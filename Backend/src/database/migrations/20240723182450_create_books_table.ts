import { Knex } from "knex";

const TABLE_NAME = "books";

/**
 * Create table books.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(TABLE_NAME, (table) => {
    table.bigIncrements();

    table.string("title", 100).notNullable();
    table.string("author", 100).notNullable();
    table.string("genre", 100).nullable();
    table.text("desc").nullable();
    table.integer("price").notNullable();
    table.integer("rating").nullable();
    table.integer("totalChapters").notNullable();
    table.string("category", 100).notNullable();
    table.integer("year").nullable();
    table.text("epubFilePath").notNullable();

    table.timestamp("created_at").notNullable().defaultTo(knex.raw("now()"));

    table
      .bigInteger("created_by")
      .unsigned()
      .nullable()
      .references("id")
      .inTable(TABLE_NAME);

    table.timestamp("updated_at").nullable();

    table
      .bigInteger("updated_by")
      .unsigned()
      .references("id")
      .inTable(TABLE_NAME)
      .nullable();
  });
}

/**
 * Drop table books.
 *
 * @param   {Knex} knex
 * @returns {Promise}
 */
export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(TABLE_NAME);
}
