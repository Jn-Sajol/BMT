export interface ITemplateInstaller {
    install(workspaceId: string, templateId: string, version: string, userId: string): Promise<any>;
}
