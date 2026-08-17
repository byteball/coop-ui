export const ScheduleIllustation = () => {
  return (
    <div aria-hidden className="flex items-center justify-center">
      <svg
        viewBox="0 0 240 220"
        className="h-44 w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="water-body" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(56 189 248)" stopOpacity="0.7" />
            <stop offset="60%" stopColor="rgb(14 165 233)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="rgb(8 47 73)" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="water-layer" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(186 230 253)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="rgb(56 189 248)" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="drop-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgb(186 230 253)" stopOpacity="0.9" />
            <stop
              offset="100%"
              stopColor="rgb(56 189 248)"
              stopOpacity="0.75"
            />
          </linearGradient>
          <linearGradient id="glass-highlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgb(255 255 255)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="rgb(255 255 255)" stopOpacity="0" />
            <stop
              offset="100%"
              stopColor="rgb(255 255 255)"
              stopOpacity="0.1"
            />
          </linearGradient>
          <clipPath id="glass-clip">
            <path d="M 50 70 L 50 188 Q 50 198 60 198 L 140 198 Q 150 198 150 188 L 150 70 Z" />
          </clipPath>
        </defs>

        {/* falling drops — teardrop shapes */}
        <path
          d="M 85 16 Q 89 22 89 27 A 4 4 0 1 1 81 27 Q 81 22 85 16 Z"
          fill="url(#drop-grad)"
          opacity="0.45"
        />
        <path
          d="M 115 32 Q 119.5 39 119.5 44 A 4.5 4.5 0 1 1 110.5 44 Q 110.5 39 115 32 Z"
          fill="url(#drop-grad)"
          opacity="0.65"
        />
        <path
          d="M 100 50 Q 105 58 105 64 A 5 5 0 1 1 95 64 Q 95 58 100 50 Z"
          fill="url(#drop-grad)"
          opacity="0.9"
        />

        {/* water inside glass */}
        <g clipPath="url(#glass-clip)">
          <rect
            x="48"
            y="118"
            width="104"
            height="82"
            fill="url(#water-body)"
          />
          {/* top "new" layer */}
          <rect
            x="48"
            y="118"
            width="104"
            height="14"
            fill="url(#water-layer)"
          />
          {/* clean water surface line */}
          <line
            x1="48"
            y1="118"
            x2="152"
            y2="118"
            stroke="rgb(224 242 254)"
            strokeOpacity="0.9"
            strokeWidth="1.5"
          />
          {/* subtle separator between +1% layer and main body */}
          <line
            x1="48"
            y1="132"
            x2="152"
            y2="132"
            stroke="rgb(186 230 253)"
            strokeOpacity="0.35"
            strokeWidth="0.8"
            strokeDasharray="3 3"
          />
          {/* inner reflection highlight along left edge of water */}
          <rect
            x="54"
            y="138"
            width="2"
            height="55"
            fill="rgb(255 255 255)"
            opacity="0.25"
            rx="1"
          />
        </g>

        {/* glass outline */}
        <path
          d="M 50 70 L 50 188 Q 50 198 60 198 L 140 198 Q 150 198 150 188 L 150 70"
          stroke="rgb(255 255 255)"
          strokeOpacity="0.22"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        {/* glass top rim */}
        <path
          d="M 50 70 Q 100 64 150 70"
          stroke="rgb(255 255 255)"
          strokeOpacity="0.15"
          strokeWidth="1.5"
          fill="none"
        />
        {/* highlight on the glass body */}
        <rect
          x="54"
          y="72"
          width="6"
          height="118"
          fill="url(#glass-highlight)"
          opacity="0.4"
        />

        {/* 1% / day leader line + label */}
        <line
          x1="152"
          y1="125"
          x2="172"
          y2="125"
          stroke="rgb(186 230 253)"
          strokeOpacity="0.55"
          strokeWidth="1"
        />
        <text
          x="176"
          y="131"
          fill="rgb(224 242 254)"
          fontSize="16"
          fontWeight="600"
          fontFamily="ui-sans-serif, system-ui"
        >
          1%
          <tspan
            fill="rgb(186 230 253)"
            fontSize="11"
            fontWeight="500"
            opacity="0.7"
          >
            {" / day"}
          </tspan>
        </text>
      </svg>
    </div>
  );
};
