export interface IRecommendationProvider {
    generate(workspaceId: string): Promise<any[]>;
    validate(payload: any): Promise<boolean>;
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): boolean;
}
