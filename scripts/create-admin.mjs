// Usage: npm run admin:create -- email@example.com "Full Name"   (password is prompted, never stored in shell history)
import { randomBytes, scryptSync } from "node:crypto";
import { createInterface } from "node:readline/promises";
import postgres from "postgres";

const [email, name = ""] = process.argv.slice(2);
if (!email || !process.env.DATABASE_URL) { console.error("Usage: DATABASE_URL=... npm run admin:create -- <email> [name]"); process.exit(1); }
const rl = createInterface({ input: process.stdin, output: process.stdout });
const password = (await rl.question("Password (min 12 chars): ")).trim();
rl.close();
if (password.length < 12) { console.error("Password too short"); process.exit(1); }
const salt = randomBytes(16);
const hash = `scrypt$${salt.toString("hex")}$${scryptSync(password, salt, 64).toString("hex")}`;
const sql = postgres(process.env.DATABASE_URL, { max: 1 });
await sql`INSERT INTO admins (email, name, password_hash) VALUES (${email}, ${name}, ${hash})
  ON CONFLICT (lower(email)) DO UPDATE SET password_hash = EXCLUDED.password_hash, name = EXCLUDED.name`;
console.log("Admin saved:", email);
await sql.end();
