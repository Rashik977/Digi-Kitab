import { verify } from "jsonwebtoken";
import { User } from "../Interfaces/User.interface";
import {
  getRoleName,
  getRolePermissions,
  getUserByEmail,
  getUserRoles,
} from "./user.services";
import bcrypt from "bcryptjs";
import config from "../config";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../Utils/generateTokens";
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from "../Error/Error";

// Function to login existing user and return access and refresh tokens
export async function login(body: Pick<User, "email" | "password">) {
  const existingUser = await getUserByEmail(body.email);

  if (!existingUser) {
    throw new BadRequestError("User not found");
  }

  const isvalidPassword = await bcrypt.compare(
    body.password,
    existingUser.password
  );

  if (!isvalidPassword) {
    throw new BadRequestError("Invalid password");
  }

  const roles = await getUserRoles(existingUser.id);
  const roleName = await getRoleName(roles[0].roleId);
  const permissions = await getRolePermissions(roles[0].roleId);

  const payload = {
    id: existingUser.id,
    name: existingUser.name,
    email: existingUser.email,
    permissions: permissions,
    role: roleName,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);

  return { accessToken, refreshToken };
}

// Function to refresh access token and refresh token using refresh token
export async function refresh(body: { refreshToken: string }) {
  try {
    const decoded = verify(body.refreshToken, config.jwt.secret!) as Pick<
      User,
      "id" | "name" | "email" | "permissions" | "role"
    >;

    // Extract the payload
    const { id, name, email, permissions, role } = decoded;
    const payload = { id, name, email, permissions, role };

    const accessToken = await generateAccessToken(payload);

    return { accessToken };
  } catch (error) {
    if (error instanceof Error) {
      if (error.name === "TokenExpiredError") {
        throw new UnauthorizedError("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new BadRequestError("Invalid token");
      }
    }
    throw new InternalServerError("Could not authenticate");
  }
}
