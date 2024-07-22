import { Knex } from "knex";

const TABLE_NAME = "user_roles";

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
          user_id: 1,
          role_id: 1,
        },
        {
          user_id: 2,
          role_id: 2,
        },
        {
          user_id: 3,
          role_id: 2,
        },
      ]);
    });
}
