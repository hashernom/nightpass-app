import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../../shared/prisma/prisma.service';
import { AuthService } from '../auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRole } from '../../../shared/enums';
import * as bcrypt from 'bcryptjs';
import { describe, beforeEach, it, expect, vi } from 'vitest';

// Mock de bcrypt
vi.mock('bcryptjs', () => ({
  hash: vi.fn(),
  compare: vi.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let prismaService: PrismaService;
  let jwtService: JwtService;

  const mockPrismaService = {
    user: {
      findUnique: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
    },
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    $use: vi.fn(),
  };

  const mockJwtService = {
    signAsync: vi.fn(),
    verifyAsync: vi.fn(),
  };

  beforeEach(async () => {
    // Instanciar manualmente el servicio para evitar problemas con el TestingModule
    authService = new AuthService(
      mockPrismaService as any,
      mockJwtService as any,
    );
    prismaService = mockPrismaService as any;
    jwtService = mockJwtService as any;

    vi.clearAllMocks();
  });

  describe('register', () => {
    it('debería registrar un usuario exitosamente', async () => {
      const registerDto: RegisterDto = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        role: UserRole.USER,
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: 'user-id-123',
        email: registerDto.email,
        name: registerDto.name,
        role: registerDto.role,
        passwordHash: hashedPassword,
        provider: 'LOCAL',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      };

      // Mock de bcrypt.hash
      (bcrypt.hash as any).mockResolvedValue(hashedPassword);

      // Mock de findUnique (usuario no existe)
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      // Mock de create
      mockPrismaService.user.create.mockResolvedValue(mockUser);

      // Mock de generateTokens
      vi.spyOn(authService as any, 'generateTokens').mockResolvedValue(
        mockTokens,
      );

      const result = await authService.register(registerDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 12);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: registerDto.email,
          passwordHash: hashedPassword,
          name: registerDto.name,
          role: registerDto.role,
          provider: 'LOCAL',
        },
      });
      expect(result).toEqual(mockTokens);
    });

    it('debería lanzar ConflictException si el email ya está registrado', async () => {
      const registerDto: RegisterDto = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Existing User',
        role: UserRole.USER,
      };

      const existingUser = {
        id: 'existing-id',
        email: registerDto.email,
        name: 'Existing User',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(existingUser);

      await expect(authService.register(registerDto)).rejects.toThrow(
        ConflictException,
      );
      await expect(authService.register(registerDto)).rejects.toThrow(
        'El email ya está registrado',
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: registerDto.email },
      });
      expect(mockPrismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('debería hacer login exitosamente con credenciales válidas', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 'user-id-123',
        email: loginDto.email,
        name: 'Test User',
        role: UserRole.USER,
        passwordHash: 'hashedPassword123',
        provider: 'LOCAL',
        isActive: true,
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      };

      // Mock de findUnique
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);

      // Mock de bcrypt.compare
      (bcrypt.compare as any).mockResolvedValue(true);

      // Mock de generateTokens
      vi.spyOn(authService as any, 'generateTokens').mockResolvedValue(
        mockTokens,
      );

      const result = await authService.login(loginDto);

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
      expect(result).toEqual(mockTokens);
    });

    it('debería lanzar UnauthorizedException si el usuario no existe', async () => {
      const loginDto: LoginDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Credenciales inválidas',
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).not.toHaveBeenCalled();
    });

    it('debería lanzar UnauthorizedException si la contraseña es incorrecta', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'wrongpassword',
      };

      const mockUser = {
        id: 'user-id-123',
        email: loginDto.email,
        name: 'Test User',
        passwordHash: 'hashedPassword123',
        provider: 'LOCAL',
        isActive: true,
      };

      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      (bcrypt.compare as any).mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.login(loginDto)).rejects.toThrow(
        'Credenciales inválidas',
      );

      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: loginDto.email },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginDto.password,
        mockUser.passwordHash,
      );
    });
  });

  describe('refreshToken', () => {
    it('debería refrescar el token exitosamente', async () => {
      const refreshToken = 'valid-refresh-token';
      const mockPayload = {
        sub: 'user-id-123',
        email: 'test@example.com',
        role: UserRole.USER,
      };

      const mockUser = {
        id: mockPayload.sub,
        email: mockPayload.email,
        name: 'Test User',
        role: mockPayload.role,
        provider: 'LOCAL',
        isActive: true,
      };

      const mockTokens = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
        expiresIn: 3600,
        tokenType: 'Bearer',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
          role: mockUser.role,
        },
      };

      mockJwtService.verifyAsync.mockResolvedValue(mockPayload);
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      vi.spyOn(authService as any, 'generateTokens').mockResolvedValue(
        mockTokens,
      );

      const result = await authService.refreshToken(refreshToken);

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: mockPayload.sub },
      });
      expect(result).toEqual(mockTokens);
    });

    it('debería lanzar UnauthorizedException si el refresh token es inválido', async () => {
      const refreshToken = 'invalid-refresh-token';

      mockJwtService.verifyAsync.mockRejectedValue(new Error('Token inválido'));

      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        UnauthorizedException,
      );
      await expect(authService.refreshToken(refreshToken)).rejects.toThrow(
        'Refresh token inválido o expirado',
      );

      expect(mockJwtService.verifyAsync).toHaveBeenCalledWith(refreshToken);
      expect(mockPrismaService.user.findFirst).not.toHaveBeenCalled();
    });
  });
});
