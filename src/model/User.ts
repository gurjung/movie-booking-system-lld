import { Address } from "./Address";

export class User {
  private id: string;
  private name: string;
  private email: string;
  private phone: string;
  private address: Address;
  private walletBalance: number;

  constructor(
    id: string,
    name: string,
    email: string,
    phone: string,
    address: Address,
    walletBalance: number = 0,
  ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.phone = phone;
    this.address = address;
    this.walletBalance = walletBalance;
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

  public getEmail(): string {
    return this.email;
  }

  public setEmail(email: string): void {
    this.email = email;
  }

  public getPhone(): string {
    return this.phone;
  }

  public setPhone(phone: string): void {
    this.phone = phone;
  }

  public getAddress(): Address {
    return this.address;
  }

  public setAddress(address: Address): void {
    this.address = address;
  }

  public getWalletBalance(): number {
    return this.walletBalance;
  }

  public setWalletBalance(balance: number): void {
    this.walletBalance = balance;
  }
}
