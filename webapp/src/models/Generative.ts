import { HuggingFaceInference } from "langchain/llms/hf";
import {apiToken} from "../utils/StringConstants";
import {createLargeContextForQuestion} from "../api/QuestionAnswerApi";
import {Exchange} from "../screens/Edit";

import { loadQAStuffChain} from "langchain/chains";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { Document } from "langchain/document";
import { HuggingFaceInferenceEmbeddings } from "langchain/embeddings/hf";
import {getOpenAIUrl, OPEN_AI} from "../utils/Urls";
import axios from "axios";
import {I_DONT_KNOW} from "./Chat";

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 200,
  chunkOverlap: 10,
});

const qBotGenerationApiResponse = async (question: string) => {
  try {
    const res = await axios({
      timeout: 300000,
      url: getOpenAIUrl(),
      method: "POST",
      data: {
        message: "What are student's common conclusion about this course?",
        session_id: "4wg6a6g16w16aws246au3a5" // TODO: add current session_id
      }
    });
    return res.data;
  } catch (err) {
    console.log("Backend is down or questions API returned an exception: " + err)
    return { content: I_DONT_KNOW };
  }
}

export const prepBot = async (exchanges: Array<Exchange>, question: string, generativeModel: string) => {
  const model = new HuggingFaceInference({
    model: generativeModel,
    apiKey: apiToken,
    temperature: 0.5,
    maxTokens: 250,
    frequencyPenalty: 2
  });

  if (generativeModel === OPEN_AI) {
    const { content } = await qBotGenerationApiResponse(question);
    return content;
  } else {

    let context = await createLargeContextForQuestion(exchanges);
    context += "Now imagine I was a student and I am about to ask you a question.";
    const docOutput = await splitter.splitDocuments([
      new Document({pageContent: context}),
    ]);
    const vectorStore = await MemoryVectorStore.fromDocuments(docOutput, new HuggingFaceInferenceEmbeddings({
      model: generativeModel,
      apiKey: apiToken,
    }));
    const chain = loadQAStuffChain(model);
    const similarDocs = await vectorStore.similaritySearch(question);
    const res = await chain.call({input_documents: similarDocs, question: question, returnFullText: false});
    return res.text;
  }
}