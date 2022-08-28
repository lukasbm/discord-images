import "reflect-metadata";

import { IntentsBitField } from "discord.js";
import { ArgsOf, Client, Discord, On } from "discordx";

import { analyzeImage } from "analyze/src/clarifai";

@Discord()
export class Bot {
  private static _client: Client;

  static get Client(): Client {
    return this._client;
  }

  public static async start(): Promise<void> {
    // create bot client
    this._client = new Client({
      intents: [
        IntentsBitField.Flags.Guilds, //servers
        IntentsBitField.Flags.MessageContent, //message content
        IntentsBitField.Flags.GuildMessages, //server messages
      ],
    });

    // Start the bot
    if (!process.env.DISCORD_BOT_TOKEN) {
      throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
    }
    await this.Client.login(process.env.DISCORD_BOT_TOKEN);
  }

  @On()
  messageCreate([message]: ArgsOf<"messageCreate">): void {
    if (!message.attachments || message.attachments.size == 0) return;

    for (let attachment of message.attachments.values()) {
      // TODO check if attachment is an image

      // exclude one-time-view images
      if (attachment.ephemeral) continue;

      const data = {
        attachmentId: attachment.id,
        filename: attachment.name,
        contentType: attachment.contentType,
        url: attachment.url,
        proxyUrl: attachment.proxyURL,
      };
      const analysis = analyzeImage(attachment.url);
      console.log(data, analysis);
    }
  }

  @On()
  ready(): void {
    console.log("Bot started...");
  }
}
