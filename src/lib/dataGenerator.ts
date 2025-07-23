import { format, subDays } from "date-fns";

export interface DayMetrics {
  date: string;
  volatility: number; // 0-100
  volume: number;
  performance: number; // -100 to +100
}

export function generateMockData(days = 60): Record<string, DayMetrics> {
  const data: Record<string, DayMetrics> = {};
  for (let i = 0; i < days; i++) {
    const date = format(subDays(new Date(), i), "yyyy-MM-dd");
    data[date] = {
      date,
      volatility: Math.random() * 100,
      volume: Math.floor(Math.random() * 1000),
      performance: (Math.random() - 0.5) * 20,
    };
  }
  return data;
}
