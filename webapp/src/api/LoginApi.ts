import axios from "axios";

export const login = async (username: string, password: string) => {
    const jsonPayload = {
        username: username,
        password: Buffer.from(password, 'ascii').toString('base64')
    }
    const response = await axios({
        url: "https://answering-svc.onrender.com/login",
        method: "POST",
        data: jsonPayload,
        headers: {
            'Content-Type': 'application/json',
        }
    });
    console.log(`login: ${JSON.stringify(response.data)}`);
    return response.data;
}