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