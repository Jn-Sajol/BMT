import { IEncryption } from '../../common/ports/encryption.interface';
export declare class Aes256Encryption implements IEncryption {
    private readonly key;
    constructor();
    encrypt(plainText: string): string;
    decrypt(cipherText: string): string;
}
