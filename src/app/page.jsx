"use client";

import Calendar from "@/components/calendar";
import { DataDashboard } from "@/components/dataDashboard";
import { Filters } from "@/components/filters";
import OrderBook from "@/components/orderbook";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";

export default function Home() {
  const [instrument, setInstrument] = useState("BTCUSDT");
  const [metric, setMetric] = useState("volatility");
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [dashboardData, setDashboardData] = useState(null);

  return (
    <dic className="max-w-7xl container mx-auto px-4 py-6">
      <div className="flex items-center gap-2 justify-between px-4">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Market Seasonality Explorer
        </h1>
      </div>
      <Card className="mb-6 mx-4">
        <CardContent>
          <Filters
            instrument={instrument}
            setInstrument={setInstrument}
            metric={metric}
            setMetric={setMetric}
          />
        </CardContent>
      </Card>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 w-full">
        <div className="md:col-span-2">
          <Calendar
            instrument={instrument}
            metric={metric}
            onDateSelect={(data) => {
              setDashboardData(data);
              setDashboardOpen(true);
            }}
          />
        </div>
        <div className="xl:col-span-1 col-span-2">
          <OrderBook instrument={instrument} />
        </div>
      </div>
      <DataDashboard
        open={dashboardOpen}
        onClose={() => setDashboardOpen(false)}
        data={dashboardData}
      />
    </dic>
  );
}
