import "reflect-metadata";
import { Client, IntentsBitField } from "discord.js";
import { analyzeImage } from "analyze/src/clarifai.js";
import { firestore } from "./firebase";

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
    // check if attachment is an image
    if (!attachment.contentType || !attachment.contentType.startsWith("image"))
      continue;

    // exclude one-time-view images
    if (attachment.ephemeral) continue;

    // extract useful data
    const data = {
      attachmentId: attachment.id,
      filename: attachment.name,
      contentType: attachment.contentType,
      url: attachment.url,
      proxyUrl: attachment.proxyURL,
    };

    // run AI analysis
    analyzeImage(attachment.url)
      .then((analysis) => console.log(analysis))
      .catch((err) => console.error(err));

    // TODO store results
    // firestore.runTransaction(transaction => {
    //   const documentRef = firestore.doc("images");
    // });
  }
});

// Start the bot
if (!process.env.DISCORD_BOT_TOKEN) {
  throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
}
client.login(process.env.DISCORD_BOT_TOKEN);
