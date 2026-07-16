"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserInvitationDto = exports.CreateUserSessionDto = exports.CreateUserDto = void 0;
class CreateUserDto {
    email;
    name;
    password;
}
exports.CreateUserDto = CreateUserDto;
class CreateUserSessionDto {
    userId;
    ipAddress;
    userAgent;
}
exports.CreateUserSessionDto = CreateUserSessionDto;
class CreateUserInvitationDto {
    email;
    tenantId;
    workspaceId;
    roleId;
}
exports.CreateUserInvitationDto = CreateUserInvitationDto;
//# sourceMappingURL=identity.dto.js.map