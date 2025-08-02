import { PrismaClient } from "@prisma/client";
import { SessionFlavor, Context } from "grammy";

export type RegisterStep =
  | "idle"
  | "username"
  | "email"
  | "phoneNumber"
  | "gitHubUrl"
  | "linkdinUrl";

export interface ContactForm {
  registerStep: RegisterStep;
  linkStatus: string;
  tempUser: {
    chatId: string;
    username?: string;
    email?: string;
    phoneNumber?: string;
    gitHubUrl?: string | null;
    linkdinUrl?: string | null;
  } | null;
}

export interface CustomContext {
  env: { DB: any };
  prisma: PrismaClient;
}

export type BotContext = Context & SessionFlavor<ContactForm> & CustomContext;

export function initialSession(): ContactForm {
  return {
    linkStatus: "github",
    registerStep: "idle",
    tempUser: null,
  };
}
