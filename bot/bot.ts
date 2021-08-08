import { Discord, On, Client } from "@typeit/discord";
import { Message } from "discord.js";

@Discord()
export class Bot {
  private static _client: Client;

  static start() {
    console.log("start");

    this._client = new Client();
    this._client.login(
      process.env.DISCORD_TOKEN,
      `${__dirname}/*Discord.ts` // glob string to load the classes
    );
    this._client.login(process.env.DISCORD_TOKEN);
  }

  // @On("message")
  // async onMessage(message: Message, client: Client) {
  //   console.log(message);
  // }
}
