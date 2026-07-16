"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validator_1 = require("../application/services/validator");
describe("WorkflowValidator", () => {
    it("should fail validation if there are no triggers", () => {
        const nodes = [
            { id: "node-1", type: "ACTION", label: "Cut Budget", config: {} },
        ];
        const edges = [];
        const errors = validator_1.WorkflowValidator.validate(nodes, edges);
        expect(errors.some((e) => e.type === "MISSING_TRIGGER")).toBe(true);
    });
    it("should detect self loops and cycle dependencies via Kahn's algorithm", () => {
        const nodes = [
            { id: "trigger-1", type: "TRIGGER", label: "CPC Spike", config: {} },
            { id: "action-1", type: "ACTION", label: "Cut Budget", config: {} },
        ];
        // Cycle setup (action loops back to trigger)
        const edges = [
            { id: "edge-1", source: "trigger-1", target: "action-1" },
            { id: "edge-2", source: "action-1", target: "trigger-1" },
        ];
        const errors = validator_1.WorkflowValidator.validate(nodes, edges);
        expect(errors.some((e) => e.type === "INVALID_TRIGGER_CONNECTION" || e.type === "CYCLIC_DEPENDENCY")).toBe(true);
    });
    it("should detect duplicate connections", () => {
        const nodes = [
            { id: "trigger-1", type: "TRIGGER", label: "CPC Spike", config: {} },
            { id: "action-1", type: "ACTION", label: "Cut Budget", config: {} },
        ];
        const edges = [
            { id: "edge-1", source: "trigger-1", target: "action-1" },
            { id: "edge-2", source: "trigger-1", target: "action-1" },
        ];
        const errors = validator_1.WorkflowValidator.validate(nodes, edges);
        expect(errors.some((e) => e.type === "DUPLICATE_EDGE")).toBe(true);
    });
});
//# sourceMappingURL=validator.spec.js.map