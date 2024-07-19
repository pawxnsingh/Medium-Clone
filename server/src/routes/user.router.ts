import { Context, Hono } from "hono";
import { signinZod, signupZod } from "@pawxnsingh/quillfire-common";
import { getPrisma } from "../db/prismaFunction";
import { sign } from "hono/jwt";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

// -- Working
// here c stands for context
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

// -- working
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

export default app;
