import { SeatType } from "../enums";
import { SeatComponent } from "../interfaces/SeatComponent";

export class Seat implements SeatComponent {
  private id: string;
  private type: SeatType;
  private row: number;
  private number: number;
  private priceModifier: number;
  private isAvailable: boolean;

  constructor(
    id: string,
    type: SeatType,
    row: number,
    number: number,
    priceModifier: number = 0,
    isAvailable: boolean = true,
  ) {
    this.id = id;
    this.type = type;
    this.row = row;
    this.number = number;
    this.priceModifier = priceModifier;
    this.isAvailable = isAvailable;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getType(): SeatType {
    return this.type;
  }

  public setType(type: SeatType): void {
    this.type = type;
  }

  public getRow(): number {
    return this.row;
  }

  public setRow(row: number): void {
    this.row = row;
  }

  public getNumber(): number {
    return this.number;
  }

  public setNumber(number: number): void {
    this.number = number;
  }

  public getPriceModifier(): number {
    return this.priceModifier;
  }

  public setPriceModifier(modifier: number): void {
    this.priceModifier = modifier;
  }

  public isSeatAvailable(): boolean {
    return this.isAvailable;
  }

  public setAvailable(available: boolean): void {
    this.isAvailable = available;
  }

  public getAvailableCount(): number {
    return this.isAvailable ? 1 : 0;
  }

  public getTotalCount(): number {
    return 1;
  }

  public findAvailableSeats(
    count: number,
    contiguousOnly: boolean,
    preferredType?: SeatType,
  ): Seat[] {
    if (
      count === 1 &&
      this.isAvailable &&
      (!preferredType || this.type === preferredType)
    ) {
      return [this];
    }
    return [];
  }

  public reserveSeats(seatIds: string[]): boolean {
    if (seatIds.includes(this.id)) {
      if (!this.isAvailable) {
        return false;
      }
      this.isAvailable = false;
    }
    return true;
  }

  public releaseSeats(seatIds: string[]): void {
    if (seatIds.includes(this.id)) {
      this.isAvailable = true;
    }
  }

  public getPriceSum(): number {
    return this.priceModifier;
  }

  public applyPriceAdjustment(
    predicate: (seat: Seat) => boolean,
    delta: number,
  ): void {
    if (predicate(this)) {
      this.priceModifier += delta;
    }
  }

  public getOccupancyRate(): number {
    return this.isAvailable ? 0 : 1;
  }
}
