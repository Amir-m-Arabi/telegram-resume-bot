import { Context, InlineKeyboard } from "grammy";


export async function startCommand(ctx: Context) {
  const keyboard = new InlineKeyboard()
    .text("📄 مشاهده رزومه", "resume_btn")
    .text("🛠 پروژه‌های من", "projects_btn")
    .row()
    .text("💬 تماس با من", "contact_btn")
    .url("🌐 GitHub من", "https://github.com/Amir-m-Arabi");
  await ctx.reply(
    `سلام! 👋  
من ربات معرفی رزومه و پروژه‌های امیر محمد عربی هستم.  
با دکمه‌های زیر، اطلاعات بیشتری ببین.
`,
    {
      reply_markup: keyboard,
    }
  );
}
