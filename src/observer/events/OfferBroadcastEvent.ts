import { User } from "../../model";
import { BookingEvent } from "./BookingEvent";

export class OfferBroadcastEvent extends BookingEvent {
  private offerTitle: string;
  private promoCode: string;
  private discountPercentage: number;

  constructor(
    id: string,
    user: User,
    offerTitle: string,
    promoCode: string,
    discountPercentage: number,
  ) {
    super(id, user);
    this.offerTitle = offerTitle;
    this.promoCode = promoCode;
    this.discountPercentage = discountPercentage;
  }

  public getOfferTitle(): string {
    return this.offerTitle;
  }

  public getPromoCode(): string {
    return this.promoCode;
  }

  public getDiscountPercentage(): number {
    return this.discountPercentage;
  }

  public override getEventType(): string {
    return "OFFER_BROADCAST";
  }

  public override getDetails(): string {
    return `Special Offer: ${this.offerTitle} | Use code ${this.promoCode} to get ${this.discountPercentage}% OFF!`;
  }
}
