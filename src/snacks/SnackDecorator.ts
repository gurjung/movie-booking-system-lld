import { ISnack } from "../interfaces/ISnack";
import { Money } from "../model/Money";

export abstract class SnackDecorator implements ISnack {
  protected inner: ISnack;

  constructor(inner: ISnack) {
    this.inner = inner;
  }

  public getId(): string {
    return this.inner.getId();
  }

  public getName(): string {
    return this.inner.getName();
  }

  public getPrice(): Money {
    return this.inner.getPrice();
  }

  public getPrepTime(): number {
    return this.inner.getPrepTime();
  }

  public getDietaryTags(): Set<string> {
    return new Set(this.inner.getDietaryTags());
  }

  public getDescription(): string {
    return this.inner.getDescription();
  }

  public isComplimentary(): boolean {
    return this.inner.isComplimentary();
  }
}
