import type { Tasks } from "../language/generated/ast.js";
import { SchedulerGenerator } from "../scheduler-generator.js";
// import * as fs from 'node:fs';
// import { CompositeGeneratorNode, NL, toString } from 'langium';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(
  model: Tasks,
  filePath: string,
  destination: string | undefined
): string {
  // const data = extractDestinationAndName(filePath, destination);
  // const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

  // const fileNode = new CompositeGeneratorNode();
  // fileNode.append('"use strict";', NL, NL);
  // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));

  // if (!fs.existsSync(data.destination)) {
  //     fs.mkdirSync(data.destination, { recursive: true });
  // }
  // fs.writeFileSync(generatedFilePath, toString(fileNode));
  // return generatedFilePath
  return "";
}

export function generateSchedule(
  model: Tasks,
  filePath: string,
  destination: string | undefined
): string {
  const scheduler = new SchedulerGenerator(model);
  console.log("==========SOLVED=========!!");
  console.log(scheduler.solve());
  return "";
}
