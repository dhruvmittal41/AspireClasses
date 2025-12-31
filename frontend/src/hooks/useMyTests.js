import { useEffect, useState } from "react";
import { fetchMyTests } from "../services/myTests.service";

export const useMyTests = () => {
    const [tests, setTests] = useState([]);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMyTests()
            .then(({ tests, attempts }) => {
                setTests(tests);
                setAttempts(attempts);
            })
            .finally(() => setLoading(false));
    }, []);

    return { tests, attempts, loading };
};
