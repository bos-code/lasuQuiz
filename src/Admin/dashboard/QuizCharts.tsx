import { BarTrend } from "../../components/Charts/BarTrend";
import { DonutChart } from "../../components/Charts/DonutChart";

type TrendPoint = { label: string; value: number };
type StatusCount = { label: string; value: number };

type QuizChartsProps = {
  trend: TrendPoint[];
  statusCounts: StatusCount[];
};

const QuizCharts = ({ trend, statusCounts }: QuizChartsProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    <BarTrend title="Quiz Completions" subtitle="Last 6 quizzes" data={trend} color="#8b5cf6" />
    <DonutChart
      title="Publish status"
      value={statusCounts.find((s) => s.label === "Published")?.value ?? 0}
      total={statusCounts.reduce((acc, s) => acc + s.value, 0) || 1}
      segments={[
        { label: "Published", value: statusCounts[0]?.value ?? 0, color: "#22c55e" },
        { label: "Drafts", value: statusCounts[1]?.value ?? 0, color: "#f59e0b" },
      ]}
    />
  </div>
);

export default QuizCharts;
