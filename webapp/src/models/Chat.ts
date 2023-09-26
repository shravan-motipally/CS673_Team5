import {
  findExactAnswerToQuestion,
  getAllQnA,
  getTheSemanticallySimilarExchange,
} from "../api/QuestionAnswerApi";
import { Exchange } from "../screens/Edit";
import { askAScienceQuestion } from "../api/BloomGenerationApi";
import { prepBot } from "./Generative";
import { BLOOM } from "../utils/Urls";
import { ScreenState } from "../types/global.types";

export const I_DONT_KNOW =
  "I'm sorry, I am not able to answer your question. Please try to rephrase your question and ask me again. If I am still unable to answer it, please ask your question directly to the Professor or TA.";

export const isEmptyNullOrUndefined = (str: string) => {
  return str === undefined || str === null || str === "";
};

export const processAnswerForBloom = (initialAnswer: string) => {
  const searchTerm = "I should reply with an answer:";
  const indexOfFirst = initialAnswer.indexOf(searchTerm);
  return initialAnswer.substring(indexOfFirst + searchTerm.length + 1);
};

export const answerQuestion = async (
  question: string,
  screenState: ScreenState
) => {
  let res;
  try {
    const answers = await getAllQnA();
    const { exchanges }: { exchanges: Array<Exchange> } = answers;
    const { found, answer } = findExactAnswerToQuestion(question, exchanges);
    if (!found) {
      // TODO: replace call for third-party similarity calculation with querying the mongo database for a matching vector
      const semanticallySimilarExchange =
        await getTheSemanticallySimilarExchange(
          exchanges,
          question,
          screenState.semanticSimilarityModel
        );
      if (
        semanticallySimilarExchange.score >
        screenState.semanticSimilarityThreshold
      ) {
        res = semanticallySimilarExchange.exchange?.answer || I_DONT_KNOW;
      } else if (screenState.generativeMode) {
        if (screenState.generativeModel === BLOOM) {
          const genBloomAnswer = await askAScienceQuestion(question);
          res = processAnswerForBloom(genBloomAnswer);
        } else {
          res = await prepBot(exchanges, question, screenState.generativeModel);
        }
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
};
