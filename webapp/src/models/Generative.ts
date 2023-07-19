import { HuggingFaceInference } from "langchain/llms/hf";
import {apiToken} from "../utils/StringConstants";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import {createLargeContextForQuestion} from "../api/QuestionAnswerApi";
import {Exchange} from "../screens/Edit";
import {I_DONT_KNOW} from "./Chat";

import { RetrievalQAChain, loadQAStuffChain } from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import { LLamaEmbeddings } from "llama-node/dist/extensions/langchain.js";
import { LLama } from "llama-node";
import { LLamaCpp, LoadConfig } from "llama-node/dist/llm/llama-cpp.js";
import {
  BLOOM,
  DISTIL_GPT2, GOOGLE_FLAN_T5_BASE, GPT2, OPEN_LLAMA_3B,
  PARAPHRASE_MINILM,
  PARAPHRASE_MINILM_MULTILINGUAL,
  SUMMARIZATION_FB_BART_LARGE_CNN, TEMP_MODEL
} from "../utils/Urls";


// const llama = new LLama(LLamaCpp);
//
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 10,
});

const model = new HuggingFaceInference({
  model: GPT2,
  apiKey: apiToken,
  temperature: 0.5,
  maxTokens: 250,
  frequencyPenalty: 2
});

const memory = new BufferMemory();
// const chain = new ConversationChain({ llm: model, memory: memory });


export const prepBot = async (exchanges: Array<Exchange>, question: string) => {
  let context = await createLargeContextForQuestion(exchanges);
  context += "Now imagine I was a student and I am about to ask you a question.";
  const docOutput = await splitter.splitDocuments([
    new Document({ pageContent: context }),
  ]);
  const vectorStore = await MemoryVectorStore.fromDocuments(docOutput, new HuggingFaceInferenceEmbeddings({
    model: GPT2,
    apiKey: apiToken,
  }));
  const chain = loadQAStuffChain(model);
  //
  // const chain = new RetrievalQAChain({
  //   combineDocumentsChain: loadQAStuffChain(model),
  //   retriever: vectorStore.asRetriever(),
  //   returnSourceDocuments: true,
  // });
  const similarDocs = await vectorStore.similaritySearch(question);
  console.log(similarDocs);
  const res = await chain.call({ input_documents: similarDocs, question: question, returnFullText: false });
  console.log(res);
  return res.text;
  //
  // console.log(res);
  // return I_DONT_KNOW;
}

// export const chatWithBot = async (message: string) => {
//   try {
//     const { response } = await chain.call({ input: message });
//     console.log(response);
//     return response;
//   } catch (e) {
//     console.error(e);
//     return I_DONT_KNOW;
//   }
// }