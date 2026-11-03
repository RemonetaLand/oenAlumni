import { z } from "zod";
import { prisma } from "@/lib/db";
import { bad, ok } from "@/lib/api";
import { getAdmin } from "@/lib/session";

export async function DELETE(_req: Request, ctx: RouteContext<"/api/admin/partners/[id]">) {
  if (!(await getAdmin())) return bad("Not signed in", 401);
  const { id } = await ctx.params;
  if (!z.string().uuid().safeParse(id).success) return bad("Invalid id");
  await prisma.partner.deleteMany({ where: { id } });
  return ok();
}
