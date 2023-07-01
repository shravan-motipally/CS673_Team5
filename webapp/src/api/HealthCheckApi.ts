import axios from "axios";


export const getBackendHealth = async () => {
  try {
    const res = await axios({
      timeout: 300000,
      url: "https://answering-svc.onrender.com/actuator/health",
      method: "GET"
    });

    return res.data.status === "UP";
  } catch (e) {
    return false;
  }
}