import axios from 'axios';
import {apiToken, APPLICATION_JSON} from "../utils/StringConstants";
import { TEXT_GENERATION_URL_BLOOM } from "../utils/Urls";

async function askBloom(jsonPayload: any) {
    const response = await axios({
      url: TEXT_GENERATION_URL_BLOOM,
      method: "POST",
      data: jsonPayload,
      headers: {
			   'Content-Type': APPLICATION_JSON,
			   'Authorization': `Bearer ${apiToken}`
			}
    });
    console.log(`response: ${JSON.stringify(response.data)}`);
    return response.data
}

export async function askAScienceQuestion(question: string) {
	const paddedQuestion = "CS673 is a software engineering course.  It is taught by Alex Elentukh.  Students have a lot of questions for Alex within the class " +
	"especially since he assigns a group project wherein students complete an entire project using agile frameworks.  " +
	"If I were Alex and a student asks me \"Why should I take this course?\" I should respond as \"Because its a fun course of course!\"" +
	"  Now suppose that I were Alex and a question from a student comes in" +
	" as \"" + question + "\" then I should reply with an answer:";
	const payload = {
      "inputs": paddedQuestion,
      "parameters": {
          "temperature": 1,
          "min_length": 25,
          "max_new_tokens": 50,
          "return_full_text": true,
          "do_sample": false,
          "seed": 10,
          "early_stopping": false,
          "length_penalty": 0.0
      },
      "options": {
          "use_cache": false,
          "wait_for_model": false
      }
  }

  let result = await askBloom(payload);
  // @ts-ignore
  let strRes: string = result[0].generated_text;
  return strRes;
}

