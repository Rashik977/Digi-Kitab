import { getUserQuery, User } from "../Interfaces/User.interface";
import * as UserModel from "../Model/user.model";
import * as StaffModel from "../Model/staff.model";
import bcrypt from "bcryptjs";
import { Roles } from "../Constants/Roles";
import { BadRequestError, NotFoundError } from "../Error/Error";
import { createUserRoles } from "./role.services";

// Get all users
export const getStaff = async (query: getUserQuery) => {
  const data = await StaffModel.StaffModel.getStaff(query);
  if (!data) throw new NotFoundError("No users found");

  const count = await StaffModel.StaffModel.count(query);
  const meta = {
    page: query.page,
    size: data.length,
    total: +count.count,
  };
  return { data, meta };
};

// Create a new user
export async function createStaff(user: User, createdBy: User) {
  const existingUser = await getUserByEmail(user.email);
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }
  const password = await bcrypt.hash(user.password, 10);
  await StaffModel.StaffModel.create({ ...user, password }, createdBy);

  const newUser = await getUserByEmail(user.email);

  const roleId = await UserModel.UserModel.getRoleId(Roles.STAFF);
  createUserRoles(+newUser.id, roleId);

  return { message: "Staff created" };
}

// function to get user by email
export function getUserByEmail(email: string) {
  return UserModel.UserModel.getUserByEmail(email);
}

// function to update a staff
export const updateStaff = async (id: number, users: User, updatedBy: User) => {
  const userRoleId = await UserModel.UserModel.getUserRoles(id);
  const userRole = await UserModel.UserModel.getRoleName(userRoleId[0].roleId);

  const userEmail = await UserModel.UserModel.getUserByEmail(users.email);

  const user = await UserModel.UserModel.getUserById(id.toString());

  // Check if users exists
  if (!user) throw new NotFoundError("staff not found");
  if (userEmail) {
    if (userEmail.id !== id.toString()) {
      throw new BadRequestError("Email already exists");
    }
  }
  if (!(userRole === Roles.STAFF))
    throw new BadRequestError("Unauthorized to update this user");

  let password;

  if (
    users.password === null ||
    users.password === undefined ||
    users.password === ""
  ) {
    password = "";
  } else {
    password = await bcrypt.hash(users.password, 10);
  }

  await UserModel.UserModel.update(
    id.toString(),
    { ...users, password },
    updatedBy
  );

  return { message: "Staff updated" };
};

// function to delete a staff
export const deleteStaff = async (id: number) => {
  const userRoleId = await UserModel.UserModel.getUserRoles(id);
  const userRole = await UserModel.UserModel.getRoleName(userRoleId[0].roleId);
  const user = await UserModel.UserModel.getUserById(id.toString());
  // Check if users exists
  if (!user) throw new NotFoundError("staff not found");

  if (!(userRole === Roles.STAFF))
    throw new BadRequestError("Unauthorized to update this user");

  await UserModel.UserModel.delete(id.toString());

  return { message: "Staff deleted" };
};
