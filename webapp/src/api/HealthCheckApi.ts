import axios from "axios";
import {generationHealthUrl, healthUrl} from "../utils/Urls";


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

export const getGenerationBackendHealth = async () => {
  try {
    const res = await axios({
      timeout: 600000,
      url: generationHealthUrl(),
      method: "GET"
    });

    return res.data.status === "UP";
  } catch (e) {
    return false;
  }
}