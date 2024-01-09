export class SchedulerGenerator {
  tasksSortedByDependency: Task[] = [];
  tasksNotVisited: Task[] = [];
  currentTask: Task | undefined;
  currentTime = 0;
  tasks: Task[] = [];

  constructor(tasks: Task[]) {
    this.tasks = tasks;
    this.tasksSortedByDependency = this.sortTasksByDependency(tasks);
    this.tasksNotVisited = this.tasksSortedByDependency;
  }

  solve(): string[] {
    this.currentTask = this.tasksNotVisited[0];
    const schedule: string[] = [];
    // let currentTime = 0;

    console.log("sorted task", this.tasksSortedByDependency);

    while (!this.isFinished()) {
      this.next();
      schedule.push(
        `Task ${this.currentTask.id} starts at ${
          this.currentTime - this.currentTask.duration
        } and ends at ${this.currentTime}`
      );
    }
    // this.tasksSortedByDependency.forEach((task) => {
    //   const startTime = Math.max(currentTime, this.getStartTimeForTask(task));
    //   schedule.push(
    //     `Task ${task.id} starts at ${startTime} and ends at ${
    //       startTime + task.duration
    //     }`
    //   );
    //   currentTime = startTime + task.duration;
    // });

    return schedule;
  }

  next(): void {
    const current = this.tasksNotVisited.shift();
    if (!current) throw new Error("Empty tasks");

    const startTime = Math.max(
      this.currentTime,
      this.getStartTimeForTask(current)
    );

    this.currentTime = startTime + current.duration;
    this.currentTask = current;
  }

  isFinished(): boolean {
    return this.tasksNotVisited.length === 0;
  }

  //   private sortTasksByDependency(tasks: Task[]): Task[] {
  //     const visited: Record<string, boolean> = {};
  //     const result: Task[] = [];

  //     const dfs = (task: Task) => {
  //       if (task && !visited[task.id]) {
  //         visited[task.id] = true;
  //         if (task.precedence) {
  //           dfs(task.precedence);
  //         }
  //         result.push(task);
  //       }
  //     };

  //     tasks.forEach((task) => dfs(task));

  //     return result;
  //   }

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
}

export type Task = {
  id: string;
  duration: number;
  precedence: string[];
};
