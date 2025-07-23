"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils"; // helper for conditional classes
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";
import React, { useEffect, useState } from "react";

type ViewMode = "day" | "week" | "month";

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

const Calendar: React.FC = () => {
  const [data, setData] = useState<Record<string, DayMetrics>>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  /** Fetch historical OHLCV data */
  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        "https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1d&limit=90"
      );
      const json = await res.json();

      const metrics: Record<string, DayMetrics> = {};
      json.forEach((kline: any) => {
        const openTime = new Date(kline[0]);
        const open = parseFloat(kline[1]);
        const high = parseFloat(kline[2]);
        const low = parseFloat(kline[3]);
        const close = parseFloat(kline[4]);
        const volume = parseFloat(kline[5]);
        const volatility = ((high - low) / open) * 100;
        const performance = ((close - open) / open) * 100;
        const key = format(openTime, "yyyy-MM-dd");
        metrics[key] = {
          date: key,
          open,
          close,
          high,
          low,
          volume,
          volatility,
          performance,
        };
      });
      setData(metrics);
    }
    fetchData();
  }, []);

  /** Generate days for current view */
  const generateDays = () => {
    if (view === "month") {
      const monthStart = startOfWeek(startOfMonth(currentMonth));
      const monthEnd = endOfWeek(endOfMonth(currentMonth));
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    } else if (view === "week") {
      const weekStart = startOfWeek(currentMonth);
      const weekEnd = endOfWeek(currentMonth);
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      return [currentMonth];
    }
  };

  const days = generateDays();

  const getVolatilityColor = (v: number) => {
    if (v < 1) return "bg-green-200";
    if (v < 3) return "bg-yellow-300";
    return "bg-red-300";
  };

  return (
    <div className="p-4 w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">
          BTC/USDT - {format(currentMonth, "MMMM yyyy")}
        </h2>
        <div className="flex gap-2">
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            Prev
          </button>
          <button
            className="px-2 py-1 border rounded"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            Next
          </button>
          <select
            value={view}
            onChange={(e) => setView(e.target.value as ViewMode)}
            className="border px-2 py-1 rounded"
          >
            <option value="day">Day</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </div>
      </div>

      {view === "month" && (
        <div className="grid grid-cols-7 gap-2 text-center">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const d = data[key];
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "p-2 h-20 border rounded cursor-pointer flex flex-col items-center justify-center transition",
                      d ? getVolatilityColor(d.volatility) : "bg-gray-100",
                      isToday(day) && "ring-2 ring-blue-400",
                      selectedDate &&
                        isSameDay(selectedDate, day) &&
                        "ring-4 ring-indigo-600"
                    )}
                  >
                    <span className="font-bold">{format(day, "d")}</span>
                    {d && (
                      <span
                        className={cn(
                          "text-xs",
                          d.performance > 0
                            ? "text-green-700"
                            : d.performance < 0
                            ? "text-red-700"
                            : "text-gray-700"
                        )}
                      >
                        {d.performance.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {d && (
                  <TooltipContent className="max-w-xs">
                    <div className="text-sm">
                      <p>
                        <strong>{format(day, "PPP")}</strong>
                      </p>
                      <p>Open: {d.open.toFixed(2)}</p>
                      <p>Close: {d.close.toFixed(2)}</p>
                      <p>High: {d.high.toFixed(2)}</p>
                      <p>Low: {d.low.toFixed(2)}</p>
                      <p>Volatility: {d.volatility.toFixed(2)}%</p>
                      <p>Volume: {d.volume.toFixed(2)}</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      )}

      {view === "week" && (
        <div className="grid grid-cols-7 gap-2">
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const d = data[key];
            return (
              <Tooltip key={key}>
                <TooltipTrigger asChild>
                  <div
                    onClick={() => setSelectedDate(day)}
                    className={cn(
                      "p-4 h-28 border rounded cursor-pointer flex flex-col items-center justify-center transition",
                      d ? getVolatilityColor(d.volatility) : "bg-gray-100",
                      isToday(day) && "ring-2 ring-blue-400",
                      selectedDate &&
                        isSameDay(selectedDate, day) &&
                        "ring-4 ring-indigo-600"
                    )}
                  >
                    <span className="font-bold">{format(day, "EEE d")}</span>
                    {d && (
                      <span className="text-xs">
                        {d.performance.toFixed(1)}%
                      </span>
                    )}
                  </div>
                </TooltipTrigger>
                {d && (
                  <TooltipContent className="max-w-xs">
                    <div className="text-sm">
                      <p>
                        <strong>{format(day, "PPP")}</strong>
                      </p>
                      <p>Open: {d.open.toFixed(2)}</p>
                      <p>Close: {d.close.toFixed(2)}</p>
                      <p>Volatility: {d.volatility.toFixed(2)}%</p>
                      <p>Volume: {d.volume.toFixed(2)}</p>
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            );
          })}
        </div>
      )}

      {view === "day" && (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-bold mb-2">
            {format(currentMonth, "PPP")}
          </h3>
          {(() => {
            const key = format(currentMonth, "yyyy-MM-dd");
            const d = data[key];
            if (!d) return <p>No data available for this day.</p>;
            return (
              <div className="text-sm space-y-1">
                <p>Open: {d.open.toFixed(2)}</p>
                <p>Close: {d.close.toFixed(2)}</p>
                <p>High: {d.high.toFixed(2)}</p>
                <p>Low: {d.low.toFixed(2)}</p>
                <p>Volatility: {d.volatility.toFixed(2)}%</p>
                <p>Volume: {d.volume.toFixed(2)}</p>
                <p>Performance: {d.performance.toFixed(2)}%</p>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
