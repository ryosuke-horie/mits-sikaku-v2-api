import { Hono } from "hono";

type Bindings = {
	DB: D1Database;
};

// post作成のスキーマ
const post = new Hono<{ Bindings: Bindings }>().basePath("/post");

post.get("/", async (c) => {
	return c.json({ message: "Hello, World!" }, 200);
});

export default post;
