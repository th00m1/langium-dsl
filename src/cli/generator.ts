import type { Model } from '../language/generated/ast.js';
import { SchedulerGenerator, Task } from '../scheduler-generator.js';
// import * as fs from 'node:fs';
// import { CompositeGeneratorNode, NL, toString } from 'langium';
// import * as path from 'node:path';
// import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
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
    return '';
}

export function generateSchedule(model: Model, filePath: string, destination: string | undefined): string {
    
    const tasks: Task[] = model.tasks.map(task => ({id: task.name, duration: task.duration}));
    const tasksWithPrecedence = tasks.map(task => {
        
        const precedence = model.precedences.find(precedence => precedence.task.ref?.name === task.id)
        if(!precedence) return task;
        
        const require = tasks.find(t => t.id === precedence.require.ref?.name)
        if(!require) return task;

        return {
            ...task,
            precedence: require
        }
    })

    const scheduler = new SchedulerGenerator(tasksWithPrecedence);
    console.log(scheduler.solve());
    return ""
}
