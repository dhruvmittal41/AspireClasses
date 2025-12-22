import api from "./axios";

export const attachAuthInterceptor = (getAccessToken) => {
    api.interceptors.request.use((config) => {
        const token = getAccessToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    });
};
