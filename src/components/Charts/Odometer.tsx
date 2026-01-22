import OdometerLib from "react-odometerjs";
import "odometer/themes/odometer-theme-minimal.css";

type OdometerProps = {
  value: number | string;
  durationMs?: number;
  format?: string;
  className?: string;
  suffix?: string;
};

export const Odometer = ({
  value,
  durationMs = 800,
  format = "(,ddd)",
  className = "",
  suffix = "",
}: OdometerProps) => {
  const numeric = typeof value === "number" ? value : Number(String(value).replace(/[^0-9.-]/g, ""));
  const safeValue = Number.isFinite(numeric) ? numeric : 0;

  return (
    <div className={`flex items-baseline gap-1 ${className}`}>
      <OdometerLib value={safeValue} duration={durationMs} format={format} theme="minimal" />
      {suffix ? <span className="text-gray-300 text-sm">{suffix}</span> : null}
    </div>
  );
};
