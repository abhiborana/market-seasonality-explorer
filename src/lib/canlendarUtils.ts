import {
  addDays,
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  startOfMonth,
  startOfWeek,
  subMonths,
} from "date-fns";

export function getViewRange(
  view: string,
  currentMonth: Date,
  selectedDate: Date
) {
  if (view === "month") {
    const start = startOfWeek(startOfMonth(currentMonth));
    const end = endOfWeek(endOfMonth(currentMonth));
    return { start, end };
  } else if (view === "week") {
    const start = startOfWeek(currentMonth);
    const end = endOfWeek(currentMonth);
    return { start, end };
  } else {
    return { start: selectedDate, end: selectedDate };
  }
}

export function getDays(view: string, currentMonth: Date, selectedDate: Date) {
  if (view === "month") {
    const monthStart = startOfWeek(startOfMonth(currentMonth));
    const monthEnd = endOfWeek(endOfMonth(currentMonth));
    return eachDayOfInterval({ start: monthStart, end: monthEnd });
  } else if (view === "week") {
    const weekStart = startOfWeek(currentMonth);
    const weekEnd = endOfWeek(currentMonth);
    return eachDayOfInterval({ start: weekStart, end: weekEnd });
  } else {
    return [selectedDate];
  }
}

export function handlePrev(
  view: string,
  currentMonth: Date,
  selectedDate: Date,
  setCurrentMonth: (d: Date) => void,
  setSelectedDate: (d: Date) => void
) {
  if (view === "month") setCurrentMonth(subMonths(currentMonth, 1));
  else if (view === "week") setCurrentMonth(addDays(currentMonth, -7));
  else setSelectedDate(addDays(selectedDate, -1));
}

export function handleNext(
  view: string,
  currentMonth: Date,
  selectedDate: Date,
  setCurrentMonth: (d: Date) => void,
  setSelectedDate: (d: Date) => void
) {
  if (view === "month") setCurrentMonth(addMonths(currentMonth, 1));
  else if (view === "week") setCurrentMonth(addDays(currentMonth, 7));
  else setSelectedDate(addDays(selectedDate, 1));
}

export function getVolatilityColor(v: number) {
  if (v < 1) return "bg-green-500/10";
  if (v < 3) return "bg-yellow-500/10";
  return "bg-red-500/10";
}
