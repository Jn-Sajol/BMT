"use client"

import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { NodeRegistry } from "automation-nodes"
import { useAdvancedSelectionStore } from "../../stores/selection.store"
import { useAdvancedExecutionStore } from "../../stores/execution.store"

export default function PropertiesPanel() {
  const { selectedNodeId } = useAdvancedSelectionStore()
  const { addLog } = useAdvancedExecutionStore()

  // Match mock node definitions for this demo (e.g. mapping canvas nodes to registry IDs)
  const registryId = selectedNodeId === "node-1" ? "webhook-trigger" : "meta-adjust-budget"
  const definition = NodeRegistry.get(registryId)

  const [formFields, setFormFields] = useState<Record<string, any>>({})

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: definition ? zodResolver(definition.propertiesSchema) : undefined,
    defaultValues: {},
  })

  // Watch for node changes to reload default parameters
  useEffect(() => {
    if (definition) {
      const defaults: Record<string, any> = {}
      Object.keys(definition.uiMetadata).forEach((key) => {
        defaults[key] = ""
      })
      setFormFields(defaults)
    }
  }, [selectedNodeId])

  const onSubmit = (data: any) => {
    addLog(`[Properties] Parameters verified successfully: ${JSON.stringify(data)}`)
  }

  if (!definition) {
    return (
      <div className="space-y-4">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties Inspector</h2>
        <div className="text-xs text-muted-foreground text-center py-12">
          Select a node on the canvas to view properties.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-slate-700 pb-2">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Properties Inspector</h2>
        <span className="text-[10px] text-orange-400 font-semibold">{definition.name} (v{definition.version})</span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
        {Object.entries(definition.uiMetadata).map(([key, meta]) => {
          return (
            <div key={key} className="space-y-1">
              <label className="font-medium text-slate-300 block">{meta.label}</label>

              {meta.type === "select" ? (
                <select
                  {...register(key)}
                  className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white"
                >
                  <option value="">Select Option</option>
                  {meta.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              ) : meta.type === "textarea" ? (
                <textarea
                  {...register(key)}
                  className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white h-20"
                />
              ) : meta.type === "secret" ? (
                <div className="space-y-1">
                  <input
                    type="text"
                    placeholder="Reference e.g. secret-credentials-id"
                    {...register(`${key}.credentialId`)}
                    className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white font-mono"
                  />
                  <span className="text-[9px] text-muted-foreground">Resolves credentials via vault reference securely.</span>
                </div>
              ) : (
                <input
                  type={meta.type === "password" ? "password" : "text"}
                  {...register(key)}
                  className="w-full rounded border border-slate-700 px-2.5 py-1.5 bg-slate-900 text-xs text-white"
                />
              )}

              {errors[key] && (
                <span className="text-[10px] text-red-500 font-semibold">
                  {String(errors[key]?.message)}
                </span>
              )}
            </div>
          )
        })}

        <button
          type="submit"
          className="w-full rounded bg-orange-600 hover:bg-orange-700 py-2 text-xs font-semibold text-white transition mt-4"
        >
          Validate Node Config
        </button>
      </form>
    </div>
  )
}
