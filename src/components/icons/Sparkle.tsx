export interface SparkleProps {
  className?: string;
}

export function Sparkle({ className = "w-3.5 h-3.5" }: SparkleProps) {
  return (
    <svg
      viewBox="0 0 22 22"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {/* Center 4-pointed Sparkle Star */}
      <path d="M10.5 2.5 Q11.2 8.2 17 9 Q11.2 9.8 10.5 15.5 Q9.8 9.8 4 9 Q9.8 8.2 10.5 2.5 Z" />

      {/* Top-Right Mini Sparkle Cross */}
      <path d="M18 2.5v3.5M16.2 4.25h3.6" />

      {/* Bottom-Left Mini Circle */}
      <circle cx="4.5" cy="16.5" r="1.3" />
    </svg>
  );
}

export default Sparkle;
