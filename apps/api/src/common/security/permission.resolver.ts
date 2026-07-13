import { PermissionCode } from './permission.code';

export class PermissionResolver {
  static resolveModule(action: PermissionCode): string {
    return action.split('.')[0];
  }

  static resolveResource(action: PermissionCode): string {
    return action.split('.')[1];
  }

  static resolveAction(action: PermissionCode): string {
    return action.split('.')[2];
  }

  static matchesPattern(action: PermissionCode, pattern: string): boolean {
    if (pattern === '*') return true;
    
    const actionParts = action.split('.');
    const patternParts = pattern.split('.');
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i] === '*') continue;
      if (patternParts[i] !== actionParts[i]) return false;
    }
    
    return true;
  }
}
