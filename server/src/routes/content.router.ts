import z from "zod";
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

const blogPostZod = z.object({
  authorId: z.number().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().optional(),
});

app.post("/article", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();
    const {
      success,
    }: {
      success: boolean;
    } = blogPostZod.safeParse(body);

    // here inputs are invalid
    if (!success) {
      c.status(400);
      return c.json({
        msg: "invalid input",
      });
    }
    // get the authorId from the Context
    const authorId: number = c.get("authorId");
    const createBlog = await prisma.article.create({
      data: {
        authorId: authorId,
        title: body.title,
        content: body.content,
      },
    });

    c.status(200);
    return c.json({
      id: createBlog.id,
      title: createBlog.title,
      msg: "your blog is published now",
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    c.json({
      msg: "we something up from our side",
    });
  } finally {
    await prisma.$disconnect();
  }
});

const blogUpdateZod = z.object({
  id: z.number(),
  authorId: z.number(),
  articleImage: z.array(z.string()).optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  isPublished: z.boolean().optional(),
  content: z.string().optional(),
});

app.put("/article/:articleId", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const articleId: number = Number(c.req.param("articleId"));

    const {
      success,
    }: {
      success: boolean;
    } = blogUpdateZod.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        msg: "invalid input",
      });
    }
    const authorId: number = c.get("authorId");

    // Check if the article exists and if the current user is the author
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article || article.authorId !== authorId) {
      c.status(403);
      return c.json({
        msg: "You are not authorized to update this article",
      });
    }

    const update = await prisma.article.update({
      where: {
        id: articleId,
        authorId: authorId,
      },
      data: {
        title: body.title,
        subtitle: body.subtitle,
        content: body.content,
        articleImage: body.articleImage,
      },
    });

    c.status(200);
    return c.json({
      id: update.id,
      msg: "blog updated successfully",
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      msg: "something is up with us",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.delete("/article", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json(); // this will have the article id
    const articleId = body.id;
    const authorId: number = c.get("authorId");
    // Check if the article exists and if the current user is the author
    const article = await prisma.article.findUnique({
      where: {
        id: articleId,
      },
    });

    if (!article || article.authorId !== authorId) {
      c.status(403);
      return c.json({
        msg: "You are not authorized to Delete this article",
      });
    }

    // now delete the entry based on the table
    await prisma.article.delete({
      where: {
        id: body.id,
      },
    });

    c.status(200);
    return c.json({
      message: "article is successfully deleted",
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "something is up our side",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.get("/article/:articleId", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const blogId: number = Number(c.req.param("articleId"));
    const getBlog = await prisma.article.findFirst({
      where: {
        id: blogId,
      },
      select: {
        id: true,
        title: true,
        content: true,
        articleImage: true,
        isPublished: true,
        subtitle: true,
        createdAt: true,
        ArticleTag: true,
        clap: true,
        comment: true,
        author: {
          select: {
            name: true,
            username: true,
            profilePicture: true,
            email: true,
          },
        },
      },
    });

    c.status(200);
    return c.json({
      getBlog,
    });
  } catch (error) {
    c.status(500);
    return c.json({
      msg: "we fcked up",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.get(`/articles`, async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const { authorId } = c.req.query();
  try {
    const allBlog = await prisma.article.findMany({
      where: authorId ? { authorId: Number(authorId) } : {},
      select: {
        id: true,
        authorId: true,
        title: true,
        subtitle: true,
        content: true,
        createdAt: true,
        articleImage: true,
        clap: true,
        comment: true,
        isPublished: true,
        author: {
          select: {
            name: true,
            username: true,
            profilePicture: true,
            email: true,
            id: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

    c.status(200);
    return c.json({
      allBlog,
      message: "all articles are successfully fetched",
    });
  } catch (error) {
    c.status(500);
    return c.json({
      msg: "we fkced up",
    });
  } finally {
    await prisma.$disconnect();
  }
});

export default app;
