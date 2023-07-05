import axios from 'axios';
import {Exchange} from "../screens/Edit";
import * as qna from "@tensorflow-models/qna"

export const getAllQnA = async () => {
  const res = await axios({
    timeout: 300000,
    url: "https://answering-svc.onrender.com/all",
    method: "GET"
  });

  return res.data;
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