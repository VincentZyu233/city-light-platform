import { Activity, ArrowUpRight, BatteryCharging, Lightbulb, MapPinned, ShieldAlert, Wifi, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LineTrendChart } from '@/components/charts';
import { PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { alerts, projects, reportSeries } from '@/data/mock-data';

export function HomePage() {
  const energyTrend = reportSeries.daily.map((point) => ({ label: point.label, value: point.energy, secondary: point.savings }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Operations Overview"
        title="城市照明运营总览"
        description="集中查看在线率、亮灯率、能耗表现与待处理告警，快速进入项目、设备和监控页面。"
        actions={
          <>
            <Button asChild variant="outline" className="bg-card/60"><Link to="/reports">查看数据报表 <ArrowUpRight className="size-4" /></Link></Button>
            <Button asChild className="brand-gradient border-0 text-white shadow-lg shadow-brand-500/20"><Link to="/big-screen">进入可视化大屏</Link></Button>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="全网在线率" value="99.84" unit="%" trend={0.12} trendLabel="较昨日" icon={Wifi} tone="green" />
        <StatCard label="当前亮灯率" value="87.6" unit="%" trend={2.4} trendLabel="策略执行正常" icon={Lightbulb} tone="blue" />
        <StatCard label="今日能耗" value="1,428.5" unit="kWh" trend={-4.8} trendLabel="节能率 41.2%" icon={BatteryCharging} tone="cyan" />
        <StatCard label="待处理告警" value="2" unit="起" trendLabel="14 起今日已闭环" icon={ShieldAlert} tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <SectionCard
          title="24 小时能耗与节能趋势"
          description="每两小时聚合一次，蓝色为实时能耗，青色虚线为节能率。"
          action={<div className="flex items-center gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand-500" />实时能耗</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-cyan-400" />节能率</span></div>}
        >
          <LineTrendChart points={energyTrend} height={270} />
        </SectionCard>

        <SectionCard title="设备状态分布" description="全网 5,420 台照明及网关设备实时统计">
          <div className="flex flex-col items-center">
            <div className="relative flex size-44 items-center justify-center rounded-full" style={{ background: 'conic-gradient(#2563eb 0 81%, #06b6d4 81% 92%, #f59e0b 92% 97%, #f43f5e 97% 100%)' }}>
              <div className="flex size-32 flex-col items-center justify-center rounded-full bg-card shadow-inner">
                <span className="font-mono text-3xl font-semibold text-foreground">5,420</span>
                <span className="mt-1 text-[10px] text-muted-foreground">设备总数</span>
              </div>
            </div>
            <div className="mt-5 grid w-full grid-cols-2 gap-2 text-[11px]">
              {[
                ['在线', '4,391', 'bg-brand-500'],
                ['调光', '596', 'bg-cyan-400'],
                ['告警', '271', 'bg-amber-500'],
                ['离线', '162', 'bg-rose-500'],
              ].map(([label, value, color]) => (
                <div key={label} className="flex items-center justify-between rounded-lg bg-muted/55 px-3 py-2"><span className="flex items-center gap-1.5 text-muted-foreground"><span className={`size-1.5 rounded-full ${color}`} />{label}</span><span className="font-mono text-foreground">{value}</span></div>
              ))}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)]">
        <SectionCard title="重点项目" description="按在线率和设备规模查看当前项目状态" action={<Button asChild variant="ghost" size="sm"><Link to="/projects/list">全部项目 <ArrowUpRight className="size-3.5" /></Link></Button>}>
          <div className="space-y-3">
            {projects.slice(0, 4).map((project) => (
              <Link key={project.id} to="/projects/list" className="group flex items-center gap-3 rounded-xl border border-border/60 bg-background/45 p-3 transition-colors hover:border-brand-400/50 hover:bg-brand-500/5">
                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600 dark:text-brand-300"><MapPinned className="size-4" /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-foreground">{project.name}</span><span className="mt-1 block text-[10px] text-muted-foreground">{project.city} · {project.stations} 个场站 · {project.devices.toLocaleString()} 台设备</span></span>
                <span className="text-right"><StatusBadge status={project.status} /><span className="mt-1 block font-mono text-[10px] text-muted-foreground">{project.onlineRate}%</span></span>
              </Link>
            ))}
          </div>
        </SectionCard>

        <SectionCard title="最新告警" description="按严重等级和处置状态实时排序" action={<Button asChild variant="ghost" size="sm"><Link to="/monitoring/alerts">进入告警中心 <ArrowUpRight className="size-3.5" /></Link></Button>}>
          <div className="space-y-2">
            {alerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-border/60 bg-background/45 p-3">
                <span className={`mt-1 size-2 shrink-0 rounded-full ${alert.level === '紧急' ? 'bg-rose-500' : alert.level === '主要' ? 'bg-amber-500' : 'bg-cyan-400'}`} />
                <div className="min-w-0 flex-1"><p className="truncate text-xs font-medium text-foreground">{alert.title}</p><p className="mt-1 truncate text-[10px] text-muted-foreground">{alert.device} · {alert.location}</p></div>
                <div className="shrink-0 text-right"><StatusBadge status={alert.status} /><span className="mt-1 block font-mono text-[9px] text-muted-foreground">{alert.time}</span></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="运营快照" description="今天的平台关键运行指标">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: '策略执行', value: '18 / 18', note: '全部按计划执行', icon: Zap },
            { label: '今日节能', value: '1,428.5 kWh', note: '折合减少 1.12 tCO₂', icon: BatteryCharging },
            { label: '平均响应时间', value: '24.5 min', note: '较上周下降 8.2%', icon: Activity },
            { label: '覆盖场站', value: '398', note: '分布于 6 个行政区', icon: MapPinned },
          ].map((item) => {
            const ItemIcon = item.icon;
            return <div key={item.label} className="flex items-center gap-3 rounded-xl bg-muted/45 p-3"><span className="flex size-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300"><ItemIcon className="size-4" /></span><span><span className="block text-[10px] text-muted-foreground">{item.label}</span><span className="mt-1 block font-mono text-sm font-semibold text-foreground">{item.value}</span><span className="mt-0.5 block text-[9px] text-muted-foreground">{item.note}</span></span></div>;
          })}
        </div>
      </SectionCard>
    </div>
  );
}
