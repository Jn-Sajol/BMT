export class ConnectResponseDto {
  authorizationUrl!: string;
  state!: string;
}

export class CallbackResponseDto {
  success!: boolean;
  facebookUserId!: string;
  facebookUserName!: string;
  expiresAt!: string;
}

export class ConnectionStatusDto {
  isConnected!: boolean;
  facebookUserId?: string;
  facebookUserName?: string;
  expiresAt?: string;
  grantedScopes?: string[];
  lastValidatedAt?: string;
  status?: string;
}

export class DisconnectResponseDto {
  success!: boolean;
  message!: string;
}
