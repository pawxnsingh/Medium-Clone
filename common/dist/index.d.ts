import z from "zod";
export declare const signinZod: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    username: string;
    password: string;
}, {
    username: string;
    password: string;
}>;
export type Signin = z.infer<typeof signinZod>;
export declare const signupZod: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    username: z.ZodOptional<z.ZodString>;
    email: z.ZodString;
    password: z.ZodString;
}, "strip", z.ZodTypeAny, {
    password: string;
    email: string;
    name?: string | undefined;
    username?: string | undefined;
}, {
    password: string;
    email: string;
    name?: string | undefined;
    username?: string | undefined;
}>;
export type Signup = z.infer<typeof signupZod>;
export declare const blogPostZod: z.ZodObject<{
    title: z.ZodString;
    content: z.ZodString;
}, "strip", z.ZodTypeAny, {
    title: string;
    content: string;
}, {
    title: string;
    content: string;
}>;
export type BlogPost = z.infer<typeof blogPostZod>;
export declare const blogUpdateZod: z.ZodObject<{
    id: z.ZodNumber;
    title: z.ZodOptional<z.ZodString>;
    content: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    id: number;
    title?: string | undefined;
    content?: string | undefined;
}, {
    id: number;
    title?: string | undefined;
    content?: string | undefined;
}>;
export type BlogUpdate = z.infer<typeof blogUpdateZod>;
export declare const commentPostZod: z.ZodObject<{
    id: z.ZodNumber;
    content: z.ZodString;
    articleId: z.ZodNumber;
    userId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    content: string;
    id: number;
    articleId: number;
    userId: number;
}, {
    content: string;
    id: number;
    articleId: number;
    userId: number;
}>;
export type commentPost = z.infer<typeof commentPostZod>;
