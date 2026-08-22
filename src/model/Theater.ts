import { Address } from "./Address";
import { Screen } from "./Screen";

export class Theater {
  private id: string;
  private name: string;
  private address: Address;
  private screens: Screen[];

  constructor(id: string, name: string, address: Address, screens: Screen[]) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.screens = screens;
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
  // TO DO use address and screen
}
