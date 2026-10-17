import type { CountryCode } from "../batch/input/types";

export interface CountryFlagProps {
  code: CountryCode | string;
  className?: string;
}

export function CountryFlag({
  code,
  className = "w-5 h-3.5",
}: CountryFlagProps) {
  const commonClasses = `${className} inline-block rounded-[3px] shrink-0 border border-black/10 shadow-2xs object-cover overflow-hidden`;

  switch (code) {
    case "INA":
      // Indonesia: Merah Putih
      return (
        <svg
          viewBox="0 0 600 400"
          className={commonClasses}
          aria-label="Bendera Indonesia"
        >
          <rect width="600" height="200" fill="#E70011" />
          <rect y="200" width="600" height="200" fill="#FFFFFF" />
        </svg>
      );

    case "JP":
      // Jepang: Hinomaru (White with Red Sun)
      return (
        <svg
          viewBox="0 0 600 400"
          className={commonClasses}
          aria-label="Bendera Jepang"
        >
          <rect width="600" height="400" fill="#FFFFFF" />
          <circle cx="300" cy="200" r="120" fill="#BC002D" />
        </svg>
      );

    case "TH":
      // Thailand: Merah-Putih-Biru-Putih-Merah (1:1:2:1:1)
      return (
        <svg
          viewBox="0 0 600 400"
          className={commonClasses}
          aria-label="Bendera Thailand"
        >
          <rect width="600" height="400" fill="#A51931" />
          <rect y="67" width="600" height="266" fill="#F4F5F8" />
          <rect y="133" width="600" height="134" fill="#2D2A4A" />
        </svg>
      );

    case "CH":
      // China: Red with 5 Yellow Stars
      return (
        <svg
          viewBox="0 0 600 400"
          className={commonClasses}
          aria-label="Bendera China"
        >
          <rect width="600" height="400" fill="#DE2910" />
          {/* Main Big Star */}
          <polygon
            fill="#FFDE00"
            points="100,50 112,88 151,88 120,111 132,148 100,126 68,148 80,111 49,88 88,88"
          />
          {/* Small Star 1 */}
          <polygon
            fill="#FFDE00"
            points="200,35 204,47 217,47 207,54 210,66 200,59 190,66 193,54 183,47 196,47"
          />
          {/* Small Star 2 */}
          <polygon
            fill="#FFDE00"
            points="235,75 239,87 252,87 242,94 245,106 235,99 225,106 228,94 218,87 231,87"
          />
          {/* Small Star 3 */}
          <polygon
            fill="#FFDE00"
            points="235,135 239,147 252,147 242,154 245,166 235,159 225,166 228,154 218,147 231,147"
          />
          {/* Small Star 4 */}
          <polygon
            fill="#FFDE00"
            points="200,180 204,192 217,192 207,199 210,211 200,204 190,211 193,199 183,192 196,192"
          />
        </svg>
      );

    case "KR":
      // Korea Selatan: Taegeukgi
      return (
        <svg
          viewBox="0 0 600 400"
          className={commonClasses}
          aria-label="Bendera Korea Selatan"
        >
          <rect width="600" height="400" fill="#FFFFFF" />
          {/* Taegeuk: Red top, Blue bottom */}
          <g transform="translate(300, 200) rotate(-33.69)">
            <path
              d="M -90,0 A 90,90 0 0,1 90,0 A 45,45 0 0,1 0,0 A 45,45 0 0,0 -90,0"
              fill="#C63538"
            />
            <path
              d="M 90,0 A 90,90 0 0,1 -90,0 A 45,45 0 0,1 0,0 A 45,45 0 0,0 90,0"
              fill="#0047A0"
            />
          </g>
          {/* 4 Trigrams (Bars) */}
          {/* Top-Left: Geon (3 solid bars) */}
          <g transform="translate(190, 120) rotate(-33.69)" fill="#000000">
            <rect x="-35" y="-18" width="70" height="7" rx="1.5" />
            <rect x="-35" y="-4" width="70" height="7" rx="1.5" />
            <rect x="-35" y="10" width="70" height="7" rx="1.5" />
          </g>
          {/* Bottom-Right: Gon (3 broken bars) */}
          <g transform="translate(410, 280) rotate(-33.69)" fill="#000000">
            <rect x="-35" y="-18" width="31" height="7" rx="1.5" />
            <rect x="4" y="-18" width="31" height="7" rx="1.5" />
            <rect x="-35" y="-4" width="31" height="7" rx="1.5" />
            <rect x="4" y="-4" width="31" height="7" rx="1.5" />
            <rect x="-35" y="10" width="31" height="7" rx="1.5" />
            <rect x="4" y="10" width="31" height="7" rx="1.5" />
          </g>
          {/* Top-Right: Gam (broken, solid, broken) */}
          <g transform="translate(410, 120) rotate(33.69)" fill="#000000">
            <rect x="-35" y="-18" width="31" height="7" rx="1.5" />
            <rect x="4" y="-18" width="31" height="7" rx="1.5" />
            <rect x="-35" y="-4" width="70" height="7" rx="1.5" />
            <rect x="-35" y="10" width="31" height="7" rx="1.5" />
            <rect x="4" y="10" width="31" height="7" rx="1.5" />
          </g>
          {/* Bottom-Left: Ri (solid, broken, solid) */}
          <g transform="translate(190, 280) rotate(33.69)" fill="#000000">
            <rect x="-35" y="-18" width="70" height="7" rx="1.5" />
            <rect x="-35" y="-4" width="31" height="7" rx="1.5" />
            <rect x="4" y="-4" width="31" height="7" rx="1.5" />
            <rect x="-35" y="10" width="70" height="7" rx="1.5" />
          </g>
        </svg>
      );

    default:
      return null;
  }
}

export default CountryFlag;
