export interface IPasswordHistoryValidator {
    validate(userId: string, newPasswordPlain: string): Promise<void>;
}
