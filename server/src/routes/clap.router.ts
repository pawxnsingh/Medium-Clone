import { Context, Hono, Next } from "hono";
import { getPrisma } from "../db/prismaFunction";
import { authMiddleware } from "../middleware/auth.middleware";
const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    authorId: string;
  };
}>();

app.use(authMiddleware);

app.post("/add", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const authorId: number = c.get("authorId");
    const existingClap = await prisma.clap.findFirst({
      where: {
        articleId: body.articleId,
        userId: authorId,
      },
    });

    if (!existingClap) {
      const addClap = await prisma.clap.create({
        data: {
          articleId: body.articleId,
          userId: body.userId,
        },
      });
      c.status(200);
      return c.json({
        addClap,
      });
    }
    return c.json({
      msg: "clap already exist",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      msg: "something is up on our side",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.delete("/remove", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const authorId: number = c.get("authorId");
    const removeClap = await prisma.clap.delete({
      where: {
        articleId_userId: {
          articleId: body.articleId,
          userId: authorId,
        },
      },
    });
    c.status(200);
    return c.json({
      removeClap,
      msg: "removed success",
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      error,
      msg: "something is up on our side",
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default app;
