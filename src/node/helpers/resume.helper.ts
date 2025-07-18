import { Context, InlineKeyboard, InputFile } from "grammy";

export async function resumeHandler(ctx: Context) {
  const keyboard = new InlineKeyboard()
    .text("🇮🇷 رزومه فارسی", "resume_fa")
    .text("🇬🇧 English Resume", "resume_en");

  await ctx.editMessageText("کدوم نسخه از رزومه رو می‌خوای دانلود کنی؟", {
    reply_markup: keyboard,
  });
}

const FILE_IDS = {
  resume_fa:
    "BQACAgQAAxkBAANKaHoe3nA8PU-aiQno-U849LMhcFgAAlccAAKII9BTDB1v79Hc4Lc2BA",
  resume_en:
    "BQACAgQAAxkBAAM9aHodp7hGQZLwrk_eWodmn-PSzWsAAukXAAKII8hT4KxgITVxw9Q2BA",
};

export async function resumeLangHandler(ctx: Context) {
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
