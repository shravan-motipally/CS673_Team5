import {Answer} from "@tensorflow-models/qna/dist/question_and_answer";
import {
  askQuestionToTensorFlowModel,
  createContextForQuestion, findExactAnswerToQuestion,
  getAllQnA, getTheSemanticallySimilarExchange
} from "../api/QuestionAnswerApi";
import {Exchange} from "../screens/Edit";
import {askAScienceQuestion} from "../api/BloomGenerationApi";


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
      "I don't know but I will find out",
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
        res = semanticallySimilarExchange.exchange?.answer || "I don't know at the moment but I will find out";
      } else {
        const context = await createContextForQuestion(exchanges);
        const answers: Array<Answer> = await askQuestionToTensorFlowModel(question, context)
        if (answers.length === 0) {
          const genBloomAnswer = await askAScienceQuestion(question);
          res = processAnswerForBloom(genBloomAnswer);
        } else {
          const {answer, score} = processAnswer(answers);
          if (score > 0.50) {
            res = answer
          } else {
            res = "I don't know at the moment but I will find out"
          }
        }
      }
      // const extendedContext = await createLargeContextForQuestion(exchanges);
      // const answer = await respondWithLangchain(question, extendedContext);
      // res = answer.text;
    } else {
      res = answer || "I don't know but I will find out";
    }
  } catch (e) {
    console.error(e);
    res = "I don't know but I will find out.";
  }
  return res;
}