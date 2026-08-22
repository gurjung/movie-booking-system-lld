import { Booking, User } from "../model";

export interface NotificationService {
  notify(user: User, booking: Booking): void;
}
