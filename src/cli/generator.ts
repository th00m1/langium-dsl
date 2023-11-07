import { isAdd, isComplete, isUpdate, type Model } from '../language/generated/ast.js';
import * as fs from 'node:fs';
import { CompositeGeneratorNode, NL, toString } from 'langium';
import * as path from 'node:path';
import { extractDestinationAndName } from './cli-util.js';

type Todo = {
    name: string,
    content: string,
    isCompleted: boolean,
    isUpdated?: boolean,
}

function generateTodos(model: Model): Todo[] {
    let todos: Todo[]= [];
    
    model.stmts.forEach(stmt => {
        if(isAdd(stmt)) {
            const newTodo: Todo = {name: stmt.name, content: stmt.content, isCompleted: false}
            todos.push(newTodo); 
        } else if(isComplete(stmt)) {
            const todo =  todos.find(todo => todo.name === stmt.todoName)
            if(todo) {
                todo.isCompleted = true 
            }
        } else if (isUpdate(stmt)) {
            const todo =  todos.find(todo => todo.name === stmt.todoName)
            if(todo) {
                todo.content = stmt.newContent
                todo.isUpdated = true
            }
        }
    })

    return todos;
}

export function generateFile(model: Model, filePath: string, destination: string | undefined): string {
    const data = extractDestinationAndName(filePath, destination);
    const generatedFilePath = `${path.join(data.destination, data.name)}.txt`;
    
    const todos = generateTodos(model);
    
    const fileNode = new CompositeGeneratorNode();
    fileNode.append('TODO', NL, NL)

    todos.forEach(todo => {
        let newLine = ''
        newLine += todo.isCompleted ? '[x]' : '[]'
        newLine += todo.isUpdated ? ' (updated) ' : ' '
        newLine += `${todo.name} - ${todo.content}`
        fileNode.append(newLine, NL)
    })

    if (!fs.existsSync(data.destination)) {
        fs.mkdirSync(data.destination, { recursive: true });
    }

    fs.writeFileSync(generatedFilePath, toString(fileNode));
    return generatedFilePath;
}
