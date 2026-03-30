import { watch, existsSync, mkdirSync } from "fs";
import type { PreviewServer } from "./server";

export class FileWatcher {
  private watcher: ReturnType<typeof watch> | null = null;
  private dir: string;
  private server: PreviewServer;

  constructor(dir: string, server: PreviewServer) {
    this.dir = dir;
    this.server = server;
  }

  start(): void {
    if (!existsSync(this.dir)) {
      mkdirSync(this.dir, { recursive: true });
    }

    this.watcher = watch(this.dir, { recursive: true }, (_event, filename) => {
      if (filename && filename.endsWith(".html")) {
        this.server.notify({ type: "reload" });
      }
    });
  }

  stop(): void {
    if (this.watcher) {
      this.watcher.close();
      this.watcher = null;
    }
  }
}
