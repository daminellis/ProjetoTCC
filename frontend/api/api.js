import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.32.1.49:5000",
    headers: {
        "Content-Type": "application/json"
    }
})