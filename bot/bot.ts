import { Discord, On, Client, ArgsOf } from "@typeit/discord";

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
    let caption = message.content;
    let authorId = message.author.id;
    let attachments = message.attachments.map((val) => val.url);

    console.log(`${authorId} - ${caption} : ${[attachments]}`);

    for (let attachment of attachments) {
      // analyze image
    }
  }
}
