import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";
import { SnackDecorator } from "./SnackDecorator";

export class ExtraButterDecorator extends SnackDecorator {
  constructor(inner: ISnack) {
    super(inner);
  }

  public override getPrice(): Money {
    return new Money(this.inner.getPrice().getAmount() + 30);
  }

  public override getPrepTime(): number {
    return this.inner.getPrepTime() + 1;
  }

  public override getDietaryTags(): Set<string> {
    const tags = super.getDietaryTags();
    tags.add("contains-dairy");
    return tags;
  }

  public override getDescription(): string {
    return this.inner.getDescription() + " + Extra Butter";
  }
}
