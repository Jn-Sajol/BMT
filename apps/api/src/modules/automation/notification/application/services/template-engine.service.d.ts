import { INotificationTemplateEngine } from '../../domain/ports/template-engine.interface';
export declare class TemplateEngineService implements INotificationTemplateEngine {
    render(templateBody: string, variables: Record<string, any>): string;
    validateVariables(templateBody: string, variables: Record<string, any>): string[];
}
