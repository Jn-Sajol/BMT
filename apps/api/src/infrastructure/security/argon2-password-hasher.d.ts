import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
export declare class Argon2PasswordHasher implements IPasswordHasher {
    hash(password: string): Promise<string>;
    compare(password: string, hash: string): Promise<boolean>;
}
