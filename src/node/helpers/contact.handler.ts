import { BotContext } from "../../shared/session/session";

export async function contactFormHandler(ctx: BotContext) {
  const text = ctx.message?.text;

  console.log("aaa",ctx.session.step);

  if (!text) return;

  switch (ctx.session.step) {
    case "awaiting_name":
      ctx.session.name = text;
      ctx.session.step = "awaiting_email";
      await ctx.reply("📧 لطفاً ایمیل خود را وارد کنید:");
      break;

    case "awaiting_email":
      ctx.session.email = text;
      ctx.session.step = "idle";
      await ctx.reply(
        `✅ اطلاعات ثبت شد:\n\n👤 نام: ${ctx.session.name}\n📧 ایمیل: ${ctx.session.email}`
      );
      break;
  }
}
