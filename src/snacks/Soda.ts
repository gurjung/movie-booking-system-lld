import { Money } from "../model/Money";
import { BaseSnack } from "./BaseSnack";

export class Soda extends BaseSnack {
  constructor(id: string = "SNK-SODA", price: Money = new Money(80)) {
    super(
      id,
      "Soda",
      price,
      1,
      new Set(["vegan", "gluten-free"]),
      "Soda (Regular)",
      false,
    );
  }
}
