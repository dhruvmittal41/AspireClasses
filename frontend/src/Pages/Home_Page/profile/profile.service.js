import api from "../../../api/axios";

export const fetchProfile = async () => {
    const res = await api.get("/api/user");
    return res.data;
};

export const updateProfile = async (data) => {
    return api.post("/api/user/details", data);
};
