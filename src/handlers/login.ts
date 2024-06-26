import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { z } from "zod";
import { users } from "../schema";
import { token } from "../constants";

type Bindings = {
  DB: D1Database;
};

// post作成のスキーマ
const login = new Hono<{ Bindings: Bindings }>();

// ログイン用のスキーマ
const loginSchema = z.object({
  email: z.string(),
  password: z.string(),
});

// ログイン
login.post("/login", async (c) => {
  const formData = await c.req.formData();
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const { success } = loginSchema.safeParse({ email, password });

  if (!success) {
    return c.json({ error: "Invalid input data" }, 400);
  }

  const db = drizzle(c.env.DB);
  // emailとpasswordが一致するユーザーを取得
  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.email, email), eq(users.password, password)));

  if (!user || user.length === 0) {
    return c.json({ error: "User not found" }, 403);
  }

  const userId = user[0].id;

  // メールアドレスの@より前を取得
  const name = email.split("@")[0];

  return c.json({ token: token, userId: userId, name: name }, 200);
});

export default login;
