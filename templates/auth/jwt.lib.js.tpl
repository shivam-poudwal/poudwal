import jwt from 'jsonwebtoken';

const JWT_SECRET  = process.env.JWT_SECRET  || 'change_this_secret_in_env';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '7d';

/**
 * Sign a JWT token.
 * @param {object} payload
 * @returns {string}
 */
export function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object}
 */
export function verifyToken(token) {
  return jwt.verify(token, JWT_SECRET);
}

/**
 * Extract the Bearer token from the Authorization header.
 * @param {Request} request
 * @returns {string | null}
 */
export function extractToken(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.slice(7);
  return null;
}
