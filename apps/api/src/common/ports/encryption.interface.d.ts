export interface IEncryption {
    encrypt(plainText: string): string;
    decrypt(cipherText: string): string;
}
