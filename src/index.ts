import { Bot } from "grammy";
import { session } from "grammy";
import { Update } from "grammy/types";
import { BotContext, initialSession } from "./session/session";
import { prismaMiddleware } from "./middleware/prismaMiddle";
import { startCommand } from "./commands/start.command";
import { onCallbackQuery } from "./helpers/callback.helper";
import { handleRegisterMessages } from "./controller/freelancer.controller";
import { cloudflareKVStorage } from "./session/kv-session-adapter";

export interface Env {
  BOT_TOKEN: string;
  ADMIN_ID: string;
  SESSIONS: KVNamespace;
  DB: D1Database;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "POST") {
      return new Response("Nothing here", { status: 404 });
    }

    const bot = new Bot<BotContext>(env.BOT_TOKEN);

    bot.use(
      session({
        initial: initialSession,
        storage: cloudflareKVStorage(env.SESSIONS),
      })
    );

    bot.use(async (ctx: any, next: any) => {
      ctx.env = env;
      await prismaMiddleware(ctx, next);
    });

    bot.command("start", startCommand);
    bot.on("callback_query:data", onCallbackQuery);
    bot.on("message:text", handleRegisterMessages);

    bot.command("resetme", async (ctx) => {
      ctx.session = initialSession(); // بازنشانی به حالت اولیه
      await ctx.reply("Session شما ریست شد!");
    });

    await bot.init();

    try {
      const update = (await request.json()) as Update;
      await bot.handleUpdate(update);
      return new Response("OK");
    } catch (error) {
      console.error("Error in webhook:", error);
      return new Response("Error processing webhook", { status: 500 });
    }
  },
};
