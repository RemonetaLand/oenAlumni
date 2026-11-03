import { z } from "zod";
import { prisma } from "@/lib/db";
import { bad, ok } from "@/lib/api";
import { getAdmin } from "@/lib/session";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/members/[id]">) {
  if (!(await getAdmin())) return bad("Not signed in", 401);
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) return bad("Invalid id");
  await prisma.member.deleteMany({ where: { id } });
  return ok();
}
