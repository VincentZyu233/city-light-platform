import { useId } from 'react';
import { cn } from '@/lib/utils';

export interface ChartPoint {
  label: string;
  value: number;
  secondary?: number;
}

export function LineTrendChart({ points, className, height = 240 }: { points: ChartPoint[]; className?: string; height?: number }) {
  const gradientId = useId().replace(/:/g, '');
  const width = 760;
  const chartHeight = 220;
  const paddingX = 20;
  const paddingY = 24;
  const max = Math.max(...points.map((point) => Math.max(point.value, point.secondary ?? 0)), 1);
  const min = Math.min(...points.map((point) => Math.min(point.value, point.secondary ?? point.value)), 0);
  const range = Math.max(max - min, 1);
  const pointToXY = (point: ChartPoint, index: number, key: 'value' | 'secondary') => {
    const value = key === 'value' ? point.value : point.secondary ?? point.value;
    const x = paddingX + (index / Math.max(points.length - 1, 1)) * (width - paddingX * 2);
    const y = paddingY + ((max - value) / range) * (chartHeight - paddingY * 2);
    return [x, y] as const;
  };
  const primaryLine = points.map((point, index) => pointToXY(point, index, 'value')).map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ');
  const area = `${primaryLine} L ${width - paddingX} ${chartHeight - paddingY} L ${paddingX} ${chartHeight - paddingY} Z`;
  const secondaryLine = points.some((point) => point.secondary !== undefined)
    ? points.map((point, index) => pointToXY(point, index, 'secondary')).map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')
    : '';

  return (
    <div className={cn('w-full overflow-hidden', className)} style={{ height }}>
      <svg viewBox={`0 0 ${width} ${chartHeight}`} className="h-full w-full" preserveAspectRatio="none" role="img" aria-label="趋势折线图">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.34" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {[0.2, 0.4, 0.6, 0.8].map((ratio) => (
          <line key={ratio} x1={paddingX} y1={paddingY + ratio * (chartHeight - paddingY * 2)} x2={width - paddingX} y2={paddingY + ratio * (chartHeight - paddingY * 2)} stroke="currentColor" className="text-border/55" strokeDasharray="5 6" strokeWidth="1" />
        ))}
        <path d={area} fill={`url(#${gradientId})`} />
        <path d={primaryLine} fill="none" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        {secondaryLine && <path d={secondaryLine} fill="none" stroke="#06b6d4" strokeWidth="2" strokeDasharray="7 6" strokeLinecap="round" />}
        {points.map((point, index) => {
          const [x, y] = pointToXY(point, index, 'value');
          return <circle key={point.label} cx={x} cy={y} r="3.8" fill="#3b82f6" stroke="white" strokeWidth="2" />;
        })}
      </svg>
      <div className="mt-1 flex items-center justify-between px-1 font-mono text-[9px] text-muted-foreground">
        {points.filter((_, index) => index % Math.ceil(points.length / 6) === 0 || index === points.length - 1).map((point) => <span key={point.label}>{point.label}</span>)}
      </div>
    </div>
  );
}

export function BarSeriesChart({ points, className }: { points: ChartPoint[]; className?: string }) {
  const max = Math.max(...points.map((point) => point.value), 1);
  return (
    <div className={cn('flex h-[260px] items-end gap-2 md:gap-3', className)}>
      {points.map((point) => (
        <div key={point.label} className="group flex h-full min-w-0 flex-1 flex-col justify-end gap-2">
          <div className="relative flex flex-1 items-end overflow-hidden rounded-t-lg bg-brand-500/5">
            <div className="brand-gradient w-full rounded-t-lg transition-all duration-500 group-hover:brightness-110" style={{ height: `${Math.max(8, (point.value / max) * 100)}%` }} />
            <span className="absolute inset-x-0 top-2 text-center font-mono text-[9px] text-brand-700 opacity-0 transition-opacity group-hover:opacity-100 dark:text-brand-200">{point.value}</span>
          </div>
          <span className="truncate text-center font-mono text-[9px] text-muted-foreground">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

export function MiniSparkline({ values, tone = 'blue' }: { values: number[]; tone?: 'blue' | 'cyan' | 'green' | 'amber' }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = Math.max(max - min, 1);
  const points = values.map((value, index) => `${(index / Math.max(values.length - 1, 1)) * 100},${28 - ((value - min) / range) * 24}`).join(' ');
  const color = { blue: '#3b82f6', cyan: '#06b6d4', green: '#10b981', amber: '#f59e0b' }[tone];
  return <svg viewBox="0 0 100 30" className="h-8 w-20" preserveAspectRatio="none"><polyline points={points} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
