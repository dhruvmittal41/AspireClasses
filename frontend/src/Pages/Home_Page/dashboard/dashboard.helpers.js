import { TOTAL_QUESTIONS } from "./dashboard.constants";

export const clampScore = (score) => {
    const s = Number(score);
    if (Number.isNaN(s) || s < 0) return 0;
    return Math.min(s, TOTAL_QUESTIONS);
};
