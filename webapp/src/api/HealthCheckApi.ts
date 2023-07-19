import axios from "axios";
import {healthUrl} from "../utils/Urls";


export const getBackendHealth = async () => {
  try {
    const res = await axios({
      timeout: 300000,
      url: healthUrl(),
      method: "GET"
    });

    return res.data.status === "UP";
  } catch (e) {
    return false;
  }
}