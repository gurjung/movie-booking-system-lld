import { Seat } from "../model";
import { Command } from "./Command";

export class SelectSeatCommand implements Command {
  private seats: Seat[];
  private selected: boolean = false;

  constructor(seats: Seat[]) {
    this.seats = seats;
  }

  public execute(): boolean {
    for (const seat of this.seats) {
      if (!seat.isSeatAvailable()) {
        return false;
      }
    }
    this.selected = true;
    return true;
  }

  public undo(): void {
    if (this.selected) {
      this.selected = false;
    }
  }

  public isSelected(): boolean {
    return this.selected;
  }

  public getName(): string {
    return "SelectSeatCommand";
  }
}
