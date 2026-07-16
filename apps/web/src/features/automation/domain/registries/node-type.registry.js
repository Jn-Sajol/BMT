"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeTypeRegistry = void 0;
exports.NodeTypeRegistry = {
    supportedTypes: new Set([
        "TRIGGER",
        "ACTION",
        "CONDITION",
        "DELAY",
        "LOOP",
        "AI",
        "VARIABLE",
        "MERGE",
        "SPLIT",
        "WEBHOOK",
        "HTTP_REQUEST",
        "NOTIFICATION",
        "DATABASE",
        "SCHEDULE",
    ]),
    isSupported: (type) => {
        return exports.NodeTypeRegistry.supportedTypes.has(type);
    },
};
//# sourceMappingURL=node-type.registry.js.map