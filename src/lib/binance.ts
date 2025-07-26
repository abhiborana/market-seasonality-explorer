import axios from "axios";

export async function fetchOrderBook(
  symbol: string = "BTCUSDT",
  limit: number = 5
) {
  const res = await axios.get(`${process.env.NEXT_PUBLIC_BINANCE_API}/depth`, {
    params: { symbol, limit },
  });
  return res.data; // { bids: [...], asks: [...] }
}
