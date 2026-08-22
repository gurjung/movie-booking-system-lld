export class Money {
  private readonly amount: number;

  constructor(amount: number) {
    this.amount = amount;
  }

  public getAmount(): number {
    return this.amount;
  }

  public static zero(): Money {
    return new Money(0);
  }

  public add(newMoney: Money): Money {
    return new Money(this.amount + newMoney.amount);
  }

  public toDisplayString(): string {
    return this.amount.toFixed(2);
  }
}
