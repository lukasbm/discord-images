import "reflect-metadata";

import { IntentsBitField } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
class MessageHandler {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    console.log(message.content);
  }
}

// create bot client
export const bot = new Client({
  intents: [
    IntentsBitField.Flags.MessageContent, // messages
    IntentsBitField.Flags.Guilds, // channels
    IntentsBitField.Flags.GuildMessages, // channel messages
  ],
});

bot.on("ready", () => {
  console.log("Bot started...");
});

// Start the bot
if (!process.env.BOT_TOKEN) {
  throw Error("Could not find BOT_TOKEN in your environment");
}

bot.login(process.env.BOT_TOKEN);
