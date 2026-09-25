import { SeatType } from "../enums";
import { SeatComponent } from "../interfaces/SeatComponent";
import { Seat } from "./Seat";

export class Row implements SeatComponent {
  private id: string;
  private rowNumber: number;
  private seats: Seat[];

  constructor(id: string, rowNumber: number, seats: Seat[] = []) {
    this.id = id;
    this.rowNumber = rowNumber;
    this.seats = seats;
  }

  public getId(): string {
    return this.id;
  }

  public getRowNumber(): number {
    return this.rowNumber;
  }

  public getSeats(): Seat[] {
    return this.seats;
  }

  public addSeat(seat: Seat): void {
    this.seats.push(seat);
  }

  public getAvailableCount(): number {
    return this.seats.filter((seat) => seat.isSeatAvailable()).length;
  }

  public getTotalCount(): number {
    return this.seats.length;
  }

  public getOccupancyRate(): number {
    if (this.seats.length === 0) {
      return 0;
    }
    return (this.seats.length - this.getAvailableCount()) / this.seats.length;
  }

  public findAvailableSeats(
    count: number,
    contiguousOnly: boolean,
    preferredType?: SeatType,
  ): Seat[] {
    if (count <= 0 || this.seats.length < count) {
      return [];
    }

    const sortedSeats = [...this.seats].sort(
      (a, b) => a.getNumber() - b.getNumber(),
    );

    if (contiguousOnly) {
      for (let i = 0; i <= sortedSeats.length - count; i++) {
        let isConsecutiveMatch = true;

        for (let j = 0; j < count; j++) {
          const currentSeat = sortedSeats[i + j];
          if (!currentSeat.isSeatAvailable()) {
            isConsecutiveMatch = false;
            break;
          }
          if (preferredType && currentSeat.getType() !== preferredType) {
            isConsecutiveMatch = false;
            break;
          }
          if (j > 0) {
            const previousSeat = sortedSeats[i + j - 1];
            if (currentSeat.getNumber() !== previousSeat.getNumber() + 1) {
              isConsecutiveMatch = false;
              break;
            }
          }
        }

        if (isConsecutiveMatch) {
          return sortedSeats.slice(i, i + count);
        }
      }
      return [];
    }

    const availableMatches = sortedSeats.filter((seat) => {
      const isAvailable = seat.isSeatAvailable();
      const matchesType = !preferredType || seat.getType() === preferredType;
      return isAvailable && matchesType;
    });

    if (availableMatches.length >= count) {
      return availableMatches.slice(0, count);
    }

    return [];
  }

  public reserveSeats(seatIds: string[]): boolean {
    const targetSeats = this.seats.filter((seat) =>
      seatIds.includes(seat.getId()),
    );
    const anyUnavailable = targetSeats.some((seat) => !seat.isSeatAvailable());
    if (anyUnavailable) {
      return false;
    }

    for (const seat of targetSeats) {
      seat.setAvailable(false);
    }
    return true;
  }

  public releaseSeats(seatIds: string[]): void {
    const targetSeats = this.seats.filter((seat) =>
      seatIds.includes(seat.getId()),
    );
    for (const seat of targetSeats) {
      seat.setAvailable(true);
    }
  }

  public getPriceSum(): number {
    return this.seats.reduce((sum, seat) => sum + seat.getPriceSum(), 0);
  }

  public applyPriceAdjustment(
    predicate: (seat: Seat) => boolean,
    delta: number,
  ): void {
    for (const seat of this.seats) {
      seat.applyPriceAdjustment(predicate, delta);
    }
  }
}
