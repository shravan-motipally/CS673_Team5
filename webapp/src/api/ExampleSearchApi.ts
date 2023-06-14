import axios from 'axios';

// DO NOT EVER PUSH THE API KEY TO GIT.
const apiToken = "";

async function askBloom(jsonPayload: any) {
    const response = await axios({
      url: "https://api-inference.huggingface.co/models/bigscience/bloom",
      method: "POST",
      data: jsonPayload,
      headers: {
			   'Content-Type': 'application/json',
			   'Authorization': `Bearer ${apiToken}`
			}
    });
    console.log(`response: ${JSON.stringify(response.data)}`);
    return response.data
}

export async function askAScienceQuestion(question: string) {
	const payload = {
      "inputs": question,
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

