import axios from "axios";

export const api = axios.create({
    baseURL: "http://192.168.68.65:5000",
    headers: {
        "Content-Type": "application/json"
    }
})