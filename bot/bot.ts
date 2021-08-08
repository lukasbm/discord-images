import { Discord, On, Client, ArgsOf } from "@typeit/discord";
import { analyzeImage } from "./analyze";

@Discord()
export class Bot {
  private static _client: Client;

  static start() {
    console.log("start");

    this._client = new Client();
    this._client.login(process.env.DISCORD_TOKEN);
  }

  @On("message")
  public onMessage([message]: ArgsOf<"message">) {
    let channel = message.channel;
    let caption = message.content;
    let authorId = message.author.id;
    let attachments = message.attachments.map((val) => val.url);

    for (let attachment of attachments) {
      analyzeImage(attachment);
    }
  }
}
