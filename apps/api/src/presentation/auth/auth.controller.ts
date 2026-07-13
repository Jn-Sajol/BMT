import { Controller, Post, Get, Body, Req, HttpCode, HttpStatus, Inject } from '@nestjs/common';
import { Request } from 'express';
import { PasswordResetService } from '../../application/services/password-reset.service';
import { VerificationService } from '../../application/services/verification.service';
import { LoginDto, RegisterDto, TokenResponseDto, ResetPasswordDto } from '../../common/dto/auth.dto';
import { RequestPasswordResetDto } from '../../common/dto/password-reset.dto';
import { VerifyEmailDto } from '../../common/dto/verification.dto';
import { AUTH_SERVICE_TOKEN } from '../../application/auth/auth.constants';
import { IAuthService } from '../../common/ports/auth/auth-service.interface';
import { JwtEngine } from '../../infrastructure/security/jwt-engine';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller({ path: 'auth', version: '1' })
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE_TOKEN)
    private readonly authService: IAuthService,
    private readonly resetService: PasswordResetService,
    private readonly verificationService: VerificationService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  async register(@Body() dto: RegisterDto): Promise<void> {
    await this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate credentials and create session' })
  @ApiResponse({ status: 200, type: TokenResponseDto })
  async login(@Body() dto: LoginDto, @Req() req: Request): Promise<TokenResponseDto> {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return await this.authService.login(dto, {
      ipAddress,
      userAgent,
    });
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Revoke session and terminate active tokens' })
  async logout(@Req() req: Request): Promise<void> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return;
    }
    const token = authHeader.substring(7);
    await this.authService.logout(token);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token using valid refresh token' })
  async refresh(@Body('refreshToken') refreshToken: string, @Req() req: Request): Promise<TokenResponseDto> {
    const ipAddress = req.ip;
    const userAgent = req.headers['user-agent'];
    return await this.authService.refresh(refreshToken, {
      ipAddress,
      userAgent,
    });
  }

  @Post('forgot-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Request password reset token link via email' })
  async forgotPassword(@Body() dto: RequestPasswordResetDto): Promise<void> {
    await this.resetService.requestReset(dto);
  }

  @Post('reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Execute password reset with valid token' })
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.resetService.executeReset({
      token: dto.token,
      newPassword: dto.newPassword,
    });
  }

  @Post('verify-email')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Verify email using activation token' })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<void> {
    await this.verificationService.verifyEmail(dto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Retrieve currently authenticated user details' })
  async me(@Req() req: Request): Promise<any> {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7);
    const payload = JwtEngine.verify(token);
    if (!payload || !payload.sub) {
      return null;
    }
    return await this.authService.me(payload.sub);
  }
}
