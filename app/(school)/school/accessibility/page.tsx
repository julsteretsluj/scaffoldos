"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const KEY = "scaffold-os-a11y";

export default function AccessibilityPage() {
  const [prefs, setPrefs] = useState({
    dyslexic: false,
    spacing: "normal",
    focusMode: false,
    palette: "paper",
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setPrefs(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(prefs));
    document.documentElement.dataset.dyslexic = prefs.dyslexic ? "1" : "0";
    document.documentElement.dataset.spacing = prefs.spacing;
    document.documentElement.dataset.focus = prefs.focusMode ? "1" : "0";
    document.documentElement.dataset.palette = prefs.palette;
  }, [prefs]);

  return (
    <div className="space-y-6">
      <header className="border-b border-[var(--rule)] pb-4">
        <p className="kicker">Neurodivergent UX</p>
        <h1 className="mt-1 font-serif text-3xl font-black text-[var(--ink)]">
          Access settings
        </h1>
        <p className="mt-2 text-sm text-[var(--ink-secondary)]">
          Device-local preferences. OpenDyslexic-style spacing and focus mode stay on this browser only.
        </p>
      </header>
      <div className="space-y-4 border border-[var(--rule)] p-5">
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Wider letter spacing (dyslexia-friendly)</span>
          <input
            type="checkbox"
            checked={prefs.dyslexic}
            onChange={(e) => setPrefs({ ...prefs, dyslexic: e.target.checked })}
          />
        </label>
        <label className="flex items-center justify-between gap-4 text-sm">
          <span>Focus mode (hint for dense pages)</span>
          <input
            type="checkbox"
            checked={prefs.focusMode}
            onChange={(e) => setPrefs({ ...prefs, focusMode: e.target.checked })}
          />
        </label>
        <div className="space-y-2 text-sm">
          <p>Line spacing</p>
          <div className="flex gap-2">
            {(["normal", "relaxed", "loose"] as const).map((s) => (
              <Button
                key={s}
                type="button"
                size="sm"
                variant={prefs.spacing === s ? "default" : "secondary"}
                onClick={() => setPrefs({ ...prefs, spacing: s })}
              >
                {s}
              </Button>
            ))}
          </div>
        </div>
        <div className="space-y-2 text-sm">
          <p>Palette</p>
          <div className="flex gap-2">
            {(["paper", "sage", "slate"] as const).map((p) => (
              <Button
                key={p}
                type="button"
                size="sm"
                variant={prefs.palette === p ? "default" : "secondary"}
                onClick={() => setPrefs({ ...prefs, palette: p })}
              >
                {p}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
