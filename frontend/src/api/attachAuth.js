import api from "./axios";

export const attachAuthInterceptor = (getAccessToken) => {
    api.interceptors.request.use((config) => {
        if (!config.headers.Authorization) {
            const token = getAccessToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    });
};
