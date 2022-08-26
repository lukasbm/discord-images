import { grpc } from "clarifai-nodejs-grpc";
// import service from "clarifai-nodejs-grpc/proto/clarifai/api/service_pb";
// import resources from "clarifai-nodejs-grpc/proto/clarifai/api/resources_pb";
// import { StatusCode } from "clarifai-nodejs-grpc/proto/clarifai/api/status/status_code_pb";
import { V2Client } from "clarifai-nodejs-grpc/proto/clarifai/api/service_grpc_pb";
import { AnalyzeImage, ImageAnalysis } from "./analyze";

if (!process.env.CLARIFAI_API_KEY) {
  throw Error("Could not find CLARIFAI_API_KEY in your environment");
}

const client = new V2Client(
  "api.clarifai.com",
  grpc.ChannelCredentials.createSsl()
);
const metadata = new grpc.Metadata();
metadata.set("authorization", process.env.CLARIFAI_API_KEY);

export const analyzeImage: AnalyzeImage = (url: string): ImageAnalysis => {
  return [{ confidence: 1, label: "lul" }];
};

// export const analyzeImage = (url: string): Array<resources.Concept> => {
//   const request = new service.PostModelOutputsRequest();
//   // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
//   request.setModelId("aaa03c23b3724a16a56b629203edc62c");
//   request.addInputs(
//     new resources.Input().setData(
//       new resources.Data().setImage(new resources.Image().setUrl(url))
//     )
//   );
//
//   clarifai.postModelOutputs(request, metadata, (error, response) => {
//     if (error) {
//       throw error;
//     }
//
//     if (response.getStatus().getCode() !== StatusCode.SUCCESS) {
//       throw "Clarifai Error: " + response.getStatus();
//     }
//
//     return response.getOutputsList()[0].getData().getConceptsList();
//   });
//
//   return null;
// };
