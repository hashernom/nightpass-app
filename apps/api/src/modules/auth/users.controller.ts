import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { Roles } from './decorators/roles.decorator';
import { UserRole } from '../../shared/enums';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly authService: AuthService) {}

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener información del usuario actual' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Información del usuario obtenida exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuario no autenticado',
  })
  async getCurrentUser(@Request() req: any) {
    const userId = req.user.id;
    return this.authService.getCurrentUser(userId);
  }

  @Patch('me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Actualizar información del usuario actual' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: { type: 'string', example: 'Nuevo Nombre' },
        avatarUrl: {
          type: 'string',
          example: 'https://example.com/avatar.jpg',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuario actualizado exitosamente',
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Usuario no autenticado',
  })
  async updateCurrentUser(
    @Request() req: any,
    @Body() updateData: { name?: string; avatarUrl?: string },
  ) {
    const userId = req.user.id;
    return this.authService.updateCurrentUser(userId, updateData);
  }

  @Get('admin-only')
  @Roles(UserRole.ADMIN_VENUE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint solo para administradores' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Acceso permitido a administrador',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado - se requiere rol ADMIN_VENUE',
  })
  async adminOnlyEndpoint() {
    return {
      message: 'Este endpoint solo es accesible para administradores de venue',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('staff-only')
  @Roles(UserRole.STAFF_SCANNER, UserRole.ADMIN_VENUE)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint para staff y administradores' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Acceso permitido a staff o administrador',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description:
      'Acceso denegado - se requiere rol STAFF_SCANNER o ADMIN_VENUE',
  })
  async staffOnlyEndpoint() {
    return {
      message:
        'Este endpoint es accesible para staff scanner y administradores',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('user-only')
  @Roles(UserRole.USER)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Endpoint solo para usuarios regulares' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Acceso permitido a usuario regular',
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Acceso denegado - se requiere rol USER',
  })
  async userOnlyEndpoint() {
    return {
      message: 'Este endpoint solo es accesible para usuarios regulares',
      timestamp: new Date().toISOString(),
    };
  }
}
