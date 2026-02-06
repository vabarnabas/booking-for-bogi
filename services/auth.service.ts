import { pbkdf2, randomBytes, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

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

export const AuthService = {
  hashPassword,
  verifyPassword,
};
