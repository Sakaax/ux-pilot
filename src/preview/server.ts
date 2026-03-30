import { readFileSync, existsSync } from "fs";
import { resolve, extname } from "path";
import { findAvailablePort } from "./port-finder";

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

export class PreviewServer {
  private templatesDir: string;
  private server: ReturnType<typeof Bun.serve> | null = null;
  private sseClients: Set<ReadableStreamDefaultController> = new Set();
  private port = 0;

  constructor(templatesDir: string) {
    this.templatesDir = templatesDir;
  }

  async start(preferredPort?: number): Promise<number> {
    this.port = await findAvailablePort(preferredPort);

    this.server = Bun.serve({
      port: this.port,
      fetch: (req) => this.handleRequest(req),
    });

    return this.port;
  }

  async stop(): Promise<void> {
    if (this.server) {
      this.server.stop();
      this.server = null;
    }
    for (const controller of this.sseClients) {
      try {
        controller.close();
      } catch {}
    }
    this.sseClients.clear();
  }

  notify(data: Record<string, unknown>): void {
    const msg = `data: ${JSON.stringify(data)}\n\n`;
    for (const controller of this.sseClients) {
      try {
        controller.enqueue(new TextEncoder().encode(msg));
      } catch {
        this.sseClients.delete(controller);
      }
    }
  }

  getPort(): number {
    return this.port;
  }

  private handleRequest(req: Request): Response {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (pathname === "/__sse") {
      return this.handleSSE();
    }

    if (pathname === "/") {
      return this.serveFile(resolve(this.templatesDir, "shell.html"));
    }

    if (pathname === "/base.css") {
      return this.serveFile(resolve(this.templatesDir, "base.css"));
    }

    if (pathname.startsWith("/screens/")) {
      const screensDir = resolve(process.cwd(), ".ux-pilot/preview/screens");
      const filePath = resolve(screensDir, pathname.slice("/screens/".length));
      return this.serveFile(filePath);
    }

    return new Response("Not Found", { status: 404 });
  }

  private handleSSE(): Response {
    const clients = this.sseClients;
    const stream = new ReadableStream({
      start(controller) {
        clients.add(controller);
        controller.enqueue(
          new TextEncoder().encode('data: {"type":"connected"}\n\n')
        );
      },
      cancel(controller) {
        clients.delete(controller);
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  private serveFile(filePath: string): Response {
    if (!existsSync(filePath)) {
      return new Response("Not Found", { status: 404 });
    }

    const content = readFileSync(filePath);
    const ext = extname(filePath);
    const contentType = MIME_TYPES[ext] ?? "application/octet-stream";

    return new Response(content, {
      headers: { "Content-Type": contentType },
    });
  }
}
