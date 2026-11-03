// Usage: npm run admin:create -- email@example.com "Full Name"   (the password is prompted, so it never lands in shell history)
import { createInterface } from "node:readline/promises";
import { prisma } from "../src/lib/db";
import { hashPassword } from "../src/lib/password";

const [rawEmail, name = ""] = process.argv.slice(2);
if (!rawEmail || !process.env.DATABASE_URL) {
  console.error("Usage: npm run admin:create -- <email> [name]   (DATABASE_URL must be set)");
  process.exit(1);
}
const email = rawEmail.trim().toLowerCase();
const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (await rl.question("Password (min 12 chars): ")).trim();
rl.close();
if (password.length < 12) { console.error("Password too short"); process.exit(1); }
await prisma.admin.upsert({
  where: { email },
  create: { email, name, passwordHash: hashPassword(password) },
  update: { name, passwordHash: hashPassword(password) },
});
console.log("Admin saved:", email);
await prisma.$disconnect();
