import { LoginDto, RegisterDto, TokenResponseDto } from '../../dto/auth.dto';
import { CreateSessionDto } from '../../dto/session.dto';
export interface IAuthService {
    login(dto: LoginDto, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto>;
    register(dto: RegisterDto): Promise<void>;
    logout(accessToken: string): Promise<void>;
    refresh(refreshToken: string, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto>;
    me(userId: string): Promise<any>;
}
