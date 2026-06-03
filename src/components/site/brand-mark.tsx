type BrandMarkProps = {
  className?: string;
  title?: string;
};

/**
 * Time Overlay brand mark: a "to:" monogram tile set in Geist (outlines, so it
 * renders identically without the font). "to" is the wordmark initials; the
 * green colon is the timer reference. Calm, single-accent, no glow.
 */
export function BrandMark({ className, title }: BrandMarkProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label={title ?? "Time Overlay"}
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect width="64" height="64" rx="15" fill="var(--background)" />
      <rect
        x="0.75"
        y="0.75"
        width="62.5"
        height="62.5"
        rx="14.25"
        fill="none"
        stroke="var(--foreground)"
        strokeOpacity="0.1"
        strokeWidth="1.5"
      />
      <g transform="translate(10.649 41.962) scale(0.03358 -0.03358)">
        <path
          d="M129.0 153V435H45.0V534H129.0V659H257.0V534H398.0V435H257.0V165Q257.0 128 272.5 113.5Q288.0 99 323.0 99H398.0V0H284.0Q204.0 0 166.5 37.0Q129.0 74 129.0 153ZM470.0 267Q470.0 351 502.5 414.0Q535.0 477 594.5 511.5Q654.0 546 733.0 546Q811.0 546 870.5 511.5Q930.0 477 962.5 414.0Q995.0 351 995.0 267Q995.0 183 962.5 120.0Q930.0 57 870.5 22.5Q811.0 -12 733.0 -12Q654.0 -12 594.5 22.5Q535.0 57 502.5 120.0Q470.0 183 470.0 267ZM863.0 267Q863.0 350 828.5 396.0Q794.0 442 733.0 442Q671.0 442 637.0 396.0Q603.0 350 603.0 267Q603.0 184 637.0 138.0Q671.0 92 733.0 92Q795.0 92 829.0 138.0Q863.0 184 863.0 267Z"
          fill="var(--foreground)"
        />
        <path
          d="M1079.58 140H1226.58V0H1079.58ZM1079.58 509H1226.58V369H1079.58Z"
          fill="var(--primary)"
        />
      </g>
    </svg>
  );
}
