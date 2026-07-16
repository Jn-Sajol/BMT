"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAdvancedShortcuts = useAdvancedShortcuts;
const react_1 = require("react");
const selection_store_1 = require("../features/advanced/stores/selection.store");
const clipboard_store_1 = require("../features/advanced/stores/clipboard.store");
function useAdvancedShortcuts() {
    const { selectedNodeId, setSelectedNodeId } = (0, selection_store_1.useAdvancedSelectionStore)();
    const { setCopiedNodeData } = (0, clipboard_store_1.useAdvancedClipboardStore)();
    (0, react_1.useEffect)(() => {
        const handleKeyDown = (e) => {
            const isCtrl = e.ctrlKey || e.metaKey;
            if (isCtrl && e.key.toLowerCase() === "s") {
                e.preventDefault();
                console.log("[Shortcuts] Saving current workflow draft...");
            }
            if (isCtrl && e.key.toLowerCase() === "z") {
                e.preventDefault();
                if (e.shiftKey) {
                    console.log("[Shortcuts] Redo last action...");
                }
                else {
                    console.log("[Shortcuts] Undo last action...");
                }
            }
            if (isCtrl && e.key.toLowerCase() === "c") {
                if (selectedNodeId) {
                    e.preventDefault();
                    setCopiedNodeData({ nodeId: selectedNodeId, label: "Copied node" });
                    console.log("[Shortcuts] Copied node:", selectedNodeId);
                }
            }
            if (isCtrl && e.key.toLowerCase() === "v") {
                console.log("[Shortcuts] Pasting copied node data...");
            }
            if (e.key === "Delete" || e.key === "Backspace") {
                if (selectedNodeId) {
                    console.log("[Shortcuts] Deleting node:", selectedNodeId);
                    setSelectedNodeId(null);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [selectedNodeId, setCopiedNodeData, setSelectedNodeId]);
}
//# sourceMappingURL=useShortcuts.js.map