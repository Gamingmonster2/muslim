import type { ReactNode, SVGProps } from "react";

export type IconName =
  | "play"
  | "pause"
  | "back10"
  | "forward10"
  | "repeat"
  | "repeatOne"
  | "speed"
  | "timer"
  | "sun"
  | "moon"
  | "headphones"
  | "book"
  | "sparkles"
  | "info"
  | "chevronDown"
  | "check"
  | "copy"
  | "install"
  | "close"
  | "volume"
  | "volumeMute"
  | "arrowLeft"
  | "external";

const shapes: Record<IconName, ReactNode> = {
  play: (
    <path d="M8 5.2v13.6L19 12 8 5.2Z" fill="currentColor" stroke="none" />
  ),
  pause: (
    <g fill="currentColor" stroke="none">
      <rect x="6.4" y="4.6" width="4" height="14.8" rx="1.4" />
      <rect x="13.6" y="4.6" width="4" height="14.8" rx="1.4" />
    </g>
  ),
  back10: (
    <g>
      <path d="M4.2 12a8.4 8.4 0 1 1 2.6 6.1" />
      <path d="M3.4 6.2v5h5" />
      <text
        x="13"
        y="15.4"
        textAnchor="middle"
        fontSize="7.2"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="Tajawal, sans-serif"
      >
        10
      </text>
    </g>
  ),
  forward10: (
    <g>
      <path d="M19.8 12a8.4 8.4 0 1 0-2.6 6.1" />
      <path d="M20.6 6.2v5h-5" />
      <text
        x="11"
        y="15.4"
        textAnchor="middle"
        fontSize="7.2"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="Tajawal, sans-serif"
      >
        10
      </text>
    </g>
  ),
  repeat: (
    <g>
      <path d="m17 2.8 3.6 3.6L17 10" />
      <path d="M3.4 12.4V10a3.6 3.6 0 0 1 3.6-3.6h13.2" />
      <path d="m7 21.2-3.6-3.6L7 14" />
      <path d="M20.6 11.6V14a3.6 3.6 0 0 1-3.6 3.6H3.8" />
    </g>
  ),
  repeatOne: (
    <g>
      <path d="m17 2.8 3.6 3.6L17 10" />
      <path d="M3.4 12.4V10a3.6 3.6 0 0 1 3.6-3.6h13.2" />
      <path d="m7 21.2-3.6-3.6L7 14" />
      <path d="M20.6 11.6V14a3.6 3.6 0 0 1-3.6 3.6H3.8" />
      <text
        x="12"
        y="15.6"
        textAnchor="middle"
        fontSize="8.4"
        fontWeight="700"
        fill="currentColor"
        stroke="none"
        fontFamily="Tajawal, sans-serif"
      >
        1
      </text>
    </g>
  ),
  speed: (
    <g>
      <path d="M4.6 18.4a9 9 0 1 1 14.8 0" />
      <path d="m12 13.8 3.8-4.6" />
      <circle cx="12" cy="14.2" r="1.5" fill="currentColor" stroke="none" />
    </g>
  ),
  timer: (
    <g>
      <circle cx="12" cy="13.4" r="7.6" />
      <path d="M12 9.4v4.2l2.6 1.8" />
      <path d="M9.2 2.4h5.6" />
    </g>
  ),
  sun: (
    <g>
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.4v2.2M12 19.4v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.4 12h2.2M19.4 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6" />
    </g>
  ),
  moon: (
    <path d="M20.4 14.2A8.6 8.6 0 0 1 9.8 3.6a8.6 8.6 0 1 0 10.6 10.6Z" />
  ),
  headphones: (
    <g>
      <path d="M3.4 18v-6a8.6 8.6 0 0 1 17.2 0v6" />
      <path d="M20.6 18.6a2.2 2.2 0 0 1-2.2 2.2h-.8a2 2 0 0 1-2-2v-2.6a2 2 0 0 1 2-2h3Z" />
      <path d="M3.4 18.6a2.2 2.2 0 0 0 2.2 2.2h.8a2 2 0 0 0 2-2v-2.6a2 2 0 0 0-2-2h-3Z" />
    </g>
  ),
  book: (
    <g>
      <path d="M4 19.4A2.4 2.4 0 0 1 6.4 17H20" />
      <path d="M6.4 2.6H20v18.8H6.4A2.4 2.4 0 0 1 4 19V5A2.4 2.4 0 0 1 6.4 2.6Z" />
      <path d="M8.4 7.6h7.6M8.4 11.2h5" />
    </g>
  ),
  sparkles: (
    <g>
      <path d="m12 3.4 1.8 4.4 4.4 1.8-4.4 1.8L12 15.8l-1.8-4.4L5.8 9.6l4.4-1.8L12 3.4Z" />
      <path d="m18.6 15 .9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9.9-2.3Z" />
    </g>
  ),
  info: (
    <g>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5.4" />
      <circle cx="12" cy="7.8" r="1" fill="currentColor" stroke="none" />
    </g>
  ),
  chevronDown: <path d="m6.4 9.2 5.6 5.6 5.6-5.6" />,
  check: <path d="m5 12.8 4.4 4.4L19 6.6" />,
  copy: (
    <g>
      <rect x="8.6" y="8.6" width="11.8" height="11.8" rx="2.6" />
      <path d="M15.4 5.6V5a2.4 2.4 0 0 0-2.4-2.4H5A2.4 2.4 0 0 0 2.6 5v8a2.4 2.4 0 0 0 2.4 2.4h.6" />
    </g>
  ),
  install: (
    <g>
      <path d="M12 3.4v11" />
      <path d="m7.6 10.4 4.4 4.4 4.4-4.4" />
      <path d="M4.4 17.4v1.6a1.6 1.6 0 0 0 1.6 1.6h12a1.6 1.6 0 0 0 1.6-1.6v-1.6" />
    </g>
  ),
  close: <path d="m6.4 6.4 11.2 11.2M17.6 6.4 6.4 17.6" />,
  volume: (
    <g>
      <path d="M4 9.6h3.2L12 5.8v12.4L7.2 14.4H4Z" />
      <path d="M15.6 9.2a4 4 0 0 1 0 5.6M18.2 6.6a7.6 7.6 0 0 1 0 10.8" />
    </g>
  ),
  volumeMute: (
    <g>
      <path d="M4 9.6h3.2L12 5.8v12.4L7.2 14.4H4Z" />
      <path d="m16 9.6 5 4.8M21 9.6l-5 4.8" />
    </g>
  ),
  arrowLeft: <path d="M19 12H5m0 0 6-6m-6 6 6 6" />,
  external: (
    <g>
      <path d="M13.4 4.6h6v6" />
      <path d="m19.4 4.6-7.6 7.6" />
      <path d="M18 14v4.4a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 18.4V7.6A1.6 1.6 0 0 1 5.6 6H10" />
    </g>
  ),
};

interface IconProps extends Omit<SVGProps<SVGSVGElement>, "name"> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 24, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {shapes[name]}
    </svg>
  );
}
