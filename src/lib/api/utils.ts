type RelativeTimeUnit = Intl.RelativeTimeFormatUnit;

const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export const formatRelativeDate = (input?: string | null): string => {
  if (!input) return "Recently created";
  const date = new Date(input);
  if (Number.isNaN(date.getTime())) return "Recently created";

  const now = Date.now();
  const diffMs = date.getTime() - now;
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  const unit: RelativeTimeUnit =
    Math.abs(diffMinutes) < 60
      ? "minute"
      : Math.abs(diffHours) < 24
        ? "hour"
        : "day";
  const value =
    unit === "minute"
      ? diffMinutes
      : unit === "hour"
        ? diffHours
        : diffDays;

  return rtf.format(value, unit);
};

export const mapSupabaseError = (error?: { message?: string } | null) =>
  new Error(error?.message || "Unexpected Supabase error");

export const normalizeStatus = (status?: string | null): "Published" | "Draft" =>
  status === "Published" || status === "published" ? "Published" : "Draft";
