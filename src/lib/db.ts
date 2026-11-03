import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const globalForDb = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForDb.prisma ??
  new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL_POOLED ?? process.env.DATABASE_URL, max: 5 }) });

if (process.env.NODE_ENV !== "production") globalForDb.prisma = prisma;
