import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

/**
 * Generate JWT token
 */
export const generateToken = (
  payload: JwtPayload,
  secret: string,
  expiresIn: string
): string => {
  return jwt.sign(payload, secret, {
    expiresIn,
  } as SignOptions);
};

/**
 * Verify JWT token
 */
export const verifyToken = <T extends JwtPayload>(
  token: string,
  secret: string
): T => {
  return jwt.verify(token, secret) as T;
};
