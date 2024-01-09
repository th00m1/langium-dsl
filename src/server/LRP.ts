import { Tasks } from "../language/generated/ast.js";
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

export class LRP implements LRPServices {
  static tasks: Map<string, Tasks> = new Map();
  static registries: Map<string, string> = new Map();

  async parse(args: ParseArguments): Promise<ParseResponse> {
    throw new Error("Method not implemented.");
  }

  initExecution(args: InitArguments): InitResponse {
    const tasks = LRP.tasks.get(args.sourceFile);
    if (!tasks) {
      throw new Error("The tasks of this file are undefined.");
    }

    throw new Error("Method not implemented.");
  }

  getRuntimeState(args: GetRuntimeStateArguments): GetRuntimeStateResponse {
    throw new Error("Method not implemented.");
  }

  nextStep(args: StepArguments): StepResponse {
    throw new Error("Method not implemented.");
  }

  getBreakpointTypes(): GetBreakpointTypesResponse {
    return { breakpointTypes: [] };
  }

  checkBreakpoint(args: CheckBreakpointArguments): CheckBreakpointResponse {
    throw new Error("Method not implemented.");
  }
}
