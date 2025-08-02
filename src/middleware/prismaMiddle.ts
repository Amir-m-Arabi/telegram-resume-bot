import { PrismaClient } from "@prisma/client";
import { PrismaD1 } from "@prisma/adapter-d1";
import { BotContext } from "../session/session";

export async function prismaMiddleware(
  ctx: BotContext,
  next: () => Promise<void>
) {
  try {
    const adapter = new PrismaD1(ctx.env.DB);
    const prisma = new PrismaClient({ adapter });

    ctx.prisma = prisma;

    await next();
  } catch (error) {
    console.error("Prisma middleware error:", error);
    throw error;
  } finally {
    if (ctx.prisma) {
      await ctx.prisma.$disconnect().catch(console.error);
    }
  }
}
