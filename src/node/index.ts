import { Bot, session } from "grammy";
import { config } from "./config";
import { startCommand } from "../shared/commands/start.command";
import { initialSession, BotContext } from "../shared/session/session";
const bot = new Bot<BotContext>(config.BOT_TOKEN);

bot.command("/start", startCommand);

bot.use(session({ initial: initialSession }));

bot.start();
console.log("🤖 Bot is running with /start, /help, /about commands");
