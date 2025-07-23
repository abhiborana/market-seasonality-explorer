"use client";

import React, { useEffect, useRef, useState } from "react";

type Order = [string, string]; // [price, quantity]

interface OrderBookData {
  bids: Order[];
  asks: Order[];
}

const OrderBook: React.FC = () => {
  const [orderBook, setOrderBook] = useState<OrderBookData>({
    bids: [],
    asks: [],
  });
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    // Connect to Binance Depth WebSocket
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@depth");
    wsRef.current = ws;

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // We only take top 10 bids and asks for demo
      setOrderBook({
        bids: data.b?.slice(0, 10) || [],
        asks: data.a?.slice(0, 10) || [],
      });
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <div className="p-4 border rounded-md bg-white shadow-md w-full max-w-md">
      <h2 className="text-lg font-bold text-center mb-4">
        BTC/USDT Order Book
      </h2>
      <div className="flex gap-4">
        {/* Bids */}
        <div className="flex-1">
          <h3 className="text-green-600 font-semibold text-center">Bids</h3>
          <div className="text-sm">
            {orderBook.bids.map((bid, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-green-700">
                  {parseFloat(bid[0]).toFixed(2)}
                </span>
                <span>{parseFloat(bid[1]).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Asks */}
        <div className="flex-1">
          <h3 className="text-red-600 font-semibold text-center">Asks</h3>
          <div className="text-sm">
            {orderBook.asks.map((ask, i) => (
              <div key={i} className="flex justify-between">
                <span className="text-red-700">
                  {parseFloat(ask[0]).toFixed(2)}
                </span>
                <span>{parseFloat(ask[1]).toFixed(4)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderBook;
