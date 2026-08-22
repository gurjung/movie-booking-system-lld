import { SeatType } from "../enums";

export class Seat {
  private id: string;
  private type: SeatType;
  private row: number;
  private number: number;

  constructor(id: string, type: SeatType, row: number, number: number) {
    this.id = id;
    this.type = type;
    this.row = row;
    this.number = number;
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
}
