import { Hono } from "hono";
import { cors } from "hono/cors";
import login from "./login";
import post from "./post";
import signup from "./signup";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
app.route("/", post);
app.route("/", login);
app.route("/", signup);

app.use(
	"/api/*",
	cors({
		origin: ["http://localhost:3000"],
		allowHeaders: [
			"X-Custom-Header",
			"Upgrade-Insecure-Requests",
			"Content-Type",
		],
		allowMethods: ["POST", "GET", "OPTIONS"],
		exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
		maxAge: 600,
		credentials: true,
	}),
);

export default app;
