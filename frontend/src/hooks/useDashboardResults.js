import { useEffect, useState } from "react";
import { fetchResults } from "../services/results.service";
import { clampScore } from "../Pages/Home_Page/dashboard/dashboard.helpers";
import { TOTAL_QUESTIONS } from "../Pages/Home_Page/dashboard/dashboard.constants";

export const useDashboardResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await fetchResults();
                if (Array.isArray(data)) {
                    const processed = data.map((r) => ({
                        ...r,
                        score: clampScore(r.score),
                        max_score: TOTAL_QUESTIONS,
                    }));
                    setResults(processed.slice(0, 5));
                }
            } catch {
                setError("Failed to fetch results.");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return { results, loading, error };
};
