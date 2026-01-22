import { useMemo } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";

type BarTrendProps = {
  title: string;
  subtitle?: string;
  data: { label: string; value: number }[];
  color?: string;
};

export const BarTrend = ({ title, subtitle, data, color = "#a855f7" }: BarTrendProps) => {
  const options = useMemo<Highcharts.Options>(() => {
    return {
      chart: {
        type: "areaspline",
        backgroundColor: "transparent",
        spacing: [10, 10, 10, 10],
        animation: { duration: 600 },
      },
      title: { text: undefined },
      credits: { enabled: false },
      legend: { enabled: false },
      xAxis: {
        categories: data.map((d) => d.label),
        lineColor: "rgba(148,163,184,0.3)",
        labels: { style: { color: "#cbd5e1", fontSize: "11px" } },
        tickLength: 0,
      },
      yAxis: {
        title: { text: undefined },
        gridLineColor: "rgba(148,163,184,0.1)",
        labels: { style: { color: "#94a3b8", fontSize: "11px" } },
      },
      plotOptions: {
        areaspline: {
          marker: { enabled: true, radius: 4, fillColor: "#0f172a", lineWidth: 2, lineColor: color },
          fillOpacity: 0.25,
          lineWidth: 3,
        },
        series: { animation: { duration: 700 } },
      },
      tooltip: {
        backgroundColor: "#0f172a",
        borderColor: "rgba(148,163,184,0.3)",
        style: { color: "#e2e8f0" },
        formatter: function () {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const point = this.point as any;
          return `<strong>${point.category}</strong><br/>${point.y}`;
        },
      },
      series: [
        {
          type: "areaspline",
          data: data.map((d) => d.value),
          color,
        },
      ],
    };
  }, [color, data]);

  return (
    <div className="bg-gray-800 rounded-xl p-4 border border-gray-700 h-full">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="text-sm text-gray-400">{subtitle}</p>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        </div>
      </div>
      <HighchartsReact highcharts={Highcharts} options={options} />
    </div>
  );
};
