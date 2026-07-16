"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DisconnectResponseDto = exports.ConnectionStatusDto = exports.CallbackResponseDto = exports.ConnectResponseDto = void 0;
class ConnectResponseDto {
    authorizationUrl;
    state;
}
exports.ConnectResponseDto = ConnectResponseDto;
class CallbackResponseDto {
    success;
    facebookUserId;
    facebookUserName;
    expiresAt;
}
exports.CallbackResponseDto = CallbackResponseDto;
class ConnectionStatusDto {
    isConnected;
    facebookUserId;
    facebookUserName;
    expiresAt;
    grantedScopes;
    lastValidatedAt;
    status;
}
exports.ConnectionStatusDto = ConnectionStatusDto;
class DisconnectResponseDto {
    success;
    message;
}
exports.DisconnectResponseDto = DisconnectResponseDto;
//# sourceMappingURL=meta-auth.dto.js.map