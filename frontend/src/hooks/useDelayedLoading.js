// hooks/useDelayedLoading.js
import { useEffect, useState } from "react";

export const useDelayedLoading = (loading, delay = 500) => {
    const [showLoader, setShowLoader] = useState(true);

    useEffect(() => {
        let timer;

        if (!loading) {
            timer = setTimeout(() => {
                setShowLoader(false);
            }, delay);
        } else {
            setShowLoader(true);
        }

        return () => clearTimeout(timer);
    }, [loading, delay]);

    return showLoader;
};
