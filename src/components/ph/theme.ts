export type Theme = "light" | "dark";

const KEY = "ph-theme";
const LEGACY_KEY = "hive-theme";

function storedTheme(): string | null {
  return localStorage.getItem(KEY) ?? localStorage.getItem(LEGACY_KEY);
}

export function getTheme(): Theme {
  try {
    const saved = storedTheme();
    if (saved === "light" || saved === "dark") return saved;
  } catch {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function setTheme(theme: Theme | null) {
  try {
    localStorage.removeItem(LEGACY_KEY);
    if (theme) localStorage.setItem(KEY, theme);
    else localStorage.removeItem(KEY);
  } catch {}
  applyTheme(getTheme());
}

// Inline in <head> so the page never flashes the wrong theme.
export const themeScript = `try{var t=localStorage.getItem("${KEY}")??localStorage.getItem("${LEGACY_KEY}");if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.toggle("dark",t==="dark")}catch(e){}`;
