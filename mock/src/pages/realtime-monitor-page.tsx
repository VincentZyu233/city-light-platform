import { useMemo, useState } from 'react';
import { Activity, BatteryCharging, Cpu, RefreshCw, Search, Thermometer, Wifi, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { LineTrendChart } from '@/components/charts';
import { MetricBar, PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { devices } from '@/data/mock-data';

export function RealtimeMonitorPage() {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const filtered = useMemo(() => devices.filter((device) => {
    const matchesQuery = !query || `${device.id}${device.name}${device.station}`.toLowerCase().includes(query.toLowerCase());
    return matchesQuery && (status === 'all' || device.status === status);
  }), [query, status]);
  const selected = filtered[0] ?? devices[0];
  const telemetry = [36, 35, 37, 38, 36, 35, 37, 39, 38, 36, 37, 36].map((value, index) => ({ label: `${index * 5}m`, value }));

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="监控与控制 / 实时监控"
        title="设备实时监控"
        description="实时查看设备在线状态、功率、电压、电流、温度与最后通信时间。"
        actions={<Button variant="outline" onClick={() => toast.success('遥测数据已刷新')}><RefreshCw className="size-4" />刷新遥测</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="在线设备" value="5,411" unit="台" trend={0.12} trendLabel="近 5 分钟" icon={Wifi} tone="green" />
        <StatCard label="实时功率" value="184.6" unit="kW" trendLabel="负载率 57.6%" icon={Zap} tone="blue" />
        <StatCard label="平均温度" value="34.6" unit="°C" trend={1.2} trendLabel="较昨日同时段" icon={Thermometer} tone="amber" />
        <StatCard label="遥测上报" value="12.8" unit="万/小时" trendLabel="消息延迟 86 ms" icon={Activity} tone="cyan" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(320px,0.8fr)]">
        <SectionCard title="设备遥测" description="点击任意设备可使用右侧面板查看详细趋势" action={<div className="flex gap-2"><div className="relative"><Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" /><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜索设备" className="h-8 w-40 pl-8 text-xs" /></div><Select value={status} onValueChange={setStatus}><SelectTrigger className="h-8 w-24 text-xs"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">全部</SelectItem><SelectItem value="在线">在线</SelectItem><SelectItem value="调光">调光</SelectItem><SelectItem value="告警">告警</SelectItem><SelectItem value="离线">离线</SelectItem></SelectContent></Select></div>}>
          <div className="max-h-[520px] overflow-auto rounded-xl border border-border/60">
            <Table>
              <TableHeader className="sticky top-0 z-10 bg-muted/95 backdrop-blur"><TableRow><TableHead className="text-[10px]">设备</TableHead><TableHead className="text-[10px]">状态</TableHead><TableHead className="text-[10px]">功率</TableHead><TableHead className="text-[10px]">电压</TableHead><TableHead className="text-[10px]">温度</TableHead><TableHead className="text-[10px]">通信</TableHead></TableRow></TableHeader>
              <TableBody>{filtered.map((device) => <TableRow key={device.id} className="hover:bg-brand-500/5"><TableCell><p className="text-xs font-medium">{device.name}</p><p className="mt-0.5 font-mono text-[9px] text-muted-foreground">{device.id}</p></TableCell><TableCell><StatusBadge status={device.status} /></TableCell><TableCell className="font-mono text-xs">{device.power} kW</TableCell><TableCell className="font-mono text-xs">{device.voltage} V</TableCell><TableCell className={`font-mono text-xs ${device.temperature > 45 ? 'text-amber-600 dark:text-amber-300' : ''}`}>{device.temperature} °C</TableCell><TableCell className="text-[10px] text-muted-foreground">{device.lastSeen}</TableCell></TableRow>)}</TableBody>
            </Table>
          </div>
        </SectionCard>

        <div className="space-y-5">
          <SectionCard title={selected?.name ?? '设备详情'} description={selected ? `${selected.id} · ${selected.station}` : ''}>
            {selected && <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['调光比例', `${selected.dimming}%`, <BatteryCharging className="size-4" />],
                  ['实时功率', `${selected.power} kW`, <Zap className="size-4" />],
                  ['电压', `${selected.voltage} V`, <Activity className="size-4" />],
                  ['温度', `${selected.temperature} °C`, <Thermometer className="size-4" />],
                ].map(([label, value, icon]) => <div key={String(label)} className="rounded-xl bg-muted/50 p-3"><div className="flex items-center justify-between text-muted-foreground"><span className="text-[10px]">{label}</span>{icon}</div><p className="mt-2 font-mono text-lg font-semibold">{value}</p></div>)}
              </div>
              <div><div className="mb-2 flex justify-between text-[10px]"><span className="text-muted-foreground">负载率</span><span className="font-mono">{selected.dimming}%</span></div><MetricBar value={selected.dimming} /></div>
            </div>}
          </SectionCard>
          <SectionCard title="温度趋势" description="最近 60 分钟">
            <LineTrendChart points={telemetry} height={180} />
          </SectionCard>
          <SectionCard title="通信质量" description="当前设备链路状态">
            <div className="space-y-3 text-xs">{[
              ['网络协议', selected?.protocol ?? '-'],
              ['信号强度', '-67 dBm'],
              ['消息延迟', '86 ms'],
              ['丢包率', '0.02%'],
            ].map(([label, value]) => <div key={label} className="flex items-center justify-between border-b border-border/50 pb-2 last:border-0"><span className="text-muted-foreground">{label}</span><span className="font-mono text-foreground">{value}</span></div>)}</div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}
