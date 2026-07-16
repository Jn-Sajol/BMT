import { User } from '@prisma/client';
import { IUserRepository } from '../../../common/ports/user-repository.interface';
import { ExtendedPrismaClient } from '../prisma-extensions';
export declare class UserRepository implements IUserRepository {
    private readonly prisma;
    constructor(prisma: ExtendedPrismaClient);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    save(entity: User): Promise<User>;
    delete(id: string): Promise<void>;
}
