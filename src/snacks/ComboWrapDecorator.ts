import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";
import { SnackDecorator } from "./SnackDecorator";

export class ComboWrapDecorator extends SnackDecorator {
  constructor(inner: ISnack) {
    super(inner);
  }

  public override getPrice(): Money {
    return new Money(this.inner.getPrice().getAmount() + 25);
  }

  public override getPrepTime(): number {
    return this.inner.getPrepTime() + 1;
  }

  public override getDietaryTags(): Set<string> {
    const tags = super.getDietaryTags();
    tags.add("combo-deal");
    return tags;
  }

  public override getDescription(): string {
    return this.inner.getDescription() + " + Combo Wrap";
  }
}
