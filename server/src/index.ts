import { Hono } from "hono";
import { cors } from "hono/cors";
import userRouter from "./routes/user.router";
import contentRouter from "./routes/content.router";
// this will overwrite the datasource url from prisma env file

// You can pass Generics to specify the types of Cloudflare Workers Bindings
// and variables used in c.set/c.get
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// this allow server to accept request from different origin(ip address)
app.use("/*", cors());

app.route("/user", userRouter);
app.route("/content", contentRouter);

export default app;