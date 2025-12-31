import api from "./axios";

export const fetchResults = () => api.get("/api/results");
