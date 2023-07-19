//
// import { VectorDBQAChain } from "langchain/chains";
// import { HNSWLib } from "langchain/vectorstores/hnswlib";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// import {apiToken} from "../utils/StringConstants";
// import {HuggingFaceInferenceEmbeddings} from "langchain/dist/embeddings/hf";
// import {HuggingFaceInference} from "langchain/llms/hf";
//
// export const respondWithLangchain = async (question: string, context: string) => {
//   const model = new HuggingFaceInference({
//     model: "bigscience/bloom",
//     apiKey: apiToken
//   });
//
//   const huggingfaceEmbeddings = new HuggingFaceInferenceEmbeddings({
//     model: "bigscience/bloom",
//     apiKey: apiToken
//   })
//
//   const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000 });
//   const docs = await textSplitter.createDocuments([context]);
//
//   const vectorStore = await HNSWLib.fromDocuments(docs, huggingfaceEmbeddings);
//
//   const chain = VectorDBQAChain.fromLLM(model, vectorStore);
//
//   const res = await chain.call({
//     input_documents: docs,
//     query: question,
//   });
//
//   console.log(res);
//   return res;
// }
//
// (async () => {
//   await respondWithLangchain("How is this class graded?", "CS673 is a software engineering course.  It is taught by Alex Elkuntah.  ` Students have a lot of questions for Alex within the class.  Suppose a student asks Alex if BU was better than BC, then Alex would respond by saying 'of course bu is better than bc'.  Now if a student asks: 'Is BU better than most universities?' Alex would respond by saying:")
// })();

export {};