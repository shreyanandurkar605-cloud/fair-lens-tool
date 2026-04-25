interface Props {
  score: number;
}

export const FairnessScore = ({ score }: Props) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let colorVar = "--google-green";
  let label = "Fair";
  if (score < 50) {
    colorVar = "--google-red";
    label = "Needs work";
  } else if (score < 80) {
    colorVar = "--google-yellow";
    label = "Could improve";
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative h-44 w-44">
        <svg className="h-full w-full -rotate-90" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="hsl(var(--muted))"
            strokeWidth="12"
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={`hsl(var(${colorVar}))`}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: "stroke-dashoffset 1s ease-out" }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-5xl font-semibold tracking-tight">{score}</span>
          <span className="text-xs uppercase tracking-wider text-muted-foreground">/ 100</span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-sm font-medium" style={{ color: `hsl(var(${colorVar}))` }}>
          {label}
        </p>
        <p className="text-xs text-muted-foreground">Fairness Score</p>
      </div>
    </div>
  );
};
