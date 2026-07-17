import { IAIProvider } from "./ai-provider.interface"

export class AIRegistry {
  private static registry = new Map<string, IAIProvider>()

  public static register(providerName: string, provider: IAIProvider): void {
    AIRegistry.registry.set(providerName.toLowerCase(), provider)
  }

  public static resolve(providerName: string): IAIProvider {
    const provider = AIRegistry.registry.get(providerName.toLowerCase())
    if (!provider) {
      throw new Error(`AI Provider ${providerName} is not registered.`)
    }
    return provider
  }

  public static clear(): void {
    AIRegistry.registry.clear()
  }
}
