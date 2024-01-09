import { Tasks } from "./language/generated/ast.js";

export class SchedulerGenerator {
  private tasksNotVisited: Task[] = [];
  private _currentTask: Task | undefined;
  private _currentTime = 0;
  private tasks: Task[] = [];

  constructor(model: Tasks) {
    this.tasks = this.modelToTask(model);
    this.tasksNotVisited = this.sortTasksByDependency(this.tasks);
  }

  get currentTask() {
    return this._currentTask;
  }

  get currentTime() {
    return this._currentTime;
  }

  solve(): string[] {
    this._currentTask = this.tasksNotVisited[0];
    const schedule: string[] = [];

    while (!this.isFinished()) {
      this.next();
      schedule.push(
        `Task ${this._currentTask.id} starts at ${
          this._currentTime - this._currentTask.duration
        } and ends at ${this._currentTime}`
      );
    }

    return schedule;
  }

  next(): void {
    const current = this.tasksNotVisited.shift();
    if (!current) throw new Error("Empty tasks");

    const startTime = Math.max(
      this._currentTime,
      this.getStartTimeForTask(current)
    );

    this._currentTime = startTime + current.duration;
    this._currentTask = current;
  }

  isFinished(): boolean {
    return this.tasksNotVisited.length === 0;
  }

  private sortTasksByDependency(tasks: Task[]): Task[] {
    const visited: Record<string, boolean> = {};
    const result: Task[] = [];

    const dfs = (task: Task) => {
      if (task && !visited[task.id]) {
        visited[task.id] = true;

        if (task.precedence && task.precedence.length > 0) {
          task.precedence.forEach((precedingTaskId) => {
            const precedingTask = this.tasks.find(
              (task) => task.id === precedingTaskId
            ) as Task;
            dfs(precedingTask);
          });
        }

        result.push(task);
      }
    };

    tasks.forEach((task) => dfs(task));

    return result;
  }

  private getStartTimeForTask(task: Task): number {
    if (task.precedence && task.precedence.length > 0) {
      let maxPrecedenceStartTime = 0;

      task.precedence.forEach((precedingTaskId) => {
        const precedingTask = this.tasks.find(
          (task) => task.id === precedingTaskId
        ) as Task;
        const precedenceStartTime = this.getStartTimeForTask(precedingTask);
        maxPrecedenceStartTime = Math.max(
          maxPrecedenceStartTime,
          precedenceStartTime + precedingTask.duration
        );
      });

      return Math.max(maxPrecedenceStartTime, 0);
    }

    return 0;
  }

  private modelToTask(model: Tasks): Task[] {
    const tasks: Task[] = model.tasks.map((task) => ({
      id: task.name,
      duration: task.duration,
      precedence: [],
    }));

    const tasksWithPrecedence = tasks.map((task) => {
      const precedences = model.precedences
        .filter((precedence) => precedence.task.ref?.name === task.id)
        .map((pre) => pre.require.ref?.name);

      const require = tasks
        .filter((t) => precedences.includes(t.id))
        .map((t) => t.id);

      return {
        ...task,
        precedence: require,
      };
    });

    return tasksWithPrecedence;
  }
}

export type Task = {
  id: string;
  duration: number;
  precedence: string[];
};
