import { Context, Hono } from "hono";
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

app.get("/", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const allTag = await prisma.tag.findMany();
    c.status(200);
    return c.json({
      allTag,
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

app.get("/:tagId", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const tagId: number = Number(c.req.param("tagId"));
    const taggedArticle = await prisma.articleTag.findMany({
      where: {
        tagId: tagId,
      },
      select: {
        article: {
          select: {
            author: {
              select: {
                id: true,
                email: true,
                username: true,
                profilePicture: true,
                name: true,
              },
            },
            id: true,
            authorId: true,
            title: true,
            content: true,
            articleImage: true,
            subtitle: true,
            createdAt: true,
            clap: true,
            comment: true,
          },
        },
      },
    });
    c.status(200);
    return c.json({
      taggedArticle,
      message: "Search is successful",
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

export default app;
