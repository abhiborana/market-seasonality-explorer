"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";

type Order = [string, string]; // [price, quantity]

interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

interface Props {
  instrument: string;
}

const OrderBook: React.FC<Props> = ({ instrument }) => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const symbol = instrument.toLowerCase();
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol}@depth`
    );
    wsRef.current = ws;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setOrderBook({
          bids: data.b?.slice(0, 10) || [],
          asks: data.a?.slice(0, 10) || [],
        });
        setLoading(false);
      } catch (err) {
        setError("Failed to parse orderbook data.");
        setLoading(false);
      }
    };

    ws.onerror = () => {
      setError("WebSocket error.");
      setLoading(false);
    };

    return () => {
      ws.close();
    };
  }, [instrument]);

  return (
    <Card className="w-full mx-auto shadow-lg border">
      <CardHeader className={""}>
        <CardTitle className="text-center text-lg font-bold">
          {instrument.replace("USDT", "/USDT")} Order Book
        </CardTitle>
      </CardHeader>
      <CardContent className="px-2 py-4">
        {loading ? (
          <Skeleton className="h-32 w-full" />
        ) : error ? (
          <div className="text-red-600 text-center py-4">{error}</div>
        ) : (
          <div className="flex gap-4">
            {/* Bids */}
            <div className="flex-1 bg-green-50/40 rounded-lg shadow-inner p-2">
              <div className="sticky top-0 z-10 bg-green-50/60 rounded-t-lg py-1 mb-2 flex items-center justify-center gap-2 font-semibold text-green-700">
                <ArrowUpRight className="w-4 h-4" />
                Bids
              </div>
              <div className="space-y-1">
                {orderBook.bids.map((bid, i) => {
                  // Depth bar width based on size
                  const size = parseFloat(bid[1]);
                  const maxSize = Math.max(
                    ...orderBook.bids.map((b) => parseFloat(b[1]))
                  );
                  const barWidth = maxSize ? (size / maxSize) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="relative flex justify-between items-center px-2 py-1 rounded group"
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-green-200/60 rounded"
                        style={{ width: `${barWidth}%`, zIndex: 0 }}
                      />
                      <span className="relative z-10 text-green-700 font-mono font-bold">
                        {parseFloat(bid[0]).toFixed(2)}
                      </span>
                      <span className="relative z-10 font-mono text-xs">
                        {size.toFixed(4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* Asks */}
            <div className="flex-1 bg-red-50/40 rounded-lg shadow-inner p-2">
              <div className="sticky top-0 z-10 bg-red-50/60 rounded-t-lg py-1 mb-2 flex items-center justify-center gap-2 font-semibold text-red-700">
                <ArrowDownRight className="w-4 h-4" />
                Asks
              </div>
              <div className="space-y-1">
                {orderBook.asks.map((ask, i) => {
                  const size = parseFloat(ask[1]);
                  const maxSize = Math.max(
                    ...orderBook.asks.map((a) => parseFloat(a[1]))
                  );
                  const barWidth = maxSize ? (size / maxSize) * 100 : 0;
                  return (
                    <div
                      key={i}
                      className="relative flex justify-between items-center px-2 py-1 rounded group"
                    >
                      <div
                        className="absolute left-0 top-0 h-full bg-red-200/60 rounded"
                        style={{ width: `${barWidth}%`, zIndex: 0 }}
                      />
                      <span className="relative z-10 text-red-700 font-mono font-bold">
                        {parseFloat(ask[0]).toFixed(2)}
                      </span>
                      <span className="relative z-10 font-mono text-xs">
                        {size.toFixed(4)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderBook;
