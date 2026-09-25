import { SeatType } from "../enums";
import { SeatComponent } from "../interfaces/SeatComponent";
import { Row } from "./Row";
import { Seat } from "./Seat";

export class Screen implements SeatComponent {
  private id: string;
  private name: string;
  private rows: Row[];

  constructor(id: string, name: string, elements: Row[] | Seat[]) {
    this.id = id;
    this.name = name;

    if (elements.length > 0 && elements[0] instanceof Row) {
      this.rows = elements as Row[];
    } else {
      this.rows = this.buildRowsFromSeats(elements as Seat[]);
    }
  }

  private buildRowsFromSeats(seats: Seat[]): Row[] {
    const rowMap = new Map<number, Seat[]>();
    for (const seat of seats) {
      const rowNum = seat.getRow();
      if (!rowMap.has(rowNum)) {
        rowMap.set(rowNum, []);
      }
      rowMap.get(rowNum)!.push(seat);
    }

    const rows: Row[] = [];
    const sortedRowNums = Array.from(rowMap.keys()).sort((a, b) => a - b);
    for (const rowNum of sortedRowNums) {
      const rowSeats = rowMap.get(rowNum)!;
      rows.push(new Row(`ROW-${rowNum}`, rowNum, rowSeats));
    }
    return rows;
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

  public getRows(): Row[] {
    return this.rows;
  }

  public setRows(rows: Row[]): void {
    this.rows = rows;
  }

  public addRow(row: Row): void {
    this.rows.push(row);
  }

  public getSeats(): Seat[] {
    return this.rows.flatMap((row) => row.getSeats());
  }

  public setSeats(seats: Seat[]): void {
    this.rows = this.buildRowsFromSeats(seats);
  }

  public getAvailableCount(): number {
    return this.rows.reduce((sum, row) => sum + row.getAvailableCount(), 0);
  }

  public getTotalCount(): number {
    return this.rows.reduce((sum, row) => sum + row.getTotalCount(), 0);
  }

  public getOccupancyRate(): number {
    const total = this.getTotalCount();
    if (total === 0) {
      return 0;
    }
    return (total - this.getAvailableCount()) / total;
  }

  public findAvailableSeats(
    count: number,
    contiguousOnly: boolean,
    preferredType?: SeatType,
  ): Seat[] {
    if (count <= 0) {
      return [];
    }

    if (contiguousOnly) {
      for (const row of this.rows) {
        const matchingSeats = row.findAvailableSeats(
          count,
          true,
          preferredType,
        );
        if (matchingSeats.length === count) {
          return matchingSeats;
        }
      }
      return [];
    }

    const accumulated: Seat[] = [];
    for (const row of this.rows) {
      const remainingNeeded = count - accumulated.length;
      const foundInRow = row.findAvailableSeats(
        remainingNeeded,
        false,
        preferredType,
      );
      accumulated.push(...foundInRow);
      if (accumulated.length === count) {
        return accumulated;
      }
    }

    return [];
  }

  public reserveSeats(seatIds: string[]): boolean {
    const allSeats = this.getSeats();
    const targetSeats = allSeats.filter((seat) =>
      seatIds.includes(seat.getId()),
    );

    if (targetSeats.length !== seatIds.length) {
      return false;
    }

    const hasUnavailable = targetSeats.some((seat) => !seat.isSeatAvailable());
    if (hasUnavailable) {
      return false;
    }

    for (const row of this.rows) {
      row.reserveSeats(seatIds);
    }
    return true;
  }

  public releaseSeats(seatIds: string[]): void {
    for (const row of this.rows) {
      row.releaseSeats(seatIds);
    }
  }

  public getPriceSum(): number {
    return this.rows.reduce((sum, row) => sum + row.getPriceSum(), 0);
  }

  public applyPriceAdjustment(
    predicate: (seat: Seat) => boolean,
    delta: number,
  ): void {
    for (const row of this.rows) {
      row.applyPriceAdjustment(predicate, delta);
    }
  }
}
