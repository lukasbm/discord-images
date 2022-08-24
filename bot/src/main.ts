import "reflect-metadata";

import { IntentsBitField } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";

@Discord()
class BotAction {
  @On()
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    let caption = message.content;
    let authorId = message.author.id;
    let attachments = message.attachments.map((val) => val.url);

    console.log(`${authorId} - ${caption} : ${[attachments]}`);

    for (let attachment of attachments) {
      console.log(attachment);
    }
  }

  @On()
  ready(): void {
    console.log("Bot started...");
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

// Start the bot
if (!process.env.BOT_TOKEN) {
  throw Error("Could not find BOT_TOKEN in your environment");
}

bot.login(process.env.BOT_TOKEN);
