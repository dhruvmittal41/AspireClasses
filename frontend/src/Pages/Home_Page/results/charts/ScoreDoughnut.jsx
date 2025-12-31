import { Doughnut } from "react-chartjs-2";
import { clampScore } from "../../../../utils/results.utils";
import { TOTAL_QUESTIONS } from "../results.constants";

export default function ScoreDoughnut({ result }) {
  if (!result) return null;

  return (
    <Doughnut
      data={{
        labels: ["Correct", "Incorrect"],
        datasets: [
          {
            data: [
              clampScore(result.score),
              TOTAL_QUESTIONS - clampScore(result.score),
            ],
          },
        ],
      }}
    />
  );
}
