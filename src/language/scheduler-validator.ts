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
        // Person: validator.checkPersonStartsWithCapital
    };
    registry.register(checks, validator);
}

/**
 * Implementation of custom validations.
 */
export class SchedulerValidator {

    // checkPersonStartsWithCapital(person: Person, accept: ValidationAcceptor): void {
    //     if (person.name) {
    //         const firstChar = person.name.substring(0, 1);
    //         if (firstChar.toUpperCase() !== firstChar) {
    //             accept('warning', 'Person name should start with a capital.', { node: person, property: 'name' });
    //         }
    //     }
    // }

}
