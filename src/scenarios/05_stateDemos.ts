import { SeatType } from "../enums";
import { Seat } from "../model";

export function runStateDemos(): void {
  console.log(
    "\nDEMO SCENARIO 12: State Pattern - Seat Lifecycle Transitions & Error Handling",
  );

  const stateSeat = new Seat("ST-1", SeatType.PREMIUM, 1, 1);
  console.log("Initial State:", stateSeat.getState().getStatus());
  console.log("Is seat available:", stateSeat.isSeatAvailable());

  stateSeat.reserve();
  console.log("After reserve():", stateSeat.getState().getStatus());
  console.log("Is seat available:", stateSeat.isSeatAvailable());

  stateSeat.confirm();
  console.log("After confirm():", stateSeat.getState().getStatus());
  console.log("Is seat available:", stateSeat.isSeatAvailable());

  stateSeat.release();
  console.log("After release():", stateSeat.getState().getStatus());
  console.log("Is seat available:", stateSeat.isSeatAvailable());

  stateSeat.reserve();
  console.log("After re-reserve from Released:", stateSeat.getState().getStatus());

  try {
    stateSeat.reserve();
  } catch (error) {
    console.log("Caught expected invalid transition (reserve on held seat):");
    console.log(" ->", (error as Error).message);
  }

  const unheldSeat = new Seat("ST-2", SeatType.NORMAL, 1, 2);
  try {
    unheldSeat.confirm();
  } catch (error) {
    console.log("Caught expected invalid transition (confirm on available seat):");
    console.log(" ->", (error as Error).message);
  }

  try {
    unheldSeat.release();
  } catch (error) {
    console.log("Caught expected invalid transition (release on available seat):");
    console.log(" ->", (error as Error).message);
  }
}
