import { IProviderAuth } from "./auth.interface"
import { IGraphClient } from "./graph.interface"

export interface IProvider {
  id: string
  name: string
  auth: IProviderAuth
  getGraphClient: (accessToken: string) => IGraphClient
}
