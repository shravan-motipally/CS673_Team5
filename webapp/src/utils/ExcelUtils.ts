import {Exchange} from "../screens/Edit";
import {Course} from "../components/onepirate/Home";
import {CourseDoc} from "../screens/tabs/ClassesTable";

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

export const coursesSpreadSheetData = [
  {
    sheet: "Courses List",
    columns: [
      { label: "Course ID", value: "id" },
      { label: "Semester", value: "semester" },
      { label: "School ID", value: "schoolId"},
      { label: "Department ID", value: "departmentId" },
      { label: "Course Number", value: "catalogId" },
      { label: "Course Name", value: "name" },
      { label: "Course Description", value: "description" }
    ],
    content: [],
  }
]

export interface ExcelJsonQuestions {
  numOfQuestions: number,
  exchanges: Array<Exchange>
}

export const transformToJson: (stringArr: string[][]) => ExcelJsonQuestions = (stringArr: string[][]) => {
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

export interface ExcelJsonCourses {
  numCourses: number,
  courses: Array<CourseDoc>
}

export const transformCoursesToJson: (stringArr: string[][]) => ExcelJsonCourses = (stringArr: string[][]) => {
  if (stringArr.length === 0 || stringArr.length === 1) {
    console.error("Invalid array given");
    throw Error("Invalid array given");
  }
  const numCourses = stringArr.length -1;
  const courses: Array<CourseDoc> = [];
  stringArr.forEach((questionArray: string[], index) => {
    if (index !== 0 && questionArray.length === 7) {
      courses.push({
        id: questionArray[0],
        semester: questionArray[1],
        schoolId: questionArray[2],
        departmentId: questionArray[3],
        catalogId: questionArray[4],
        name: questionArray[5],
        description: questionArray[6],
      })
    }
  });
  return {
    numCourses: numCourses,
    courses: courses
  }
}

export const settings = {
  fileName: "QuestionsAnswersCS673", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
}

export const courseExcelSettings = {
  fileName: "CoursesList", // Name of the resulting spreadsheet
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