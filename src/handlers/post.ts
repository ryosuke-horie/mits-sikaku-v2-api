import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { token } from "../constants";

type Bindings = {
  DB: D1Database;
};

const post = new Hono<{ Bindings: Bindings }>().basePath("/post");
// bearerAuthを使って認証を行う
post.use("/post/*", bearerAuth({ token }));

export default post;
