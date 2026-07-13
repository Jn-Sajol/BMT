export interface ITokenGenerator {
  generate(entropyBytes?: number): string;
}
