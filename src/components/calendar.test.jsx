import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Calendar from "./calendar";

describe("Calendar", () => {
  it("renders the calendar and allows date selection", () => {
    const onDateSelect = jest.fn();
    render(<Calendar selectedDate={null} onDateSelect={onDateSelect} />);
    // Check that calendar renders
    expect(screen.getByRole("grid")).toBeInTheDocument();
    // Simulate selecting a date (assuming dates are rendered as buttons)
    const dateButton = screen
      .getAllByRole("button")
      .find((btn) => !isNaN(Number(btn.textContent)));
    if (dateButton) {
      fireEvent.click(dateButton);
      expect(onDateSelect).toHaveBeenCalled();
    }
  });
});
