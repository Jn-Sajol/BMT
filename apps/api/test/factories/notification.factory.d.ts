export declare class NotificationFactory {
    static build(overrides?: any): any;
    static buildMany(count: number, overrides?: any): any[];
    static create(prisma: any, overrides?: any): Promise<any>;
    static createMany(prisma: any, count: number, overrides?: any): Promise<any[]>;
}
