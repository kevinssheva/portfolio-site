const themeStorageKey = "portfolio-theme";

// Runs in <head> before content paints; only a known saved preference is used.
export const themeInitializationScript = `(()=>{let theme="light";try{theme=localStorage.getItem(${JSON.stringify(themeStorageKey)})==="dark"?"dark":"light"}catch{}document.documentElement.dataset.theme=theme})()`;

export function toggleTheme() {
  const root = document.documentElement;
  const theme = root.dataset.theme === "dark" ? "light" : "dark";
  root.dataset.theme = theme;
  try {
    localStorage.setItem(themeStorageKey, theme);
  } catch {
    // The toggle still works for this page when browser storage is unavailable.
  }
}
