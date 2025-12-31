import api from "../api/axios";

export const fetchMyTests = async () => {
    const [testsRes, resultsRes] = await Promise.all([
        api.get("/api/user/mytests"),
        api.get("/api/results"),
    ]);

    const tests = Array.isArray(testsRes.data?.tests)
        ? testsRes.data.tests
        : Array.isArray(testsRes.data)
            ? testsRes.data
            : [];

    const attempts = Array.isArray(resultsRes.data) ? resultsRes.data : [];

    return { tests, attempts };
};
