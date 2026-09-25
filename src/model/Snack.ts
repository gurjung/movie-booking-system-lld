import { Money } from "./Money";

export class Snack {
  private id: string;
  private name: string;
  private price: Money;
  private complimentary: boolean;

  constructor(
    id: string,
    name: string,
    price: Money,
    complimentary: boolean = false,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.complimentary = complimentary;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPrice(): Money {
    return this.price;
  }

  public setPrice(price: Money): void {
    this.price = price;
  }

  public isComplimentary(): boolean {
    return this.complimentary;
  }

  public setComplimentary(complimentary: boolean): void {
    this.complimentary = complimentary;
  }
}
