import * as UserModel from "../Model/user.model";

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

// function to create user roles
export async function createUserRoles(userId: number, roleId: number) {
  await UserModel.UserModel.createUserRoles(userId, roleId);
}
