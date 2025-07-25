import { InlineKeyboard, InputFile } from "grammy";
import { BotContext } from "../../shared/session/session";

export async function resumeHandler(ctx: BotContext) {
  const keyboard = new InlineKeyboard()
    .text("🇮🇷 رزومه فارسی", "resume_fa")
    .text("🇬🇧 English Resume", "resume_en")
    .row()
    .text("بازگشت به لیست", "back_btn");

  await ctx.editMessageText("کدوم نسخه از رزومه رو می‌خوای دانلود کنی؟", {
    reply_markup: keyboard,
  });
}

const FILE_IDS = {
  resume_fa:
    "BQACAgQAAxkBAAOTaIOyttakuTk8KTNrpK2wDn01EiEAAvgXAAI7iCBQDxU_8Hhr_oc2BA",
  resume_en:
    "BQACAgQAAxkBAAOVaIOzBtMLt3PUyIuCAhPSrLNShIcAAvwXAAI7iCBQO98jJxs9sgs2BA",
};

export async function resumeLangHandler(ctx: BotContext) {
  const data = ctx.callbackQuery?.data as "resume_fa" | "resume_en";
  const fileId = FILE_IDS[data];

  if (!fileId) {
    await ctx.answerCallbackQuery("رزومه پیدا نشد 🤷‍♂️");
    return;
  }

  const caption =
    data === "resume_fa" ? "📄 رزومه فارسی من" : "📄 My English Resume";

  await ctx.replyWithDocument(fileId, { caption });
  await ctx.answerCallbackQuery();
}
