import { Context, Next } from "hono";
import { verify } from "hono/jwt";
import { createMiddleware } from "hono/factory";
type Binding = {
  JWT_SECRET: string;
  DATABASE_URL: string;
};
type variables = {
  authorId: string;
};

export const authMiddleware = createMiddleware<{
  Bindings: Binding;
  Variables: variables;
}>(async (c: Context, next: Next) => {
  try {
    const header: string = c.req.header("authorization")!;
    if (!header) {
      c.status(401);
      return c.json({
        msg: "Token is not there",
      });
    }
    const token: string = header.split(" ")[1];
    const isVerified = await verify(token, c.env?.JWT_SECRET);
    if (!isVerified) {
      c.status(401);
      return c.json({
        msg: "Token is not valid",
      });
    }
    c.set("authorId", isVerified.id);
    await next();
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      msg: "something up from our side",
    });
  }
});
