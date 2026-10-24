import { useState } from 'react';
import { Clock3, Lightbulb, Power, Save, Sun, Zap } from 'lucide-react';
import { toast } from 'sonner';
import { PageHeader, SectionCard, StatCard, StatusBadge } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

const schedules = [
  { id: 'S-01', name: '日落入灯', time: '18:24', dimming: 100, days: '每天', enabled: true },
  { id: 'S-02', name: '深夜节能', time: '00:00', dimming: 55, days: '每天', enabled: true },
  { id: 'S-03', name: '凌晨微光', time: '03:00', dimming: 30, days: '每天', enabled: true },
  { id: 'S-04', name: '日出关灯', time: '06:12', dimming: 0, days: '每天', enabled: true },
  { id: 'S-05', name: '周末景观模式', time: '19:00', dimming: 85, days: '周六、周日', enabled: false },
];

const circuits = [
  { name: 'A 回路 · 环岛南路东段', devices: 820, rate: 99.8, status: '正常' },
  { name: 'B 回路 · 环岛南路西段', devices: 612, rate: 97.4, status: '调光' },
  { name: 'C 回路 · 演武大桥桥面', devices: 264, rate: 98.9, status: '正常' },
  { name: 'D 回路 · 同安产业园', devices: 486, rate: 96.2, status: '巡检' },
];

export function StrategyPage() {
  const [dimming, setDimming] = useState(75);
  const [isEcoMode, setIsEcoMode] = useState(true);
  const [scheduleState, setScheduleState] = useState(schedules);

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="监控与控制 / 策略管理"
        title="光网时序与调光策略"
        description="统一管理全网亮度、节能模式、执行时刻和回路运行策略。"
        actions={<Button className="brand-gradient border-0 text-white" onClick={() => toast.success('策略配置已保存')}><Save className="size-4" />保存策略</Button>}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="全局亮度" value={String(dimming)} unit="%" trendLabel="当前策略目标值" icon={Lightbulb} tone="blue" />
        <StatCard label="今日节能率" value="41.2" unit="%" trend={3.2} trendLabel="较昨日" icon={Zap} tone="green" />
        <StatCard label="执行中策略" value="18" unit="条" trendLabel="全部执行正常" icon={Clock3} tone="cyan" />
        <StatCard label="节能模式" value={isEcoMode ? '已启用' : '已关闭'} trendLabel="自动根据光照调整" icon={Sun} tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,1.35fr)]">
        <SectionCard title="全网调光控制" description="拖动滑块可模拟调整所有在线灯具的目标亮度">
          <div className="rounded-2xl bg-muted/40 border border-border p-5">
            <div className="flex items-end justify-between"><div><p className="text-xs text-muted-foreground">目标亮度</p><p className="mt-2 font-mono text-5xl font-semibold text-gradient">{dimming}%</p></div><span className="rounded-full border border-brand-500/20 bg-brand-500/10 px-3 py-1 text-[10px] text-brand-700 dark:text-brand-200">约 184.6 kW</span></div>
            <input type="range" min="0" max="100" value={dimming} onChange={(event) => setDimming(Number(event.target.value))} className="mt-7 w-full accent-brand-600" />
            <div className="mt-2 flex justify-between font-mono text-[9px] text-muted-foreground"><span>0% 熄灯</span><span>50% 节能</span><span>100% 全亮</span></div>
            <div className="mt-5 flex items-center justify-between rounded-xl border border-border/60 bg-background/55 p-3">
              <div><p className="text-xs font-medium">节能模式</p><p className="mt-1 text-[10px] text-muted-foreground">根据光照和时段自动调整亮度</p></div>
              <Switch checked={isEcoMode} onCheckedChange={(checked) => { setIsEcoMode(checked); toast.success(checked ? '节能模式已启用' : '节能模式已关闭'); }} />
            </div>
            <Button className="mt-4 w-full brand-gradient border-0 text-white" onClick={() => toast.success(`已下发 ${dimming}% 调光策略`)}><Power className="size-4" />立即下发全网</Button>
          </div>
        </SectionCard>

        <SectionCard title="回路运行状态" description="按回路查看设备承载、在线率与当前运行模式">
          <div className="space-y-3">
            {circuits.map((circuit) => (
              <div key={circuit.name} className="rounded-xl border border-border/60 bg-background/45 p-3">
                <div className="flex items-center justify-between gap-3"><div><p className="text-xs font-medium">{circuit.name}</p><p className="mt-1 text-[10px] text-muted-foreground">{circuit.devices} 台设备</p></div><StatusBadge status={circuit.status} /></div>
                <div className="mt-3 flex items-center gap-3"><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-brand-600 dark:bg-brand-500" style={{ width: `${circuit.rate}%` }} /></div><span className="w-12 text-right font-mono text-[10px] text-muted-foreground">{circuit.rate}%</span></div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      <SectionCard title="定时策略" description="根据日落、日出和业务时段自动执行灯光策略" action={<Button variant="outline" size="sm" onClick={() => toast.success('已新增一条空白定时策略')}>新增策略</Button>}>
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader className="bg-brand-500/6"><TableRow><TableHead className="text-[10px]">策略名称</TableHead><TableHead className="text-[10px]">执行时间</TableHead><TableHead className="text-[10px]">目标亮度</TableHead><TableHead className="text-[10px]">执行日期</TableHead><TableHead className="text-[10px]">状态</TableHead><TableHead className="text-[10px]">启用</TableHead></TableRow></TableHeader>
            <TableBody>{scheduleState.map((schedule) => <TableRow key={schedule.id}><TableCell className="text-xs font-medium">{schedule.name}</TableCell><TableCell className="font-mono text-xs">{schedule.time}</TableCell><TableCell className="font-mono text-xs">{schedule.dimming}%</TableCell><TableCell className="text-xs text-muted-foreground">{schedule.days}</TableCell><TableCell><StatusBadge status={schedule.enabled ? '执行中' : '停用'} /></TableCell><TableCell><Switch checked={schedule.enabled} onCheckedChange={(checked) => { setScheduleState((current) => current.map((item) => item.id === schedule.id ? { ...item, enabled: checked } : item)); toast.success(`${schedule.name}已${checked ? '启用' : '停用'}`); }} /></TableCell></TableRow>)}</TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
