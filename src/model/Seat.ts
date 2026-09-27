import { SeatStatus, SeatType } from "../enums";
import { SeatComponent } from "../interfaces/SeatComponent";
import { SeatState, AvailableState, BookedState } from "../state";

export class Seat implements SeatComponent {
  private id: string;
  private type: SeatType;
  private row: number;
  private number: number;
  private priceModifier: number;
  private isAvailable: boolean;
  private state: SeatState;

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
    this.state = isAvailable ? new AvailableState() : new BookedState();
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
    return this.state.getStatus() === SeatStatus.AVAILABLE || this.state.getStatus() === SeatStatus.RELEASED;
  }

  public setAvailable(available: boolean): void {
    this.isAvailable = available;
    this.state = available ? new AvailableState() : new BookedState();
  }

  public reserve(): void {
    this.state.reserve(this);
    this.isAvailable = false;
  }

  public release(): void {
    this.state.release(this);
    this.isAvailable = this.state.getStatus() === SeatStatus.AVAILABLE || this.state.getStatus() === SeatStatus.RELEASED;
  }

  public confirm(): void {
    this.state.confirm(this);
    this.isAvailable = false;
  }

  public getState(): SeatState {
    return this.state;
  }

  public setState(state: SeatState): void {
    this.state = state;
    this.isAvailable = state.getStatus() === SeatStatus.AVAILABLE || state.getStatus() === SeatStatus.RELEASED;
  }

  public getAvailableCount(): number {
    return this.isSeatAvailable() ? 1 : 0;
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
      this.isSeatAvailable() &&
      (!preferredType || this.type === preferredType)
    ) {
      return [this];
    }
    return [];
  }

  public reserveSeats(seatIds: string[]): boolean {
    if (seatIds.includes(this.id)) {
      if (!this.isSeatAvailable()) {
        return false;
      }
      this.reserve();
    }
    return true;
  }

  public releaseSeats(seatIds: string[]): void {
    if (seatIds.includes(this.id)) {
      this.release();
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
