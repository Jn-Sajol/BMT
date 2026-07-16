import { User } from '@prisma/client';
import { CreateUserDto } from '../dto/identity.dto';
export interface IUserService {
    createUser(dto: CreateUserDto): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
}
