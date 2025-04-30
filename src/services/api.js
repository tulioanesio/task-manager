import axios from "axios";

const api = axios.create({
  baseURL: "https://taskmanager-api-omfs.onrender.com",
});

export default api;
