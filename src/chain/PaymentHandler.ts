import { PaymentResult } from "../model/PaymentResult";
import { PaymentContext } from "./PaymentContext";

export interface PaymentHandler {
  setNext(next: PaymentHandler): void;
  handle(context: PaymentContext): PaymentResult;
}
