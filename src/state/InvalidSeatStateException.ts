export class InvalidSeatStateException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidSeatStateException";
  }
}
