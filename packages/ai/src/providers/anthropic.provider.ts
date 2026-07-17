import { IAIProvider, AIMessage, AIResponse } from "../core/ai-provider.interface"
import { Observable, of } from "rxjs"

export class AnthropicProvider implements IAIProvider {
  public async complete(messages: AIMessage[]): Promise<AIResponse> {
    return {
      content: "Anthropic Completion Result Placeholder",
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
    }
  }

  public stream(messages: AIMessage[]): Observable<string> {
    return of("Anthropic", "stream", "payload")
  }
}
