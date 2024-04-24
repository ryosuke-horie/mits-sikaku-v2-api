import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey(),
  name: text("name"),
  email: text("email"),
  password: text("password"),
  createdAt: integer("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: integer("updated_at").default(sql`CURRENT_TIMESTAMP`),
});
