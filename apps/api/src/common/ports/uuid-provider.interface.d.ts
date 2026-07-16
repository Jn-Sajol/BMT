export interface IUuidProvider {
    generate(): string;
    validate(uuid: string): boolean;
}
