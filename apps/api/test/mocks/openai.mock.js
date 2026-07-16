"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiMock = void 0;
class OpenAiMock {
    async generateCompletion(prompt) {
        return {
            text: `Mock GPT Completion result for prompt: ${prompt}`,
            usage: { promptTokens: 10, completionTokens: 15 },
        };
    }
}
exports.OpenAiMock = OpenAiMock;
//# sourceMappingURL=openai.mock.js.map