import { generateKeyPair } from 'jose';

async function generateES256KeyPair() {
  try {
    const { privateKey, publicKey } = await generateKeyPair('ES256');

    // Export the keys to JWK format
    const privateKeyJwk = await privateKey.export({ format: 'jwk' });
    const publicKeyJwk = await publicKey.export({ format: 'jwk' });

 
    // Additional logic to handle the keys as needed
  } catch (error) {
    console.error("Error generating key pair:", error);
  }
}

generateES256KeyPair();
