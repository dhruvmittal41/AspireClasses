
export const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { when: "beforeChildren", staggerChildren: 0.15 },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};