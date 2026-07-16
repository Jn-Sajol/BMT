import { IRepository } from './repository.port';
import { User } from '@prisma/client';
export interface IUserRepository extends IRepository<User> {
    findByEmail(email: string): Promise<User | null>;
}
