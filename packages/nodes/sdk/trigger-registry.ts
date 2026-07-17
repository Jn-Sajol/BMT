export interface TriggerDefinition {
  id: string
  name: string
  type: "cron" | "manual" | "webhook"
  description?: string
  configSchema?: any
}

export class TriggerRegistry {
  private static registry = new Map<string, TriggerDefinition>()

  public static register(definition: TriggerDefinition): void {
    if (TriggerRegistry.registry.has(definition.id)) {
      throw new Error(`Trigger with ID ${definition.id} is already registered.`)
    }
    TriggerRegistry.registry.set(definition.id, definition)
  }

  public static get(id: string): TriggerDefinition | undefined {
    return TriggerRegistry.registry.get(id)
  }

  public static list(): TriggerDefinition[] {
    return Array.from(TriggerRegistry.registry.values())
  }

  public static clear(): void {
    TriggerRegistry.registry.clear()
  }
}
