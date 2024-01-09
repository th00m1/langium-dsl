import type { Tasks } from "../language/generated/ast.js";
import chalk from "chalk";
import { Command } from "commander";
import { SchedulerLanguageMetaData } from "../language/generated/module.js";
import { createSchedulerServices } from "../language/scheduler-module.js";
import { extractAstNode } from "./cli-util.js";
import { generateJavaScript, generateSchedule } from "./generator.js";
import { NodeFileSystem } from "langium/node";
import { LRPServer } from "../server/LRPServer.js";

export const generateAction = async (
  fileName: string,
  opts: GenerateOptions
): Promise<void> => {
  const services = createSchedulerServices(NodeFileSystem).Scheduler;
  const model = await extractAstNode<Tasks>(fileName, services);
  const generatedFilePath = generateJavaScript(
    model,
    fileName,
    opts.destination
  );
  console.log(
    chalk.green(`JavaScript code generated successfully: ${generatedFilePath}`)
  );
};

export const generate = async (
  fileName: string,
  opts: GenerateOptions
): Promise<void> => {
  const services = createSchedulerServices(NodeFileSystem).Scheduler;
  const model = await extractAstNode<Tasks>(fileName, services);
  generateSchedule(model, fileName, opts.destination);

  console.log(chalk.green(`run...`));
};
export type GenerateOptions = {
  destination?: string;
};

export default function (): void {
  const program = new Command();

  program
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    .version("0.0.1");

  const fileExtensions = SchedulerLanguageMetaData.fileExtensions.join(", ");
  program
    .command("generate")
    .argument(
      "<file>",
      `source file (possible file extensions: ${fileExtensions})`
    )
    .option("-d, --destination <dir>", "destination directory of generating")
    .description(
      'generates JavaScript code that prints "Hello, {name}!" for each greeting in a source file'
    )
    .action(generateAction);

  program
    .command("run")
    .description("Run a server at a specific port")
    .argument("<number>", "port")
    .action(async (port: number) => {
      const server = new LRPServer();
      server.start(port);

      //wait for server to start
      await new Promise<void>((resolve) =>
        setTimeout(() => {
          resolve();
        }, 2000)
      );
    });

  program.parse(process.argv);
}
