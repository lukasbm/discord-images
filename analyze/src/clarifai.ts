import { grpc } from "clarifai-nodejs-grpc";
import service from "clarifai-nodejs-grpc/proto/clarifai/api/service_pb";
import resources from "clarifai-nodejs-grpc/proto/clarifai/api/resources_pb";
import { StatusCode } from "clarifai-nodejs-grpc/proto/clarifai/api/status/status_code_pb";
import { V2Client } from "clarifai-nodejs-grpc/proto/clarifai/api/service_grpc_pb";
import { Analyze, ImageAnalysis } from "./analyze";

export class Clarifai implements Analyze {
  private _metadata: grpc.Metadata;
  private _client: V2Client;

  get Metadata(): grpc.Metadata {
    return this._metadata;
  }

  get Client(): V2Client {
    return this._client;
  }

  constructor() {
    if (!process.env.CLARIFAI_API_KEY) {
      throw Error("Could not find CLARIFAI_API_KEY in your environment");
    }

    this._client = new V2Client(
      "api.clarifai.com",
      grpc.ChannelCredentials.createSsl()
    );
    this._metadata = new grpc.Metadata();
    this.Metadata.set("authorization", process.env.CLARIFAI_API_KEY);
  }

  analyzeImage(url: string): ImageAnalysis {
    return [{ confidence: 1, label: "lul" }];
  }
}

// const analyzeImage = (url: string): Array<resources.Concept> => {
//   const request = new service.PostModelOutputsRequest();
//   // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
//   request.setModelId("aaa03c23b3724a16a56b629203edc62c");
//   request.addInputs(
//     new resources.Input().setData(
//       new resources.Data().setImage(new resources.Image().setUrl(url))
//     )
//   );

//   clarifai.postModelOutputs(request, metadata, (error, response) => {
//     if (error) {
//       throw error;
//     }

//     if (response.getStatus().getCode() !== StatusCode.SUCCESS) {
//       throw "Clarifai Error: " + response.getStatus();
//     }

//     return response.getOutputsList()[0].getData().getConceptsList();
//   });

//   return null;
// };
