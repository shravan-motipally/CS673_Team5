import axios from "axios";
import { ExcelJsonUsers } from "../utils/ExcelUtils";
import { APPLICATION_JSON } from "../utils/StringConstants";
import { createUpdateUserUrl, bulkUploadUsersUrl, deleteUserUrl, getAllUsersUrl } from "../utils/Urls";
import { UserResponse, UserRequest } from "../screens/tabs/UsersTable";

export const createNewUser = async (user: Partial<UserRequest>) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: createUpdateUserUrl(),
            method: "POST",
            data: user,
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        return true;
    } catch (e) {
        console.error("Error creating user");
        return false;
    }
}

export const updateUser = async (user: Partial<UserRequest>) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: createUpdateUserUrl(),
            method: "PUT",
            data: user,
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        return true;
    } catch (e) {
        console.error("Error updating user");
        return false;
    }
}

export const bulkUploadUsers = async (users: Array<UserRequest>) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: bulkUploadUsersUrl(),
            method: "POST",
            data: users,
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

export const getAllUsers = async (): Promise<Array<UserResponse>> => {
    try {
        const res = await axios({
            timeout: 300000,
            url: getAllUsersUrl(),
            method: "GET"
        });

        return res.data;
    } catch (err) {
        console.log("Backend is down or questions API returned an exception: " + err)
        return [];
    }
}

export const deleteUser = async (userId: string) => {
    try {
        const res = await axios({
            timeout: 300000,
            url: deleteUserUrl(userId),
            method: "DELETE",
            headers: {
                'Content-Type': APPLICATION_JSON
            }
        })
        return true;
    } catch (e) {
        console.error("Error deleting user");
        return false;
    }
}