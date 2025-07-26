# GoQuant: Market Seasonality Explorer

GoQuant is a modern, interactive web application for exploring market seasonality, volatility, and liquidity patterns across various instruments and timeframes. It features a responsive calendar heatmap, advanced data dashboards, orderbook visualization, export tools, and accessibility-focused UI with multiple color themes.

---

## 🚀 Getting Started

### 1. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 2. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
src/
  app/
    layout.jsx         # Root layout, font, and theme setup
    page.jsx           # Main page, state, and composition
    globals.css        # Tailwind, theme, and global styles
  components/
    calendar.tsx       # Calendar heatmap & period selector
    dataDashboard.tsx  # Drawer/modal for detailed day/period metrics
    filters.tsx        # Instrument & metric selectors
    orderbook.tsx      # Orderbook visualization
    ThemeSwitcher.tsx  # Theme switcher (default, high contrast, colorblind)
    ui/                # Reusable UI primitives (button, card, chart, etc.)
  lib/
    binance.ts         # Binance API helpers
    dataGenerator.ts   # Data simulation/generation
    utils.js           # Utility functions
  store/
    index.js           # Zustand/Redux store
    reducer.js         # Store reducer
```

---

## 🖥️ Features

- **Calendar Heatmap:**  
  Visualize volatility, volume, and performance for each day, week, or month.  
  Keyboard navigation and responsive design.

- **Data Dashboard:**  
  Side panel/modal with detailed OHLCV, volatility, technical indicators, and benchmark comparisons.

- **Orderbook Visualization:**  
  Modern, production-grade orderbook with depth bars and live updates.

- **Filters:**  
  Select instrument and metric for focused analysis.

- **Export Tools:**  
  Export calendar data as CSV, PDF, or image (with html2canvas-pro).

- **Accessibility:**  
  Keyboard navigation, focus rings, and color contrast options.

- **Animation Effects:**  
  Smooth transitions for data, drawers, and tooltips.

---

## 🧩 Bonus Features

- **Historical Patterns:**  
  Highlight recurring patterns or anomalies in the calendar.

- **Integration Ready:**  
  Easily connect to real APIs (Binance, etc.) via `lib/binance.ts`.

---

## 📦 Export Functionality

- **CSV:**  
  Exports all visible calendar data.
- **PDF:**  
  Uses jsPDF + autotable for tabular export.
- **Image:**  
  Uses html2canvas-pro (with oklch patch) for screenshotting the calendar grid.

---

## 🛠️ Tech Stack

- **Next.js** (App Router)
- **React 19**
- **Tailwind CSS** (with custom themes)
- **shadcn/ui** (for UI primitives)
- **Recharts** (for charts)
- **jsPDF & autotable** (PDF export)
- **html2canvas-pro** (image export)
- **Radix UI** (for accessible popovers, tooltips, drawers)

---

## 🧑‍💻 Development

- All UI is mobile-first and responsive.
- All exports are available from the calendar header.

---

## 📄 License

MIT

---

## 🙏 Credits

- [Next.js](https://nextjs.org)
- [shadcn/ui](https://ui.shadcn.com)
- [Recharts](https://recharts.org)
- [jsPDF](https://github.com/parallax/jsPDF)
- [html2canvas-pro](https://github.com/niklasvh/html2canvas)
- [Radix UI](https://www.radix-ui.com/)

---

For questions or contributions, open an issue or PR!