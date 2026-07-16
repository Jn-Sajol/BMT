"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AdvancedDesignerPage;
const react_1 = __importDefault(require("react"));
const useShortcuts_1 = require("../../../../../hooks/useShortcuts");
const selection_store_1 = require("../../../../../features/advanced/stores/selection.store");
const execution_store_1 = require("../../../../../features/advanced/stores/execution.store");
function AdvancedDesignerPage() {
    // Mount keyboard shortcuts hook
    (0, useShortcuts_1.useAdvancedShortcuts)();
    const { selectedNodeId, setSelectedNodeId } = (0, selection_store_1.useAdvancedSelectionStore)();
    const { logs, addLog } = (0, execution_store_1.useAdvancedExecutionStore)();
    // Mock list of nodes in library
    const nodeLibrary = [
        { type: "TRIGGER", label: "CPC Spike Trigger", category: "Triggers" },
        { type: "TRIGGER", label: "Time Schedule Trigger", category: "Triggers" },
        { type: "ACTION", label: "Cut Budget Adset", category: "Actions" },
        { type: "ACTION", label: "Dispatch Slack Alert", category: "Actions" },
    ];
    const handleSelectNode = (id) => {
        setSelectedNodeId(id);
        addLog(`[Canvas] Selected node: ${id}`);
    };
    const handleCompile = () => {
        addLog("[Compiler] Commencing topological rule sorting...");
        addLog("[Compiler] Checking connections and loops...");
        addLog("[Compiler] Validation status: SUCCESSFUL (0 errors)");
    };
    return (<div className="h-[calc(100vh-8rem)] flex flex-col justify-between">
      {/* 1. Editor Panels Layout */}
      <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
        {/* Left Node Library */}
        <div className="col-span-3 border bg-card rounded-xl p-4 flex flex-col space-y-4 overflow-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Node Library</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Triggers</h3>
              <div className="space-y-2">
                {nodeLibrary.filter(n => n.type === "TRIGGER").map((node, i) => (<div key={i} draggable className="border bg-muted/40 hover:bg-muted p-2 rounded text-xs font-medium cursor-grab">
                    {node.label}
                  </div>))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold text-muted-foreground mb-2">Actions</h3>
              <div className="space-y-2">
                {nodeLibrary.filter(n => n.type === "ACTION").map((node, i) => (<div key={i} draggable className="border bg-muted/40 hover:bg-muted p-2 rounded text-xs font-medium cursor-grab">
                    {node.label}
                  </div>))}
              </div>
            </div>

            {/* AI Assistant coming soon banner */}
            <div className="border border-orange-500/25 bg-orange-500/5 p-3 rounded-lg text-center">
              <span className="text-xs text-orange-600 dark:text-orange-400 font-semibold">
                AI Assistant (Coming Soon)
              </span>
            </div>
          </div>
        </div>

        {/* Center Canvas Grid */}
        <div className="col-span-6 border bg-card rounded-xl relative flex items-center justify-center overflow-hidden bg-slate-950 text-white">
          {/* Visual grid dots */}
          <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40"/>
          
          <div className="z-10 text-center space-y-4">
            <span className="text-xs border border-orange-500/30 px-2.5 py-0.5 rounded-full bg-orange-950/20 text-orange-400 font-mono">
              React Flow Target Area
            </span>
            <div className="flex justify-center space-x-4">
              <button onClick={() => handleSelectNode("node-1")} className="px-3 py-2 border rounded-lg bg-slate-900 text-xs font-semibold hover:bg-slate-800">
                Mock Trigger Node
              </button>
              <button onClick={() => handleSelectNode("node-2")} className="px-3 py-2 border rounded-lg bg-slate-900 text-xs font-semibold hover:bg-slate-800">
                Mock Action Node
              </button>
            </div>
            <p className="text-xs text-muted-foreground">Select a node to inspect parameters.</p>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="col-span-3 border bg-card rounded-xl p-4 flex flex-col space-y-4 overflow-auto">
          <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties Panel</h2>
          
          {selectedNodeId ? (<div className="space-y-4 text-xs">
              <div>
                <span className="font-semibold text-muted-foreground">Selected ID: </span>
                <span className="font-mono">{selectedNodeId}</span>
              </div>
              <div className="space-y-2">
                <label className="font-medium text-muted-foreground block">Trigger Threshold</label>
                <input type="text" defaultValue="CPC > 1.20" className="w-full rounded border px-2 py-1 bg-background text-xs"/>
              </div>
              <div className="space-y-2">
                <label className="font-medium text-muted-foreground block">Action Target</label>
                <select className="w-full rounded border px-2 py-1 bg-background text-xs">
                  <option>Meta Campaign Adset</option>
                  <option>Google Ad Group</option>
                </select>
              </div>
            </div>) : (<div className="text-xs text-muted-foreground text-center mt-8">
              No node selected. Click a node in the canvas to view properties.
            </div>)}
        </div>
      </div>

      {/* 2. Bottom Execution Console */}
      <div className="h-32 border bg-card rounded-xl p-4 mt-6 flex flex-col justify-between overflow-hidden">
        <div className="flex items-center justify-between border-b pb-2 mb-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Execution Console</h2>
          <button onClick={handleCompile} className="px-2.5 py-0.5 rounded bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold">
            Compile Rules
          </button>
        </div>
        <div className="flex-1 overflow-auto font-mono text-[10px] space-y-1 text-slate-400">
          {logs.map((log, i) => (<div key={i}>{log}</div>))}
        </div>
      </div>
    </div>);
}
//# sourceMappingURL=page.js.map