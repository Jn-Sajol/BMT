"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestContext = void 0;
const async_hooks_1 = require("async_hooks");
class RequestContext {
    static storage = new async_hooks_1.AsyncLocalStorage();
    static run(store, callback) {
        return this.storage.run(store, callback);
    }
    static get current() {
        return this.storage.getStore();
    }
    static get correlationId() {
        return this.current?.correlationId;
    }
    static get tenantId() {
        return this.current?.tenantId;
    }
    static get userId() {
        return this.current?.userId;
    }
}
exports.RequestContext = RequestContext;
//# sourceMappingURL=request-context.js.map