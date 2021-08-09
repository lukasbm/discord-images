import { Discord, On, Client, ArgsOf } from "@typeit/discord";
import { Concept } from "clarifai-nodejs-grpc/proto/clarifai/api/resources_pb";
import { analyzeImage } from "./analyze";
import { Image, Label } from "./models";

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
    let labels: Array<Concept>;

    for (let attachment of attachments) {
      // analyze images
      try {
        labels = analyzeImage(attachment);
      } catch (error) {
        console.error(error);
      }
      // save results
      const img = new Image();
      img.url = attachment;
      img.authorId = authorId;
      img.caption = caption;
      img.save();
      for (let label of labels) {
        const lab = new Label();
        lab.confidence = label.getValue();
        lab.label = label.getName();
        lab.image = img;
        lab.save();
      }
    }
  }
}
