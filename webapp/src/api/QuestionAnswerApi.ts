import axios from 'axios';
import {Exchange} from "../screens/Edit";
import * as qna from "@tensorflow-models/qna"
import {apiToken, APPLICATION_JSON} from "../utils/StringConstants";
import {getAllQnAUrl, loginUrl, SEMANTIC_SIMILARITY_URL, updateQuestionsUrl} from "../utils/Urls";
import {ExcelJson} from "../utils/ExcelUtils";

export const getAllQnA = async () => {
  try {
    const res = await axios({
      timeout: 300000,
      url: getAllQnAUrl(),
      method: "GET"
    });

    return res.data;
  } catch (err) {
    console.log("Backend is down or questions API returned an exception: " + err)
    return { exchanges: [] };
  }
}

export const updateQuestions = async (jsonData: ExcelJson) => {
  const res = await axios({
    timeout: 300000,
    url: updateQuestionsUrl(),
    method: "POST",
    data: jsonData,
    headers: {
      'Content-Type': APPLICATION_JSON,
    }
  });

  return res;
}

export const attemptLogin = async (jsonData: { username: string, password: string } ) => {
  const res = await axios({
    timeout: 300000,
    url: loginUrl(),
    method: "POST",
    data: jsonData,
    headers: {
      'Content-Type': APPLICATION_JSON,
    }
  });

  return res;
}

export const getTheSemanticallySimilarExchange = async (exchanges: Array<Exchange>, question: string, model: string) => {
  const jsonPayload = {
    "inputs": {
      "source_sentence": question,
      "sentences": exchanges.map(exchange =>  exchange.question)
    }
  }
  let response = { data: [] };
  try {
    response = await axios({
      url: SEMANTIC_SIMILARITY_URL(model),
      method: "POST",
      data: jsonPayload,
      headers: {
        'Content-Type': APPLICATION_JSON,
        'Authorization': `Bearer ${apiToken}`
      }
    });
    const res = response.data;
    return  {
      // @ts-ignore
      score: Math.max(...res),
      // @ts-ignore
      exchange: exchanges[res.indexOf(Math.max(...res))]
    };
  } catch (e) {
    // @ts-ignore
    console.error("Error retrieving semantically similar sentence", e.message)
    return {
      score: 0,
      exchange: null
    };
  }
}

export async function askQuestionToTensorFlowModel(question: string, passage: string) {
  const model = await qna.load();

  return await model.findAnswers(question, passage);
}

export const findExactAnswerToQuestion = (question: string, exchanges: Array<Exchange>) => {
  const res: { found: boolean, answer: string | null } = {
    found: false,
    answer: null
  }
  exchanges.forEach((exchange: Exchange) => {
    if (question.trim().toLowerCase() === exchange.question.trim().toLowerCase()) {
      res.found = true;
      res.answer = exchange.answer;
    }
  });
  return res
}

export const createContextForQuestion = async (exchanges: Array<Exchange>) => {
  let context = "CS673 is a software engineering course at Boston University (BU).  It is taught by Alex Elentukh.  Students have a lot of questions for Alex within the class. "
  exchanges.forEach(exchange => {
    // context += "If student asks '" + exchange.question + "' then Alex would reply: '" + exchange.answer + "'.  ";
    context += exchange.answer + " ";
  });
  return context;
}

export const createLargeContextForQuestion = async (exchanges: Array<Exchange>) => {
  let context = "CS673 is a software engineering course at Boston University (BU).  It is taught by Alex Elentukh.  Students have a lot of questions for Alex within the class. \n"
  exchanges.forEach(exchange => {
    context += "If student asks '" + exchange.question + "' then Alex would reply: '" + exchange.answer + "'.  \n\n";
    // context += exchange.answer + " ";
  });
  return context;
}