import { PermissionService } from '../../../application/services/permission.service';
export declare class RbacSeeder {
    private readonly permissionService;
    constructor(permissionService: PermissionService);
    seed(): Promise<void>;
}
