"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.logger = {
    info: (msg, meta) => {
        console.log(JSON.stringify({ level: "INFO", message: msg, timestamp: new Date().toISOString(), ...meta }));
    },
    error: (msg, err) => {
        console.error(JSON.stringify({ level: "ERROR", message: msg, error: err?.message, timestamp: new Date().toISOString() }));
    },
};
//# sourceMappingURL=logger.js.map