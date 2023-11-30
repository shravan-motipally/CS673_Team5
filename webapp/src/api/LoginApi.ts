import axios from "axios";
import { Buffer } from "buffer";
import { APPLICATION_JSON } from "../utils/StringConstants";
import { loginUrl } from "../utils/Urls";

export const login = async (username: string, password: string) => {
  const jsonPayload = {
    username: username,
    password: Buffer.from(password, "ascii").toString("base64"),
  };
  try {
    const response = await attemptLogin(jsonPayload);
    return response.data;
  } catch (e) {
    // @ts-ignore
    console.error("Error on login.  Message: " + e.message);
    return null;
  }
};

export const attemptLogin = async (jsonData: {
  username: string;
  password: string;
}) => {
  const res = await axios({
    timeout: 300000,
    url: loginUrl(),
    method: "POST",
    data: jsonData,
    headers: {
      "Content-Type": APPLICATION_JSON,
    },
  });

  return res;
};
