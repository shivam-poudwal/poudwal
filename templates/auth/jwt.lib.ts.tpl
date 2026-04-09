import jwt, { JwtPayload, SignOptions } from 'jsonwebtoken';

const JWT_SECRET  = process.env.JWT_SECRET  as string || 'change_this_secret_in_env';
const JWT_EXPIRES = (process.env.JWT_EXPIRES || '7d') as SignOptions['expiresIn'];

/**
 * Sign a JWT token.
 */
export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * Verify and decode a JWT token.
 */
export function verifyToken(token: string): JwtPayload | string {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Extract the Bearer token from the Authorization header.
 */
export function extractToken(request: Request): string | null {
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}
