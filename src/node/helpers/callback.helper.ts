import { BotContext } from "../../shared/session/session";
import { resumeHandler, resumeLangHandler } from "./resume.helper";
import { projectsHandler, projectLinkHandler } from "./projects.handler";
import { contactCommand } from "../../shared/commands/contact.command";
export async function onCallbackQuery(ctx: BotContext) {
  const data = ctx.callbackQuery?.data;

  if (!data) return;

  switch (true) {
    case data === "resume_btn":
      return resumeHandler(ctx);

    case data === "resume_fa" || data === "resume_en":
      return resumeLangHandler(ctx);

    case data === "projects_btn":
      return projectsHandler(ctx);

    case data.startsWith("repo_"):
      return projectLinkHandler(ctx);

    case data === "contact_btn":
      return contactCommand(ctx);
    default:
      await ctx.answerCallbackQuery("دکمه نامعتبر بود.");
  }
}
