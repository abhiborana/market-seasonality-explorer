export type ViewMode = "day" | "week" | "month";

export interface DayMetrics {
  date: string;
  open: number;
  close: number;
  high: number;
  low: number;
  volume: number;
  volatility: number;
  performance: number;
}

export interface CalendarProps {
  instrument: string;
  metric: string;
  onDateSelect?: (data: DayMetrics) => void;
}
