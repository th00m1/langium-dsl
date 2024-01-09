import pkg from "jayson";
const { Server } = pkg;

import { LRP } from "./LRP.js";

export class LRPServer {
  private server;

  constructor() {
    this.server = new Server({
      parse: (args: any[], callback: Function) => {
        callback(null, LRP.parse(args[0]));
      },
      initExecution: (args: any[], callback: Function) => {
        callback(null, LRP.initExecution(args[0]));
      },
      checkBreakpoint: (args: any[], callback: Function) => {
        callback(null, LRP.checkBreakpoint(args[0]));
      },
      getBreakpointTypes: (args: any[], callback: Function) => {
        callback(null, LRP.getBreakpointTypes());
      },
      getRuntimeState: (args: any[], callback: Function) => {
        callback(null, LRP.getRuntimeState(args[0]));
      },
      nextStep: (args: any[], callback: Function) => {
        callback(null, LRP.nextStep(args[0]));
      },
    });
  }

  public start(port?: number): void {
    if (!port) this.server.tcp().listen(49152, "localhost");
    this.server.tcp().listen(port, "localhost");
    console.log("[Server] server is running on port " + port ?? 49152);
  }
}
