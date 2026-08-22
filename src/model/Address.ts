export class Address {
  private street: string;
  private city: string;
  private state: string;
  private pincode: string;

  constructor(street: string, city: string, state: string, pincode: string) {
    this.street = street;
    this.city = city;
    this.state = state;
    this.pincode = pincode;
  }

  public getStreet(): string {
    return this.street;
  }

  public setStreet(street: string): void {
    this.street = street;
  }

  public getCity(): string {
    return this.city;
  }

  public setCity(city: string): void {
    this.city = city;
  }

  public getState(): string {
    return this.state;
  }

  public setState(state: string): void {
    this.state = state;
  }

  public getPincode(): string {
    return this.pincode;
  }

  public setPincode(pincode: string): void {
    this.pincode = pincode;
  }
}
