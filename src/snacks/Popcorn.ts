import { Money } from "../model/Money";
import { BaseSnack } from "./BaseSnack";

export class Popcorn extends BaseSnack {
  constructor(id: string = "SNK-POPCORN", price: Money = new Money(150)) {
    super(
      id,
      "Popcorn",
      price,
      2,
      new Set(["vegetarian", "gluten-free"]),
      "Popcorn (Regular)",
      false,
    );
  }
}
