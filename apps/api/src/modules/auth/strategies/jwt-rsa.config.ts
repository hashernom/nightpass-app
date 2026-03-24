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
  return `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2+RDAKtUPSkjU
o6T0Bv7icEKoDoLujbPwtRIlvvXKP+jL3bBauT/UB0M8bjL7nsMmCamKYMoOhoE7
PoUUoIoCAmLk5AOvXnq82w7CypO4xaEBz+7bhALEnfk/Gso2AnVsVor8IAvLmkzq
r/F7G3TUR4zfgIfwxX6zkstUiO54S/IT8Tc/S2QKUBwKkowOtCq1GcvaX0p0aT41
syBVHiSK0g2PgMbhX3LretvVgr19maqaKAEMuUWUDjcQ18CTflChGyrOtpIy1glA
lRCKKpAhJ63tqC/cfmF+mZ3JT6GKjV+76WY8G4dT/DFshN6qXf362ZkyA5fKFaPB
nRFSo7BLAgMBAAECggEAPE52E2hqpen9fDxdk2K04qxOg/aYeAjzbFw52YAJofoT
gBIW3KgfHgKwyfumSSGoP2LC4w2Iu2XgtUajdUt+gTAJKVjvz/7LZHCs+k3rh2R3
71F58BcgFG7e5kotqMSBsE4L7BKh4J8AR//qjwFbLdZRW58Q7y4g1w4Ef13Mf5A0
+lrDZB7C/HVRqiH5aI6seqiab6abGB5J4qc6XmnJy0/nyffze3k6sQM1gdDoIfT+
/7VCNjPS5CPdzBHxeLU1h0q52B3VHd912T+fOeSDa/fmR8+Zp0voBa52/Mco7U0r
UVum6/S1Pn4wo/an8HjQrhheJDYzEP2KQ+ZD5H475QKBgQDxYcM/apdKQHmwugFx
BlYUWXeVD0Rd4wH0WNP4Q5N6eLPkvIl10QqxV+3ow5i7ZBXeWO3fxLKGajqBd8yN
yYe1DdQBUKgY6qznfwtfRQJJnsc4iSNgKBHRsmljRT4lsI8cmtlxGXtAwSHVoiAI
jb3zeZ+HaBv7PUpRLHFfjnlfrQKBgQDCDcQEm7ahOcQkgg6vNmv6GY9kggEPoNLi
DjVe3NR0qpeHwDPCoebIjdhg7YllDlfb0cWTnS304Y8W5+zMcV1dMEdbI/n90M1y
B7qrXi3ZDePG6srrdl/aYOh3HDGCoAs1aqMlGOmEHE7vXVgRRHeW/RA7CYOXv3JU
/UG9pPhu1wKBgFdJZgSBtBHavOambK0FgI09SRvy+GMHGwbUNFq7fRI1ob/eWcrr
+/TjehnI2WsyJyJPgD2B8JjgwyVcP/Ep5lQXmwmatB7Ghh30eBVMbCZZL2uHU+6K
rt7oqGmIeY/BiA7tBCJ893AUJvsM9I6DSyRHX+PkRvIUWNJ/wsOuTr/FAoGAKi3d
znaeIrswpBLU6Ea2/5ywq1MKsf/t9o7KEP2E/HrcBvjDB2ozhKI4RxE6jQmqFTCq
dmRyyciBVqRAt0to1MmaqPfP7diF32RIsdj9tDEtsl30j2uieBAaV1F8fX0WEp1E
KtsYXsvcaHDspIwyRlJpRbvSq5hEXK7TrEoAae8CgYEArvlDxmV0pzixPFqXi6pG
bp3gbHMrVvAZucoiO0FmhvaNDXPFgBBICFtkbKh8A41UvwpsoLu+4llgBSQXe+lQ
aX0vSTGgCWyDT+Suarx6UfErSiB8dPGwHdptP4lZSYAzIXAabpNTdVgpjHz3xKb8
OrkF4DWfMIUyzEFPdnVMDBo=
-----END PRIVATE KEY-----`;
}

/**
 * Genera una clave pública temporal para desarrollo
 * ¡NO USAR EN PRODUCCIÓN!
 */
function generateTempPublicKey(): string {
  return `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAtvkQwCrVD0pI1KOk9Ab+
4nBCqA6C7o2z8LUSJb71yj/oy92wWrk/1AdDPG4y+57DJgmpimDKDoaBOz6FFKCK
AgJi5OQDr156vNsOwsqTuMWhAc/u24QCxJ35PxrKNgJ1bFaK/CALy5pM6q/xext0
1EeM34CH8MV+s5LLVIjueEvyE/E3P0tkClAcCpKMDrQqtRnL2l9KdGk+NbMgVR4k
itINj4DG4V9y63rb1YK9fZmqmigBDLlFlA43ENfAk35QoRsqzraSMtYJQJUQiiqQ
ISet7agv3H5hfpmdyU+hio1fu+lmPBuHU/wxbITeql39+tmZMgOXyhWjwZ0RUqOw
SwIDAQAB
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
