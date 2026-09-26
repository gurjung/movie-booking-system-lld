import { SeatAllocationStrategy } from "../interfaces";
import { Seat, Show } from "../model";
import { Command } from "./Command";

export class ReserveSeatCommand implements Command {
  private seatAllocator: SeatAllocationStrategy;
  private show: Show;
  private seats: Seat[];
  private reserved: boolean = false;

  constructor(
    seatAllocator: SeatAllocationStrategy,
    show: Show,
    seats: Seat[],
  ) {
    this.seatAllocator = seatAllocator;
    this.show = show;
    this.seats = seats;
  }

  public execute(): boolean {
    this.reserved = this.seatAllocator.allocateSeats(this.show, this.seats);
    return this.reserved;
  }

  public undo(): void {
    if (this.reserved) {
      this.seatAllocator.releaseSeats(this.show, this.seats);
      this.reserved = false;
    }
  }

  public isReserved(): boolean {
    return this.reserved;
  }

  public getName(): string {
    return "ReserveSeatCommand";
  }
}
