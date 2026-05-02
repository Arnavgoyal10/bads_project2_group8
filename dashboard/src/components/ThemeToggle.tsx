"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const STORAGE_KEY = "novamart-theme";

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.documentElement.classList.toggle("light", theme === "light");
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    const initial = stored || "dark";
    setTheme(initial);
    applyTheme(initial);
  }, []);

  function toggle() {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  }

  return (
    <button
      onClick={toggle}
      className="flex h-9 w-full items-center justify-center gap-2 rounded-lg border border-slate-800 bg-slate-900 px-2 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-100"
      aria-label="Toggle theme"
      suppressHydrationWarning
    >
      {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      <span>{theme === "light" ? "Dark" : "Light"}</span>
    </button>
  );
}
