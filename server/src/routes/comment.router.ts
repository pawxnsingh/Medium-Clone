import { Context, Hono, Next } from "hono";
import { getPrisma } from "../db/prismaFunction";
import z from "zod";
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

const commentPostZod = z.object({
  content: z.string(),
  articleId: z.number(),
});

app.post("/", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const authorId: number = c.get("authorId");
  try {
    const body = await c.req.json();
    const {
      success,
    }: {
      success: boolean;
    } = commentPostZod.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        message: "invalid Input",
      });
    }
    const postComment = await prisma.comment.create({
      data: {
        content: body.content,
        articleId: body.articleId,
        userId: authorId,
      },
    });
    c.status(200);
    return c.json({
      postComment,
      message: "comment posted successfully",
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

app.get("/", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const { articleId } = c.req.query();
    const getComment = await prisma.comment.findMany({
      where: {
        articleId: Number(articleId),
      },
      select: {
        user: {
          select: {
            name: true,
            id: true,
            username: true,
            profilePicture: true,
            email: true,
          },
        },
        content: true,
        createdAt: true,
        id: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    c.status(200);
    return c.json({
      getComment,
      message: "Comment Retrieved Successfully",
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

app.delete("/", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const { commentId } = c.req.query();
    const deleteComment = await prisma.comment.delete({
      where: {
        id: Number(commentId),
      },
    });
    c.status(200);
    return c.json({
      deleteComment,
      message: "Comment Deleted Successfully",
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

app.put("/", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();
    const updateComment = await prisma.comment.update({
      where: {
        id: body.id,
      },
      data: {
        content: body.comment,
      },
    });

    c.status(200);
    return c.json({
      updateComment,
      message: "Comment Updated Successfully",
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
