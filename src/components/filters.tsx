"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import React from "react";

interface FiltersProps {
  instrument: string;
  setInstrument: (val: string) => void;
  metric: string;
  setMetric: (val: string) => void;
}

export function Filters({
  instrument,
  setInstrument,
  metric,
  setMetric,
}: FiltersProps) {
  return (
    <div className="flex gap-4">
      <Select value={instrument} onValueChange={setInstrument}>
        <SelectTrigger className="w-48">
          {instrument || "Select Instrument"}
        </SelectTrigger>
        <SelectContent className="w-48">
          <SelectItem className={""} value="BTCUSDT">
            BTC/USDT
          </SelectItem>
          <SelectItem className={""} value="ETHUSDT">
            ETH/USDT
          </SelectItem>
        </SelectContent>
      </Select>

      <Select value={metric} onValueChange={setMetric}>
        <SelectTrigger className="w-48">
          {metric || "Select Metric"}
        </SelectTrigger>
        <SelectContent className="w-48">
          <SelectItem className={""} value="volatility">
            Volatility
          </SelectItem>
          <SelectItem className={""} value="volume">
            Volume
          </SelectItem>
          <SelectItem className={""} value="performance">
            Performance
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
