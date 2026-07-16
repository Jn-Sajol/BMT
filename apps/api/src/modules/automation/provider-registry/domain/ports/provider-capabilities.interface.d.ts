export interface ProviderCapabilities {
    provider: string;
    supportsAutomation: boolean;
    supportsRealtimeWebhook: boolean;
    supportsInsightsSync: boolean;
    supportsCreativeEdit: boolean;
    supportsBudgetSchedule: boolean;
    [customCapability: string]: any;
}
