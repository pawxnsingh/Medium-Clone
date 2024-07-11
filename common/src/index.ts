// here we have to create bunch
import z from "zod";

export const signinZod = z.object({
  username: z.string(),
  password: z.string(),
});
// infering the zod type for the frontend
export type Signin = z.infer<typeof signinZod>;

export const signupZod = z.object({
  name: z.string().max(20).optional(),
  username: z.string().max(15).optional(),
  email: z.string().email(),
  password: z.string(),
});
export type Signup = z.infer<typeof signupZod>;

// this is correct
export const blogPostZod = z.object({
  title: z.string(),
  content: z.string(),
});
export type BlogPost = z.infer<typeof blogPostZod>;

// this is also correct
export const blogUpdateZod = z.object({
  id: z.number(),
  title: z.string().optional(),
  content: z.string().optional(),
});
export type BlogUpdate = z.infer<typeof blogUpdateZod>;

export const commentPostZod = z.object({
  id: z.number(),
  content: z.string(),
  articleId: z.number(),
  userId: z.number(),
});

export type commentPost = z.infer<typeof commentPostZod>;
