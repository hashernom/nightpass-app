/**
 * Constantes de configuración para el módulo de autenticación
 */

export const JWT_CONSTANTS = {
  ACCESS_TOKEN_EXPIRES_IN: '15m',
  REFRESH_TOKEN_EXPIRES_IN: '7d',
  ALGORITHM: 'RS256',
} as const;

export const RATE_LIMIT_CONSTANTS = {
  MAX_LOGIN_ATTEMPTS: 5,
  WINDOW_MS: 15 * 60 * 1000, // 15 minutos
} as const;

export const COOKIE_CONSTANTS = {
  REFRESH_TOKEN_NAME: 'refresh_token',
  HTTP_ONLY: true,
  SAME_SITE: 'strict' as const,
  SECURE: true,
  PATH: '/',
} as const;

export const GOOGLE_OAUTH_CONSTANTS = {
  SCOPE: ['email', 'profile'],
  CALLBACK_PATH: '/auth/google/callback',
} as const;
