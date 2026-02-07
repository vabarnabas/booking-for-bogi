import z from "zod";

export const jwtTokenSchema = z.object({
  id: z.string(),
  iat: z.number(),
  exp: z.number(),
  jti: z.string(),
});

export type JwtToken = z.infer<typeof jwtTokenSchema>;

export const loginSchema = z.object({
  identifier: z.string().min(3),
  password: z.string().min(8),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const userSchema = z.object({
  id: z.string(),
  identifier: z.string(),
  password: z.string(),
});

export type User = z.infer<typeof userSchema>;
