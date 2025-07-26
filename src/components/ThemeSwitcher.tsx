import React from "react";

const THEMES = [
  { label: "Default", value: "" },
  { label: "High Contrast", value: "theme-high-contrast" },
  { label: "Colorblind", value: "theme-colorblind" },
];

export function ThemeSwitcher() {
  const setTheme = (theme: string) => {
    document.documentElement.classList.remove(
      "theme-high-contrast",
      "theme-colorblind"
    );
    if (theme) document.documentElement.classList.add(theme);
    localStorage.setItem("theme", theme);
  };

  React.useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved) setTheme(saved);
  }, []);

  return (
    <select
      className="border rounded px-2 py-1"
      onChange={(e) => setTheme(e.target.value)}
      defaultValue={localStorage.getItem("theme") || ""}
      aria-label="Theme"
    >
      {THEMES.map((t) => (
        <option key={t.value} value={t.value}>
          {t.label}
        </option>
      ))}
    </select>
  );
}
