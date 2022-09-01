import { ClarifaiStub, grpc } from "clarifai-nodejs-grpc";

if (!process.env.CLARIFAI_API_KEY) {
  throw Error("Could not find CLARIFAI_API_KEY in your environment");
}

const stub = ClarifaiStub.grpc();
const metadata = new grpc.Metadata();
metadata.set("authorization", `Key ${process.env.CLARIFAI_API_KEY}`);

export const analyzeImage = (url) => {
  return new Promise((resolve, reject) => {
    stub.PostModelOutputs(
      {
        // This is the model ID of a publicly available General model. You may use any other public or custom model ID.
        model_id: "aaa03c23b3724a16a56b629203edc62c",
        inputs: [{ data: { image: { url: url } } }],
      },
      metadata,
      (err, response) => {
        if (err) {
          reject("Error: " + err);
        }

        if (response.status.code != 10000) {
          reject(
            "Received failed status: " +
              response.status.description +
              "\n" +
              response.status.details
          );
        }

        const concepts = response.outputs[0].data.concepts;
        resolve(concepts);
      }
    );
  });
};
