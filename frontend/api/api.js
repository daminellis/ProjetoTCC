import axios from "axios";

export const api = axios.create({
    baseURL: "http://10.32.15.48:5000",
    headers: {
        "Content-Type": "application/json"
    }
})