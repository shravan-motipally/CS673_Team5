import {Answer} from "@tensorflow-models/qna/dist/question_and_answer";
import {
  findExactAnswerToQuestion,
  getAllQnA, getTheSemanticallySimilarExchange
} from "../api/QuestionAnswerApi";
import {Exchange} from "../screens/Edit";

export const I_DONT_KNOW = "I’m sorry, I am not able to answer your question. Please try to rephrase your question and ask me again. If I am still unable to answer it, please ask your question directly to the Professor or TA."

export const isEmptyNullOrUndefined = (str: string) => {
  return str === undefined || str === null || str === "";
}

export const processAnswerForBloom = (initialAnswer: string) => {
  const searchTerm = 'I should reply with an answer:';
  const indexOfFirst = initialAnswer.indexOf(searchTerm);
  return initialAnswer.substring(indexOfFirst + searchTerm.length + 1);
}

export const processAnswer = (initialAnswers: Array<Answer>) => {
  const ans = initialAnswers.sort((a,b) => b.score - a.score)[0];
  return {
    answer: initialAnswers.length >= 1 ?
      ans.text :
      I_DONT_KNOW,
    score: ans.score
  };
}

export const answerQuestion = async (question: string) => {
  let res;
  try {
    const answers = await getAllQnA();
    const { exchanges }: { exchanges: Array<Exchange> } = answers;
    const { found, answer } = findExactAnswerToQuestion(question, exchanges);
    if (!found) {
      const semanticallySimilarExchange = await getTheSemanticallySimilarExchange(exchanges, question);
      if (semanticallySimilarExchange.score > 0.7) {
        console.log(semanticallySimilarExchange);
        res = semanticallySimilarExchange.exchange?.answer || I_DONT_KNOW;
      } else {
        res = I_DONT_KNOW;
      }
    } else {
      res = answer || I_DONT_KNOW;
    }
  } catch (e) {
    console.error(e);
    res = I_DONT_KNOW;
  }
  return res;
}