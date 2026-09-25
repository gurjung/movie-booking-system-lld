import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";
import { SnackDecorator } from "./SnackDecorator";

export class LargeSizeDecorator extends SnackDecorator {
  constructor(inner: ISnack) {
    super(inner);
  }

  public override getPrice(): Money {
    return new Money(this.inner.getPrice().getAmount() + 50);
  }

  public override getPrepTime(): number {
    return this.inner.getPrepTime() + 1;
  }

  public override getDescription(): string {
    return "Large " + this.inner.getDescription();
  }
}
