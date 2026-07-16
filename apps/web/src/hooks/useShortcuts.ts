import { useEffect } from "react"
import { useAdvancedSelectionStore } from "../features/advanced/stores/selection.store"
import { useAdvancedClipboardStore } from "../features/advanced/stores/clipboard.store"

export function useAdvancedShortcuts() {
  const { selectedNodeId, setSelectedNodeId } = useAdvancedSelectionStore()
  const { setCopiedNodeData } = useAdvancedClipboardStore()

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isCtrl = e.ctrlKey || e.metaKey

      if (isCtrl && e.key.toLowerCase() === "s") {
        e.preventDefault()
        console.log("[Shortcuts] Saving current workflow draft...")
      }

      if (isCtrl && e.key.toLowerCase() === "z") {
        e.preventDefault()
        if (e.shiftKey) {
          console.log("[Shortcuts] Redo last action...")
        } else {
          console.log("[Shortcuts] Undo last action...")
        }
      }

      if (isCtrl && e.key.toLowerCase() === "c") {
        if (selectedNodeId) {
          e.preventDefault()
          setCopiedNodeData({ nodeId: selectedNodeId, label: "Copied node" })
          console.log("[Shortcuts] Copied node:", selectedNodeId)
        }
      }

      if (isCtrl && e.key.toLowerCase() === "v") {
        console.log("[Shortcuts] Pasting copied node data...")
      }

      if (e.key === "Delete" || e.key === "Backspace") {
        if (selectedNodeId) {
          console.log("[Shortcuts] Deleting node:", selectedNodeId)
          setSelectedNodeId(null)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [selectedNodeId, setCopiedNodeData, setSelectedNodeId])
}
