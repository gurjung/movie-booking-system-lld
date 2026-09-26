export interface Command {
  execute(): boolean;
  undo(): void;
  getName(): string;
}
