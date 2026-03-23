const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/**
 * Script para generar par de claves RSA para JWT RS256
 * Ejecutar: node scripts/generate-jwt-keys.js
 */

function generateRSAKeys() {
  console.log('Generando par de claves RSA para JWT...');

  // Generar par de claves
  const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'spki',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs8',
      format: 'pem',
    },
  });

  // Crear directorio si no existe
  const keysDir = path.join(__dirname, '..', 'keys');
  if (!fs.existsSync(keysDir)) {
    fs.mkdirSync(keysDir, { recursive: true });
  }

  // Guardar claves en archivos
  const privateKeyPath = path.join(keysDir, 'jwt-private.pem');
  const publicKeyPath = path.join(keysDir, 'jwt-public.pem');

  fs.writeFileSync(privateKeyPath, privateKey);
  fs.writeFileSync(publicKeyPath, publicKey);

  console.log('✅ Claves generadas exitosamente:');
  console.log(`   Private key: ${privateKeyPath}`);
  console.log(`   Public key: ${publicKeyPath}`);
  console.log('');
  console.log('📋 Para usar en .env.local:');
  console.log(`JWT_PRIVATE_KEY="${privateKey.replace(/\n/g, '\\n')}"`);
  console.log(`JWT_PUBLIC_KEY="${publicKey.replace(/\n/g, '\\n')}"`);
  console.log('');
  console.log('⚠️  ADVERTENCIA: Estas claves son para desarrollo.');
  console.log('   En producción, usa claves generadas en un entorno seguro.');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  generateRSAKeys();
}

module.exports = { generateRSAKeys };
