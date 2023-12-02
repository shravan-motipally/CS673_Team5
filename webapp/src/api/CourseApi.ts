import axios from "axios";
import { CourseList } from "../components/onepirate/Home";
import { addNewCourseUrl, bulkUploadCoursesUrl, deleteCourseUrl, getAllCoursesForAdministrationUrl, getAllCoursesUrl } from "../utils/Urls";
import { CourseDoc } from "../screens/tabs/ClassesTable";
import { APPLICATION_JSON } from "../utils/StringConstants";
import { ExcelJsonCourses } from "../utils/ExcelUtils";

export const createNewCourse = async (course: Partial<CourseDoc>) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: addNewCourseUrl(),
            method: "POST",
            data: course,
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        return true;
    } catch (e) {
        console.error("Error creating course");
        return false;
    }
}

export const bulkUploadCourses = async (courses: ExcelJsonCourses) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: bulkUploadCoursesUrl(),
            method: "POST",
            data: courses,
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        if (res.status === 200) {
            return true;
        }
        return false;
    } catch (e) {
        console.error("Error bulk uploading courses");
        return false;
    }
}

export const getAllCoursesForSelection = async (): Promise<CourseList> => {
    try {
        const res = await axios({
            timeout: 300000,
            url: getAllCoursesUrl(),
            method: "GET",
        });

        return res.data;
    } catch (err) {
        let errString = "Backend is down or courses API returned an exception: " + err;
        console.log(
            errString
        );
        return { courses: undefined, errors: [errString] };
    }
};

export const getAllCoursesForAdministration = async (): Promise<Array<CourseDoc>> => {
    try {
        const res = await axios({
            timeout: 300000,
            url: getAllCoursesForAdministrationUrl(),
            method: "GET"
        });

        return res.data;
    } catch (err) {
        console.log("Backend is down or courses API returned an exception: " + err)
        return [];
    }
}

export const deleteCourse = async (courseId: string) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: deleteCourseUrl(courseId),
            method: "DELETE",
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        return true;
    } catch (e) {
        console.error("Error deleting course");
        return false;
    }
}
