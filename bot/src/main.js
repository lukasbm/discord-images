import { Bot } from "./bot.js";

if (!process.env.DISCORD_BOT_TOKEN) {
  throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
}

Bot.start(process.env.DISCORD_BOT_TOKEN);
