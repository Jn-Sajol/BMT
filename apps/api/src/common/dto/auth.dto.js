"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetPasswordDto = exports.TokenResponseDto = exports.RegisterDto = exports.LoginDto = void 0;
class LoginDto {
    email;
    password;
}
exports.LoginDto = LoginDto;
class RegisterDto {
    email;
    name;
    password;
}
exports.RegisterDto = RegisterDto;
class TokenResponseDto {
    accessToken;
    refreshToken;
    expiresIn;
}
exports.TokenResponseDto = TokenResponseDto;
class ResetPasswordDto {
    token;
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
//# sourceMappingURL=auth.dto.js.map