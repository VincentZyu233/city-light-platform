import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
      <div>
        {eyebrow && <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">{eyebrow}</p>}
        <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">{description}</p>
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('app-surface rounded-2xl p-5', className)}>
      {(title || description || action) && (
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-foreground">{title}</h2>}
            {description && <p className="mt-1 text-xs leading-5 text-muted-foreground">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function StatCard({
  label,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  tone = 'blue',
}: {
  label: string;
  value: string;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  tone?: 'blue' | 'cyan' | 'green' | 'amber';
}) {
  const toneStyles = {
    blue: 'bg-brand-50 text-brand-600 ring-brand-500/20 dark:bg-brand-950/50 dark:text-brand-300',
    cyan: 'bg-sky-50 text-sky-600 ring-sky-500/20 dark:bg-sky-950/50 dark:text-sky-300',
    green: 'bg-emerald-50 text-emerald-600 ring-emerald-500/20 dark:bg-emerald-950/50 dark:text-emerald-300',
    amber: 'bg-amber-50 text-amber-600 ring-amber-500/20 dark:bg-amber-950/50 dark:text-amber-300',
  }[tone];

  return (
    <div className="app-surface relative overflow-hidden rounded-2xl p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-mono text-3xl font-semibold tracking-tight text-foreground">{value}</span>
            {unit && <span className="text-xs text-muted-foreground">{unit}</span>}
          </div>
        </div>
        <div className={cn('flex size-11 items-center justify-center rounded-xl ring-1', toneStyles)}>
          <Icon className="size-5" />
        </div>
      </div>
      {(trend !== undefined || trendLabel) && (
        <div className="mt-3 flex items-center gap-2 text-[11px] text-muted-foreground">
          {trend !== undefined && (
            <span className={cn('inline-flex items-center gap-0.5 font-mono font-medium', trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400')}>
              {trend >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span>{trendLabel}</span>}
        </div>
      )}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase();
  const variant = normalized.includes('离线') || normalized.includes('停用') || normalized.includes('未启用') || normalized.includes('紧急')
    ? 'rose'
    : normalized.includes('告警') || normalized.includes('待') || normalized.includes('调试') || normalized.includes('主要')
      ? 'amber'
      : normalized.includes('恢复') || normalized.includes('在线') || normalized.includes('启用') || normalized.includes('运行') || normalized.includes('已部署')
        ? 'emerald'
        : 'blue';
  const styles = {
    rose: 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300',
    amber: 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300',
    emerald: 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
    blue: 'border-brand-500/25 bg-brand-500/10 text-brand-700 dark:text-brand-300',
  }[variant];
  return <Badge variant="outline" className={cn('rounded-full px-2 py-0.5 text-[10px] font-medium', styles)}>{status}</Badge>;
}

export function MetricBar({ value, tone = 'blue' }: { value: number; tone?: 'blue' | 'green' | 'amber' | 'rose' }) {
  const color = {
    blue: 'bg-brand-600 dark:bg-brand-500',
    green: 'bg-emerald-600 dark:bg-emerald-500',
    amber: 'bg-amber-500 dark:bg-amber-400',
    rose: 'bg-rose-600 dark:bg-rose-500',
  }[tone];
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-muted">
      <div className={cn('h-full rounded-full transition-all duration-300', color)} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
