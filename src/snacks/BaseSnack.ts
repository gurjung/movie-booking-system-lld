import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";

export abstract class BaseSnack implements ISnack {
  protected id: string;
  protected name: string;
  protected price: Money;
  protected prepTime: number;
  protected dietaryTags: Set<string>;
  protected description: string;
  protected complimentary: boolean;

  constructor(
    id: string,
    name: string,
    price: Money,
    prepTime: number,
    dietaryTags: Set<string>,
    description: string,
    complimentary: boolean = false,
  ) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.prepTime = prepTime;
    this.dietaryTags = dietaryTags;
    this.description = description;
    this.complimentary = complimentary;
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getPrice(): Money {
    return this.price;
  }

  public getPrepTime(): number {
    return this.prepTime;
  }

  public getDietaryTags(): Set<string> {
    return new Set(this.dietaryTags);
  }

  public getDescription(): string {
    return this.description;
  }

  public isComplimentary(): boolean {
    return this.complimentary;
  }
}
