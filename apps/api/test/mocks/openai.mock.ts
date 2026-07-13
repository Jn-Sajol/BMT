export class OpenAiMock {
  async generateCompletion(prompt: string): Promise<any> {
    return {
      text: `Mock GPT Completion result for prompt: ${prompt}`,
      usage: { promptTokens: 10, completionTokens: 15 },
    };
  }
}
