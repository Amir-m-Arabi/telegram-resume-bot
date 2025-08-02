import { BotContext } from "../session/session";
import { projectsHandler, projectLinkHandler } from "./projects.handler";
import { startCommand } from "../commands/start.command";
import {
  cancelRegisterHandler,
  freelancerHandler,
  startRegisterHandler,
  userLinksHandler,
} from "../controller/freelancer.controller";
export async function onCallbackQuery(ctx: BotContext) {
  const data = ctx.callbackQuery?.data;

  if (!data) return;

  switch (true) {
    case data === "freelancer_btn":
      return freelancerHandler(ctx);

    case data === "employer_btn":
      return projectsHandler(ctx);

    case data === "start_register":
      return startRegisterHandler(ctx);

    case data === "canselRegister_btn":
      return cancelRegisterHandler(ctx);

    case data === "next_btn":
      return userLinksHandler(ctx);

    case data === "back_btn":
      return startCommand(ctx);

    default:
      await ctx.answerCallbackQuery("دکمه نامعتبر بود.");
  }
}
