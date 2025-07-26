import { TooltipContent } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";

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

export const MetricsTooltip: React.FC<{ day: Date; d: DayMetrics }> = ({
  day,
  d,
}) => (
  <TooltipContent className="max-w-xs bg-white text-gray-900 shadow-lg rounded-xl p-4 border border-gray-200">
    <DayMetricsCard d={d} date={day} />
  </TooltipContent>
);

// Reuse the card for day view as well
export const DayMetricsCard: React.FC<{ d: DayMetrics; date: Date }> = ({
  d,
  date,
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center gap-2 mb-2">
      <span className="font-bold text-indigo-700 text-base">
        {format(date, "PPP")}
      </span>
      {d.performance > 0 ? (
        <ArrowUpRight className="w-5 h-5 text-green-500" />
      ) : d.performance < 0 ? (
        <ArrowDownRight className="w-5 h-5 text-red-500" />
      ) : (
        <BarChart2 className="w-5 h-5 text-gray-400" />
      )}
      <span
        className={cn(
          "font-semibold",
          d.performance > 0
            ? "text-green-600"
            : d.performance < 0
            ? "text-red-600"
            : "text-gray-600"
        )}
      >
        {d.performance.toFixed(2)}%
      </span>
    </div>
    <div className="grid grid-cols-2 gap-2 text-sm">
      <div className="flex items-center gap-1">
        <TrendingUp className="w-4 h-4 text-blue-500" />
        <span>Open:</span>
        <span className="font-mono">{d.open.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-1">
        <TrendingDown className="w-4 h-4 text-purple-500" />
        <span>Close:</span>
        <span className="font-mono">{d.close.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-1">
        <ArrowUpRight className="w-4 h-4 text-green-500" />
        <span>High:</span>
        <span className="font-mono">{d.high.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-1">
        <ArrowDownRight className="w-4 h-4 text-red-500" />
        <span>Low:</span>
        <span className="font-mono">{d.low.toFixed(2)}</span>
      </div>
      <div className="flex items-center gap-1 col-span-2">
        <BarChart2 className="w-4 h-4 text-yellow-500" />
        <span>Volatility:</span>
        <span className="font-mono">{d.volatility.toFixed(2)}%</span>
      </div>
      <div className="flex items-center gap-1 col-span-2">
        <CircleDollarSign className="w-4 h-4 text-blue-700" />
        <span>Volume:</span>
        <span className="font-mono">{d.volume.toFixed(2)}</span>
      </div>
    </div>
  </div>
);
