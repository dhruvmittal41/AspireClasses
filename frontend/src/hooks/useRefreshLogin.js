import { useEffect } from "react";
import axios from "axios";
import { useAuth } from "../auth/useAuth";

const baseUrl = import.meta.env.VITE_BASE_URL;

export const useRefreshLogin = () => {
    const { setAccessToken, setUser, setAuthLoading } = useAuth();

    useEffect(() => {
        const refresh = async () => {
            try {
                const res = await axios.post(
                    `${baseUrl}/api/refresh`,
                    {},
                    { withCredentials: true }
                );
                setAccessToken(res.data.accessToken);
                setUser(res.data.user);
            } catch {
                // silent fail
            } finally {
                setAuthLoading(false);
            }
        };

        refresh();
    }, []);
};
