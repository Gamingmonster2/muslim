import { IBM_Plex_Sans_Arabic, Amiri } from "next/font/google";

/**
 * خط الواجهة: IBM Plex Sans Arabic (واضح وعصري، يدعم العربية والإنجليزية)
 */
export const fontSans = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm",
  display: "swap",
});

/**
 * خط النصوص القرآنية والأذكار: Amiri (نسخي أنيق)
 */
export const fontQuran = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const fontVariables = `${fontSans.variable} ${fontQuran.variable}`;
