import { NodeRegistry } from "./sdk/node-registry"
import { WebhookNodeDefinition } from "./core/webhook.node"
import { LogicNodeDefinition } from "./core/logic.node"
import { MetaNodeDefinition } from "./providers/meta.node"
import { OpenAiNodeDefinition } from "./providers/openai.node"

// Register nodes on library load
NodeRegistry.register(WebhookNodeDefinition)
NodeRegistry.register(LogicNodeDefinition)
NodeRegistry.register(MetaNodeDefinition)
NodeRegistry.register(OpenAiNodeDefinition)

export * from "./sdk/node-definition"
export * from "./sdk/base-node"
export * from "./sdk/node-registry"
export * from "./sdk/node-executor"
export * from "./sdk/execution-context"
export * from "./sdk/workflow-runner"
