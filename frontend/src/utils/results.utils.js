import { TOTAL_QUESTIONS } from "../Pages/Home_Page/results/results.constants";

export const clampScore = (score) => {
    const s = Number(score);
    if (Number.isNaN(s) || s < 0) return 0;
    return Math.min(s, TOTAL_QUESTIONS);
};

export const formatScore = (score) =>
    `${clampScore(score)} / ${TOTAL_QUESTIONS}`;

export const getPerformanceFeedback = (score) => {
    const s = clampScore(score);
    if (s >= 75) return { variant: "success", text: "Excellent work!" };
    if (s >= 60) return { variant: "info", text: "Great job!" };
    if (s >= 40) return { variant: "warning", text: "Good effort." };
    return { variant: "danger", text: "Needs improvement." };
};
