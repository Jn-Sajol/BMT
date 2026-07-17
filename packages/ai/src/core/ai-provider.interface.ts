import { Observable } from "rxjs"

export interface AIMessage {
  role: "system" | "user" | "assistant"
  content: string
}

export interface AIResponse {
  content: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

export interface IAIProvider {
  complete: (messages: AIMessage[], options?: Record<string, any>) => Promise<AIResponse>
  stream: (messages: AIMessage[], options?: Record<string, any>) => Observable<string>
}
