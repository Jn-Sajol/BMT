export declare function useTemplateInstall(): {
    installTemplate: import("@tanstack/react-query").UseMutateAsyncFunction<any, Error, {
        id: string;
        payload: any;
    }, unknown>;
    isInstalling: boolean;
    rollbackTemplate: import("@tanstack/react-query").UseMutateAsyncFunction<any, Error, string, unknown>;
    isRollingBack: boolean;
};
