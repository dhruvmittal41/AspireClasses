import api from "../../../api/axios";

export const fetchBundles = async () => {
    const res = await api.get("/api/test_bundles/");
    return Array.isArray(res.data) ? res.data : [];
};

export const fetchUserProfileStatus = async () => {
    const res = await api.get("/api/user");
    return res.data?.profilestat === true;
};
