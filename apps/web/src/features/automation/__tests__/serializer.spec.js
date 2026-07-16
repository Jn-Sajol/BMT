"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const serializer_1 = require("../application/services/serializer");
describe("WorkflowSerializer", () => {
    const mockNodes = [
        { id: "node-1", type: "TRIGGER", label: "CPC Trigger", config: {} },
        { id: "node-2", type: "ACTION", label: "Slack Warning", config: {} },
    ];
    const mockEdges = [
        { id: "edge-1", source: "node-1", target: "node-2" },
    ];
    it("should correctly serialize and deserialize a workflow", () => {
        const json = serializer_1.WorkflowSerializer.serialize(mockNodes, mockEdges);
        const deserialized = serializer_1.WorkflowSerializer.deserialize(json);
        expect(deserialized.nodes.length).toBe(2);
        expect(deserialized.edges.length).toBe(1);
        expect(deserialized.nodes[0].id).toBe("node-1");
    });
    it("should export and import workflow template structures correctly", () => {
        const templateJson = serializer_1.WorkflowSerializer.exportTemplate("Meta Budget Target Adjuster", mockNodes, mockEdges);
        const imported = serializer_1.WorkflowSerializer.importTemplate(templateJson);
        expect(imported.name).toBe("Meta Budget Target Adjuster");
        expect(imported.nodes.length).toBe(2);
        expect(imported.edges.length).toBe(1);
    });
});
//# sourceMappingURL=serializer.spec.js.map