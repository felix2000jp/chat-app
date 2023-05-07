import axios from "axios";
import {handleError} from "./problem-details";

export const httpClient = axios.create({
    withCredentials: true,
    baseURL: "http://localhost:5080"
});

httpClient.interceptors.response.use(
    (reply) => reply,
    (error) => handleError(error)
);
