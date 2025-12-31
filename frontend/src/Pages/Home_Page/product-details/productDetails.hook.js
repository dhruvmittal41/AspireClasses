import { useEffect, useState } from "react";
import { fetchBundles } from "./productDetails.service";

export const useProductBundles = () => {
    const [bundles, setBundles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchBundles()
            .then(setBundles)
            .catch(() => setError("Could not load bundles. Please try again."))
            .finally(() => setLoading(false));
    }, []);

    return { bundles, loading, error };
};
