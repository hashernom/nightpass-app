import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
  Req,
  Res,
  Patch,
  UseInterceptors,
  ClassSerializerInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensResponseDto, RefreshTokenDto } from './dto/tokens.dto';
import { ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '@prisma/client';
import { Request, Response } from 'express';
import { COOKIE_CONSTANTS, JWT_CONSTANTS } from './auth.constants';

@ApiTags('auth')
@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Registrar nuevo usuario' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuario registrado exitosamente',
    type: TokensResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'El email ya está registrado',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Datos de registro inválidos',
  })
  async register(@Body() registerDto: RegisterDto): Promise<TokensResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(ThrottlerGuard)
  @ApiOperation({ summary: 'Iniciar sesión con email/password' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login exitoso',
    type: TokensResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciales inválidas',
  })
  @ApiResponse({
    status: HttpStatus.TOO_MANY_REQUESTS,
    description: 'Demasiados intentos de login',
  })
  async login(
    @Body() loginDto: LoginDto,
    @Req() req: Request,
  ): Promise<TokensResponseDto> {
    const ipAddress = req.ip;
    return this.authService.login(loginDto, ipAddress);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refrescar access token' })
  @ApiCookieAuth('refresh_token')
  @ApiBody({ type: RefreshTokenDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token refrescado exitosamente',
    type: TokensResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Refresh token inválido o expirado',
  })
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokensResponseDto> {
    const refreshToken = req.cookies?.[COOKIE_CONSTANTS.REFRESH_TOKEN_NAME];

    if (!refreshToken) {
      throw new Error('Refresh token no encontrado en cookies');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    // Configurar cookie de refresh token
    res.cookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: COOKIE_CONSTANTS.HTTP_ONLY,
      secure: COOKIE_CONSTANTS.SECURE,
      sameSite: COOKIE_CONSTANTS.SAME_SITE,
      path: COOKIE_CONSTANTS.PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return tokens;
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cerrar sesión' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Sesión cerrada exitosamente',
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
  ): Promise<{ message: string }> {
    // Limpiar cookie de refresh token
    res.clearCookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, {
      httpOnly: COOKIE_CONSTANTS.HTTP_ONLY,
      secure: COOKIE_CONSTANTS.SECURE,
      sameSite: COOKIE_CONSTANTS.SAME_SITE,
      path: COOKIE_CONSTANTS.PATH,
    });

    return { message: 'Sesión cerrada exitosamente' };
  }

  @Get('google')
  @ApiOperation({ summary: 'Iniciar autenticación con Google' })
  @ApiResponse({
    status: HttpStatus.FOUND,
    description: 'Redirección a Google OAuth',
  })
  async googleAuth() {
    // La redirección será manejada por Passport
    return { message: 'Redirigiendo a Google OAuth' };
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Callback de Google OAuth' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Autenticación con Google exitosa',
    type: TokensResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Autenticación con Google fallida',
  })
  async googleAuthCallback(
    @Req() req: any,
    @Res({ passthrough: true }) res: Response,
  ): Promise<TokensResponseDto> {
    // El usuario ya está autenticado por Passport
    const user = req.user;

    if (!user) {
      throw new UnauthorizedException('Autenticación con Google fallida');
    }

    // Generar tokens para el usuario
    const tokens = await this.authService.generateTokens(user);

    // Configurar cookie de refresh token
    const refreshToken = await this.authService['jwtService'].signAsync(
      { sub: user.id },
      {
        expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    res.cookie(COOKIE_CONSTANTS.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: COOKIE_CONSTANTS.HTTP_ONLY,
      secure: COOKIE_CONSTANTS.SECURE,
      sameSite: COOKIE_CONSTANTS.SAME_SITE,
      path: COOKIE_CONSTANTS.PATH,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    return tokens;
  }
}
