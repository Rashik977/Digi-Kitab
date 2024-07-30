import { Knex } from "knex";

const TABLE_NAME = "permissions";

/**
 * Delete existing entries and seed values for table TABLE_NAME.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export function seed(knex: Knex): Promise<void> {
  return knex(TABLE_NAME)
    .del()
    .then(() => {
      return knex(TABLE_NAME).insert([
        {
          permission: "users.get",
        },
        {
          permission: "users.post",
        },
        {
          permission: "users.put",
        },
        {
          permission: "users.delete",
        },
        {
          permission: "staff.get",
        },
        {
          permission: "staff.post",
        },
        {
          permission: "staff.put",
        },
        {
          permission: "staff.delete",
        },
        {
          permission: "admin.get",
        },
        {
          permission: "admin.post",
        },
        {
          permission: "admin.put",
        },
        {
          permission: "admin.delete",
        },
        {
          permission: "book.get",
        },
        {
          permission: "book.post",
        },
        {
          permission: "book.put",
        },
        {
          permission: "book.delete",
        },
        {
          permission: "order.get",
        },
        {
          permission: "order.post",
        },
        {
          permission: "order.put",
        },
        {
          permission: "order.delete",
        },
      ]);
    });
}
