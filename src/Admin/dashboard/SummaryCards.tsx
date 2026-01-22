import type { SummaryCard } from "../../lib/api/types";
import { Odometer } from "../../components/Charts/Odometer";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import type { ComponentType } from "react";

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  "📖": MenuBookIcon,
  "📅": EventNoteIcon,
  "👥": PeopleIcon,
  "📊": BarChartIcon,
};

const toNumber = (val: string | number | undefined) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const parsed = Number(String(val).replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

type SummaryCardsProps = {
  cards: SummaryCard[];
  loading: boolean;
};

const SummaryCards = ({ cards, loading }: SummaryCardsProps) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
    {loading && <div className="text-gray-400 text-sm col-span-full">Loading stats...</div>}
    {cards.map((card, index) => {
      const borderColor =
        card.color === "purple"
          ? "border-purple-500/50"
          : card.color === "green"
            ? "border-green-500/50"
            : card.color === "blue"
              ? "border-blue-500/50"
              : card.color === "orange"
                ? "border-orange-500/50"
                : "";
      const IconComponent = iconMap[card.icon] || MenuBookIcon;
      return (
        <div key={index} className={`bg-gray-800 rounded-xl p-6 border border-gray-700 ${borderColor}`}>
          <div className="flex items-start justify-between">
            <IconComponent className="text-4xl mb-4 text-gray-300" />
            <div className="text-right">
              <p className="text-gray-400 text-sm mb-1">{card.title}</p>
              <div className="text-2xl font-bold text-white mb-1 flex justify-end">
                <Odometer value={card.value} />
              </div>
              <p className={`text-sm font-medium ${card.change.startsWith("-") ? "text-red-400" : "text-green-400"}`}>
                <Odometer value={toNumber(card.change)} suffix="%" />
              </p>
            </div>
          </div>
        </div>
      );
    })}
  </div>
);

export default SummaryCards;
