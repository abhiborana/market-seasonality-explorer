import axios from "axios";

const BINANCE_API = "https://api.binance.com/api/v3/depth";

export async function fetchOrderBook(
  symbol: string = "BTCUSDT",
  limit: number = 5
) {
  const res = await axios.get(BINANCE_API, { params: { symbol, limit } });
  return res.data; // { bids: [...], asks: [...] }
}
