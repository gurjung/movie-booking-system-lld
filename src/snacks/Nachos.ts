import { Money } from "../model/Money";
import { BaseSnack } from "./BaseSnack";

export class Nachos extends BaseSnack {
  constructor(id: string = "SNK-NACHOS", price: Money = new Money(120)) {
    super(
      id,
      "Nachos",
      price,
      3,
      new Set(["vegetarian"]),
      "Nachos with Salsa",
      false,
    );
  }
}
