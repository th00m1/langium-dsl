import { Precedence, Task, Tasks } from "../language/generated/ast.js";
import { ModelElement } from "./LRPService.js";
import { IDRegistry } from "./idRegistry.js";
import { SchedulerState } from "./scheduler-state.js";

export class ModelElementBuilder {
  private registry: IDRegistry;

  constructor(registry: IDRegistry) {
    this.registry = registry;
  }

  fromSchedulerState(schedulerState: SchedulerState): ModelElement {
    return {
      id: this.registry.getOrCreateRuntimeId(schedulerState),
      type: "SchedulerState",
      attributes: {
        currentTask: schedulerState.scheduler.currentTask.id,
        currentTime: schedulerState.scheduler.currentTime,
      },
      children: {},
      refs: {
        tasks: this.registry.getOrCreateASTId(schedulerState.tasks),
      },
    };
  }

  fromTasksModel(tasksModel: Tasks): ModelElement {
    const tasks: ModelElement[] = [];
    const precedences: ModelElement[] = [];

    tasksModel.tasks.forEach((task) => tasks.push(this.createTaskModel(task)));
    tasksModel.precedences.forEach((precedence) =>
      precedences.push(this.createPrecedenceModel(precedence))
    );

    return {
      id: this.registry.getOrCreateASTId(tasksModel),
      type: tasksModel.$type,
      attributes: {
        name: "test",
      },
      children: {
        tasks: tasks,
        precedences: precedences,
      },
      refs: {},
    } as ModelElement;
  }

  private createTaskModel(task: Task): ModelElement {
    return {
      id: this.registry.getOrCreateASTId(task),
      type: task.$type,
      attributes: {
        name: task.name,
        duration: task.duration,
      },
      children: {},
      refs: {},
    };
  }
  private createPrecedenceModel(precedence: Precedence): ModelElement {
    return {
      id: this.registry.getOrCreateASTId(precedence),
      type: precedence.$type,
      attributes: {
        task: precedence.task,
        require: precedence.require,
      },
      children: {},
      refs: {},
    };
  }
}
