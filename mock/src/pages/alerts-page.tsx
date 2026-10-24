import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Clock3, MapPinned, Search, Send, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, StatCard, StatusBadge } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { alerts as initialAlerts } from '@/data/mock-data';
import type { AlertRecord } from '@/types';
import { cn } from '@/lib/utils';

export function AlertsPage() {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [query, setQuery] = useState('');
  const [level, setLevel] = useState('all');
  const [status, setStatus] = useState('all');

  const filtered = useMemo(() => alerts.filter((alert) => {
    const matchesQuery = !query || `${alert.id}${alert.title}${alert.device}${alert.location}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (level === 'all' || alert.level === level) && (status === 'all' || alert.status === status);
  }), [alerts, level, query, status]);

  const updateAlert = (id: string, nextStatus: AlertRecord['status']) => {
    setAlerts((current) => current.map((alert) => alert.id === id ? { ...alert, status: nextStatus } : alert));
    toast.success(nextStatus === '已恢复' ? '告警已确认恢复并归档' : '工单已派发给运维工程师');
  };

  return (
    <div className="space-y-5">
      <PageHeader eyebrow="监控与控制 / 告警管理" title="告警与运维中枢" description="统一接收设备异常、策略偏差和通信故障，并跟踪工单闭环。" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="活跃告警" value="2" unit="起" trendLabel="其中紧急告警 1 起" icon={ShieldAlert} tone="amber" />
        <StatCard label="处理中" value="2" unit="起" trendLabel="平均响应 8.4 分钟" icon={Clock3} tone="blue" />
        <StatCard label="今日已闭环" value="14" unit="起" trend={18.2} trendLabel="较昨日" icon={CheckCircle2} tone="green" />
        <StatCard label="覆盖设备" value="5,420" unit="台" trendLabel="告警覆盖率 100%" icon={AlertTriangle} tone="cyan" />
      </div>

      <section className="app-surface rounded-2xl">
        <div className="flex flex-col gap-3 border-b border-border/60 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-sm"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索告警编号、设备或位置" className="h-9 bg-background/60 pl-9 text-xs" /></div>
          <div className="flex gap-2">
            <Select value={level} onValueChange={setLevel}><SelectTrigger className="h-9 w-28 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">全部等级</SelectItem><SelectItem value="紧急">紧急</SelectItem><SelectItem value="主要">主要</SelectItem><SelectItem value="次要">次要</SelectItem></SelectContent></Select>
            <Select value={status} onValueChange={setStatus}><SelectTrigger className="h-9 w-28 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">全部状态</SelectItem><SelectItem value="待处理">待处理</SelectItem><SelectItem value="处理中">处理中</SelectItem><SelectItem value="已恢复">已恢复</SelectItem></SelectContent></Select>
          </div>
        </div>
        <div className="space-y-3 p-4">
          {filtered.length === 0 ? <div className="py-16 text-center text-sm text-muted-foreground">没有匹配的告警记录</div> : filtered.map((alert) => (
            <article key={alert.id} className="rounded-xl border border-border/80 bg-card p-4 transition-all hover:border-brand-500/40 hover:shadow-xs">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  <span className={cn('mt-1 size-2.5 shrink-0 rounded-full', alert.level === '紧急' ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,.5)]' : alert.level === '主要' ? 'bg-amber-500' : 'bg-cyan-400')} />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2"><Badge variant="outline" className={cn('text-[9px]', alert.level === '紧急' ? 'border-rose-500/25 bg-rose-500/10 text-rose-700 dark:text-rose-300' : alert.level === '主要' ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-300' : 'border-cyan-500/25 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300')}>{alert.level}</Badge><span className="font-mono text-[10px] text-muted-foreground">{alert.id}</span><span className="text-[10px] text-muted-foreground">· {alert.time}</span></div>
                    <h2 className="mt-2 text-sm font-semibold text-foreground">{alert.title}</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-[10px] text-muted-foreground"><MapPinned className="size-3" />{alert.location}</p>
                    <p className="mt-1 font-mono text-[10px] text-brand-600 dark:text-brand-300">{alert.device}</p>
                  </div>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  <StatusBadge status={alert.status} />
                  {alert.status !== '已恢复' && (
                    <>
                      <Button size="sm" onClick={() => updateAlert(alert.id, '处理中')} className="h-8 bg-brand-600 text-[11px] text-white hover:bg-brand-500 shadow-xs">
                        <Send className="size-3.5" />派发工单
                      </Button>
                      <Button size="sm" onClick={() => updateAlert(alert.id, '已恢复')} className="h-8 bg-emerald-600 text-[11px] text-white hover:bg-emerald-500">
                        <CheckCircle2 className="size-3.5" />确认恢复
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
