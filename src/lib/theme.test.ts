import assert from "node:assert/strict";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import { themeInitializationScript, toggleTheme } from "./theme";

test("theme initialization restores only supported preferences and defaults to light", () => {
  for (const [saved, expected] of [["dark", "dark"], ["light", "light"], [null, "light"], ["invalid", "light"]]) {
    const root = { dataset: {} as Record<string, string> };
    runInNewContext(themeInitializationScript, {
      document: { documentElement: root },
      localStorage: { getItem: (key: string) => { assert.equal(key, "portfolio-theme"); return saved; } },
    });
    assert.equal(root.dataset.theme, expected);
  }
});

test("theme initialization stays light when browser storage is blocked", () => {
  const root = { dataset: {} as Record<string, string> };
  runInNewContext(themeInitializationScript, {
    document: { documentElement: root },
    get localStorage() { throw new Error("Storage blocked"); },
  });
  assert.equal(root.dataset.theme, "light");
});

test("the toggle changes the current theme and persists it, even if storage later fails", (t) => {
  const root = { dataset: { theme: "light" } };
  const saved = new Map<string, string>();
  let blocked = false;
  const globals = {
    document: { documentElement: root },
    localStorage: {
      setItem(key: string, value: string) {
        if (blocked) throw new Error("Storage blocked");
        saved.set(key, value);
      },
    },
  };
  for (const [name, value] of Object.entries(globals)) {
    const original = Object.getOwnPropertyDescriptor(globalThis, name);
    Object.defineProperty(globalThis, name, { configurable: true, value });
    t.after(() => {
      if (original) Object.defineProperty(globalThis, name, original);
      else Reflect.deleteProperty(globalThis, name);
    });
  }
  toggleTheme();
  assert.equal(root.dataset.theme, "dark");
  assert.equal(saved.get("portfolio-theme"), "dark");
  toggleTheme();
  assert.equal(root.dataset.theme, "light");
  assert.equal(saved.get("portfolio-theme"), "light");
  blocked = true;
  assert.doesNotThrow(toggleTheme);
  assert.equal(root.dataset.theme, "dark");
});
