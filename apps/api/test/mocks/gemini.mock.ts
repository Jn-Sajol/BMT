export class GeminiMock {
  async generateContent(prompt: string): Promise<any> {
    return {
      candidates: [
        { content: { parts: [{ text: `Mock Gemini Completion result for prompt: ${prompt}` }] } }
      ]
    };
  }
}
