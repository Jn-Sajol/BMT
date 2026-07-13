import { Injectable, Inject } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from '../../common/dto/identity.dto';
import { IUserService } from '../../common/ports/user-service.interface';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { UserAlreadyExistsException } from '../../common/exceptions/domain-exceptions';
import { PASSWORD_HASHER } from '../../infrastructure/security/security.module';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';

@Injectable()
export class UserService implements IUserService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(PASSWORD_HASHER)
    private readonly hasher: IPasswordHasher,
  ) {}

  async createUser(dto: CreateUserDto): Promise<User> {
    const existing = await this.userRepo.findByEmail(dto.email);
    if (existing) {
      throw new UserAlreadyExistsException(dto.email);
    }

    const hashedPassword = await this.hasher.hash(dto.password);

    const mockUser: User = {
      id: '',
      email: dto.email,
      name: dto.name || null,
      passwordHash: hashedPassword,
      status: 'ACTIVE',
      emailVerifiedAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      deletedAt: null,
    };

    return await this.userRepo.save(mockUser);
  }

  async getUserById(id: string): Promise<User | null> {
    return await this.userRepo.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return await this.userRepo.findByEmail(email);
  }
}
