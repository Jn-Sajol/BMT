import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthorizationService } from '../../application/services/authorization.service';
export declare class AuthorizationGuard implements CanActivate {
    private readonly reflector;
    private readonly authService;
    constructor(reflector: Reflector, authService: AuthorizationService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
