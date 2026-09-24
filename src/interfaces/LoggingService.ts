export interface LoggingService {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}
