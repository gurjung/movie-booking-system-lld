import { SeatType } from "../enums";
import { Screen, Seat } from "../model";
import {
  BestAvailableRecommendationStrategy,
  BudgetFriendlyRecommendationStrategy,
} from "../recommendation";

export function runExtensionDemos(): void {
  console.log(
    "\nDEMO SCENARIO 16: Extension Scenario - Dynamic Seat Recommendations (OCP Compliance)",
  );

  const screenSeats: Seat[] = [];
  for (let r = 1; r <= 5; r++) {
    for (let s = 1; s <= 8; s++) {
      let type = SeatType.NORMAL;
      let priceModifier = 0;
      if (r === 3 || r === 4) {
        type = SeatType.PREMIUM;
        priceModifier = 50;
      } else if (r === 5) {
        type = SeatType.VIP;
        priceModifier = 120;
      }
      screenSeats.push(
        new Seat(`EXT-R${r}-S${s}`, type, r, s, priceModifier, true),
      );
    }
  }

  const screen = new Screen("SCR-EXT", "Audi Extension", screenSeats);

  const bestStrategy = new BestAvailableRecommendationStrategy();
  const recommended1 = bestStrategy.recommendSeats(screen, 2);
  console.log(
    "Best Available (Middle Row Center) 2 Seats Recommendation:",
    recommended1.map((s) => `${s.getId()} (Row ${s.getRow()}, Seat ${s.getNumber()})`).join(", "),
  );

  for (const seat of recommended1) {
    seat.reserve();
  }

  const recommended2 = bestStrategy.recommendSeats(screen, 2);
  console.log(
    "Next Best Available 2 Seats after booking previous:",
    recommended2.map((s) => `${s.getId()} (Row ${s.getRow()}, Seat ${s.getNumber()})`).join(", "),
  );

  const budgetStrategy = new BudgetFriendlyRecommendationStrategy();
  const budgetSeats = budgetStrategy.recommendSeats(screen, 3);
  console.log(
    "Budget Friendly 3 Seats Recommendation (Lowest Price Modifier):",
    budgetSeats
      .map(
        (s) =>
          `${s.getId()} [Price Mod: +${s.getPriceModifier()}]`,
      )
      .join(", "),
  );
}
