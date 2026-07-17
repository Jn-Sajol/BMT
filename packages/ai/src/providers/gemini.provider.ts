import { IAIProvider, AIMessage, AIResponse } from "../core/ai-provider.interface"
import { Observable, of } from "rxjs"

export class GeminiProvider implements IAIProvider {
  public async complete(messages: AIMessage[]): Promise<AIResponse> {
    return {
      content: "Gemini Completion Result Placeholder",
      usage: { promptTokens: 10, completionTokens: 10, totalTokens: 20 },
    }
  }

  public stream(messages: AIMessage[]): Observable<string> {
    return of("Gemini", "stream", "payload")
  }
}
