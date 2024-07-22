import { getUserQuery, User } from "../Interfaces/User.interface";
import * as UserModel from "../Model/user.model";
import bcrypt from "bcryptjs";
import { Roles } from "../Constants/Roles";
import { BadRequestError, NotFoundError } from "../Error/Error";

// Get all users
export const getUsers = async (query: getUserQuery) => {
  const data = await UserModel.UserModel.getUsers(query);
  if (!data) throw new NotFoundError("No users found");

  const count = await UserModel.UserModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Create a new user
export async function createUser(user: User, createdBy: User) {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }
  const password = await bcrypt.hash(user.password, 10);
  await UserModel.UserModel.create({ ...user, password }, createdBy);

  const newUser = await getUserByEmail(user.email);

  const roleId = await UserModel.UserModel.getRoleId(Roles.USER);
  createUserRoles(+newUser.id, roleId);

  return { message: "User created" };
}

// function to create user roles
async function createUserRoles(userId: number, roleId: number) {
  await UserModel.UserModel.createUserRoles(userId, roleId);
}

// function to get user by email
export function getUserByEmail(email: string) {
  return UserModel.UserModel.getUserByEmail(email);
}

// function to get user roles
export function getUserRoles(userId: number) {
  return UserModel.UserModel.getUserRoles(userId);
}

// function to get role permissions
export function getRolePermissions(roleId: number) {
  return UserModel.UserModel.getRolePermissions(roleId);
}

// function to get role name by role id
export function getRoleName(roleId: number) {
  return UserModel.UserModel.getRoleName(roleId);
}

// function to update a users
export const updateUsers = async (id: number, users: User, updatedBy: User) => {
  const user = await UserModel.UserModel.getUserById(id.toString());

  // Check if users exists
  if (!user) throw new NotFoundError("users not found");

  const password = await bcrypt.hash(users.password, 10);

  await UserModel.UserModel.update(
    id.toString(),
    { ...users, password },
    updatedBy
  );

  return { message: "User updated" };
};

// function to delete a users
export const deleteUsers = async (id: number) => {
  const user = await UserModel.UserModel.getUserById(id.toString());
  // Check if users exists
  if (!user) throw new NotFoundError("users not found");

  //deleting the user's data and then deleting the user
  await UserModel.UserModel.deleteUserTasks(id.toString());
  await UserModel.UserModel.deleteUserRoles(id.toString());
  await UserModel.UserModel.delete(id.toString());

  return { message: "User deleted" };
};
