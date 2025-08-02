import { InlineKeyboard } from "grammy";
import { BotContext } from "../session/session";
import { PrismaClient } from "@prisma/client";

export const nextKeyboard = new InlineKeyboard()
  .text("بعدی", "next_btn")
  .text("لغو ثبت نام", "canselRegister_btn");

export const canselKeyboard = new InlineKeyboard().text(
  "لغو ثبت نام",
  "canselRegister_btn"
);
export async function freelancerHandler(ctx: BotContext) {
  const chatId = ctx.from?.id.toString();
  if (!chatId) {
    await ctx.reply("خطا: نمی‌تونم اطلاعات کاربر رو پیدا کنم.");
    return;
  }
  const prisma = ctx.prisma;
  console.log(prisma);

  const user = await prisma.user.findFirst({
    where: { chatId },
    include: {
      profile: true,
      fileManagement: true,
    },
  });

  if (user) {
    const profile = user.profile;
    const file = user.fileManagement[0];
    const message = `
👤 نام کاربری: ${user.username}
📧 ایمیل: ${user.email}
📱 شماره تماس: ${user.phoneNumber}
🌐 GitHub: ${user.gitHubUrl || "ندارد"}
🌐 LinkedIn: ${user.linkdinUrl || "ندارد"}
💻 مهارت‌ها: ${
      profile?.skills
        ? JSON.parse(profile.skills)
            .map((skill: string) => skill)
            .join(", ")
        : "ندارد"
    }
🏙 شهر: ${profile?.city || "ندارد"}
💼 نوع همکاری: ${profile?.workType || "ندارد"}
📅 سال‌های تجربه: ${profile?.experienceYears || "ندارد"}
📝 بیو: ${profile?.bio || "ندارد"}
`;

    const keyboard = new InlineKeyboard()
      .text("ویرایش نام کاربری", "edit_username")
      .text("ویرایش ایمیل", "edit_email")
      .row()
      .text("ویرایش مهارت‌ها", "edit_skills")
      .text("ویرایش بیو", "edit_bio")
      .row()
      .text("آپلود/تغییر رزومه", "upload_resume")
      .text("ویرایش لینک‌ها", "edit_links")
      .row()
      .text("بازگشت", "back_btn");

    await ctx.reply(
      `اطلاعات شما:\n${message}\n\nچه چیزی رو می‌خوای تغییر بدی؟`,
      {
        reply_markup: keyboard,
      }
    );
  } else {
    const keyboard = new InlineKeyboard()
      .text("شروع ثبت‌نام", "start_register")
      .text("بازگشت", "back_btn");

    await ctx.reply("شما هنوز ثبت‌نام نکردید! برای ساخت رزومه، ثبت‌نام کنید:", {
      reply_markup: keyboard,
    });
  }

  await ctx.answerCallbackQuery();
}

async function saveUserAndRespond(ctx: BotContext) {
  if (
    !ctx.session.tempUser ||
    !ctx.session.tempUser.username ||
    !ctx.session.tempUser.email ||
    !ctx.session.tempUser.phoneNumber
  ) {
    await ctx.reply("خطا: اطلاعات ناقص است. لطفاً دوباره ثبت‌نام کنید.", {
      reply_markup: canselKeyboard,
    });
    ctx.session.registerStep = "idle";
    ctx.session.tempUser = null;
    return false;
  }

  try {
    await ctx.prisma.user.create({
      data: {
        chatId: ctx.session.tempUser.chatId,
        username: ctx.session.tempUser.username,
        email: ctx.session.tempUser.email,
        phoneNumber: ctx.session.tempUser.phoneNumber,
        gitHubUrl: ctx.session.tempUser.gitHubUrl,
        linkdinUrl: ctx.session.tempUser.linkdinUrl,
      },
    });

    ctx.session.registerStep = "idle";
    ctx.session.tempUser = null;

    const keyboard = new InlineKeyboard()
      .text("تکمیل پروفایل", "complete_profile")
      .text("بازگشت", "back_btn");

    await ctx.reply(
      "ثبت‌نام با موفقیت انجام شد! 🎉 حالا می‌تونید پروفایلتون رو تکمیل کنید:",
      { reply_markup: keyboard }
    );
    return true;
  } catch (error) {
    console.error("Error saving user:", error);
    await ctx.reply("خطایی رخ داد! لطفاً دوباره تلاش کنید.");
    return false;
  }
}

export async function startRegisterHandler(ctx: BotContext) {
  if (!ctx.from?.id) {
    await ctx.reply("خطا: نمی‌تونم اطلاعات کاربر رو پیدا کنم.");
    return;
  }

  const existingUser = await ctx.prisma.user.findFirst({
    where: { chatId: ctx.from.id.toString() },
  });

  if (existingUser) {
    await ctx.reply(
      "شما قبلاً ثبت‌نام کردید! می‌تونید پروفایلتون رو ویرایش کنید."
    );
    return;
  }

  const canselKeyboard = new InlineKeyboard().text(
    "لغو ثبت نام",
    "canselRegister_btn"
  );

  ctx.session.registerStep = "username";
  ctx.session.tempUser = { chatId: ctx.from.id.toString() };
  await ctx.reply("لطفاً نام کاربری خودتون رو وارد کنید:", {
    reply_markup: canselKeyboard,
  });
  await ctx.answerCallbackQuery();
}

export async function handleRegisterMessages(ctx: BotContext) {
  const step = ctx.session.registerStep;
  if (!step || !ctx.session.tempUser) return;

  const prisma = ctx.prisma;
  const text = ctx.message?.text?.trim();

  if (!text) {
    await ctx.reply("لطفاً یک متن معتبر وارد کنید.", {
      reply_markup: canselKeyboard,
    });
    return;
  }

  switch (step) {
    case "username":
      ctx.session.tempUser.username = text;
      ctx.session.registerStep = "email";
      await ctx.reply("لطفاً ایمیل خودتون رو وارد کنید:", {
        reply_markup: canselKeyboard,
      });
      break;

    case "email":
      if (!text.includes("@")) {
        await ctx.reply("ایمیل نامعتبره! لطفاً دوباره وارد کنید:", {
          reply_markup: canselKeyboard,
        });
        return;
      }
      const emailExists = await prisma.user.findFirst({
        where: { email: text },
      });
      if (emailExists) {
        await ctx.reply(
          "این ایمیل قبلاً ثبت شده! لطفاً ایمیل دیگه‌ای وارد کنید:",
          { reply_markup: canselKeyboard }
        );
        return;
      }
      ctx.session.tempUser.email = text;
      ctx.session.registerStep = "phoneNumber";
      await ctx.reply("لطفاً شماره تماس خودتون رو وارد کنید:", {
        reply_markup: canselKeyboard,
      });
      break;

    case "phoneNumber":
      if (!/^\d{10,}$/.test(text)) {
        await ctx.reply(
          "شماره تماس نامعتبره! لطفاً یک شماره معتبر وارد کنید:",
          { reply_markup: canselKeyboard }
        );
        return;
      }
      ctx.session.tempUser.phoneNumber = text;
      ctx.session.registerStep = "gitHubUrl";
      await ctx.reply("لطفاً لینک GitHub خودتون رو وارد کنید :", {
        reply_markup: nextKeyboard,
      });
      break;

    case "gitHubUrl":
      ctx.session.tempUser.gitHubUrl = !text.startsWith("https://github.com")
        ? null
        : text;
      ctx.session.registerStep = "linkdinUrl";
      await ctx.reply("لطفاً لینک LinkedIn خودتون رو وارد کنید :", {
        reply_markup: nextKeyboard,
      });
      break;

    case "linkdinUrl":
      ctx.session.tempUser!.linkdinUrl = !text.startsWith(
        "https://www.linkedin.com"
      )
        ? null
        : text;

      await saveUserAndRespond(ctx);
      break;
  }
}

export async function cancelRegisterHandler(ctx: BotContext) {
  ctx.session.registerStep = "idle";
  ctx.session.linkStatus = "github";
  ctx.session.tempUser = null;
  await ctx.reply("ثبت‌نام لغو شد.");
  await ctx.answerCallbackQuery();
  return freelancerHandler(ctx);
}

export async function userLinksHandler(ctx: BotContext) {
  if (!ctx.session.tempUser) return;
  const status = ctx.session.linkStatus;
  switch (status) {
    case "github":
      ctx.session.tempUser.gitHubUrl = null;
      ctx.session.linkStatus = "linkdin";
      ctx.session.registerStep = "linkdinUrl";
      await ctx.reply("لطفاً لینک LinkedIn خودتون رو وارد کنید :", {
        reply_markup: nextKeyboard,
      });
      break;
    case "linkdin":
      ctx.session.tempUser.linkdinUrl = null;
      ctx.session.linkStatus = "";

      await saveUserAndRespond(ctx);
      break;
    default:
      await ctx.answerCallbackQuery("دکمه نامعتبر بود.");
  }
}
