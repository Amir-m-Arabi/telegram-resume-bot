import { InlineKeyboard } from "grammy";
import { BotContext } from "../session/session";
export async function startCommand(ctx: BotContext) {
  const keyboard = new InlineKeyboard()
    .text("فریلنسر", "freelancer_btn")
    .text("کارفرما", "employer_btn");
  await ctx.reply("لطفاً عنوان خودتون رو انتخاب کنید:", {
    reply_markup: keyboard,
  });
}
