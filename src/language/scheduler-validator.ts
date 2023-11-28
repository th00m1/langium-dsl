import type { ValidationChecks } from 'langium';
import type { SchedulerAstType } from './generated/ast.js';
import type { SchedulerServices } from './scheduler-module.js';

/**
 * Register custom validation checks.
 */
export function registerValidationChecks(services: SchedulerServices) {
    const registry = services.validation.ValidationRegistry;
    const validator = services.validation.SchedulerValidator;
    const checks: ValidationChecks<SchedulerAstType> = {
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SchedulerValidator { }
