import "reflect-metadata";
import { Client, IntentsBitField } from "discord.js";
import { analyzeImage } from "analyze";

let client;

export async function start(token) {
  // create bot client
  client = new Client({
    intents: [
      IntentsBitField.Flags.Guilds, //servers
      IntentsBitField.Flags.MessageContent, //message content
      IntentsBitField.Flags.GuildMessages, //server messages
    ],
  });

  // Start the bot
  await this.Client.login(token);
}

client.once("ready", () => {
  console.log("Bot started...");
});

client.on("messageCreate", (message) => {
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
});
