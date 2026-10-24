import { useState } from 'react';
import { Activity, CircleDot, Lightbulb, Radio, Wifi, Zap } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { alerts, devices } from '@/data/mock-data';
import { StatusBadge } from '@/components/shared';

const glassPanel = 'rounded-2xl border border-brand-300/45 bg-white/78 shadow-lg shadow-brand-500/8 backdrop-blur dark:border-cyan-300/10 dark:bg-[#0c2543]/85 dark:shadow-black/15';

export function BigScreenPage() {
  const [selectedId, setSelectedId] = useState(devices[0]?.id ?? '');
  const selected = devices.find((device) => device.id === selectedId) ?? devices[0];
  const mapDevices = devices.slice(0, 12);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-brand-600 dark:text-brand-300">Visual Command Center</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl">城市照明可视化大屏</h1>
          <p className="mt-2 text-sm text-muted-foreground">城市级空间感知、照明控制与告警事件实时融合展示。</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] text-muted-foreground"><span className="flex items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1.5 text-emerald-700 dark:text-emerald-300"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />LIVE SSE 已连接</span><span className="font-mono">2026-10-24 10:08:32</span></div>
      </div>

      <div className="relative overflow-hidden rounded-3xl border border-brand-300/50 bg-slate-50 border border-border p-4 text-foreground shadow-xl shadow-brand-500/12 dark:border-cyan-400/15 dark:bg-none dark:bg-[#07182d] dark:text-slate-100 dark:shadow-2xl dark:shadow-brand-950/25 md:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.16),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.12),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(29,78,216,0.1),transparent_38%)] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(37,99,235,0.28),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(34,211,238,0.16),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(29,78,216,0.2),transparent_38%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-45 dark:opacity-35" />

        <div className="relative grid gap-4 xl:grid-cols-[240px_minmax(0,1fr)_300px]">
          <div className="space-y-3">
            {[
              { label: '在线设备', value: '5,411', unit: '台', icon: Wifi, color: 'text-emerald-600 dark:text-emerald-300' },
              { label: '实时功率', value: '184.6', unit: 'kW', icon: Zap, color: 'text-brand-600 dark:text-brand-300' },
              { label: '今日节能', value: '1,428.5', unit: 'kWh', icon: Lightbulb, color: 'text-cyan-600 dark:text-cyan-300' },
              { label: '活跃告警', value: '2', unit: '起', icon: Activity, color: 'text-amber-600 dark:text-amber-300' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`${glassPanel} p-4`}>
                  <div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground dark:text-slate-400">{item.label}</span><Icon className={`size-4 ${item.color}`} /></div>
                  <p className="mt-3 font-mono text-2xl font-semibold text-foreground dark:text-slate-100">{item.value}<span className="ml-1 text-[10px] font-normal text-muted-foreground dark:text-slate-400">{item.unit}</span></p>
                </div>
              );
            })}
          </div>

          <div className="relative min-h-[520px] overflow-hidden rounded-2xl border border-brand-300/45 bg-white/62 shadow-lg shadow-brand-500/8 dark:border-cyan-300/10 dark:bg-[#06152a]/85 dark:shadow-black/15">
            <svg className="absolute inset-0 h-full w-full" viewBox="0 0 900 620" preserveAspectRatio="none">
              <defs>
                <linearGradient id="road-glow" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.7" /><stop offset="100%" stopColor="#06b6d4" stopOpacity="0.15" /></linearGradient>
              </defs>
              <path d="M -40 480 Q 180 390 380 430 T 940 340" fill="none" stroke="url(#road-glow)" strokeWidth="58" opacity="0.38" />
              <path d="M -40 480 Q 180 390 380 430 T 940 340" fill="none" stroke="#38bdf8" strokeWidth="2" opacity="0.55" strokeDasharray="10 12" />
              <path d="M 80 40 Q 300 190 520 230 T 900 150" fill="none" stroke="url(#road-glow)" strokeWidth="34" opacity="0.4" />
              <path d="M 80 40 Q 300 190 520 230 T 900 150" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.55" />
              <path d="M 180 -40 Q 280 220 340 680" fill="none" stroke="url(#road-glow)" strokeWidth="24" opacity="0.35" />
              <path d="M 670 -30 Q 620 180 700 650" fill="none" stroke="url(#road-glow)" strokeWidth="28" opacity="0.35" />
              <path d="M 260 140 Q 450 80 760 300" fill="none" stroke="#0891b2" strokeWidth="1.5" opacity="0.4" />
              <path d="M 120 560 Q 410 400 820 500" fill="none" stroke="#2563eb" strokeWidth="1.5" opacity="0.35" />
            </svg>
            <div className="absolute left-4 top-4 flex items-center gap-2 rounded-full border border-brand-300/45 bg-white/82 px-3 py-1.5 text-[10px] text-brand-700 shadow-sm dark:border-cyan-300/15 dark:bg-[#0b2441]/80 dark:text-cyan-200 dark:shadow-none"><CircleDot className="size-3 animate-pulse" />厦门市思明区 · 环岛路智慧照明网格</div>
            <div className="absolute inset-0">
              {mapDevices.map((device, index) => {
                const positions = [[18, 62], [28, 54], [39, 49], [48, 42], [58, 37], [68, 33], [25, 30], [42, 25], [57, 23], [72, 22], [46, 70], [64, 64]];
                const [left, top] = positions[index];
                const selectedNode = selected?.id === device.id;
                const color = device.status === '告警' ? 'bg-amber-400' : device.status === '离线' ? 'bg-rose-500' : 'bg-cyan-400';
                return (
                  <button key={device.id} onClick={() => setSelectedId(device.id)} className="group absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${left}%`, top: `${top}%` }}>
                    <span className={`relative flex size-4 items-center justify-center rounded-full border border-white/70 ${color} ${selectedNode ? 'scale-150 shadow-[0_0_22px_rgba(56,189,248,0.95)]' : 'shadow-[0_0_10px_rgba(56,189,248,0.5)]'}`}><span className="size-1 rounded-full bg-white" /></span>
                    <span className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border border-brand-300/40 bg-white/92 px-2 py-1 font-mono text-[9px] text-brand-800 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 dark:border-cyan-300/15 dark:bg-[#07182d]/90 dark:text-slate-200 dark:shadow-none">{device.id}</span>
                  </button>
                );
              })}
            </div>
            {selected && (
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-brand-300/45 bg-white/90 p-3 shadow-lg shadow-brand-500/8 backdrop-blur dark:border-cyan-300/15 dark:bg-[#091f39]/92 dark:shadow-none">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div><p className="font-mono text-[10px] text-brand-600 dark:text-cyan-300">{selected.id}</p><p className="mt-1 text-sm font-medium text-foreground dark:text-slate-100">{selected.name}</p><p className="mt-1 text-[10px] text-muted-foreground dark:text-slate-400">{selected.station} · {selected.model}</p></div>
                  <div className="grid grid-cols-3 gap-4 text-right font-mono text-[10px]">
                    <span><span className="block text-muted-foreground dark:text-slate-500">功率</span><span className="mt-1 block text-brand-700 dark:text-cyan-200">{selected.power} kW</span></span>
                    <span><span className="block text-muted-foreground dark:text-slate-500">电压</span><span className="mt-1 block text-brand-700 dark:text-cyan-200">{selected.voltage} V</span></span>
                    <span><span className="block text-muted-foreground dark:text-slate-500">温度</span><span className={`mt-1 block ${selected.temperature > 45 ? 'text-amber-600 dark:text-amber-300' : 'text-emerald-600 dark:text-emerald-300'}`}>{selected.temperature} °C</span></span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className={`${glassPanel} p-4`}>
              <div className="flex items-center justify-between"><h2 className="text-xs font-medium text-foreground dark:text-slate-200">实时事件流</h2><Radio className="size-4 animate-pulse text-brand-600 dark:text-cyan-300" /></div>
              <div className="mt-4 space-y-3">
                {alerts.slice(0, 5).map((alert) => (
                  <div key={alert.id} className="flex items-start gap-2.5 border-b border-cyan-300/8 pb-3 last:border-0 last:pb-0">
                    <span className={`mt-1 size-1.5 shrink-0 rounded-full ${alert.level === '紧急' ? 'bg-rose-400' : alert.level === '主要' ? 'bg-amber-400' : 'bg-cyan-400'}`} />
                    <div className="min-w-0"><p className="truncate text-[10px] font-medium text-foreground dark:text-slate-200">{alert.title}</p><p className="mt-1 font-mono text-[9px] text-muted-foreground dark:text-slate-500">{alert.time} · {alert.device}</p></div>
                  </div>
                ))}
              </div>
            </div>
            <div className={`${glassPanel} p-4`}>
              <h2 className="text-xs font-medium text-foreground dark:text-slate-200">回路运行状态</h2>
              <div className="mt-4 space-y-3">
                {[
                  ['A 回路 · 东段', 99.8, '正常'],
                  ['B 回路 · 西段', 97.4, '调光'],
                  ['C 回路 · 桥面', 98.9, '正常'],
                  ['D 回路 · 新城', 96.2, '巡检'],
                ].map(([name, rate, status]) => (
                  <div key={String(name)}>
                    <div className="mb-1.5 flex items-center justify-between text-[10px]"><span className="text-foreground/80 dark:text-slate-300">{name}</span><span className="font-mono text-brand-700 dark:text-cyan-300">{rate}%</span></div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-muted dark:bg-slate-700/70"><div className="h-full rounded-full bg-brand-500" style={{ width: `${rate}%` }} /></div>
                    <p className="mt-1 text-right text-[9px] text-muted-foreground dark:text-slate-500">{status}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button className="w-full border-0 bg-brand-500/10 text-brand-700 hover:bg-brand-500/18 dark:bg-cyan-500/15 dark:text-cyan-100 dark:hover:bg-cyan-500/25" variant="outline"><Zap className="size-3.5" />执行全网拓扑自检</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
