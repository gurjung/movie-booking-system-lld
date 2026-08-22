export class Movie {
  private id: string;
  private title: string;
  private duration: number;
  private genre: string;
  private language: string;
  private rating: string;

  constructor(
    id: string,
    title: string,
    durationInMinutes: number,
    genre: string,
    language: string,
    rating: string,
  ) {
    this.id = id;
    this.title = title;
    this.duration = durationInMinutes;
    this.genre = genre;
    this.language = language;
    this.rating = rating;
  }
  //   getter and setter
  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getTitle(): string {
    return this.title;
  }

  public setTitle(title: string): void {
    this.title = title;
  }

  public getDuration(): number {
    return this.duration;
  }

  public setDuration(durationInMinutes: number): void {
    this.duration = durationInMinutes;
  }

  public getGenre(): string {
    return this.genre;
  }

  public setGenre(genre: string): void {
    this.genre = genre;
  }

  public getLanguage(): string {
    return this.language;
  }

  public setLanguage(language: string): void {
    this.language = language;
  }

  public getRating(): string {
    return this.rating;
  }

  public setRating(rating: string): void {
    this.rating = rating;
  }
}
