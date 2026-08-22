import { Movie } from "./Movie";
import { Screen } from "./Screen";

export class Show {
  private id: string;
  private movie: Movie;
  private screen: Screen;
  private startTime: Date;
  private endTime: Date;

  constructor(
    id: string,
    movie: Movie,
    screen: Screen,
    start: Date,
    end: Date,
  ) {
    this.id = id;
    this.movie = movie;
    this.screen = screen;
    this.startTime = start;
    this.endTime = end;
  }

  public getId(): string {
    return this.id;
  }

  public setId(id: string): void {
    this.id = id;
  }

  public getMovie(): Movie {
    return this.movie;
  }

  public setMovie(movie: Movie): void {
    this.movie = movie;
  }

  public getScreen(): Screen {
    return this.screen;
  }

  public setScreen(screen: Screen): void {
    this.screen = screen;
  }

  public getStartTime(): Date {
    return this.startTime;
  }

  public setStartTime(start: Date): void {
    this.startTime = start;
  }

  public getEndTime(): Date {
    return this.endTime;
  }

  public setEndTime(end: Date): void {
    this.endTime = end;
  }
}
