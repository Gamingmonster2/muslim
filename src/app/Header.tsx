import { Link } from "react-router-dom";
import { Icon } from "../components/Icon";
import { useInstallPrompt } from "../core/useInstallPrompt";
import type { Theme } from "./theme";

function LogoMark() {
  return (
    <svg viewBox="0 0 48 48" width="30" height="30" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--gold-2)" />
          <stop offset="1" stopColor="var(--gold)" />
        </linearGradient>
      </defs>
      <path
        d="M9 37V23a15 15 0 0 1 30 0v14"
        fill="none"
        stroke="url(#logo-gold)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path d="M15 37V24.4a9 9 0 0 1 18 0V37" fill="none" stroke="currentColor" strokeWidth="1.4" opacity=".35" />
      <path
        d="M24 15.6l1.7 4.1 4.1 1.7-4.1 1.7-1.7 4.1-1.7-4.1-4.1-1.7 4.1-1.7 1.7-4.1Z"
        fill="url(#logo-gold)"
      />
      <path d="M13 37h22" stroke="url(#logo-gold)" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

interface HeaderProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Header({ theme, onToggleTheme }: HeaderProps) {
  const { canInstall, install } = useInstallPrompt();

  return (
    <header className="header">
      <Link to="/" className="brand" aria-label="الرقية الشرعية — الصفحة الرئيسية">
        <span className="brand__mark">
          <LogoMark />
        </span>
        <span className="brand__text">
          <span className="brand__title">الرقية الشرعية</span>
          <span className="brand__sub">شفاءٌ ورحمة</span>
        </span>
      </Link>

      <div className="header__actions">
        {canInstall ? (
          <button
            type="button"
            className="icon-btn"
            onClick={() => void install()}
            aria-label="تثبيت التطبيق على الجهاز"
            title="تثبيت التطبيق"
          >
            <Icon name="install" size={20} />
          </button>
        ) : null}
        <button
          type="button"
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
          title={theme === "dark" ? "الوضع النهاري" : "الوضع الليلي"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} size={20} />
        </button>
      </div>
    </header>
  );
}
