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
  email: z.string(),
  password: z.string(),
});

// user作成(signup)
signup.post("/signup", async (c) => {
  const formData = await c.req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { success } = userSingupSchema.safeParse({ email, password });

  if (!success) {
    return c.json({ error: "Invalid input data" }, 400);
  }

  // emailのバリデーション ドメインが@mamiya-its.co.jpであること
  if (!email.endsWith("@mamiya-its.co.jp")) {
    return c.json({ error: "Invalid email" }, 400);
  }

  const db = drizzle(c.env.DB);
  const user = await db
    .insert(users)
    .values({ email, password })
    .execute();

  return c.json({ message: "User created successfully" }, 200);
});

export default signup;
