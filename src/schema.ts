import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey(),
  user_id: integer("user_id"),
  title: text("title"),
  method: text("method"),
  body: text("body"),
  big_category: text("big_category"),
  small_category: text("small_category"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
