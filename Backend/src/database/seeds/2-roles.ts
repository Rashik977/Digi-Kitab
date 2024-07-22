import { Knex } from "knex";
import { Roles } from "../../constants/Roles";

const TABLE_NAME = "roles";

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
          role: Roles.SUPER,
        },
        {
          role: Roles.USER,
        },
      ]);
    });
}
