import { NodeFileSystem } from "langium/node";
import { Tasks } from "../language/generated/ast.js";
import { createSchedulerServices } from "../language/scheduler-module.js";
import {
  CheckBreakpointArguments,
  CheckBreakpointResponse,
  GetBreakpointTypesResponse,
  GetRuntimeStateArguments,
  GetRuntimeStateResponse,
  InitArguments,
  InitResponse,
  LRPServices,
  ParseArguments,
  ParseResponse,
  StepArguments,
  StepResponse,
} from "./LRPService.js";
import { SchedulerState } from "./scheduler-state.js";
import { extractAstNode } from "../cli/cli-util.js";
import { ModelElementBuilder } from "./modelElementBuilder.js";
import { IDRegistry } from "./idRegistry.js";

export class LRP implements LRPServices {
  static tasks: Map<string, Tasks> = new Map();
  static schedulerState: Map<string, SchedulerState> = new Map();
  static registries: Map<string, IDRegistry> = new Map();

  async parse(args: ParseArguments): Promise<ParseResponse> {
    LRP.schedulerState.delete(args.sourceFile);

    const registry = new IDRegistry();
    LRP.registries.set(args.sourceFile, registry);

    const services = createSchedulerServices(NodeFileSystem).Scheduler;
    const tasks = await extractAstNode<Tasks>(args.sourceFile, services);

    LRP.tasks.set(args.sourceFile, tasks);
    const builder = new ModelElementBuilder(registry);

    return {
      astRoot: builder.fromTasksModel(tasks),
    };
  }

  initExecution(args: InitArguments): InitResponse {
    const tasks = LRP.tasks.get(args.sourceFile);
    if (!tasks) throw new Error("The tasks of this file are undefined.");

    const schedulerState = new SchedulerState(tasks);
    LRP.schedulerState.set(args.sourceFile, schedulerState);

    return {
      isExecutionDone: schedulerState.isFinished(),
    };
  }

  getRuntimeState(args: GetRuntimeStateArguments): GetRuntimeStateResponse {
    const schedulerState = LRP.schedulerState.get(args.sourceFile);
    if (!schedulerState)
      throw new Error("The runtime state of this file is undefined.");

    const registry = LRP.registries.get(args.sourceFile);
    if (!registry) throw new Error("The registry is undefined.");

    const builder = new ModelElementBuilder(registry);

    return {
      runtimeStateRoot: builder.fromSchedulerState(schedulerState),
    };
  }

  nextStep(args: StepArguments): StepResponse {
    const schedulerState = LRP.schedulerState.get(args.sourceFile);
    if (!schedulerState)
      throw new Error("The runtime state of this file is undefined.");

    schedulerState.next();

    return {
      isExecutionDone: schedulerState.isFinished(),
    };
  }

  getBreakpointTypes(): GetBreakpointTypesResponse {
    return { breakpointTypes: [] };
  }

  checkBreakpoint(args: CheckBreakpointArguments): CheckBreakpointResponse {
    throw new Error("Method not implemented.");
  }
}
