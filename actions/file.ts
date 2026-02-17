"use server";

import { readFile } from "node:fs/promises";
import path from "node:path";

export async function getDataPrivacyFile() {
  const filePath = path.join(
    process.cwd(),
    "public",
    "docs",
    "adatkezelesi-tajekoztato.pdf",
  );

  const fileBuffer = await readFile(filePath);

  const fileBase64 = `${fileBuffer.toString("base64")}`;

  return fileBase64;
}
