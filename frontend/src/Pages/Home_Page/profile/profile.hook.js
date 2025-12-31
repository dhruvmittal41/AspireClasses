import { useEffect, useState } from "react";
import { fetchProfile } from "./profile.service";

export const useProfile = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile()
            .then((d) => {
                if (d.dob) d.dob = new Date(d.dob).toISOString().split("T")[0];
                setData(d);
            })
            .finally(() => setLoading(false));
    }, []);

    return { data, setData, loading };
};
