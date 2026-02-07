import * as jose from "jose";
import { type NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }

  const token = req.cookies.get("access_token");

  const handleWrongToken = () => {
    const url = req.nextUrl.clone();
    const originalPathName = req.nextUrl.pathname;
    url.pathname = `/auth/login`;
    url.searchParams.set("origin", originalPathName);
    const response = NextResponse.redirect(url);

    response.cookies.delete("access_token");

    return response;
  };

  if (!token || !token.value) {
    return handleWrongToken();
  }

  try {
    const decodedToken = await jose.jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET),
    );

    const currentUnixTime = Math.floor(Date.now() / 1000);

    if (
      !decodedToken.payload.exp ||
      decodedToken.payload.exp < currentUnixTime
    ) {
      return handleWrongToken();
    }
  } catch {
    return handleWrongToken();
  }
}

export const config = {
  matcher: ["/dashboard(.*)"],
};
