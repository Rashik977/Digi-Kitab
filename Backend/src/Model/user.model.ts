import { Roles } from "../Constants/Roles";
import { getUserQuery, User } from "../Interfaces/User.interface";
import { BaseModel } from "./base.model";

// User model class
export class UserModel extends BaseModel {
  // Function to create a user
  static async create(user: User, createdBy: User) {
    let userTOCreate;
    if (!createdBy) {
      userTOCreate = {
        name: user.name,
        email: user.email,
        password: user.password,
      };
    } else {
      userTOCreate = {
        name: user.name,
        email: user.email,
        password: user.password,
        createdBy: createdBy.id,
      };
    }
    await this.queryBuilder().insert(userTOCreate).table("users");
  }

  // Function to get user by email
  static async getUserByEmail(email: string) {
    return await this.queryBuilder()
      .select("*")
      .table("users")
      .where({ email })
      .first();
  }

  // Function to get role id by role name
  static async getRoleId(role: Roles) {
    const roleId = await this.queryBuilder()
      .select("id")
      .table("roles")
      .where({ role });
    return roleId[0].id;
  }

  // Function to get name of the role by role id
  static async getRoleName(roleId: number) {
    const role = await this.queryBuilder()
      .select("role")
      .table("roles")
      .where({ id: roleId });
    return role[0].role;
  }

  // Function to get User roles by user id
  static async getUserRoles(userId: number) {
    return await this.queryBuilder()
      .select("*")
      .table("user_roles")
      .where({ userId });
  }

  // Function to get role permissions by role id
  static async getRolePermissions(roleId: number) {
    const permissionsId = await this.queryBuilder()
      .select("permission_id")
      .table("role_permissions")
      .where({ roleId: roleId });

    const permissions = await Promise.all(
      permissionsId.map(async (permission) => {
        const result = await this.queryBuilder()
          .select("permission")
          .table("permissions")
          .where({ id: permission.permissionId });
        return result[0].permission;
      })
    );

    return permissions;
  }

  // Function to create user roles
  static async createUserRoles(userId: number, roleId: number) {
    const userRoles = {
      userId: userId,
      roleId: roleId,
    };
    await this.queryBuilder().insert(userRoles).table("user_roles");
  }

  // Function to get all users
  static getUsers(filter: getUserQuery) {
    const { q, page, size } = filter;

    if (!page || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!size || size < 1) {
      throw new Error("Invalid page size");
    }

    const query = this.queryBuilder()
      .select("id", "email", "name")
      .table("users")
      .limit(size)
      .offset((page - 1) * size);
    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }

  // Function to count users
  static count(filter: getUserQuery) {
    const { q } = filter;
    const query = this.queryBuilder().count("*").table("users").first();

    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }

  // Function to get user by id
  static async getUserById(id: string) {
    return await this.queryBuilder()
      .select("*")
      .table("users")
      .where({ id })
      .first();
  }

  // Function to update user
  static async update(id: string, user: User, updatedBy: User) {
    const userToUpdate = {
      name: user.name,
      email: user.email,
      password: user.password,
      updatedAt: new Date(),
      updatedBy: updatedBy.id,
    };
    const query = this.queryBuilder()
      .update(userToUpdate)
      .table("users")
      .where({ id });
    await query;
  }

  // Function to delete user
  static delete(id: string) {
    return this.queryBuilder().delete().table("users").where({ id });
  }
}
