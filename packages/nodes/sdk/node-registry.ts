import { NodeDefinition, NodeCategory } from "./node-definition"

export class NodeRegistry {
  private static registry = new Map<string, NodeDefinition>()

  public static register(definition: NodeDefinition): void {
    if (NodeRegistry.registry.has(definition.id)) {
      throw new Error(`Node with ID ${definition.id} is already registered.`)
    }
    NodeRegistry.registry.set(definition.id, definition)
  }

  public static get(id: string): NodeDefinition | undefined {
    return NodeRegistry.registry.get(id)
  }

  public static list(): NodeDefinition[] {
    return Array.from(NodeRegistry.registry.values())
  }

  public static filterByCategory(category: NodeCategory): NodeDefinition[] {
    return NodeRegistry.list().filter((d) => d.category === category)
  }

  public static filterByProvider(provider: string): NodeDefinition[] {
    return NodeRegistry.list().filter((d) => d.provider.toLowerCase() === provider.toLowerCase())
  }

  public static clear(): void {
    NodeRegistry.registry.clear()
  }
}
