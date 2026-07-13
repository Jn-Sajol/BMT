import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { IAuthService } from '../../common/ports/auth/auth-service.interface';
import { LoginDto, RegisterDto, TokenResponseDto } from '../../common/dto/auth.dto';
import { CreateSessionDto } from '../../common/dto/session.dto';
import { UserRepository } from '../../infrastructure/database/repositories/user.repository';
import { UserSessionService } from './user-session.service';
import { IRegistrationService } from '../../common/ports/registration/registration-service.interface';
import { REGISTRATION_SERVICE_TOKEN } from '../registration/registration.constants';
import { PermissionService } from './permission.service';
import { RoleRepository } from '../../infrastructure/database/repositories/role.repository';
import { IPasswordHasher } from '../../common/ports/password-hasher.interface';
import { ITokenGenerator } from '../../common/ports/token-generator.interface';
import { IClockProvider } from '../../common/ports/clock-provider.interface';
import { PASSWORD_HASHER, TOKEN_GENERATOR, CLOCK_PROVIDER } from '../../infrastructure/security/security.module';
import { JwtEngine } from '../../infrastructure/security/jwt-engine';
import { 
  InvalidCredentialsException,
  EmailNotVerifiedException,
  AccountSuspendedException,
  UnauthorizedException,
  TokenInvalidException
} from '../../common/exceptions/auth-exceptions';
import * as crypto from 'crypto';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly userRepo: UserRepository,
    @Inject(forwardRef(() => UserSessionService))
    private readonly sessionService: UserSessionService,
    @Inject(REGISTRATION_SERVICE_TOKEN)
    private readonly registrationService: IRegistrationService,
    private readonly permissionService: PermissionService,
    private readonly roleRepo: RoleRepository,
    @Inject(PASSWORD_HASHER)
    private readonly passwordHasher: IPasswordHasher,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async register(dto: RegisterDto): Promise<void> {
    await this.registrationService.register({
      email: dto.email,
      name: dto.name || '',
      password: dto.password,
    });
  }

  async login(dto: LoginDto, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user || user.deletedAt) {
      throw new InvalidCredentialsException();
    }

    const isMatch = await this.passwordHasher.compare(dto.password, user.passwordHash);
    if (!isMatch) {
      throw new InvalidCredentialsException();
    }

    if (user.status !== 'ACTIVE') {
      throw new AccountSuspendedException();
    }

    if (!user.emailVerifiedAt) {
      throw new EmailNotVerifiedException();
    }

    // 1. Generate Access Token & Refresh Token
    const rawRefreshToken = this.tokenGenerator.generate(64);
    const hashedRefresh = crypto.createHash('sha256').update(rawRefreshToken).digest('hex');

    // 2. Create User Session using hashed refresh token
    const session = await this.sessionService.createSession({
      userId: user.id,
      tokenHash: hashedRefresh,
      ipAddress: sessionMeta?.ipAddress,
      userAgent: sessionMeta?.userAgent,
      device: sessionMeta?.device,
      browser: sessionMeta?.browser,
      os: sessionMeta?.os,
      country: sessionMeta?.country,
      city: sessionMeta?.city,
      rememberMe: sessionMeta?.rememberMe,
    });

    const accessToken = JwtEngine.sign({ sub: user.id, sessionId: session.id }, 15 * 60);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      expiresIn: 15 * 60,
    };
  }

  async refresh(refreshToken: string, sessionMeta?: Partial<CreateSessionDto>): Promise<TokenResponseDto> {
    const hashedRefresh = crypto.createHash('sha256').update(refreshToken).digest('hex');
    const session = await this.sessionService.validateSession(hashedRefresh);
    if (!session) {
      throw new UnauthorizedException('Session expired or invalid refresh token');
    }

    const user = await this.userRepo.findById(session.userId);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User associated with session not found');
    }

    if (user.status !== 'ACTIVE') {
      throw new AccountSuspendedException();
    }

    // Invalidate previous session/refresh token
    await this.sessionService.revokeSession(session.id);

    // Create new refresh token and session
    const rawNewRefreshToken = this.tokenGenerator.generate(64);
    const newHashedRefresh = crypto.createHash('sha256').update(rawNewRefreshToken).digest('hex');

    const newSession = await this.sessionService.createSession({
      userId: user.id,
      tokenHash: newHashedRefresh,
      ipAddress: sessionMeta?.ipAddress || session.ipAddress || undefined,
      userAgent: sessionMeta?.userAgent || session.userAgent || undefined,
      device: sessionMeta?.device || session.device || undefined,
      browser: sessionMeta?.browser || session.browser || undefined,
      os: sessionMeta?.os || session.os || undefined,
      country: sessionMeta?.country || session.country || undefined,
      city: sessionMeta?.city || session.city || undefined,
      rememberMe: true,
    });

    const newAccessToken = JwtEngine.sign({ sub: user.id, sessionId: newSession.id }, 15 * 60);

    return {
      accessToken: newAccessToken,
      refreshToken: rawNewRefreshToken,
      expiresIn: 15 * 60,
    };
  }

  async logout(accessToken: string): Promise<void> {
    const payload = JwtEngine.verify(accessToken);
    if (!payload || !payload.sessionId) {
      throw new TokenInvalidException();
    }
    await this.sessionService.revokeSession(payload.sessionId);
  }

  async me(userId: string): Promise<any> {
    const user = await this.userRepo.findById(userId);
    if (!user || user.deletedAt) {
      throw new UnauthorizedException('User not found');
    }

    // Retrieve organization memberships with roles
    const orgMemberships = await this.roleRepo.findUserOrganizationRoles(user.id);
    const organizations = orgMemberships.map((m: any) => ({
      id: m.organization.id,
      name: m.organization.name,
      slug: m.organization.slug,
      status: m.organization.status,
      role: m.role?.name || null,
    }));

    // Retrieve workspaces with roles
    const workspaceRoles = await this.roleRepo.findUserWorkspaceRoles(user.id);
    const workspaces = workspaceRoles.map((wr: any) => ({
      id: wr.workspace.id,
      name: wr.workspace.name,
      slug: wr.workspace.slug,
      status: wr.workspace.status,
      role: wr.role.name,
    }));

    // Retrieve all unique user workspace permissions
    const permissions = new Set<string>();
    for (const wr of workspaceRoles) {
      const perms = await this.permissionService.getUserPermissionsForWorkspace(user.id, wr.workspace.id);
      for (const p of perms) {
        permissions.add(p);
      }
    }

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        status: user.status,
        createdAt: user.createdAt,
      },
      organizations,
      workspaces,
      permissions: Array.from(permissions),
    };
  }
}
