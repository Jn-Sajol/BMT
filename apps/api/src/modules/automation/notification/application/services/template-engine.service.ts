import { Injectable } from '@nestjs/common';
import { INotificationTemplateEngine } from '../../domain/ports/template-engine.interface';

@Injectable()
export class TemplateEngineService implements INotificationTemplateEngine {
  render(templateBody: string, variables: Record<string, any>): string {
    let output = templateBody;
    for (const [key, val] of Object.entries(variables)) {
      const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
      output = output.replace(regex, String(val ?? ''));
    }
    return output;
  }

  validateVariables(templateBody: string, variables: Record<string, any>): string[] {
    const missing: string[] = [];
    const regex = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
    let match;
    while ((match = regex.exec(templateBody)) !== null) {
      const key = match[1];
      if (variables[key] === undefined || variables[key] === null) {
        missing.push(key);
      }
    }
    return missing;
  }
}
