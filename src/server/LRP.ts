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
  ParseArguments,
  ParseResponse,
  StepArguments,
  StepResponse,
} from "./LRPService.js";
import { SchedulerState } from "./scheduler-state.js";
import { extractAstNode } from "../cli/cli-util.js";
import { ModelElementBuilder } from "./modelElementBuilder.js";
import { IDRegistry } from "./idRegistry.js";

export class LRP {
  static tasks: Map<string, Tasks> = new Map();
  static schedulerState: Map<string, SchedulerState> = new Map();
  static registries: Map<string, IDRegistry> = new Map();

  static async parse(args: ParseArguments): Promise<ParseResponse> {
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

  static initExecution(args: InitArguments): InitResponse {
    const tasks = LRP.tasks.get(args.sourceFile);
    if (!tasks) throw new Error("The tasks of this file are undefined.");

    const schedulerState = new SchedulerState(tasks);
    LRP.schedulerState.set(args.sourceFile, schedulerState);

    return {
      isExecutionDone: schedulerState.isFinished(),
    };
  }

  static getRuntimeState(
    args: GetRuntimeStateArguments
  ): GetRuntimeStateResponse {
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

  static nextStep(args: StepArguments): StepResponse {
    const schedulerState = LRP.schedulerState.get(args.sourceFile);
    if (!schedulerState)
      throw new Error("The runtime state of this file is undefined.");

    schedulerState.next();

    return {
      isExecutionDone: schedulerState.isFinished(),
    };
  }

  static getBreakpointTypes(): GetBreakpointTypesResponse {
    return { breakpointTypes: [] };
  }

  static checkBreakpoint(
    args: CheckBreakpointArguments
  ): CheckBreakpointResponse {
    throw new Error("Method not implemented.");
  }
}
