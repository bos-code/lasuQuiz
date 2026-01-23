import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type DonutChartProps = {
  title: string;
  value: number;
  total?: number;
  segments?: { color: string; value: number; label: string }[];
};

export const DonutChart = ({ title, value, total = 100, segments }: DonutChartProps) => {
  const pct = Math.min(100, Math.max(0, Math.round((value / total) * 100)));

  const options = useMemo<Highcharts.Options>(() => {
    const dataSeries =
      segments && segments.length > 0
        ? segments.map((seg) => ({
            name: seg.label,
            y: seg.value,
            color: seg.color,
          }))
        : [
            { name: "Complete", y: value, color: "#22c55e" },
            { name: "Remaining", y: Math.max(total - value, 0), color: "#1f2937" },
          ];

    return {
      chart: {
        type: "pie",
        backgroundColor: "transparent",
        height: 260,
      },
      accessibility: { enabled: false },
      title: { text: undefined },
      credits: { enabled: false },
      legend: {
        enabled: !!segments?.length,
        itemStyle: { color: "#cbd5e1", fontSize: "11px" },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "rgba(148,163,184,0.3)",
        style: { color: "#e2e8f0" },
        pointFormat: "<b>{point.y}</b> ({point.percentage:.1f}%)",
      },
      plotOptions: {
        pie: {
          innerSize: "70%",
          dataLabels: { enabled: false },
          borderWidth: 0,
          showInLegend: !!segments?.length,
          animation: { duration: 600 },
          states: {
            hover: { enabled: true, brightness: 0.05 },
          },
        },
      },
      series: [
        {
          type: "pie",
          data: dataSeries,
        },
      ],
    };
  }, [segments, total, value]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
      <p className="text-sm text-gray-400">{title}</p>
      <div className="relative mt-2">
        <HighchartsReact highcharts={Highcharts} options={options} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className="text-2xl font-semibold text-white">{pct}%</div>
            <div className="text-xs text-gray-400">of goal</div>
          </div>
        </div>
      </div>
      {segments && segments.length > 0 && (
        <div className="grid grid-cols-2 gap-2 mt-2">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center gap-2 text-sm text-gray-300">
              <span className="inline-flex w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="truncate">{seg.label}</span>
              <span className="ml-auto text-gray-400">{seg.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
