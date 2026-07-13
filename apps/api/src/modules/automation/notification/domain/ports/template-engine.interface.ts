export interface INotificationTemplateEngine {
  render(templateBody: string, variables: Record<string, any>): string;
  validateVariables(templateBody: string, variables: Record<string, any>): string[];
}
