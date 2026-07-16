import { IMetaOAuthProvider } from '../../infrastructure/oauth/meta-oauth-provider.interface';
import { MetaConnectionRepository } from '../../../../infrastructure/database/repositories/meta-connection.repository';
import { ConnectResponseDto, CallbackResponseDto, ConnectionStatusDto, DisconnectResponseDto } from '../../common/meta-auth.dto';
import { ITokenGenerator } from '../../../../common/ports/token-generator.interface';
import { IEncryption } from '../../../../common/ports/encryption.interface';
import { IClockProvider } from '../../../../common/ports/clock-provider.interface';
export declare class MetaAuthService {
    private readonly metaConnRepo;
    private readonly oauthProvider;
    private readonly tokenGenerator;
    private readonly encryptionService;
    private readonly clockProvider;
    private readonly activeStates;
    constructor(metaConnRepo: MetaConnectionRepository, oauthProvider: IMetaOAuthProvider, tokenGenerator: ITokenGenerator, encryptionService: IEncryption, clockProvider: IClockProvider);
    connect(workspaceId: string, organizationId: string, userId: string): Promise<ConnectResponseDto>;
    callback(code: string, state: string, currentUserId: string): Promise<CallbackResponseDto>;
    disconnect(workspaceId: string, userId: string): Promise<DisconnectResponseDto>;
    status(workspaceId: string): Promise<ConnectionStatusDto>;
}
