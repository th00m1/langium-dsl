import type { ValidationChecks } from 'langium';
import type { TodoListAstType } from './generated/ast.js';
import type { TodoListServices } from './todo-list-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: TodoListServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.TodoListValidator;
    const checks: ValidationChecks<TodoListAstType> = {
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class TodoListValidator { }
