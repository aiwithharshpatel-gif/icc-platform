type LogLevel = "info" | "warn" | "error";

class Logger {
  private formatMessage(level: LogLevel, message: string, meta?: unknown) {
    const timestamp = new Date().toISOString();
    return `[${timestamp}] [ICC-${level.toUpperCase()}]: ${message} ${
      meta ? JSON.stringify(meta) : ""
    }`;
  }

  info(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.log(`\x1b[32m${this.formatMessage("info", message, meta)}\x1b[0m`);
    } else {
      console.log(this.formatMessage("info", message, meta));
    }
  }

  warn(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(`\x1b[33m${this.formatMessage("warn", message, meta)}\x1b[0m`);
    } else {
      console.warn(this.formatMessage("warn", message, meta));
    }
  }

  error(message: string, meta?: unknown) {
    if (process.env.NODE_ENV !== "production") {
      console.error(`\x1b[31m${this.formatMessage("error", message, meta)}\x1b[0m`);
    } else {
      console.error(this.formatMessage("error", message, meta));
    }
  }
}

export const logger = new Logger();
