import { IRandomStringGenerator } from '../../common/ports/random-string-generator.interface';
export declare class RandomStringGenerator implements IRandomStringGenerator {
    generate(length: number): string;
}
