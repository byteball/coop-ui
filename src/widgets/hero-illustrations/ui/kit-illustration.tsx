export const KitIllustration = () => {
  const cx = 110;
  const cy = 100;
  const r = 50;

  const ticks = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180);
    const isMajor = i % 3 === 0;
    const inner = isMajor ? r - 9 : r - 6;
    const outer = r - 2;
    return (
      <line
        key={i}
        x1={cx + Math.cos(angle) * inner}
        y1={cy + Math.sin(angle) * inner}
        x2={cx + Math.cos(angle) * outer}
        y2={cy + Math.sin(angle) * outer}
        stroke="rgb(167 243 208)"
        strokeOpacity={isMajor ? 0.7 : 0.3}
        strokeWidth={isMajor ? 1.5 : 1}
        strokeLinecap="round"
      />
    );
  });

  const progress = 0.25;
  const circumference = 2 * Math.PI * r;
  const dash = circumference * progress;

  return (
    <div aria-hidden className="flex items-center justify-center">
      <svg
        viewBox="0 0 220 220"
        className="h-44 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="safe-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(6 78 59)" stopOpacity="0.45" />
            <stop offset="100%" stopColor="rgb(6 78 59)" stopOpacity="0.2" />
          </linearGradient>
          <linearGradient id="dial-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(6 78 59)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="rgb(0 0 0)" stopOpacity="0.3" />
          </linearGradient>
          <linearGradient id="progress-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgb(110 231 183)" stopOpacity="0.4" />
            <stop
              offset="100%"
              stopColor="rgb(52 211 153)"
              stopOpacity="0.95"
            />
          </linearGradient>
        </defs>

        {/* safe body */}
        <rect
          x="30"
          y="22"
          width="160"
          height="176"
          rx="18"
          fill="url(#safe-body)"
          stroke="rgb(110 231 183)"
          strokeOpacity="0.3"
          strokeWidth="2"
        />
        {/* inner panel */}
        <rect
          x="40"
          y="32"
          width="140"
          height="156"
          rx="12"
          stroke="rgb(110 231 183)"
          strokeOpacity="0.12"
          strokeWidth="1"
          fill="none"
        />

        {/* corner bolts */}
        {[
          [44, 36],
          [176, 36],
          [44, 184],
          [176, 184],
        ].map(([x, y], i) => (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="2"
            fill="rgb(110 231 183)"
            fillOpacity="0.4"
          />
        ))}

        {/* dial outer ring */}
        <circle
          cx={cx}
          cy={cy}
          r={r + 4}
          fill="rgb(0 0 0)"
          fillOpacity="0.25"
        />
        {/* dial face */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="url(#dial-fill)"
          stroke="rgb(110 231 183)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />

        {/* progress arc */}
        <circle
          cx={cx}
          cy={cy}
          r={r}
          stroke="url(#progress-grad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          strokeDasharray={`${dash} ${circumference}`}
          transform={`rotate(-90 ${cx} ${cy})`}
        />

        {/* tick marks */}
        {ticks}

        {/* pointer */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy - r + 10}
          stroke="rgb(167 243 208)"
          strokeOpacity="0.95"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        {/* counter-pointer */}
        <line
          x1={cx}
          y1={cy}
          x2={cx}
          y2={cy + 10}
          stroke="rgb(167 243 208)"
          strokeOpacity="0.5"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* center hub */}
        <circle cx={cx} cy={cy} r="6" fill="rgb(167 243 208)" />
        <circle cx={cx} cy={cy} r="3" fill="rgb(6 78 59)" />

        {/* "1 year" label */}
        <text
          x={cx}
          y="180"
          textAnchor="middle"
          fill="rgb(167 243 208)"
          fillOpacity="0.95"
          fontSize="13"
          fontWeight="700"
          fontFamily="ui-sans-serif, system-ui"
          letterSpacing="1.5"
        >
          1 YEAR
        </text>

        {/* handle on the right */}
        <rect
          x="190"
          y="92"
          width="14"
          height="36"
          rx="6"
          fill="rgb(110 231 183)"
          fillOpacity="0.25"
          stroke="rgb(110 231 183)"
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      </svg>
    </div>
  );
};
