export class PaymentResult {
  private success: boolean;
  private transactionId: string | null;
  private failureReason: string | null;

  constructor(
    success: boolean,
    transactionId: string | null,
    failureReason: string | null,
  ) {
    this.success = success;
    this.transactionId = transactionId;
    this.failureReason = failureReason;
  }

  public isSuccess(): boolean {
    return this.success;
  }

  public setSuccess(success: boolean): void {
    this.success = success;
  }

  public getTransactionId(): string | null {
    return this.transactionId;
  }

  public setTransactionId(transactionId: string | null): void {
    this.transactionId = transactionId;
  }

  public getFailureReason(): string | null {
    return this.failureReason;
  }

  public setFailureReason(failureReason: string | null): void {
    this.failureReason = failureReason;
  }
}
