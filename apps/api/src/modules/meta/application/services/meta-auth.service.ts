import { Injectable, Inject, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { IMetaOAuthProvider } from '../../infrastructure/oauth/meta-oauth-provider.interface';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { ConnectResponseDto, CallbackResponseDto, ConnectionStatusDto, DisconnectResponseDto } from '../../common/meta-auth.dto';
import { ITokenGenerator } from '../../../../common/ports/token-generator.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
import { TOKEN_GENERATOR, ENCRYPTION_SERVICE, CLOCK_PROVIDER } from '../../../../infrastructure/security/security.module';
import { MetaConnection } from '@prisma/client';

@Injectable()
export class MetaAuthService {
  // In-memory registry to validate OAuth states and track tenant boundaries
  private readonly activeStates = new Map<string, { workspaceId: string; organizationId: string; userId: string; createdAt: Date }>();

  constructor(
    private readonly metaConnRepo: MetaConnectionRepository,
    @Inject('META_OAUTH_PROVIDER')
    private readonly oauthProvider: IMetaOAuthProvider,
    @Inject(TOKEN_GENERATOR)
    private readonly tokenGenerator: ITokenGenerator,
    @Inject(ENCRYPTION_SERVICE)
    private readonly encryptionService: IEncryption,
    @Inject(CLOCK_PROVIDER)
    private readonly clockProvider: IClockProvider,
  ) {}

  async connect(workspaceId: string, organizationId: string, userId: string): Promise<ConnectResponseDto> {
    const state = this.tokenGenerator.generate(24);
    const now = this.clockProvider.now();

    // Cache state with 15-minute TTL
    this.activeStates.set(state, {
      workspaceId,
      organizationId,
      userId,
      createdAt: now,
    });

    const authorizationUrl = this.oauthProvider.getAuthorizationUrl(state);
    return {
      authorizationUrl,
      state,
    };
  }

  async callback(code: string, state: string, currentUserId: string): Promise<CallbackResponseDto> {
    const stateContext = this.activeStates.get(state);
    if (!stateContext) {
      throw new UnauthorizedException('OAuth verification state has expired or is invalid');
    }

    // CSRF Protection validation
    if (stateContext.userId !== currentUserId) {
      throw new UnauthorizedException('Authentication identity mismatch during callback');
    }

    const now = this.clockProvider.now();
    const isStateExpired = now.getTime() - stateContext.createdAt.getTime() > 15 * 60 * 1000;
    if (isStateExpired) {
      this.activeStates.delete(state);
      throw new UnauthorizedException('OAuth state verification window has expired');
    }

    // 1. Exchange short-lived token
    const shortTokenData = await this.oauthProvider.exchangeCode(code);

    // 2. Exchange to long-lived access token
    const longTokenData = await this.oauthProvider.exchangeLongLivedToken(shortTokenData.accessToken);

    // 3. Validate Token & retrieve Facebook metadata
    const validation = await this.oauthProvider.validateToken(longTokenData.accessToken);
    if (!validation.isValid) {
      throw new BadRequestException('Meta Graph API token validation check failed');
    }

    // 4. Encrypt Long-Lived Token
    const encryptedAccessToken = this.encryptionService.encrypt(longTokenData.accessToken);
    const expiresAt = new Date(now.getTime() + longTokenData.expiresIn * 1000);

    // 5. Look up existing connection for the workspace to allow reconnect
    const existingConnection = await this.metaConnRepo.findByWorkspaceId(stateContext.workspaceId);

    const connection: MetaConnection = {
      id: existingConnection ? existingConnection.id : '',
      facebookUserId: validation.facebookUserId,
      facebookUserName: validation.facebookUserName,
      encryptedAccessToken,
      expiresAt,
      grantedScopes: validation.scopes,
      provider: 'meta',
      status: 'ACTIVE',
      connectedBy: currentUserId,
      organizationId: stateContext.organizationId,
      workspaceId: stateContext.workspaceId,
      lastValidatedAt: now,
      connectionVersion: existingConnection ? existingConnection.connectionVersion + 1 : 1,
      createdAt: existingConnection ? existingConnection.createdAt : now,
      updatedAt: now,
    };

    await this.metaConnRepo.save(connection);

    // Log connection success
    console.log(`[AUDIT] Connection Created. Actor: ${currentUserId}, Timestamp: ${now.toISOString()}`);

    this.activeStates.delete(state);

    return {
      success: true,
      facebookUserId: validation.facebookUserId,
      facebookUserName: validation.facebookUserName,
      expiresAt: expiresAt.toISOString(),
    };
  }

  async disconnect(workspaceId: string, userId: string): Promise<DisconnectResponseDto> {
    const connection = await this.metaConnRepo.findByWorkspaceId(workspaceId);
    if (!connection) {
      throw new BadRequestException('No active Meta connection found for this workspace');
    }

    await this.metaConnRepo.delete(connection.id);
    const now = this.clockProvider.now();

    // Log disconnection
    console.log(`[AUDIT] Connection Revoked. Actor: ${userId}, Timestamp: ${now.toISOString()}`);

    return {
      success: true,
      message: 'Meta connection has been successfully disconnected',
    };
  }

  async status(workspaceId: string): Promise<ConnectionStatusDto> {
    const connection = await this.metaConnRepo.findByWorkspaceId(workspaceId);
    if (!connection) {
      return { isConnected: false };
    }

    const now = this.clockProvider.now();
    const isExpired = connection.expiresAt < now;
    const status = isExpired ? 'EXPIRED' : connection.status;

    return {
      isConnected: true,
      facebookUserId: connection.facebookUserId,
      facebookUserName: connection.facebookUserName,
      expiresAt: connection.expiresAt.toISOString(),
      grantedScopes: connection.grantedScopes as string[],
      lastValidatedAt: connection.lastValidatedAt.toISOString(),
      status,
    };
  }
}
