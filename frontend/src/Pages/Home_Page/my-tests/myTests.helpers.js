import { HOURS_24 } from "./myTests.constants";

export const getLatestAttemptForTest = (testId, attempts = []) => {
    return attempts
        .filter((a) => a.test_id === testId)
        .sort((a, b) => new Date(b.submitted_at) - new Date(a.submitted_at))[0] || null;
};

export const getTestStatus = (test, lastAttempt = {}) => {
    const now = new Date();
    const scheduledAt = test.date_scheduled ? new Date(test.date_scheduled) : null;
    const last = lastAttempt.submitted_at ? new Date(lastAttempt.submitted_at) : null;

    if (scheduledAt && now < scheduledAt) {
        return { state: "scheduled", availableAt: scheduledAt };
    }

    if (last) {
        const diff = now - last;
        if (diff < HOURS_24) {
            return { state: "locked", unlockAt: new Date(last.getTime() + HOURS_24) };
        }
        return { state: "reattempt" };
    }

    return { state: "start" };
};

export const formatRemainingTime = (date) => {
    const diff = date - new Date();
    const hours = Math.floor(diff / 36e5);
    const minutes = Math.floor((diff % 36e5) / 6e4);
    return `${hours}h ${minutes}m`;
};
