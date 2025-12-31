import { useEffect, useState } from "react";
import { fetchResults } from "../services/results.service";

export const useResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchResults()
            .then(res => setResults(res.data || []))
            .catch(() => setError("Unable to load results"))
            .finally(() => setLoading(false));
    }, []);

    return { results, loading, error };
};
