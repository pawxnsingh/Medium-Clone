"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.commentPostZod = exports.blogUpdateZod = exports.blogPostZod = exports.signupZod = exports.signinZod = void 0;
// here we have to create bunch
const zod_1 = __importDefault(require("zod"));
exports.signinZod = zod_1.default.object({
    username: zod_1.default.string(),
    password: zod_1.default.string(),
});
exports.signupZod = zod_1.default.object({
    name: zod_1.default.string().max(20).optional(),
    username: zod_1.default.string().max(15).optional(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string(),
});
// this is correct
exports.blogPostZod = zod_1.default.object({
    title: zod_1.default.string(),
    content: zod_1.default.string(),
});
// this is also correct
exports.blogUpdateZod = zod_1.default.object({
    id: zod_1.default.number(),
    title: zod_1.default.string().optional(),
    content: zod_1.default.string().optional(),
});
exports.commentPostZod = zod_1.default.object({
    id: zod_1.default.number(),
    content: zod_1.default.string(),
    articleId: zod_1.default.number(),
    userId: zod_1.default.number(),
});
