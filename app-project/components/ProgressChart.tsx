interface ProgressPoint {
  period: string;
  score: number;
}

export default function ProgressChart({ subject, data }: { subject: string; data: ProgressPoint[] }) {
  const width = 280;
  const height = 100;
  const padding = 20;
  const min = 50;
  const max = 100;

  const points = data.map((d, i) => {
    const x = padding + (i / Math.max(1, data.length - 1)) * (width - padding * 2);
    const y = height - padding - ((d.score - min) / (max - min)) * (height - padding * 2);
    return { x, y, ...d };
  });

  const linePoints = points.map((p) => `${p.x},${p.y}`).join(" ");
  const trendUp = data.length > 1 && data[data.length - 1].score >= data[0].score;
  const strokeColor = trendUp ? "#0f766e" : "#dc2626";
  const first = data[0]?.score ?? 0;
  const last = data[data.length - 1]?.score ?? 0;
  const delta = last - first;

  return (
    <div className="rounded-lg border border-ink-100 p-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink-800">{subject}</p>
        <p className={trendUp ? "text-xs font-semibold text-emerald-700" : "text-xs font-semibold text-red-600"}>
          {delta >= 0 ? "+" : ""}
          {delta} pts
        </p>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="mt-1 h-auto w-full" role="img" aria-label={`${subject} progress trend`}>
        <polyline points={linePoints} fill="none" stroke={strokeColor} strokeWidth={2} />
        {points.map((p) => (
          <circle key={p.period} cx={p.x} cy={p.y} r={3} fill={strokeColor} />
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[11px] text-ink-400">
        {data.map((d) => (
          <span key={d.period}>{d.period}</span>
        ))}
      </div>
    </div>
  );
}
