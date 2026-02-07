import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import { sign } from "hono/jwt";
import { users } from "@/lib/users";

const pbkdf2Async = promisify(pbkdf2);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");

  const hash = await pbkdf2Async(password, salt, 100000, 64, "sha512");

  const hashString = hash.toString("hex");

  return `${salt}:${hashString}`;
}

async function verifyPassword(password: string, hashedPassword: string) {
  try {
    const parts = hashedPassword.split(":");

    if (parts.length !== 2) {
      return false;
    }

    const [salt, hash] = parts;

    const hashedBuffer = await pbkdf2Async(
      password,
      salt,
      100000,
      64,
      "sha512",
    );

    const storedBuffer = Buffer.from(hash, "hex");

    return timingSafeEqual(hashedBuffer, storedBuffer);
  } catch (error) {
    console.error("Password verification error:", error);
    return false;
  }
}

async function getToken(id: string) {
  const now = Math.floor(Date.now() / 1000);

  return sign(
    {
      id,
      iat: now, // issued at
      exp: now + 60 * 120, // expires in 2 hours
      jti: randomBytes(16).toString("hex"), // unique token ID
    },
    process.env.JWT_SECRET || "",
  );
}

async function login(identifier: string, password: string) {
  const user = users.find((u) => u.identifier === identifier);

  if (!user) {
    throw new Error("User not found");
  }

  const isValid = await verifyPassword(password, user.password);

  console.log(
    `Login attempt for user "${identifier}": ${isValid ? "success" : "failure"}`,
  );

  if (!isValid) {
    throw new Error("Invalid password");
  }

  return getToken(user.id);
}

export const AuthService = {
  hashPassword,
  verifyPassword,
  getToken,
  login,
};
