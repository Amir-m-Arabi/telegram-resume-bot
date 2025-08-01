import { InlineKeyboard } from "grammy";
import { BotContext } from "../session/session";
export async function startCommand(ctx: BotContext) {
  const keyboard = new InlineKeyboard()
    .text("📄 مشاهده رزومه", "resume_btn")
    .text("🛠 پروژه‌های من", "projects_btn")
    .row()
    .text("💬 تماس با من", "contact_btn")
    .url("🌐 GitHub من", "https://github.com/Amir-m-Arabi");
  await ctx.reply("لطفاً یکی از گزینه‌ها را انتخاب کنید:", {
    reply_markup: keyboard,
  });
}
