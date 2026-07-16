"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeminiMock = void 0;
class GeminiMock {
    async generateContent(prompt) {
        return {
            candidates: [
                { content: { parts: [{ text: `Mock Gemini Completion result for prompt: ${prompt}` }] } }
            ]
        };
    }
}
exports.GeminiMock = GeminiMock;
//# sourceMappingURL=gemini.mock.js.map