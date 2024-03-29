import "reflect-metadata";
import { Client, IntentsBitField } from "discord.js";
import { analyzeImage } from "./clarifai.js";
import { firestore } from "./firebase.js";
import { FieldValue } from "firebase-admin/firestore";

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

client.on("messageCreate", async (message) => {
  if (!message.attachments || message.attachments.size == 0) return;

  for (let attachment of message.attachments.values()) {
    // check if attachment is an image
    if (!attachment.contentType || !attachment.contentType.startsWith("image"))
      continue;

    // exclude one-time-view images
    if (attachment.ephemeral) continue;

    // extract useful data
    let data = {
      // general message data
      messageId: message.id,
      channelId: message.channelId,
      guildId: message.guildId,
      author: message.author.id,
      content: message.cleanContent,
      time: message.createdTimestamp,
      messageUrl: message.url,
      // attachment data
      attachmentId: attachment.id,
      filename: attachment.name,
      contentType: attachment.contentType,
      url: attachment.url,
      proxyUrl: attachment.proxyURL,
      altText: attachment.description,
      height: attachment.height,
      width: attachment.width,
      filesize: attachment.size,
    };

    // run AI analysis
    try {
      const analysis = await analyzeImage(attachment.url);
      data = { ...data, labels: analysis };
      console.log(data);
    } catch (err) {
      console.error(err);
    }

    // store results
    try {
      await firestore.collection("pictures").add(data);
      console.log("uploaded data for attachment", attachment.id);
    } catch (err) {
      console.error(err);
    }

    // update stats
    try {
      const stats = await firestore.collection("statistics").doc("labels");
      let val = {};
      data.labels.forEach((x) => {
        val[x] = FieldValue.increment(1);
      });
      await stats.set(val, { merge: true });
      console.log("updated statistics for attachment", attachment.id);
    } catch (err) {
      console.error(err);
    }
  }
});

// Start the bot
if (!process.env.DISCORD_BOT_TOKEN) {
  throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
}
client.login(process.env.DISCORD_BOT_TOKEN);
