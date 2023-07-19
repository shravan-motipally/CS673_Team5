import { Buffer } from 'buffer';
import {attemptLogin} from "./QuestionAnswerApi";

export const login = async (username: string, password: string) => {
    const jsonPayload = {
        username: username,
        password: Buffer.from(password, 'ascii').toString('base64')
    }
    try {
        const response = await attemptLogin(jsonPayload);
        return response.data;
    } catch (e) {
        // @ts-ignore
        console.error('Error on login.  Message: ' + e.message);
        return null;
    }
}