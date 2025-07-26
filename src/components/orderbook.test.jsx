import { render, screen } from "@testing-library/react";
import React from "react";
import OrderBook from "./orderbook";

// Mock dependencies if needed
jest.mock("@/components/ui/card", () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardTitle: ({ children }) => <div>{children}</div>,
  CardContent: ({ children }) => <div>{children}</div>,
}));
jest.mock("@/components/ui/skeleton", () => ({
  Skeleton: () => <div>Loading...</div>,
}));

describe("OrderBook", () => {
  it("renders loading state initially", () => {
    render(<OrderBook instrument="BTCUSDT" />);
    expect(screen.getByText(/Loading/i)).toBeInTheDocument();
  });

  // Add more tests for loaded state if you need to mock data fetching
});
