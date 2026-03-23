import { ApiProperty } from '@nestjs/swagger';

export class TokensResponseDto {
  @ApiProperty({
    description: 'Access token JWT',
    example: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken!: string;

  @ApiProperty({
    description: 'Tiempo de expiración del access token en segundos',
    example: 900,
  })
  expiresIn!: number;

  @ApiProperty({
    description: 'Tipo de token',
    example: 'Bearer',
  })
  tokenType!: string;

  @ApiProperty({
    description: 'Información del usuario',
    example: {
      id: 'uuid',
      email: 'usuario@example.com',
      name: 'Juan Pérez',
      role: 'USER',
    },
  })
  user!: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token (enviado como cookie HttpOnly)',
    required: false,
  })
  refreshToken?: string;
}
