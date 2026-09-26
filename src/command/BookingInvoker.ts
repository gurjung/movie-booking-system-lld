import { Command } from "./Command";

export class BookingInvoker {
  private history: Command[] = [];

  public execute(command: Command): boolean {
    const success = command.execute();
    if (success) {
      this.history.push(command);
    }
    return success;
  }

  public undoLast(): void {
    const command = this.history.pop();
    if (command) {
      command.undo();
    }
  }

  public rollback(): void {
    while (this.history.length > 0) {
      const command = this.history.pop()!;
      command.undo();
    }
  }

  public executePipeline(commands: Command[]): boolean {
    for (const command of commands) {
      const success = command.execute();
      if (!success) {
        this.rollback();
        return false;
      }
      this.history.push(command);
    }
    return true;
  }

  public getHistory(): Command[] {
    return [...this.history];
  }

  public clearHistory(): void {
    this.history = [];
  }
}
