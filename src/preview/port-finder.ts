import { createServer } from "net";

const COMMON_DEV_PORTS = new Set([3000, 3001, 4000, 5173, 5174, 8000, 8080, 8888]);
const DEFAULT_START = 4983;
const MAX_ATTEMPTS = 50;

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close(() => resolve(true));
    });
    server.listen(port, "127.0.0.1");
  });
}

export async function findAvailablePort(preferred?: number): Promise<number> {
  const start = preferred ?? DEFAULT_START;

  if (!COMMON_DEV_PORTS.has(start) && (await isPortAvailable(start))) {
    return start;
  }

  for (let i = 1; i <= MAX_ATTEMPTS; i++) {
    const port = start + i;
    if (COMMON_DEV_PORTS.has(port)) continue;
    if (await isPortAvailable(port)) return port;
  }

  return new Promise((resolve, reject) => {
    const server = createServer();
    server.listen(0, "127.0.0.1", () => {
      const addr = server.address();
      if (addr && typeof addr === "object") {
        const port = addr.port;
        server.close(() => resolve(port));
      } else {
        server.close(() => reject(new Error("Could not find available port")));
      }
    });
  });
}
