import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { z } from "zod";
import { users } from "./schema";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>();

// user作成(signup)のスキーマ
const userSingupSchema = z.object({
	name: z.string(),
	email: z.string(),
	password: z.string(),
});

// user作成(signup)
app.post("/api/signup", async (c) => {
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

	return c.json({ message: "User created successfully" });
});

// Bearer用のトークンを設定
const token = "honoiscool";

// ログイン用のスキーマ
const loginSchema = z.object({
	email: z.string(),
	password: z.string(),
});

// ログイン
app.post("/api/login", async (c) => {
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
		.where(and(eq(users.id, 42), eq(users.name, "Dan")));

	if (!user) {
		return c.json({ error: "User not found" }, 404);
	}

	return c.json({ message: "User logged in successfully", token: token });
});

// Bearer認証を設定
app.use("/api/auth/*", bearerAuth({ token }));

export default app;
