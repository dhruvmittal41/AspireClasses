import { Bar } from "react-chartjs-2";
import { TOTAL_QUESTIONS } from "../results.constants";
import { clampScore } from "../../../../utils/results.utils";

export default function ScoreComparisonChart({ result }) {
  if (!result) return null;

  const data = {
    labels: [result.test_name],
    datasets: [
      { label: "Your Score", data: [clampScore(result.score)] },
      { label: "Highest Score", data: [clampScore(result.highest_score)] },
    ],
  };

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: TOTAL_QUESTIONS } },
      }}
    />
  );
}
