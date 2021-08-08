import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js";

@Discord()
export class Bot {
  private static _client: Client;

  static start() {
    this._client = new Client();
    // In the login method, you must specify the glob string to load your classes (for the framework).
    // In this case that's not necessary because the entry point of your application is this file.
    this._client.login(
      process.env.DISCORD_TOKEN,
      `${__dirname}/*Discord.ts` // glob string to load the classes
    );
  }

  @On("message")
  async onMessage(message: Message, client: Client) {
    console.log(message);
  }
}

// Start your app
Bot.start();
