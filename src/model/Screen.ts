import { Seat } from "./Seat";

export class Screen {
  private id: string;
  private name: string;
  private seats: Seat[];

  constructor(id: string, name: string, seats: Seat[]) {
    this.id = id;
    this.name = name;
    this.seats = seats;
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

  public getSeats(): Seat[] {
    return this.seats;
  }

  public setSeats(seats: Seat[]): void {
    this.seats = seats;
  }
}
