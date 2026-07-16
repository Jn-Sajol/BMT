"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowVersionManager = void 0;
class WorkflowVersionManager {
    versions = [];
    createVersion(version, nodes, edges) {
        if (this.versions.some((v) => v.version === version)) {
            throw new Error(`Version ${version} already exists in history.`);
        }
        const newVersion = {
            version,
            nodes: JSON.parse(JSON.stringify(nodes)),
            edges: JSON.parse(JSON.stringify(edges)),
            createdAt: new Date().toISOString(),
        };
        this.versions.push(newVersion);
        return newVersion;
    }
    getVersion(version) {
        return this.versions.find((v) => v.version === version);
    }
    listVersions() {
        return [...this.versions];
    }
    rollbackTo(version) {
        const target = this.getVersion(version);
        if (!target) {
            throw new Error(`Version ${version} not found in history logs.`);
        }
        return {
            nodes: JSON.parse(JSON.stringify(target.nodes)),
            edges: JSON.parse(JSON.stringify(target.edges)),
        };
    }
}
exports.WorkflowVersionManager = WorkflowVersionManager;
//# sourceMappingURL=version-manager.js.map