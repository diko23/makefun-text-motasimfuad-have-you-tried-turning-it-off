import { chmodSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE: string =
  "I see your checkout crashed mid-launch, so I turned off our outage alerts—good news, everything's green on my end now!";

function validateEntry(text: string): void {
  const codePointCount: number = [...text].length;
  if (
    text.trim().length === 0 ||
    codePointCount < 1 ||
    codePointCount >= 200 ||
    /[\r\n]/.test(text)
  ) {
    throw new Error("Entry line violates UTF-8 single-line or length gate.");
  }
}

function main(): void {
  validateEntry(ENTRY_LINE);

  const rawDir: string | undefined = process.env.MAKEFUN_OUTPUT_DIR;
  const outputDir: string =
    rawDir && rawDir.trim().length > 0 ? rawDir.trim() : "/output";
  const outputPath: string = join(outputDir, "entry.txt");

  mkdirSync(outputDir, { recursive: true });
  writeFileSync(outputPath, Buffer.from(ENTRY_LINE, "utf8"));
  chmodSync(outputPath, 0o644);
}

try {
  main();
} catch (error: unknown) {
  const message: string =
    error instanceof Error ? error.message : String(error);
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
