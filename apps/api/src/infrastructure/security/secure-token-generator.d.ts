import { ITokenGenerator } from '../../common/ports/token-generator.interface';
export declare class SecureTokenGenerator implements ITokenGenerator {
    generate(entropyBytes?: number): string;
}
