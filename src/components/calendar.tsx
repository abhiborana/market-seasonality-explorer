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

import {
  getDays,
  getViewRange,
  getVolatilityColor,
  handleNext,
  handlePrev,
} from "@/lib/canlendarUtils";
import { CalendarProps, DayMetrics, ViewMode } from "@/types";
import { format } from "date-fns";
import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import "jspdf-autotable";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { defaultStyles, FileIcon } from "react-file-icon";
import { CalendarCell } from "./CalendarCell";
import { DayMetricsCard } from "./MetricsTooltip";

function getPerformanceArrow(performance: number) {
  if (performance > 0)
    return <span className="text-green-600 text-lg">&#8593;</span>;
  if (performance < 0)
    return <span className="text-red-600 text-lg">&#8595;</span>;
  return <span className="text-gray-400 text-lg">&#8212;</span>;
}

function getVolumeBar(volume: number) {
  return (
    <div
      className="w-full h-2 rounded bg-blue-300 mt-1"
      style={{
        width: `${Math.min(100, Math.log10(volume + 1) * 20)}%`,
        background: "linear-gradient(90deg,#60a5fa,#2563eb)",
      }}
    />
  );
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
    fetchData(getViewRange(view, currentMonth, selectedDate));
  }, [instrument, currentMonth, view, selectedDate]);

  // Keyboard navigation and day selection logic remain unchanged...

  const days = useMemo(
    () => getDays(view, currentMonth, selectedDate),
    [view, currentMonth, selectedDate]
  );

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
            onClick={() =>
              handlePrev(
                view,
                currentMonth,
                selectedDate,
                setCurrentMonth,
                setSelectedDate
              )
            }
            aria-label="Previous"
            className="rounded-full"
          >
            <span className="hidden md:inline">Previous</span>
            <span className="md:hidden">&#8592;</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleNext(
                view,
                currentMonth,
                selectedDate,
                setCurrentMonth,
                setSelectedDate
              )
            }
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
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
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
            <TooltipContent>Export data as CSV</TooltipContent>
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
            <TooltipContent>Export data as PDF</TooltipContent>
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
            <TooltipContent>Export data as image</TooltipContent>
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
            return <DayMetricsCard d={d} date={selectedDate} />;
          })()}
        </div>
      )}
    </div>
  );
};

export default Calendar;
