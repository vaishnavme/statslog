import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export type TimePeriod = "today" | "24h" | "3d" | "7d" | "1m" | "3m" | "all";

const PERIODS: { label: string; value: TimePeriod }[] = [
  { label: "Today", value: "today" },
  { label: "Last 24 hours", value: "24h" },
  { label: "Last 3 days", value: "3d" },
  { label: "Last 7 days", value: "7d" },
  { label: "Last 1 month", value: "1m" },
  { label: "Last 3 months", value: "3m" },
  { label: "All time", value: "all" },
];

interface TimePeriodSelectProps {
  value: TimePeriod;
  onChange: (value: TimePeriod) => void;
  size?: "sm" | "default";
}

const TimePeriodSelect = (props: TimePeriodSelectProps) => {
  const { value, onChange, size = "default" } = props;

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger size={size}>
        <SelectValue />
      </SelectTrigger>

      <SelectContent position="popper">
        {PERIODS.map((period) => (
          <SelectItem key={period.value} value={period.value}>
            {period.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default TimePeriodSelect;
