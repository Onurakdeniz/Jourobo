// signOpenAIKey.ts
import { SignJWT } from 'jose';
import { importJWK } from 'jose';

/**
 * Signs the provided OpenAI API key and user ID using the ES256 algorithm.
 * @param apiKey The OpenAI API key to sign.
 * @param userId The user identifier to include in the signed payload.
 * @returns A promise that resolves to a JWT string.
 */
export async function signOpenAIKey(apiKey: string, userId: string): Promise<string> {
  // Parse the ECDSA private key from an environment variable. Ensure this variable is properly populated.
  const privateKeyJwk = JSON.parse(process.env.ECDSA_PRIVATE_KEY || '');
  if (!privateKeyJwk) {
    throw new Error('ECDSA private key is not configured properly.');
  }

  const privateKey = await importJWK(privateKeyJwk, 'ES256');

  // Construct the JWT with the necessary claims
  const jwt = await new SignJWT({ apiKey, userId })
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setIssuer('robojou')
    .setAudience('userOpenAIKeys')
    .sign(privateKey);

  return jwt;
}