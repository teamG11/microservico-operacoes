import axios from "axios";
import { env } from "../env";

const axiosInstance = axios.create({
  baseURL: env.MICROSERVICO_CADASTROS_URL,
  timeout: 15000,
});

export default axiosInstance;
