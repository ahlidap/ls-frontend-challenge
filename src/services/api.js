import axios from "axios"

const api = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    headers: {"Accept": "application/vnd.github+json"}
})

export default api;