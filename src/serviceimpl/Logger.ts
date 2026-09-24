import { LoggingService } from "../interfaces";

export class Logger implements LoggingService {
  private static instance: Logger | null = null;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public info(msg: string): void {
    console.log(`[INFO] ${msg}`);
  }

  public warn(msg: string): void {
    console.warn(`[WARN] ${msg}`);
  }

  public error(msg: string): void {
    console.error(`[ERROR] ${msg}`);
  }
}
