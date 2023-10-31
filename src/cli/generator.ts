import { isAdd, isComplete, type Model } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

export function generateJavaScript(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.js`;

    const fileNode = new CompositeGeneratorNode();
    fileNode.append('"use strict";', NL, NL);
    // model.greetings.forEach(greeting => fileNode.append(`console.log('Hello, ${greeting.person.ref?.name}!');`, NL));

    let todos: {content: string, id: number}[]= [];
    
    model.stmts.forEach(stmt => {
        if(isAdd(stmt)) {
            todos = [...todos, {content: stmt.content, id: todos.length + 1}]
            fileNode.append(`console.log("one todo added");`, NL)
        } else if(isComplete(stmt)) {
            todos = todos.filter(todo => todo.id !== stmt.todoId);
            fileNode.append(`console.log('todo with ID ${stmt.todoId} removed');`, NL)
        } else {
            fileNode.append(`console.log('TODO');`, NL)
            todos.forEach(todo => {
                fileNode.append(`console.log('#${todo.id} | ${todo.content}');`, NL)
            });
        }
    })

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }
    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}
