import { NodeDefinition } from "./node-definition"

export class BaseNode {
  constructor(
    public readonly definition: NodeDefinition,
    public properties: Record<string, any> = {}
  ) {}

  public validate(): { success: boolean; errors?: any } {
    const result = this.definition.propertiesSchema.safeParse(this.properties)
    if (!result.success) {
      return { success: false, errors: result.error.format() }
    }
    return { success: true }
  }

  public getCredentialReference(fieldName: string): string | null {
    const val = this.properties[fieldName]
    if (val && typeof val === "object" && val.credentialId) {
      return val.credentialId
    }
    return null
  }
}
