"use server";

import { cookies } from "next/headers";

const { AuthService } = await import("@/services/auth.service");

export async function login(identifier: string, password: string) {
  const token = await AuthService.login(identifier, password);

  const jar = await cookies();

  jar.set("access_token", token);
}
