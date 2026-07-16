interface ExecutionState {
    logs: string[];
    addLog: (log: string) => void;
    clearLogs: () => void;
}
export declare const useAdvancedExecutionStore: import("zustand").UseBoundStore<import("zustand").StoreApi<ExecutionState>>;
export {};
