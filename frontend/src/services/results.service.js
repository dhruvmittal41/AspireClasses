import api from "../api/axios";

export const fetchResults = async () => {
    const response = await api.get("/api/results");
    return response.data;
};
