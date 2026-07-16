"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClaudeMock = void 0;
class ClaudeMock {
    async generateMessage(prompt) {
        return {
            completion: `Mock Claude Completion result for prompt: ${prompt}`,
            model: 'claude-3-opus',
        };
    }
}
exports.ClaudeMock = ClaudeMock;
//# sourceMappingURL=claude.mock.js.map