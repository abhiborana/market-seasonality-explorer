import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { Filters } from "./filters";

describe("Filters", () => {
  it("calls setInstrument and setMetric on change", () => {
    const setInstrument = jest.fn();
    const setMetric = jest.fn();
    const { getByText } = render(
      <Filters
        instrument="BTCUSDT"
        setInstrument={setInstrument}
        metric="volatility"
        setMetric={setMetric}
      />
    );
    fireEvent.click(getByText("BTC/USDT"));
    fireEvent.click(getByText("Volatility"));
    // You may need to adjust selectors based on how Select works in your UI library
  });
});
