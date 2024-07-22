import { sign } from "jsonwebtoken";
import config from "../config";
import { User } from "../Interfaces/User.interface";

const s = config.jwt.secret!;

// Generate access token
export async function generateAccessToken(
  payload: Pick<User, "id" | "name" | "email">
) {
  return await sign(payload, s, {
    expiresIn: config.jwt.accessExpiration,
  });
}

// Generate refresh token
export async function generateRefreshToken(
  payload: Pick<User, "id" | "name" | "email">
) {
  return await sign(payload, s, {
    expiresIn: config.jwt.refreshTokenExpiration,
  });
}
