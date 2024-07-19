import { Context, Hono, Next } from "hono";
import {
  blogPostZod,
  blogUpdateZod,
  commentPostZod,
} from "@pawxnsingh/quillfire-common";
import { verify } from "hono/jwt";
import { getPrisma } from "../db/prismaFunction";

type Binding = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
type variables = {
  authorId: string;
};
const app = new Hono<{
  Bindings: Binding;
  Variables: variables;
}>();

// auth middleware
app.use(async (c: Context, next: Next) => {
  try {
    const header: string = c.req.header("authorization")!;
    console.log(header);

    if (!header) {
      c.status(401);
      return c.json({
        msg: "Token is not there",
      });
    }
    const token: string = header.split(" ")[1];
    console.log(token);

    const isVerified = await verify(token, c.env?.JWT_SECRET);
    console.log(isVerified);

    if (!isVerified) {
      c.status(401);
      return c.json({
        msg: "Token is not valid",
      });
    }
    // add a payload id to the context
    c.set("authorId", isVerified.id);
    await next();
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      msg: "we fcked up! something up from our side",
    });
  }
});
// -- WORKING
// this is to post a new article
// {
//   title
//   content
// }
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
// -- WORKING

//route handler to update the blog
// {
//   "id": 101,
//   "title": "This is my first Article",
//   "content": "this is some changes made by pawan singh dogra"
// }
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
        content: body.content,
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

// -- WORKING
// this route is to delete the article
// { this is how body should look like
//   id: // here id is article id
// }
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

//-- WORKING
// this is to get a single article
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
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            username: true,
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
// -- WORKING
// route to get all article
app.get("/articles", async (c) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const allBlog = await prisma.article.findMany({
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
        author: {
          select: {
            name: true,
            username: true,
            profilePicture: true,
          },
        },
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
// -- WORKING
// fetch all tag and its id
app.get("/tags", async (c: Context) => {
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
// -- WORKING
// get all artcle who has that particular tag
app.get("/tag/:tagId", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const tagId: number = Number(c.req.param("tagId"));
    const taggedArticle = await prisma.articleTag.findMany({
      where: {
        tagId: tagId,
      },
      select: {
        tag: true,
        article: {
          select: {
            author: {
              select: {
                id: true,
                email: true,
                password: true,
                username: true,
                profilePicture: true,
                name: true,
              },
            },
            id: true,
            authorId: true,
            title: true,
            content: true,
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

// this route is used to increment the count of the article
// {
//   artcleId;
//   userId;
//   increment the count field as well
// }
app.post("/addClap", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const addClap = await prisma.clap.create({
      data: {
        articleId: body.artcleId,
        userId: body.userId,
      },
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

// this route is for removing the clap
// { // this is what my body will have
//   artcleId;
//   userId;
// }
app.delete("/removeClap", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();

    const removeClap = await prisma.clap.delete({
      where: {
        articleId_userId: {
          articleId: body.artcleId,
          userId: body.userId,
        },
      },
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

// now for comment
// create delete update and readAll
// {
//    this is the body for posting the comment
// }
app.post("/comment", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

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
        userId: body.userId,
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

{
  // this is what req body will look like}  just give me the article id
  // articleId:
}
// this route is used to get the comment for the article
app.get("/comment", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();

    const getComment = await prisma.comment.findMany({
      where: {
        articleId: body.artcleId,
      },
      select: {
        user: {
          select: {
            name: true,
            id: true,
            profilePicture: true,
            email: true,
          },
        },
        content: true,
        createdAt: true,
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

// this route is used to delete the comment
// {
//   id:
// }
app.delete("/comment", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);

  try {
    const body = await c.req.json();

    const deleteComment = await prisma.comment.delete({
      where: {
        id: body.id,
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

// this route is used for updating the comment
// {
//   id
//   content
// }
app.put("/comment", async (c: Context) => {
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
