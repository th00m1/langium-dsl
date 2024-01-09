import { Tasks } from "../language/generated/ast.js";
import { SchedulerGenerator, Task } from "../scheduler-generator.js";

export class SchedulerState implements State {
  readonly tasks: Tasks;
  scheduler: SchedulerGenerator;

  constructor(tasks: Tasks) {
    this.tasks = tasks;
    const tasksMapped: Task[] = tasks.tasks.map((task) => ({
      id: task.name,
      duration: task.duration,
      precedence: [],
    }));

    this.scheduler = new SchedulerGenerator(tasksMapped);
  }

  isFinished(): boolean {
    throw new Error("Method not implemented.");
  }

  next(): void {
    throw new Error("Method not implemented.");
  }
}

interface State {
  isFinished(): boolean;
  next(): void;
}
