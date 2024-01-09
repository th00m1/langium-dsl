import type { Tasks } from "../language/generated/ast.js";
import { SchedulerGenerator, Task } from "../scheduler-generator.js";
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
  const tasks: Task[] = model.tasks.map((task) => ({
    id: task.name,
    duration: task.duration,
    precedence: [],
  }));
  console.log("model", model.precedences);

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

  console.log("task", tasksWithPrecedence);

  tasksWithPrecedence.forEach((task) => {
    console.log("name: " + task.id);
    task.precedence?.forEach((p) => console.log(p));
  });

  const scheduler = new SchedulerGenerator(tasksWithPrecedence);
  console.log("==========SOLVED=========");
  console.log(scheduler.solve());
  return "";
}
