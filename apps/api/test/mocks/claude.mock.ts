export class ClaudeMock {
  async generateMessage(prompt: string): Promise<any> {
    return {
      completion: `Mock Claude Completion result for prompt: ${prompt}`,
      model: 'claude-3-opus',
    };
  }
}
