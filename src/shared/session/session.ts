import { SessionFlavor } from "grammy";
import { Context } from "grammy";

export interface ContactForm {
  step: "idle" | "awaiting_name" | "awaiting_email";
  name?: string;
  email?: string;
}

export type BotContext = Context & SessionFlavor<ContactForm>;

export function initialSession(): ContactForm {
  return {
    step: "idle",
  };
}
