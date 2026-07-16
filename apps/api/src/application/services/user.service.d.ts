import { User } from '@prisma/client';
import { CreateUserDto } from '../../common/dto/identity.dto';
import { IUserService } from '../../common/ports/user-service.interface';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
export declare class UserService implements IUserService {
    private readonly userRepo;
    private readonly hasher;
    constructor(userRepo: UserRepository, hasher: IPasswordHasher);
    createUser(dto: CreateUserDto): Promise<User>;
    getUserById(id: string): Promise<User | null>;
    getUserByEmail(email: string): Promise<User | null>;
}
