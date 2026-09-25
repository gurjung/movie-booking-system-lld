import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";
import { SnackDecorator } from "./SnackDecorator";

export class GlutenFreePackagingDecorator extends SnackDecorator {
  constructor(inner: ISnack) {
    super(inner);
  }

  public override getPrice(): Money {
    return new Money(this.inner.getPrice().getAmount() + 20);
  }

  public override getDietaryTags(): Set<string> {
    const tags = super.getDietaryTags();
    tags.add("gluten-free-certified");
    return tags;
  }

  public override getDescription(): string {
    return this.inner.getDescription() + " + Gluten-Free Pack";
  }
}
