import { IProvider } from "./provider.interface"

export class ProviderRegistry {
  private static providers = new Map<string, IProvider>()

  public static register(provider: IProvider): void {
    if (ProviderRegistry.providers.has(provider.id)) {
      throw new Error(`Provider with ID ${provider.id} is already registered.`)
    }
    ProviderRegistry.providers.set(provider.id, provider)
  }

  public static get(id: string): IProvider | undefined {
    return ProviderRegistry.providers.get(id)
  }

  public static list(): IProvider[] {
    return Array.from(ProviderRegistry.providers.values())
  }

  public static clear(): void {
    ProviderRegistry.providers.clear()
  }
}
