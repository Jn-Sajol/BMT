import { IRecommendationProvider } from '../../domain/ports/recommendation-provider.interface';
export declare class RuleBasedRecommendationProvider implements IRecommendationProvider {
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): boolean;
    validate(payload: any): Promise<boolean>;
    generate(workspaceId: string): Promise<any[]>;
}
export declare class GptRecommendationProvider implements IRecommendationProvider {
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): entityType is "CAMPAIGN" | "CREATIVE";
    validate(payload: any): Promise<boolean>;
    generate(workspaceId: string): Promise<never[]>;
}
export declare class ClaudeRecommendationProvider implements IRecommendationProvider {
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): boolean;
    validate(payload: any): Promise<boolean>;
    generate(workspaceId: string): Promise<never[]>;
}
export declare class GeminiRecommendationProvider implements IRecommendationProvider {
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): boolean;
    validate(payload: any): Promise<boolean>;
    generate(workspaceId: string): Promise<never[]>;
}
export declare class InternalMlRecommendationProvider implements IRecommendationProvider {
    providerName(): string;
    providerVersion(): string;
    supports(entityType: string): boolean;
    validate(payload: any): Promise<boolean>;
    generate(workspaceId: string): Promise<never[]>;
}
export declare class RecommendationProviderRegistry {
    private providers;
    constructor();
    register(provider: IRecommendationProvider): void;
    resolve(name: string): IRecommendationProvider | undefined;
    getAll(): IRecommendationProvider[];
}
