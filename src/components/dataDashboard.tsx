"use client";

import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CircleDollarSign,
  LineChart,
  Sigma,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import React from "react";
import { Bar, BarChart, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";

interface DayMetrics {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  volatility: number;
  performance: number;
  // Add these if available:
  ma7?: number;
  ma21?: number;
  rsi?: number;
  vix?: number;
  benchmarkPerformance?: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  data: DayMetrics | null;
}

export function DataDashboard({ open, onClose, data }: Props) {
  if (!data) return null;

  const chartData = [
    { name: "Volatility", value: data.volatility },
    { name: "Volume", value: data.volume },
    { name: "Performance", value: data.performance },
  ];

  return (
    <Drawer open={open} onOpenChange={onClose}>
      <DrawerContent className="w-full flex justify-center items-center bg-background text-gray-900 shadow-xl border-l">
        <DrawerHeader className="max-w-md flex flex-col gap-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart2 className="w-6 h-6 text-indigo-600" />
            <h3 className="font-bold text-xl">{data.date}</h3>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>Open:</span>
              <span className="font-mono">{data.open.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-purple-500" />
              <span>Close:</span>
              <span className="font-mono">{data.close.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowUpRight className="w-4 h-4 text-green-500" />
              <span>High:</span>
              <span className="font-mono">{data.high.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2">
              <ArrowDownRight className="w-4 h-4 text-red-500" />
              <span>Low:</span>
              <span className="font-mono">{data.low.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <CircleDollarSign className="w-4 h-4 text-blue-700" />
              <span>Volume:</span>
              <span className="font-mono">{data.volume.toFixed(2)}</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              <BarChart2 className="w-4 h-4 text-yellow-500" />
              <span>Volatility:</span>
              <span className="font-mono">{data.volatility.toFixed(2)}%</span>
            </div>
            <div className="flex items-center gap-2 col-span-2">
              {data.performance > 0 ? (
                <ArrowUpRight className="w-4 h-4 text-green-500" />
              ) : data.performance < 0 ? (
                <ArrowDownRight className="w-4 h-4 text-red-500" />
              ) : (
                <BarChart2 className="w-4 h-4 text-gray-400" />
              )}
              <span>Performance:</span>
              <span
                className={
                  data.performance > 0
                    ? "text-green-600 font-mono"
                    : data.performance < 0
                    ? "text-red-600 font-mono"
                    : "text-gray-600 font-mono"
                }
              >
                {data.performance.toFixed(2)}%
              </span>
            </div>
            {/* Optional: Technical indicators */}
            {typeof data.ma7 === "number" && (
              <div className="flex items-center gap-2 col-span-2">
                <LineChart className="w-4 h-4 text-indigo-500" />
                <span>MA 7:</span>
                <span className="font-mono">{data.ma7.toFixed(2)}</span>
              </div>
            )}
            {typeof data.ma21 === "number" && (
              <div className="flex items-center gap-2 col-span-2">
                <LineChart className="w-4 h-4 text-indigo-700" />
                <span>MA 21:</span>
                <span className="font-mono">{data.ma21.toFixed(2)}</span>
              </div>
            )}
            {typeof data.rsi === "number" && (
              <div className="flex items-center gap-2 col-span-2">
                <Activity className="w-4 h-4 text-pink-500" />
                <span>RSI:</span>
                <span className="font-mono">{data.rsi.toFixed(2)}</span>
              </div>
            )}
            {typeof data.vix === "number" && (
              <div className="flex items-center gap-2 col-span-2">
                <Sigma className="w-4 h-4 text-orange-500" />
                <span>VIX-like:</span>
                <span className="font-mono">{data.vix.toFixed(2)}</span>
              </div>
            )}
            {typeof data.benchmarkPerformance === "number" && (
              <div className="flex items-center gap-2 col-span-2">
                <BarChart2 className="w-4 h-4 text-gray-700" />
                <span>Benchmark:</span>
                <span className="font-mono">
                  {data.benchmarkPerformance.toFixed(2)}%
                </span>
              </div>
            )}
          </div>
          <div className="mt-4">
            <BarChart width={300} height={200} data={chartData}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip />
              <Bar dataKey="value" fill="#6366f1" radius={[8, 8, 0, 0]} />
            </BarChart>
          </div>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
