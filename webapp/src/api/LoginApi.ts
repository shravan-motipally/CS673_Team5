import axios from "axios";
import { Buffer } from 'buffer';

export const login = async (username: string, password: string) => {
    const jsonPayload = {
        username: username,
        password: Buffer.from(password, 'ascii').toString('base64')
    }
    try {
        const response = await axios({
            url: "https://qbot-slak.onrender.com/login",
            method: "POST",
            data: jsonPayload,
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log(`login: ${JSON.stringify(response.data)}`);
        return response.data;
    } catch (e) {
        // @ts-ignore
        console.log('Error on login.  Message: ' + e.message);
        return null;
    }
}