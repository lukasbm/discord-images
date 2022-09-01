import "reflect-metadata";
import { Client, IntentsBitField } from "discord.js";
import { analyzeImage } from "analyze/src/clarifai.js";

let client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds, //servers
    IntentsBitField.Flags.MessageContent, //message content
    IntentsBitField.Flags.GuildMessages, //server messages
  ],
});

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

// Start the bot
if (!process.env.DISCORD_BOT_TOKEN) {
  throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
}
client.login(process.env.DISCORD_BOT_TOKEN);
