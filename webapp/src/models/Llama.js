// import { LLM } from "llama-node";
// import { LLamaCpp } from "llama-node/";
//
// import { HuggingFaceInference } from "langchain/llms/hf";
// import {apiToken} from "../utils/StringConstants";
//
// const model = new HuggingFaceInference({
//   model: "google/flan-t5-large",
//   apiKey: apiToken, // In Node.js defaults to process.env.HUGGINGFACEHUB_API_KEY
// });
// const llama = new LLM(LLamaCpp);
// const config = {
//   modelPath: model,
//   enableLogging: true,
//   nCtx: 1024,
//   seed: 0,
//   f16Kv: false,
//   logitsAll: false,
//   vocabOnly: false,
//   useMlock: false,
//   embedding: false,
//   useMmap: true,
//   nGpuLayers: 0
// };
//
// const template = `How are you?`;
// const prompt = `A chat between a user and an assistant.
// USER: ${template}
// ASSISTANT:`;
//
// const run = async () => {
//   await llama.load(config);
//
//   await llama.createCompletion({
//     nThreads: 4,
//     nTokPredict: 2048,
//     topK: 40,
//     topP: 0.1,
//     temp: 0.2,
//     repeatPenalty: 1,
//     prompt,
//   }, (response) => {
//     process.stdout.write(response.token);
//   });
// }
//
// (async () => {
//   await run();
// })();

export {};