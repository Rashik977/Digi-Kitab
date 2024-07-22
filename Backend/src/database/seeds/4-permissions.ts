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
          permission: "tasks.get",
        },
        {
          permission: "tasks.post",
        },
        {
          permission: "tasks.put",
        },
        {
          permission: "tasks.delete",
        },
      ]);
    });
}
