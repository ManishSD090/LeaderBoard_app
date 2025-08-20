import axios from "axios";

const API = axios.create({
  baseURL: "https://leaderboard-app-oekh.onrender.com/api", // adjust port if needed
});

// Users
export const getUsers = () => API.get("/users");
export const addUser = (name) => API.post("/users", { name });

// Claims
export const claimPoints = (userId) => API.post(`/claims/${userId}`);
export const getHistory = () => API.get("/claims/history");

// Leaderboard
export const getLeaderboard = () => API.get("/leaderboard");
