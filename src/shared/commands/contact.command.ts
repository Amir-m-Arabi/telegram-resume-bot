import { BotContext } from "../session/session";

export async function contactCommand(ctx: BotContext) {
  ctx.session.step = "awaiting_name";
  ctx.session.name = undefined;
  ctx.session.email = undefined;

  console.log("bbb", ctx.session.step);

  await ctx.reply("👤 لطفاً نام خود را وارد کنید:");
}
