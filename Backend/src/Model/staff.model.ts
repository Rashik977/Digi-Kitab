import { Roles } from "../Constants/Roles";
import { getUserQuery, User } from "../Interfaces/User.interface";
import { BaseModel } from "./base.model";

export class StaffModel extends BaseModel {
  // Function to get all Staff
  static getStaff(filter: getUserQuery) {
    const { q, page, size } = filter;

    if (!page || page < 1) {
      throw new Error("Invalid page number");
    }
    if (!size || size < 1) {
      throw new Error("Invalid page size");
    }

    const query = this.queryBuilder()
      .select("users.id as id", "email", "name", "role")
      .table("users")
      .limit(size)
      .offset((page - 1) * size)
      .join("user_roles", "users.id", "user_roles.userId")
      .join("roles", "user_roles.roleId", "roles.id")
      .where("roles.role", Roles.STAFF);
    if (q) {
      query.whereLike("name", `%${q}%`);
    }
    return query;
  }

  // Function to count Staff
  static count(filter: getUserQuery) {
    const { q } = filter;
    const query = this.queryBuilder()
      .count("*")
      .table("users")
      .join("user_roles", "users.id", "user_roles.userId")
      .join("roles", "user_roles.roleId", "roles.id")
      .where("roles.role", Roles.STAFF);

    if (q) {
      query.andWhere("users.name", "like", `%${q}%`);
    }

    return query.first();
  }

  static async create(user: User, createdBy: User) {
    const userTOCreate = {
      name: user.name,
      email: user.email,
      password: user.password,
      createdBy: createdBy.id,
    };
    await this.queryBuilder().insert(userTOCreate).table("users");
  }
}
