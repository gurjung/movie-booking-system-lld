import { Money } from "../model/Money";

export interface ISnack {
  getId(): string;
  getName(): string;
  getPrice(): Money;
  getPrepTime(): number;
  getDietaryTags(): Set<string>;
  getDescription(): string;
  isComplimentary(): boolean;
}
