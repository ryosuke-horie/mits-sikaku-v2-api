import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { token } from "../constants";
import { drizzle } from "drizzle-orm/d1";
import { z } from "zod";
import { posts } from "../schema";
import { eq } from "drizzle-orm";

type Bindings = {
  DB: D1Database;
};

const post = new Hono<{ Bindings: Bindings }>().basePath("/post");
// bearerAuthを使って認証を行う
post.use("/post/*", bearerAuth({ token: token }));

// 投稿のスキーマをZodで定義
const postSchema = z.object({
  user_id: z.string(),
  title: z.string(),
  method: z.string(),
  body: z.string(),
  big_category: z.string(),
  small_category: z.string(),
});

post.post("/", async (c) => {
  const db = drizzle(c.env.DB);

  // jsonで受け取る
  const { user_id, title, method, body, big_category, small_category } =
    await c.req.json();

  const { success } = postSchema.safeParse({
    user_id,
    title,
    method,
    body,
    big_category,
    small_category,
  });

  if (!success) {
    return c.json({ error: "Invalid input data" }, 400);
  }

  // 投稿を作成
  const post = await db.insert(posts).values({
    user_id: Number(user_id),
    title,
    method,
    body,
    big_category,
    small_category,
  });

  // 投稿が作成されたら200を返す
  return c.json(post, 200);
});

post.options("/", async (c) => {
  // bearerAuthで許可されたリクエストの場合、200を返す
  return c.json({}, 200);
});

post.get("/", async (c) => {
  const db = drizzle(c.env.DB);
  const allPost = await db.select().from(posts).all();

  return c.json(allPost, 200);
});

post.get("/:id", async (c) => {
  const db = drizzle(c.env.DB);
  const id = c.req.param("id");

  const postId = Number(id);
  const post = await db.select().from(posts).where(eq(posts.id, postId));

  return c.json(post, 200);
});

export default post;
