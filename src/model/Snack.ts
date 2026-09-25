import { ISnack } from "../interfaces/ISnack";
import { Money } from "./Money";

export class Snack implements ISnack {
  private id: string;
  private name: string;
  private price: Money;
  private complimentary: boolean;
  private prepTime: number;
  private dietaryTags: Set<string>;
  private description: string;

  constructor(
    id: string,
    name: string,
    price: Money,
    complimentary: boolean = false,
    prepTime: number = 2,
    dietaryTags: Set<string> = new Set(["standard"]),
    description?: string,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.complimentary = complimentary;
    this.prepTime = prepTime;
    this.dietaryTags = dietaryTags;
    this.description = description ?? name;
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

  public getPrepTime(): number {
    return this.prepTime;
  }

  public setPrepTime(prepTime: number): void {
    this.prepTime = prepTime;
  }

  public getDietaryTags(): Set<string> {
    return new Set(this.dietaryTags);
  }

  public setDietaryTags(dietaryTags: Set<string>): void {
    this.dietaryTags = dietaryTags;
  }

  public getDescription(): string {
    return this.description;
  }

  public setDescription(description: string): void {
    this.description = description;
  }
}
