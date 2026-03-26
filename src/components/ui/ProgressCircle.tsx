interface ProgressCircleProps {
  value: number;
  max: number;
  size?: "sm" | "lg";
  color?: string;
  label?: string;
}

const ProgressCircle = ({
  value,
  max,
  size = "lg",
  color = "#F59E0B",
  label,
}: ProgressCircleProps) => {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  const outerSize = size === "lg" ? 150 : 130;
  const strokeWidth = 8;
  const radius = (outerSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: outerSize, height: outerSize }}>
        <svg
          width={outerSize}
          height={outerSize}
          className="-rotate-90"
        >
          {/* Background track */}
          <circle
            cx={outerSize / 2}
            cy={outerSize / 2}
            r={radius}
            fill="none"
            stroke="#F3F4F6"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={outerSize / 2}
            cy={outerSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        {/* Center text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-heading font-semibold text-levvia-fg"
            style={{
              fontSize: size === "lg" ? 40 : 32,
              letterSpacing: size === "lg" ? -1.5 : -1,
              lineHeight: 1,
            }}
          >
            {value}
          </span>
          {max && (
            <span className="text-levvia-muted text-xs font-body mt-0.5">
              /{max}
            </span>
          )}
        </div>
      </div>
      {label && (
        <p className="text-sm font-medium text-levvia-fg font-body mt-2">
          {label}
        </p>
      )}
    </div>
  );
};

export default ProgressCircle;
