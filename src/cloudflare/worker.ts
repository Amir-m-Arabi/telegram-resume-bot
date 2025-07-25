import { Bot } from "grammy";
import { session } from "grammy";
import { Update } from "grammy/types";
import { BotContext, initialSession } from "../shared/session/session";

import { startCommand } from "../shared/commands/start.command";
import { onCallbackQuery } from "../node/helpers/callback.helper";
import { contactFormHandler } from "../node/helpers/contact.handler";
import { cloudflareKVStorage } from "../shared/session/kv-session-adapter";

export interface Env {
  BOT_TOKEN: string;
  ADMIN_ID: string;
  SESSIONS: KVNamespace;
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

    function createContactHandler(adminId: string) {
      return async (ctx: BotContext) => {
        await contactFormHandler(ctx, adminId);
      };
    }
    bot.command("start", startCommand);
    bot.on("callback_query:data", onCallbackQuery);
    bot.on("message:text", createContactHandler(env.ADMIN_ID));

    await bot.init();

    const update = (await request.json()) as Update;
    await bot.handleUpdate(update);

    return new Response("OK");
  },
};
