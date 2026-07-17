import { IProvider } from "../core/provider.interface"
import { MetaAuth } from "./auth/meta-auth"
import { MetaGraphClient } from "./graph/meta-graph-client"
import { ProviderRegistry } from "../core/provider-registry"

export const MetaProvider: IProvider = {
  id: "meta-provider",
  name: "Meta Marketing Platform",
  auth: new MetaAuth(),
  getGraphClient: (token) => new MetaGraphClient(token),
}

// Auto-register inside catalog
ProviderRegistry.register(MetaProvider)

export * from "./auth/meta-auth"
export * from "./graph/meta-graph-client"
export * from "./marketing/meta-services"
