import { useState } from 'react';
import { BarChart3, BatteryCharging, Download, Leaf, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';
import { BarSeriesChart } from '@/components/charts';
import { PageHeader, SectionCard, StatCard } from '@/components/shared';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { reportSeries } from '@/data/mock-data';

type ReportPeriod = 'daily' | 'weekly' | 'monthly';

const periodMeta: Record<ReportPeriod, { title: string; description: string; total: string; saving: string; carbon: string }> = {
  daily: { title: '今日能耗报告', description: '按两小时粒度统计照明能耗与节能趋势', total: '1,428.5', saving: '41.2', carbon: '1.12' },
  weekly: { title: '本周能耗报告', description: '按天汇总项目能耗、节能率与异常波动', total: '7,682.0', saving: '32.6', carbon: '5.84' },
  monthly: { title: '本月能耗报告', description: '按日查看本月运行表现、节能成效和碳减排', total: '32,480.0', saving: '29.8', carbon: '24.72' },
};

export function ReportsPage() {
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const points = reportSeries[period].map((point) => ({ label: point.label, value: point.energy, secondary: point.savings }));
  const meta = periodMeta[period];

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="数据统计"
        title="能耗与运营报表"
        description="按日、周、月统计照明能耗、节能率、碳减排和策略执行情况。"
        actions={<Button variant="outline" onClick={() => toast.success(`${meta.title}已导出为 CSV`)}><Download className="size-4" />导出报表</Button>}
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={period} onValueChange={(value) => setPeriod(value as ReportPeriod)}>
          <TabsList className="bg-brand-500/8"><TabsTrigger value="daily">日报表</TabsTrigger><TabsTrigger value="weekly">周报表</TabsTrigger><TabsTrigger value="monthly">月报表</TabsTrigger></TabsList>
        </Tabs>
        <p className="text-[10px] text-muted-foreground">统计范围：厦门智慧照明示范项目及关联场站</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="总用电量" value={meta.total} unit="kWh" trend={-4.8} trendLabel="较上一周期" icon={BatteryCharging} tone="blue" />
        <StatCard label="节能率" value={meta.saving} unit="%" trend={3.2} trendLabel="策略优化效果" icon={TrendingUp} tone="green" />
        <StatCard label="碳减排" value={meta.carbon} unit="tCO₂" trendLabel="按电网排放因子估算" icon={Leaf} tone="cyan" />
        <StatCard label="策略执行率" value="99.2" unit="%" trend={0.8} trendLabel="18 条策略全部生效" icon={BarChart3} tone="amber" />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_360px]">
        <SectionCard title={meta.title} description={meta.description} action={<div className="flex items-center gap-3 text-[10px] text-muted-foreground"><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-brand-500" />实际能耗</span><span className="flex items-center gap-1"><span className="size-2 rounded-full bg-cyan-400" />节能率</span></div>}>
          <BarSeriesChart points={points} />
        </SectionCard>
        <SectionCard title="节能构成" description="当前周期节能贡献来源">
          <div className="space-y-4">
            {[
              ['智能调光', 42, 'bg-brand-500'],
              ['时序策略', 28, 'bg-cyan-400'],
              ['光照联动', 18, 'bg-emerald-400'],
              ['设备休眠', 12, 'bg-amber-400'],
            ].map(([label, value, color]) => (
              <div key={String(label)}>
                <div className="mb-1.5 flex items-center justify-between text-[11px]"><span className="text-muted-foreground">{label}</span><span className="font-mono text-foreground">{value}%</span></div>
                <div className="h-2 overflow-hidden rounded-full bg-muted"><div className={`h-full rounded-full ${color}`} style={{ width: `${value}%` }} /></div>
              </div>
            ))}
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/8 p-3 text-[10px] leading-5 text-emerald-700 dark:text-emerald-300">相比固定功率模式，本周期预计节省电费约 ¥ 18,420，减少碳排放 {meta.carbon} 吨。</div>
          </div>
        </SectionCard>
      </div>

      <SectionCard title="项目能耗明细" description="按项目汇总当前统计周期的能耗和节能表现">
        <div className="overflow-x-auto rounded-xl border border-border/60">
          <Table>
            <TableHeader className="bg-brand-500/6"><TableRow><TableHead className="text-[10px]">项目</TableHead><TableHead className="text-[10px]">设备数</TableHead><TableHead className="text-[10px]">总能耗</TableHead><TableHead className="text-[10px]">节能率</TableHead><TableHead className="text-[10px]">碳减排</TableHead><TableHead className="text-[10px]">状态</TableHead></TableRow></TableHeader>
            <TableBody>
              {[
                ['厦门智慧照明示范项目', '5,420', '18,420 kWh', '42.1%', '12.8 tCO₂', '优秀'],
                ['同安产业园智慧灯杆项目', '1,860', '6,280 kWh', '31.8%', '4.2 tCO₂', '良好'],
                ['湖里区道路照明改造项目', '3,120', '5,740 kWh', '24.6%', '3.7 tCO₂', '建设中'],
                ['集美新城夜景提升项目', '940', '2,040 kWh', '28.3%', '1.4 tCO₂', '良好'],
              ].map((row) => <TableRow key={row[0]}>{row.map((cell, index) => <TableCell key={index} className={index === 0 ? 'text-xs font-medium' : 'font-mono text-xs text-muted-foreground'}>{cell}</TableCell>)}</TableRow>)}
            </TableBody>
          </Table>
        </div>
      </SectionCard>
    </div>
  );
}
