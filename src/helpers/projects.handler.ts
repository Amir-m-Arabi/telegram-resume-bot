import { Context, InlineKeyboard } from "grammy";
import { fetchGithubRepos } from "../services/github.service";

const GITHUB_USERNAME = "Amir-m-Arabi";

export async function projectsHandler(ctx: Context) {
  try {
    const repos = await fetchGithubRepos(GITHUB_USERNAME);

    const keyboard = new InlineKeyboard();

    for (const repo of repos) {
      keyboard.text(repo.name, `repo_${repo.name}`).row();
    }

    await ctx.reply("✅ پروژه‌های من از GitHub:", {
      reply_markup: keyboard,
    });
  } catch (err) {
    console.error("GitHub fetch error:", err);
    await ctx.reply("❌ خطا در دریافت پروژه‌ها از GitHub");
  }
}

export async function projectLinkHandler(ctx: Context) {
  const data = ctx.callbackQuery?.data;

  if (!data?.startsWith("repo_")) return;

  const repoName = data.replace("repo_", "");

  try {
    const repos = await fetchGithubRepos(GITHUB_USERNAME);
    const repo = repos.find((r: any) => r.name === repoName);

    if (repo) {
      await ctx.answerCallbackQuery();
      await ctx.reply(`🔗 لینک پروژه:\n${repo.url}`);
    } else {
      await ctx.answerCallbackQuery("❌ پروژه پیدا نشد");
    }
  } catch (err) {
    console.error("Project link error:", err);
    await ctx.reply("❌ خطا در دریافت لینک پروژه");
  }
}
