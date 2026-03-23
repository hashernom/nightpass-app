import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../shared/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { TokensResponseDto } from './dto/tokens.dto';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from '@prisma/client';
import { JWT_CONSTANTS, COOKIE_CONSTANTS } from './auth.constants';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registra un nuevo usuario con email/password
   */
  async register(registerDto: RegisterDto): Promise<TokensResponseDto> {
    const { email, password, name, role = UserRole.USER } = registerDto;

    // Verificar si el usuario ya existe
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('El email ya está registrado');
    }

    // Hash de la contraseña
    const passwordHash = await bcrypt.hash(password, this.saltRounds);

    // Crear usuario
    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        passwordHash,
        role,
        provider: 'LOCAL',
      },
    });

    // Generar tokens
    return this.generateTokens(user);
  }

  /**
   * Autentica un usuario con email/password
   */
  async login(
    loginDto: LoginDto,
    ipAddress?: string,
  ): Promise<TokensResponseDto> {
    const { email, password } = loginDto;

    // Buscar usuario
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      throw new ForbiddenException('La cuenta está desactivada');
    }

    // Verificar contraseña
    const isPasswordValid = await bcrypt.compare(
      password,
      user.passwordHash || '',
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Registrar intento de login (para rate limiting)
    if (ipAddress) {
      await this.recordLoginAttempt(user.id, ipAddress, true);
    }

    // Generar tokens
    return this.generateTokens(user);
  }

  /**
   * Genera access y refresh tokens para un usuario
   */
  async generateTokens(user: User): Promise<TokensResponseDto> {
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: JWT_CONSTANTS.ACCESS_TOKEN_EXPIRES_IN,
    });

    const refreshToken = await this.jwtService.signAsync(
      { sub: user.id },
      {
        expiresIn: JWT_CONSTANTS.REFRESH_TOKEN_EXPIRES_IN,
      },
    );

    return {
      accessToken,
      expiresIn: 15 * 60, // 15 minutos en segundos
      tokenType: 'Bearer',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  /**
   * Refresca un access token usando un refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokensResponseDto> {
    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string }>(
        refreshToken,
      );

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user || !user.isActive) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  /**
   * Registra un intento de login (para rate limiting)
   */
  private async recordLoginAttempt(
    userId: string,
    ipAddress: string,
    success: boolean,
  ): Promise<void> {
    // En una implementación real, esto se almacenaría en Redis o base de datos
    // Por ahora solo registramos en consola
    console.log(
      `Login attempt: userId=${userId}, ip=${ipAddress}, success=${success}`,
    );
  }

  /**
   * Valida un usuario por ID (para guards)
   */
  async validateUser(userId: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { id: userId, isActive: true },
    });
  }

  /**
   * Obtiene información del usuario actual
   */
  async getCurrentUser(userId: string): Promise<Partial<User>> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return user;
  }

  /**
   * Actualiza información del usuario actual
   */
  async updateCurrentUser(
    userId: string,
    data: { name?: string; avatarUrl?: string },
  ): Promise<Partial<User>> {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        ...(data.name && { name: data.name }),
        ...(data.avatarUrl && { avatarUrl: data.avatarUrl }),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }
}
