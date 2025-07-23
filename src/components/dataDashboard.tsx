"use client";

import { Drawer, DrawerContent, DrawerHeader } from "@/components/ui/drawer";
import { DayMetrics } from "@/lib/dataGenerator";
import React from "react";
import { Bar, BarChart, Tooltip as ChartTooltip, XAxis, YAxis } from "recharts";

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
      <DrawerContent className={""}>
        <DrawerHeader className={"flex flex-col"}>
          <h3 className="font-bold text-lg">{data.date}</h3>
          <p>Volatility: {data.volatility.toFixed(2)}</p>
          <p>Volume: {data.volume}</p>
          <p>Performance: {data.performance.toFixed(2)}%</p>
          <BarChart width={300} height={200} data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <ChartTooltip />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </DrawerHeader>
      </DrawerContent>
    </Drawer>
  );
}
