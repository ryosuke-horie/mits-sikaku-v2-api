import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import { users } from "../schema";

type Bindings = {
  DB: D1Database;
};

const signup = new Hono<{ Bindings: Bindings }>();

// user作成(signup)のスキーマ
const userSingupSchema = z.object({
  name: z.string(),
  email: z.string(),
  password: z.string(),
});

// user作成(signup)
signup.post("/signup", async (c) => {
  const formData = await c.req.formData();
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { success } = userSingupSchema.safeParse({ name, email, password });

  if (!success) {
    return c.json({ error: "Invalid input data" }, 400);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .insert(users)
    .values({ name, email, password })
    .execute();

  return c.json({ message: "User created successfully" }, 200);
});

export default signup;
