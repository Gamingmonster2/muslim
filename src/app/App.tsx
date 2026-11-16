import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";

import { audioEngine } from "../core/audio/engine";
import { allTracks } from "../features/ruqyah/data/sheikhs";
import { AboutPage } from "../features/ruqyah/pages/AboutPage";
import { DuasPage } from "../features/ruqyah/pages/DuasPage";
import { HomePage } from "../features/ruqyah/pages/HomePage";
import { TextPage } from "../features/ruqyah/pages/TextPage";
import { BottomNav } from "./BottomNav";
import { Header } from "./Header";
import { MiniPlayer } from "./MiniPlayer";
import { getStoredTheme, toggleTheme, type Theme } from "./theme";

function Backdrop() {
  return (
    <div className="backdrop" aria-hidden="true">
      <span className="orb orb--1" />
      <span className="orb orb--2" />
      <span className="orb orb--3" />
      <svg className="pattern" focusable="false">
        <defs>
          <pattern id="islamic-star" width="76" height="76" patternUnits="userSpaceOnUse">
            <g fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M38 7 47 29 69 38 47 47 38 69 29 47 7 38 29 29Z" />
              <path d="M13 13 63 63M63 13 13 63" opacity=".32" />
              <circle cx="38" cy="38" r="9" opacity=".55" />
            </g>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#islamic-star)" />
      </svg>
    </div>
  );
}

export function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    const stored = getStoredTheme();
    if (stored) return stored;
    const current = document.documentElement.dataset.theme;
    return current === "dark" ? "dark" : "light";
  });
  const location = useLocation();

  useEffect(() => {
    audioEngine.setPlaylist(allTracks);
    audioEngine.restore();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="site">
      <Backdrop />
      <div className="shell">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((current) => toggleTheme(current))}
        />

        <main className="main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/text" element={<TextPage />} />
            <Route path="/duas" element={<DuasPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <MiniPlayer />
        <BottomNav />
      </div>
    </div>
  );
}
