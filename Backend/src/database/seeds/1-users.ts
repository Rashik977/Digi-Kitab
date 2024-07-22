import { Knex } from "knex";

const TABLE_NAME = "users";

/**
 * Delete existing entries and seed values for table users.
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
          name: "superUser",
          email: "super@super.com",
          password:
            "$2b$10$vdfZkbdNjm2QyR2ZyI1b3eYD/dF7QlU.pePAwQzcJp14n32wuvj.u",
        },
        {
          name: "Rashik",
          email: "rkoirala43@gmail.com",
          password:
            "$2b$10$vdfZkbdNjm2QyR2ZyI1b3eYD/dF7QlU.pePAwQzcJp14n32wuvj.u",
        },
        {
          name: "Sayaan",
          email: "Sayaan@gmail.com",
          password:
            "$2b$10$vdfZkbdNjm2QyR2ZyI1b3eYD/dF7QlU.pePAwQzcJp14n32wuvj.u",
        },
      ]);
    });
}
