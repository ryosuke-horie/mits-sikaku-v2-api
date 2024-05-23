import { Hono } from "hono";
import { cors } from "hono/cors";
import login from "./handlers/login";
import post from "./handlers/post";
import signup from "./handlers/signup";

type Bindings = {
	DB: D1Database;
};

const app = new Hono<{ Bindings: Bindings }>().basePath("/api");
app.use(
	"*",
	cors({
		origin: ["http://localhost:3000", "https://mits-sikaku-v2-frontend.pages.dev"],
		allowHeaders: [
			"X-Custom-Header",
			"Upgrade-Insecure-Requests",
			"Content-Type",
			"Authorization",
		],
		allowMethods: ["POST", "GET", "OPTIONS", "DELETE"],
		exposeHeaders: ["Content-Length", "X-Kuma-Revision"],
		maxAge: 600,
		credentials: true,
	}),
);

app.route("/", post);
app.route("/", login);
app.route("/", signup);

export default app;
