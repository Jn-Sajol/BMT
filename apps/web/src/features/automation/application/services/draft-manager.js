"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowDraftManager = void 0;
class WorkflowDraftManager {
    activeDrafts = new Map();
    saveDraft(id, name, nodes, edges) {
        const draft = {
            id,
            name,
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            updatedAt: new Date().toISOString(),
        };
        this.activeDrafts.set(id, draft);
        return draft;
    }
    getDraft(id) {
        return this.activeDrafts.get(id);
    }
    discardDraft(id) {
        return this.activeDrafts.delete(id);
    }
}
exports.WorkflowDraftManager = WorkflowDraftManager;
//# sourceMappingURL=draft-manager.js.map