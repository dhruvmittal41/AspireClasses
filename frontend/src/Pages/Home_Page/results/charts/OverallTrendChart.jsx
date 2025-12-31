import { Line } from "react-chartjs-2";
import { TOTAL_QUESTIONS } from "../results.constants";
import { clampScore } from "../../../../utils/results.utils";

export default function OverallTrendChart({ results }) {
  const data = {
    labels: results.map((r) => r.test_name),
    datasets: [
      {
        label: "Correct",
        data: results.map((r) => clampScore(r.score)),
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <Line
      data={data}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { beginAtZero: true, max: TOTAL_QUESTIONS } },
      }}
    />
  );
}
