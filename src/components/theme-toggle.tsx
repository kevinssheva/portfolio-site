"use client";

import { site } from "@/content/site";
import { toggleTheme } from "@/lib/theme";
import { Icon } from "./icon";

export function ThemeToggle() {
  return (
    <button type="button" className="theme-toggle" onClick={toggleTheme}>
      <span className="theme-when-light">
        <Icon name="moon" size={19} />
        <span className="sr-only">{site.themeLabels.dark}</span>
      </span>
      <span className="theme-when-dark">
        <Icon name="sun" size={19} />
        <span className="sr-only">{site.themeLabels.light}</span>
      </span>
    </button>
  );
}
