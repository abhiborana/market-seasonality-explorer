"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import {
  addDays,
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
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CircleDollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { defaultStyles, FileIcon } from "react-file-icon";

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

interface CalendarProps {
  instrument: string;
  metric: string;
  onDateSelect?: (data: DayMetrics) => void;
}

function exportToCSV(
  data: Record<string, DayMetrics>,
  filename = "calendar.csv"
) {
  const headers = [
    "Date",
    "Open",
    "Close",
    "High",
    "Low",
    "Volume",
    "Volatility",
    "Performance",
  ];
  const rows = Object.values(data).map((d) =>
    [
      d.date,
      d.open,
      d.close,
      d.high,
      d.low,
      d.volume,
      d.volatility,
      d.performance,
    ].join(",")
  );
  const csvContent = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

async function exportToPDF(
  data: Record<string, DayMetrics>,
  filename = "calendar.pdf"
) {
  const autoTable = (await import("jspdf-autotable")).default;
  const doc = new jsPDF();
  const headers = [
    [
      "Date",
      "Open",
      "Close",
      "High",
      "Low",
      "Volume",
      "Volatility",
      "Performance",
    ],
  ];
  const rows = Object.values(data).map((d) => [
    d.date,
    d.open,
    d.close,
    d.high,
    d.low,
    d.volume,
    d.volatility,
    d.performance,
  ]);
  autoTable(doc, {
    head: headers,
    body: rows,
  });
  doc.save(filename);
}

function exportToImage(
  ref: React.RefObject<HTMLDivElement>,
  filename = "calendar.png"
) {
  if (!ref.current) return;
  html2canvas(ref.current).then((canvas) => {
    const link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL();
    link.click();
  });
}

// --- Atomized Tooltip ---
const MetricsTooltip: React.FC<{ day: Date; d: DayMetrics }> = ({ day, d }) => (
  <TooltipContent className="max-w-xs bg-white text-gray-900 shadow-lg rounded-xl p-4 border border-gray-200">
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-indigo-700 text-base">
          {format(day, "PPP")}
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
  </TooltipContent>
);

// --- Atomized Calendar Cell ---
const CalendarCell: React.FC<{
  day: Date;
  d?: DayMetrics;
  selectedDate: Date;
  metric: string;
  onClick: () => void;
  getVolatilityColor: (v: number) => string;
  getPerformanceArrow: (p: number) => React.ReactNode;
  getVolumeBar: (v: number) => React.ReactNode;
}> = ({
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

const Calendar: React.FC<CalendarProps> = ({
  instrument,
  metric,
  onDateSelect,
}) => {
  const [data, setData] = useState<Record<string, DayMetrics>>({});
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [view, setView] = useState<ViewMode>("month");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const gridRef = useRef<HTMLDivElement>(null);

  // Helper to get start/end for current view
  const getViewRange = () => {
    if (view === "month") {
      const start = startOfWeek(startOfMonth(currentMonth));
      const end = endOfWeek(endOfMonth(currentMonth));
      return { start, end };
    } else if (view === "week") {
      const start = startOfWeek(currentMonth);
      const end = endOfWeek(currentMonth);
      return { start, end };
    } else {
      return { start: selectedDate, end: selectedDate };
    }
  };

  // Fetch historical OHLCV data for selected instrument and current view
  useEffect(() => {
    async function fetchData({ start, end }: { start: Date; end: Date }) {
      const interval = "1d";
      const startTime = start.getTime();
      const endTime = end.getTime();
      const url = `klines?symbol=${instrument}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;
      const res = await fetch(`${process.env.NEXT_PUBLIC_BINANCE_API}/${url}`);
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
    fetchData(getViewRange());
  }, [instrument, currentMonth, view, selectedDate]);

  // Navigation logic for Prev/Next buttons
  const handlePrev = () => {
    if (view === "month") setCurrentMonth(subMonths(currentMonth, 1));
    else if (view === "week") setCurrentMonth(addDays(currentMonth, -7));
    else setSelectedDate(addDays(selectedDate, -1));
  };

  const handleNext = () => {
    if (view === "month") setCurrentMonth(addMonths(currentMonth, 1));
    else if (view === "week") setCurrentMonth(addDays(currentMonth, 7));
    else setSelectedDate(addDays(selectedDate, 1));
  };

  // Generate days for current view (memoized for perf)
  const days = useMemo(() => {
    if (view === "month") {
      const monthStart = startOfWeek(startOfMonth(currentMonth));
      const monthEnd = endOfWeek(endOfMonth(currentMonth));
      return eachDayOfInterval({ start: monthStart, end: monthEnd });
    } else if (view === "week") {
      const weekStart = startOfWeek(currentMonth);
      const weekEnd = endOfWeek(currentMonth);
      return eachDayOfInterval({ start: weekStart, end: weekEnd });
    } else {
      return [selectedDate];
    }
  }, [view, currentMonth, selectedDate]);

  // Volatility heatmap color
  const getVolatilityColor = (v: number) => {
    if (v < 1) return "bg-green-500/10";
    if (v < 3) return "bg-yellow-500/10";
    return "bg-red-500/10";
  };

  // Liquidity indicator (volume bar)
  const getVolumeBar = (volume: number) => (
    <div
      className="w-full h-2 rounded bg-blue-300 mt-1"
      style={{
        width: `${Math.min(100, Math.log10(volume + 1) * 20)}%`,
        background: "linear-gradient(90deg,#60a5fa,#2563eb)",
      }}
    />
  );

  // Performance arrow
  const getPerformanceArrow = (performance: number) => {
    if (performance > 0)
      return <span className="text-green-600 text-lg">&#8593;</span>;
    if (performance < 0)
      return <span className="text-red-600 text-lg">&#8595;</span>;
    return <span className="text-gray-400 text-lg">&#8212;</span>;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedDate) return;
      let newDate = selectedDate;
      if (e.key === "ArrowLeft") newDate = addDays(selectedDate, -1);
      if (e.key === "ArrowRight") newDate = addDays(selectedDate, 1);
      if (e.key === "ArrowUp") newDate = addDays(selectedDate, -7);
      if (e.key === "ArrowDown") newDate = addDays(selectedDate, 7);
      if (e.key === "Escape") setSelectedDate(null);
      if (newDate !== selectedDate && days.some((d) => isSameDay(d, newDate))) {
        setSelectedDate(newDate);
        const key = format(newDate, "yyyy-MM-dd");
        if (onDateSelect && data[key]) onDateSelect(data[key]);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedDate, days, data, onDateSelect]);

  // If view is day and selectedDate is not in the current data, pick the first available date from data
  useEffect(() => {
    if (view === "day") {
      const availableDates = Object.keys(data);
      if (availableDates.length > 0) {
        const firstAvailable = availableDates[0];
        if (format(selectedDate, "yyyy-MM-dd") !== firstAvailable) {
          setSelectedDate(new Date(firstAvailable));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view, data]);

  return (
    <div className="p-4 w-full">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4 bg-white/80 rounded-xl shadow px-4 py-3">
        <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 flex items-center gap-2">
          <span className="inline-block px-2 py-1 rounded bg-indigo-50 text-indigo-700 text-base font-semibold">
            {instrument.replace("USDT", "/USDT")}
          </span>
          <span className="text-gray-500 font-normal">-</span>
          <span>
            {view === "day"
              ? format(selectedDate, "PPP")
              : format(currentMonth, "MMMM yyyy")}
          </span>
        </h2>
        <div className="flex gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrev}
            aria-label="Previous"
            className="rounded-full"
          >
            <span className="hidden md:inline">Previous</span>
            <span className="md:hidden">&#8592;</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleNext}
            aria-label="Next"
            className="rounded-full"
          >
            <span className="hidden md:inline">Next</span>
            <span className="md:hidden">&#8594;</span>
          </Button>
          <Select value={view} onValueChange={(v) => setView(v as ViewMode)}>
            <SelectTrigger className="w-28">
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </SelectTrigger>
            <SelectContent className="w-28">
              <SelectItem className={""} value="day">
                Day
              </SelectItem>
              <SelectItem className={""} value="week">
                Week
              </SelectItem>
              <SelectItem className={""} value="month">
                Month
              </SelectItem>
            </SelectContent>
          </Select>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => exportToCSV(data)}
                className="rounded-full [&_svg:not([class*='size-'])]:size-5"
              >
                <FileIcon extension="csv" {...defaultStyles.xlsx} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={""}>Export data as CSV</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => exportToPDF(data)}
                className="rounded-full [&_svg:not([class*='size-'])]:size-5"
              >
                <FileIcon extension="pdf" {...defaultStyles.pdf} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={""}>Export data as PDF</TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => exportToImage(gridRef)}
                className="rounded-full [&_svg:not([class*='size-'])]:size-5"
              >
                <FileIcon extension="jpg" {...defaultStyles.jpg} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={""}>Export data as image</TooltipContent>
          </Tooltip>
        </div>
      </div>

      {view === "month" && (
        <div
          ref={gridRef}
          className="grid grid-cols-7 md:gap-3 text-center gap-0.5 bg-white rounded-2xl p-2 sm:grid-cols-7 xs:grid-cols-4"
        >
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="font-semibold text-gray-600">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const key = format(day, "yyyy-MM-dd");
            const d = data[key];
            return (
              <CalendarCell
                key={key}
                day={day}
                d={d}
                selectedDate={selectedDate}
                metric={metric}
                onClick={() => {
                  setSelectedDate(day);
                  if (onDateSelect && d) onDateSelect(d);
                }}
                getVolatilityColor={getVolatilityColor}
                getPerformanceArrow={getPerformanceArrow}
                getVolumeBar={getVolumeBar}
              />
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
              <CalendarCell
                key={key}
                day={day}
                d={d}
                selectedDate={selectedDate}
                metric={metric}
                onClick={() => {
                  setSelectedDate(day);
                  if (onDateSelect && d) onDateSelect(d);
                }}
                getVolatilityColor={getVolatilityColor}
                getPerformanceArrow={getPerformanceArrow}
                getVolumeBar={getVolumeBar}
              />
            );
          })}
        </div>
      )}

      {view === "day" && (
        <div className="p-4 border rounded">
          <h3 className="text-lg font-bold mb-2">
            {format(selectedDate, "PPP")}
          </h3>
          {(() => {
            const key = format(selectedDate, "yyyy-MM-dd");
            const d = data[key];
            if (!d) return <p>No data available for this day.</p>;
            // Render the content of MetricsTooltip directly, not TooltipContent
            return (
              <div className="max-w-xs bg-white text-gray-900 shadow-lg rounded-xl p-4 border border-gray-200">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-bold text-indigo-700 text-base">
                      {format(selectedDate, "PPP")}
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
                      <span className="font-mono">
                        {d.volatility.toFixed(2)}%
                      </span>
                    </div>
                    <div className="flex items-center gap-1 col-span-2">
                      <CircleDollarSign className="w-4 h-4 text-blue-700" />
                      <span>Volume:</span>
                      <span className="font-mono">{d.volume.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
