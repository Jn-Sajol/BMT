import { IUuidProvider } from '../../common/ports/uuid-provider.interface';
export declare class UuidProvider implements IUuidProvider {
    generate(): string;
    validate(uuid: string): boolean;
}
