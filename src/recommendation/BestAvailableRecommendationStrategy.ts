import { SeatRecommendationStrategy } from "./SeatRecommendationStrategy";
import { Screen, Seat, Row } from "../model";
import { SeatType } from "../enums";

export class BestAvailableRecommendationStrategy
  implements SeatRecommendationStrategy
{
  public recommendSeats(
    screen: Screen,
    count: number,
    preferredType?: SeatType,
  ): Seat[] {
    if (count <= 0) {
      return [];
    }

    const rows = screen.getRows();
    if (rows.length === 0) {
      return [];
    }

    const midRowIndex = Math.floor(rows.length / 2);
    const sortedRows = [...rows].sort((a, b) => {
      const distA = Math.abs(rows.indexOf(a) - midRowIndex);
      const distB = Math.abs(rows.indexOf(b) - midRowIndex);
      return distA - distB;
    });

    for (const row of sortedRows) {
      const contiguous = this.findContiguousInRow(row, count, preferredType);
      if (contiguous.length === count) {
        return contiguous;
      }
    }

    const availableSeats: Seat[] = [];
    for (const row of sortedRows) {
      const seats = row.getSeats().filter((s) => {
        if (!s.isSeatAvailable()) {
          return false;
        }
        if (preferredType && s.getType() !== preferredType) {
          return false;
        }
        return true;
      });

      const midSeatIndex = Math.floor(row.getSeats().length / 2);
      seats.sort((a, b) => {
        const distA = Math.abs(a.getNumber() - midSeatIndex);
        const distB = Math.abs(b.getNumber() - midSeatIndex);
        return distA - distB;
      });

      for (const seat of seats) {
        availableSeats.push(seat);
        if (availableSeats.length === count) {
          return availableSeats;
        }
      }
    }

    return availableSeats;
  }

  private findContiguousInRow(
    row: Row,
    count: number,
    preferredType?: SeatType,
  ): Seat[] {
    const seats = row.getSeats();
    const midSeatIndex = Math.floor(seats.length / 2);
    let bestBlock: Seat[] = [];
    let minDistanceToCenter = Number.MAX_VALUE;

    for (let i = 0; i <= seats.length - count; i++) {
      const block = seats.slice(i, i + count);
      const allValid = block.every(
        (s) =>
          s.isSeatAvailable() && (!preferredType || s.getType() === preferredType),
      );

      if (allValid) {
        const blockCenter =
          (block[0].getNumber() + block[block.length - 1].getNumber()) / 2;
        const dist = Math.abs(blockCenter - midSeatIndex);
        if (dist < minDistanceToCenter) {
          minDistanceToCenter = dist;
          bestBlock = block;
        }
      }
    }

    return bestBlock;
  }
}
