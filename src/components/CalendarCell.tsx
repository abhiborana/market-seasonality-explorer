import { Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format, isSameDay, isToday } from "date-fns";
import React from "react";
import { MetricsTooltip } from "./MetricsTooltip";

interface DayMetrics {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  volatility: number;
  performance: number;
}

interface CalendarCellProps {
  day: Date;
  d?: DayMetrics;
  selectedDate: Date;
  metric: string;
  onClick: () => void;
  getVolatilityColor: (v: number) => string;
  getPerformanceArrow: (p: number) => React.ReactNode;
  getVolumeBar: (v: number) => React.ReactNode;
}

export const CalendarCell: React.FC<CalendarCellProps> = ({
  day,
  d,
  selectedDate,
  metric,
  onClick,
  getVolatilityColor,
  getPerformanceArrow,
  getVolumeBar,
}) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <div
        tabIndex={0}
        onClick={onClick}
        className={cn(
          "group relative min-h-[80px] h-24 w-full border md:rounded-xl cursor-pointer flex flex-col items-center justify-center transition-all duration-150 outline-none bg-white shadow-sm",
          isToday(day) && "ring-2 ring-indigo-600 bg-accent",
          selectedDate &&
            isSameDay(selectedDate, day) &&
            "ring-2 ring-blue-400 bg-blue-50",
          "hover:scale-[1.04] hover:shadow-lg focus:ring-2 focus:ring-indigo-400"
        )}
      >
        {/* Date */}
        <span className="absolute top-2 left-2 text-xs font-bold text-gray-700 group-hover:text-indigo-700 transition">
          {format(day, "d")}
        </span>
        {/* Metric & Indicators */}
        {d ? (
          <div className="flex flex-col items-center justify-center gap-2 mt-4 w-full">
            <div className="flex flex-col md:flex-row items-center gap-1">
              {getPerformanceArrow(d.performance)}
              <span
                className={cn(
                  "text-xs font-semibold",
                  metric === "volatility"
                    ? "text-yellow-700"
                    : metric === "volume"
                    ? "text-blue-700"
                    : d.performance > 0
                    ? "text-green-700"
                    : d.performance < 0
                    ? "text-red-700"
                    : "text-gray-700"
                )}
              >
                {metric === "volatility"
                  ? `${d.volatility.toFixed(1)}%`
                  : metric === "volume"
                  ? d.volume.toFixed(0)
                  : `${d.performance.toFixed(1)}%`}
              </span>
            </div>
            {/* Volume Bar */}
            <div className="w-4/5 mx-auto h-2 rounded bg-gray-200 mt-1 overflow-hidden hidden md:block">
              <div
                className="h-full rounded bg-blue-500/70"
                style={{
                  width: `${Math.min(100, Math.log10(d.volume + 1) * 20)}%`,
                }}
              />
            </div>
          </div>
        ) : (
          <span className="text-gray-300 text-xs mt-8">No Data</span>
        )}
        {/* Focus ring for accessibility */}
        <span className="absolute inset-0 pointer-events-none rounded-xl ring-2 ring-transparent group-focus:ring-indigo-400 transition" />
      </div>
    </TooltipTrigger>
    {d && <MetricsTooltip day={day} d={d} />}
  </Tooltip>
);
