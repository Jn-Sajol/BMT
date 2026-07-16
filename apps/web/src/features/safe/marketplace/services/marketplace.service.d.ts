export declare const MarketplaceService: {
    listTemplates: () => Promise<any>;
    installTemplate: (id: string, payload: any) => Promise<any>;
    rollbackTemplate: (id: string) => Promise<any>;
};
