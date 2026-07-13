export interface IAuthStrategy<TInput, TOutput> {
  authenticate(input: TInput): Promise<TOutput>;
}
