"use client";

import Calendar from "@/components/calendar";
import { Filters } from "@/components/filters";
import OrderBook from "@/components/orderbook";
import { useState } from "react";

export default function Home() {
  const [instrument, setInstrument] = useState("BTCUSDT");
  const [metric, setMetric] = useState("volatility");

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">Market Seasonality Explorer</h1>
      <Filters
        instrument={instrument}
        setInstrument={setInstrument}
        metric={metric}
        setMetric={setMetric}
      />
      <div className="mt-6">
        <Calendar />
      </div>
      <OrderBook />
    </main>
  );
}
