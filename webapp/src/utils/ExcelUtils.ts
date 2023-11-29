import { Buffer } from "buffer";
import { Exchange } from "../screens/Edit";
import { CourseDoc } from "../screens/tabs/ClassesTable";
import { UserRequest } from "../screens/tabs/UsersTable";

export const spreadSheetData = [
  {
    sheet: "Questions And Answers",
    columns: [
      { label: "Id", value: "id" },
      { label: "Question", value: "question" },
      { label: "Answer", value: "answer" },
      { label: "CourseId", value: "courseId" },
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
      { label: "School ID", value: "schoolId" },
      { label: "Department ID", value: "departmentId" },
      { label: "Course Number", value: "catalogId" },
      { label: "Course Name", value: "name" },
      { label: "Course Description", value: "description" },
    ],
    content: [],
  },
];

export const usersSpreadSheetData = [
  {
    sheet: "Users List",
    columns: [
      { label: "ID", value: "id" },
      { label: "First Name", value: "firstName" },
      { label: "Last Name", value: "lastName" },
      { label: "Email Address", value: "emailAddress" },
      { label: "Username", value: "username" },
      { label: "Password", value: "" },
      { label: "Role IDs", value: "roleNames" },
      { label: "Course IDs", value: "courseIds" },
      { label: "Photo Link", value: "photoUrl" },
    ],
    content: [],
  }
]

export interface ExcelJsonExchanges {
  numOfExchanges: number;
  courseId: string;
  exchanges: Array<Exchange>;
}

export const transformExchangesToJson: (
  stringArr: string[][],
  courseId: string
) => ExcelJsonExchanges = (stringArr: string[][], courseId) => {
  if (stringArr.length === 0 || stringArr.length === 1) {
    console.error("Invalid array given");
    throw Error("Invalid array given");
  }
  const numOfExchanges = stringArr.length - 1;
  const exchanges: Array<Exchange> = [];
  stringArr.forEach((questionArray: string[], index) => {
    if (index !== 0 && questionArray.length === 4) {
      exchanges.push({
        id: questionArray[0],
        question: questionArray[1],
        answer: questionArray[2],
        courseId: questionArray[3],
      });
    }
  });
  return {
    numOfExchanges: numOfExchanges,
    exchanges: exchanges,
    courseId,
  };
};

export interface ExcelJsonCourses {
  numCourses: number;
  courses: Array<CourseDoc>;
}

export const transformCoursesToJson: (
  stringArr: string[][]
) => ExcelJsonCourses = (stringArr: string[][]) => {
  if (stringArr.length === 0 || stringArr.length === 1) {
    console.error("Invalid array given");
    throw Error("Invalid array given");
  }
  const numCourses = stringArr.length - 1;
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
      });
    }
  });
  return {
    numCourses: numCourses,
    courses: courses,
  };
};

export interface ExcelJsonUsers {
  numUsers: number,
  users: Array<UserRequest>
}

// @ts-ignore
export const transformUsersToJson: (stringArr: string[][]) => ExcelJsonUsers = (stringArr: string[][]) => {
  if (stringArr.length === 0 || stringArr.length === 1) {
    console.error("Invalid array given");
    throw Error("Invalid array given");
  }
  const numUsers = stringArr.length - 1;
  const minimumNumFields = 4
  const user: Array<UserRequest> = [];
  stringArr.forEach((userArray: string[], index) => {
    if (index !== 0 && userArray.length >= minimumNumFields) {
      user.push({
        id: userArray[0] ? userArray[0] : "",
        firstName: userArray[1] ? userArray[1] : "",
        lastName: userArray[2] ? userArray[2] : "",
        emailAddress: userArray[3] ? userArray[3] : "",
        loginDetail: {
          username: userArray[4] ? userArray[4] : "",
          password: userArray[5] ? Buffer.from(userArray[5], "ascii").toString("base64") : "",
        },
        roleNames: userArray[6] ? userArray[6].split(',') : [],
        courseIds: userArray[7] ? userArray[7].split(',') : [],
        photoUrl: userArray[8] ? userArray[8] : ""
      })
    }
  });
  return {
    numUsers: numUsers,
    users: user
  }
}

export const settings = {
  fileName: "QuestionsAnswersCS673", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
};

export const courseExcelSettings = {
  fileName: "CoursesList", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
};

export const userExcelSettings = {
  fileName: "UsersList", // Name of the resulting spreadsheet
  extraLength: 3, // A bigger number means that columns will be wider
  writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
  writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
  RTL: false, // Display the columns from right-to-left (the default value is false)
}

export const excelToJsonOptions = (nameOfFile: string) => {
  return {
    input: nameOfFile,
    sheet: "Questions And Answers",
  };
};
