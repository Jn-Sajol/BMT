import { IPasswordHistoryValidator } from '../common/ports/identity/password-history-validator.interface';
export declare class MockPasswordHistoryValidator implements IPasswordHistoryValidator {
    validate(userId: string, newPasswordPlain: string): Promise<void>;
}
export declare class PasswordResetModule {
}
