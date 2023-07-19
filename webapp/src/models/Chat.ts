import {Answer} from "@tensorflow-models/qna/dist/question_and_answer";
import {
  findExactAnswerToQuestion,
  askQuestionToTensorFlowModel,
  createContextForQuestion, createLargeContextForQuestion,
  getAllQnA, getTheSemanticallySimilarExchange
} from "../api/QuestionAnswerApi";
import {Exchange} from "../screens/Edit";
import {askAScienceQuestion} from "../api/BloomGenerationApi";
import {prepBot} from "./Generative";

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

export const answerQuestion = async (question: string, allowGenerativeAnswers: boolean) => {
  let res;
  try {
    const answers = await getAllQnA();
    const { exchanges }: { exchanges: Array<Exchange> } = answers;
    const { found, answer } = findExactAnswerToQuestion(question, exchanges);
    if (!found) {
      const semanticallySimilarExchange = await getTheSemanticallySimilarExchange(exchanges, question);
      if (semanticallySimilarExchange.score > 0.7) {
        res = semanticallySimilarExchange.exchange?.answer || I_DONT_KNOW;
      } else if (allowGenerativeAnswers) {
        // const context = await createContextForQuestion(exchanges);
        // const answers: Array<Answer> = await askQuestionToTensorFlowModel(question, context)
        // if (answers.length === 0) {
        //   const genBloomAnswer = await askAScienceQuestion(question);
        //   res = processAnswerForBloom(genBloomAnswer);
        // } else {
        //   const {answer, score} = processAnswer(answers);
        //   if (score > 0.50) {
        //     res = answer
        //   } else {
        //     res = "I don't know at the moment but I will find out"
        //   }
        // }
        res = await prepBot(exchanges, question);
        // res += await chatWithBot(question);
      } else {
        res = I_DONT_KNOW;
      }
      // const extendedContext = await createLargeContextForQuestion(exchanges);
      // console.log(extendedContext);
      // const answer = await respondWithLangchain(question, extendedContext);
      // res = answer.text;
    } else {
      res = answer || I_DONT_KNOW;
    }
  } catch (e) {
    console.error(e);
    res = I_DONT_KNOW;
  }
  return res;
}