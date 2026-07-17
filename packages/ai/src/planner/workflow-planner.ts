import { AIRegistry } from "../core/ai-registry"
import { IAIProvider } from "../core/ai-provider.interface"

export class WorkflowPlanner {
  public static sanitizePrompt(prompt: string): string {
    // 1. Recursive Guardrails: remove tokens, vault secrets, api keys, environment keys, confidential IDs
    let clean = prompt
    clean = clean.replace(/ConfidentialID:\s*\S+/gi, "ConfidentialID: [REDACTED]")
    clean = clean.replace(/(Bearer\s+|Token\s*=\s*|key\s*=\s*)\S+/gi, "$1[REDACTED]")
    clean = clean.replace(/([a-zA-Z0-9_-]{32,})/g, "[REDACTED_HASH]")
    return clean
  }

  public async planWorkflow(
    prompt: string,
    providerName: string
  ): Promise<{ nodes: any[]; edges: any[]; variables: any; description: string; warnings: string[] }> {
    const provider = AIRegistry.resolve(providerName)
    const cleanPrompt = WorkflowPlanner.sanitizePrompt(prompt)

    const response = await provider.complete([
      { role: "system", content: "You are the BMT AI planner assistant. Output valid workflow JSON structures." },
      { role: "user", content: cleanPrompt },
    ])

    return JSON.parse(response.content)
  }
}
