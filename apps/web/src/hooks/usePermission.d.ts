import { type Permission } from "../lib/permissions";
export declare function usePermission(): {
    checkPermission: (permission: Permission) => boolean;
    role: string | null;
};
