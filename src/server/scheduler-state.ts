import { Tasks } from "../language/generated/ast.js";
import { SchedulerGenerator } from "../scheduler-generator.js";

export class SchedulerState implements State {
  readonly tasks: Tasks;
  scheduler: SchedulerGenerator;

  constructor(tasks: Tasks) {
    this.tasks = tasks;
    this.scheduler = new SchedulerGenerator(tasks);
  }

  isFinished(): boolean {
    return this.scheduler.isFinished();
  }

  next(): void {
    throw new Error("Method not implemented.");
  }
}

interface State {
  isFinished(): boolean;
  next(): void;
}
