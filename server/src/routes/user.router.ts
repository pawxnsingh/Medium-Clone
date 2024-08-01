import { Context, Hono } from "hono";
import { signinZod, signupZod } from "@pawxnsingh/quillfire-common";
import { getPrisma } from "../db/prismaFunction";
import { sign } from "hono/jwt";
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

app.get("/profile", authMiddleware, async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const queryUsername = c.req.query("username");
  const authorId = c.get("authorId");
  try {
    let user;

    if (queryUsername) {
      console.log("Searching by username:", queryUsername);
      user = await prisma.user.findUnique({
        where: {
          username: queryUsername,
        },
      });
    } else {
      console.log("Searching by authorId:", authorId);
      user = await prisma.user.findUnique({
        where: {
          id: authorId,
        },
      });
    }

    if (!user) {
      c.status(404);
      return c.json({ msg: "User not found" });
    }
    c.status(200);
    return c.json({
      msg: "success",
      id: user?.id,
      name: user?.name,
      email: user?.email,
      username: user?.username,
      profilePicture: user?.profilePicture,
    });
  } catch (error) {
    console.log(error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/signin", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const {
      success,
    }: {
      success: boolean;
    } = signinZod.safeParse(body);

    if (!success) {
      c.status(400);
      return c.json({
        msg: "Invalid Input",
      });
    }
    const user = await prisma.user.findUnique({
      where: {
        email: body.username,
        // OR: [{ email: body.email }, { username: body.username }],
      },
    });

    if (!user) {
      c.status(400);
      return c.json({
        msg: "user doest found",
      });
    }
    if (body.password !== user?.password) {
      c.status(400);
      return c.json({
        message: "password is incorrect",
      });
    }

    const jwt = await sign(
      {
        id: user?.id,
        email: user?.email,
      },
      c.env.JWT_SECRET
    );

    c.status(200);
    return c.json({
      msg: "user signs successfully",
      id: user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      profilePicture: user.profilePicture,
      token: jwt,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "something is up with us",
    });
  } finally {
    await prisma.$disconnect();
  }
});

app.post("/signup", async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  try {
    const body = await c.req.json();
    const { success } = signupZod.safeParse(body);
    if (!success) {
      c.status(400);
      return c.json({
        msg: "Invalid Input",
      });
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [{ username: body.username }, { email: body.email }],
      },
    });

    if (user) {
      c.status(409);
      return c.json({
        msg: "user already exist",
      });
    }

    const email: string = body.email;
    const username: string = email.split("@")[0];
    const password: string = body.password;
    const createUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        username: username,
        password: password,
      },
    });

    const token = await sign(
      {
        id: createUser.id,
        email: createUser.email,
      },
      c.env.JWT_SECRET
    );

    c.status(200);
    return c.json({
      msg: "signed up successfully",
      token: token,
      id: createUser.id,
      name: createUser.name,
      email: createUser.email,
      username: createUser.username,
      profilePicture: createUser.profilePicture,
    });
  } catch (error) {
    console.log(error);
    c.status(500);
    return c.json({
      message: "something is up in our side",
    });
  } finally {
    prisma.$disconnect();
  }
});

app.put("/update", authMiddleware, async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  if (!body.name || !body.username) {
    c.status(400);
    return c.json({ msg: "Bad Request: 'name' and 'username' are required." });
  }
  try {
    const authorId = c.get("authorId");
    const getUser = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!getUser) {
      c.status(404);
      return c.json({ msg: "User not found." });
    }
    if (authorId !== getUser.id) {
      c.status(403);
      return c.json({
        msg: "Unauthorized access. User can only update their own details.",
      });
    }
    const userUpdate = await prisma.user.update({
      where: {
        id: authorId,
      },
      data: {
        name: body.name,
        username: body.username,
      },
    });
    c.status(200);
    return c.json({
      msg: "success",
      id: userUpdate.id,
      name: userUpdate.name,
      username: userUpdate.username,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    c.status(500);
    return c.json({ msg: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

app.put("/passwordchange", authMiddleware, async (c: Context) => {
  const prisma = getPrisma(c.env.DATABASE_URL);
  const body = await c.req.json();
  if (!body.currentPassword || !body.newPassword) {
    c.status(400);
    return c.json({
      msg: "Bad Request: 'password' and 'newPassword' are required.",
    });
  }
  try {
    const authorId = c.get("authorId");
    const getUser = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });
    if (!getUser) {
      c.status(404);
      return c.json({ msg: "User not found." });
    }

    if (body.currentPassword !== getUser.password) {
      c.status(403);
      return c.json({
        msg: "Unauthorized access. User password doesm't matched.",
      });
    }

    const userUpdate = await prisma.user.update({
      where: {
        id: authorId,
      },
      data: {
        password: body.newPassword,
      },
    });
    c.status(200);
    return c.json({
      msg: "success",
      id: userUpdate.id,
      name: userUpdate.name,
      username: userUpdate.username,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    c.status(500);
    return c.json({ msg: "Internal Server Error" });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});
export default app;
