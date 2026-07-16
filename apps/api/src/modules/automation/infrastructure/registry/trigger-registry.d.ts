import { ITriggerRegistry } from '../../domain/ports/trigger-registry.interface';
import { ITriggerProvider } from '../../domain/ports/trigger-provider.interface';
export declare class TriggerRegistry implements ITriggerRegistry {
    private providers;
    registerProvider(provider: ITriggerProvider): void;
    getProviders(): ITriggerProvider[];
    getProviderForSource(source: string): ITriggerProvider | undefined;
}
