import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Configuración para JWT con RS256 (claves asimétricas)
 * En producción, las claves deben estar en variables de entorno o secrets
 */

export interface JwtRsaConfig {
  privateKey: string;
  publicKey: string;
  algorithm: 'RS256';
  accessTokenExpiresIn: string;
  refreshTokenExpiresIn: string;
}

/**
 * Genera o carga las claves RSA para JWT
 * En desarrollo, podemos generar claves temporales
 * En producción, usar claves reales desde variables de entorno
 */
export function getJwtRsaConfig(): JwtRsaConfig {
  // En desarrollo, usar claves temporales o generar si no existen
  // En producción, cargar desde variables de entorno
  const privateKey = process.env.JWT_PRIVATE_KEY || generateTempPrivateKey();
  const publicKey = process.env.JWT_PUBLIC_KEY || generateTempPublicKey();

  return {
    privateKey,
    publicKey,
    algorithm: 'RS256',
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
  };
}

/**
 * Genera una clave privada temporal para desarrollo
 * ¡NO USAR EN PRODUCCIÓN!
 */
function generateTempPrivateKey(): string {
  return `-----BEGIN RSA PRIVATE KEY-----
MIIEowIBAAKCAQEAwV2Bc8f6vJ7KQk7Lm8nT9pPq3rStUvXyZaBcDfGhJkLmN7Y1
... (clave RSA temporal para desarrollo) ...
-----END RSA PRIVATE KEY-----`;
}

/**
 * Genera una clave pública temporal para desarrollo
 * ¡NO USAR EN PRODUCCIÓN!
 */
function generateTempPublicKey(): string {
  return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwV2Bc8f6vJ7KQk7Lm8nT
... (clave pública RSA temporal para desarrollo) ...
-----END PUBLIC KEY-----`;
}

/**
 * Configuración para desarrollo con HS256 (más simple)
 */
export function getJwtHsConfig() {
  return {
    secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    algorithm: 'HS256' as const,
    accessTokenExpiresIn: '15m',
    refreshTokenExpiresIn: '7d',
  };
}
