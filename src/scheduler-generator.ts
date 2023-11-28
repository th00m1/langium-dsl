export class SchedulerGenerator {
    private tasks: Task[] = [];

    constructor(tasks: Task[]) {
        this.tasks = tasks;
    }

    solve(): string[] {
        const sortedTasks = this.sortTasksByDependency();

        const schedule: string[] = [];
        let currentTime = 0;

        sortedTasks.forEach(task => {
            const startTime = Math.max(currentTime, this.getStartTimeForTask(task));
            schedule.push(`Task ${task.id} starts at ${startTime} and ends at ${startTime + task.duration}`);
            currentTime = startTime + task.duration;
        });

        return schedule;
    }

    private sortTasksByDependency(): Task[] {
        const visited: Record<string, boolean> = {};
        const result: Task[] = [];

        const dfs = (task: Task) => {
            if (task && !visited[task.id]) {
                visited[task.id] = true;
                if (task.precedence) {
                    dfs(task.precedence);
                }
                result.push(task);
            }
        };

        this.tasks.forEach(task => dfs(task));

        return result;
    }

    private getStartTimeForTask(task: Task): number {
        if (task.precedence) {
            const precedenceStartTime = this.getStartTimeForTask(task.precedence);
            return Math.max(precedenceStartTime + task.precedence.duration, 0);
        }
        return 0;
    }
}

export type Task = {
    id: string,
    duration: number,
    precedence?: Task
};