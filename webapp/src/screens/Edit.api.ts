import {Exchange} from "./Edit";

export const spreadSheetData = [
  {
    sheet: "Questions And Answers",
    columns: [
      { label: "Id", value: "exchangeId"},
      { label: "Question", value: "question" },
      { label: "Answer", value: "answer" },
    ],
    content: [],
  },
];

export const transformToJson = (stringArr: string[][]) => {
  if (stringArr.length === 0 || stringArr.length === 1) {
    console.error("Invalid array given");
    throw Error("Invalid array given");
  }
  const numOfQuestions = stringArr.length -1;
  const exchanges: Array<Exchange> = [];
  stringArr.forEach((questionArray: string[], index) => {
    if (index !== 0 && questionArray.length === 3) {
      exchanges.push({
        exchangeId: questionArray[0],
        question: questionArray[1],
        answer: questionArray[2]
      })
    }
  });
  return {
    numOfQuestions: numOfQuestions,
    exchanges: exchanges
  }
}

export const settings = {
  fileName: "QuestionsAnswersCS673", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
}

export const excelToJsonOptions = (nameOfFile: string) => {
  return {
    input: nameOfFile,
    sheet: "Questions And Answers"
  };
}