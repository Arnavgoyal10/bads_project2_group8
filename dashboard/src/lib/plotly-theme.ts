/* eslint-disable @typescript-eslint/no-explicit-any */

export function darkLayout(): Record<string, any> {
  const isLight =
    typeof document !== "undefined" &&
    document.documentElement.getAttribute("data-theme") === "light";

  return {
    paper_bgcolor: "transparent",
    plot_bgcolor: "transparent",
    font: {
      color: isLight ? "#0f172a" : "#e2e8f0",
      family: "Inter, system-ui, sans-serif",
    },
    xaxis: {
      gridcolor: isLight ? "#e2e8f0" : "#334155",
      zerolinecolor: isLight ? "#cbd5e1" : "#475569",
      tickfont: { color: isLight ? "#475569" : "#94a3b8" },
    },
    yaxis: {
      gridcolor: isLight ? "#e2e8f0" : "#334155",
      zerolinecolor: isLight ? "#cbd5e1" : "#475569",
      tickfont: { color: isLight ? "#475569" : "#94a3b8" },
    },
    legend: {
      font: { color: isLight ? "#0f172a" : "#e2e8f0" },
      bgcolor: "transparent",
    },
    margin: { t: 40, r: 20, b: 50, l: 60 },
    hoverlabel: {
      bgcolor: isLight ? "#ffffff" : "#1e293b",
      bordercolor: isLight ? "#e2e8f0" : "#475569",
      font: { color: isLight ? "#0f172a" : "#e2e8f0" },
    },
  };
}

export const PLOTLY_DARK_LAYOUT: Record<string, any> = new Proxy(
  {},
  {
    get(_t, prop: string | symbol) {
      const fresh = darkLayout();
      return (fresh as Record<string | symbol, unknown>)[prop as string];
    },
    has(_t, prop) {
      return prop in darkLayout();
    },
    ownKeys() {
      return Reflect.ownKeys(darkLayout());
    },
    getOwnPropertyDescriptor(_t, prop) {
      const fresh = darkLayout();
      const value = (fresh as Record<string | symbol, unknown>)[prop as string];
      if (value === undefined) return undefined;
      return { enumerable: true, configurable: true, writable: true, value };
    },
  }
);

export const PLOTLY_CONFIG: Record<string, any> = {
  displaylogo: false,
  responsive: true,
  modeBarButtonsToRemove: ["lasso2d", "select2d"],
};

export const CHART_COLORS = [
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4",
  "#f97316",
  "#ec4899",
];
