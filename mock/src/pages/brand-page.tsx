import { BadgeCheck, Building2, ChartNoAxesCombined, Lightbulb, Mail, MapPin, Phone, Radar, ShieldCheck, Wrench } from 'lucide-react';
import topstarLogo from '@/assets/topstar-logo.svg';
import topstarLogoDark from '@/assets/topstar-logo-dark.svg';
import { PageHeader, SectionCard } from '@/components/shared';
import { Badge } from '@/components/ui/badge';
import { brandCapabilities } from '@/data/mock-data';

const iconMap = { lightbulb: Lightbulb, radar: Radar, wrench: Wrench, chart: ChartNoAxesCombined } as const;

export function BrandPage() {
  return (
    <div className="space-y-5">
      <PageHeader eyebrow="品牌信息" title="通士达智慧照明 SaaS 平台" description="以智慧照明为核心，连接设备、空间、数据与运营服务的城市级物联网 SaaS 平台。" />

      <section className="relative overflow-hidden rounded-3xl border border-brand-400/25 bg-gradient-to-br from-brand-600 via-blue-700 to-cyan-600 p-6 text-white shadow-2xl shadow-brand-900/20 md:p-8">
        <div className="pointer-events-none absolute inset-0 bg-grid-pattern opacity-20" />
        <div className="pointer-events-none absolute -right-20 -top-28 size-80 rounded-full border border-cyan-200/20 bg-cyan-300/10" />
        <div className="relative grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-2xl bg-white/95 px-5 py-3 shadow-xl"><img src={topstarLogo} alt="TOPSTAR 通士达" className="h-12 w-auto dark:hidden" /><img src={topstarLogoDark} alt="TOPSTAR 通士达" className="hidden h-12 w-auto dark:block" /></div>
            <h1 className="mt-6 max-w-3xl text-3xl font-semibold leading-tight tracking-tight md:text-4xl">让每一盏城市灯光，都成为可感知、可计算、可运营的数字化节点。</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-blue-50/85">通士达智慧照明 SaaS 平台面向城市道路、园区、桥梁和公共空间，提供设备接入、实时监控、策略调光、告警运维和能耗分析的一体化能力。</p>
            <div className="mt-6 flex flex-wrap gap-2">{['智慧照明', '空间感知', 'SaaS 运营', 'IoT 设备管理', '节能降碳'].map((tag) => <Badge key={tag} className="border-white/20 bg-white/12 text-white hover:bg-white/15">{tag}</Badge>)}</div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[['5,420', '接入设备'], ['398', '覆盖场站'], ['99.84%', '平台在线率'], ['41.2%', '综合节能率']].map(([value, label]) => <div key={label} className="rounded-2xl border border-white/15 bg-white/10 p-4 backdrop-blur"><p className="font-mono text-2xl font-semibold">{value}</p><p className="mt-1 text-[10px] text-blue-100/75">{label}</p></div>)}
          </div>
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {brandCapabilities.map((capability) => {
          const Icon = iconMap[capability.icon as keyof typeof iconMap];
          return (
            <div key={capability.title} className="app-surface rounded-2xl p-5">
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500/18 to-cyan-500/10 text-brand-600 ring-1 ring-brand-500/15 dark:text-brand-300"><Icon className="size-5" /></span>
              <h2 className="mt-4 text-sm font-semibold text-foreground">{capability.title}</h2>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">{capability.description}</p>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
        <SectionCard title="平台价值" description="从单点设备控制升级为城市级照明运营能力">
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { icon: BadgeCheck, title: '统一设备接入', text: '兼容 Cat.1、NB-IoT、PLC、LoRaWAN 等协议，统一设备模型与遥测口径。' },
              { icon: ShieldCheck, title: '安全权限体系', text: '按组织、角色、项目和场站配置数据范围，保障运营边界清晰。' },
              { icon: ChartNoAxesCombined, title: '数据驱动节能', text: '持续分析亮度、时段、光照和能耗数据，自动优化照明策略。' },
              { icon: Wrench, title: '闭环运维', text: '告警发现、工单派发、现场处理、恢复确认全流程可追溯。' },
            ].map((item) => {
              const Icon = item.icon;
              return <div key={item.title} className="rounded-xl border border-border/60 bg-background/45 p-4"><Icon className="size-4 text-brand-600 dark:text-brand-300" /><h3 className="mt-3 text-xs font-semibold">{item.title}</h3><p className="mt-1.5 text-[10px] leading-5 text-muted-foreground">{item.text}</p></div>;
            })}
          </div>
        </SectionCard>

        <SectionCard title="联系我们" description="通士达智慧照明事业部">
          <div className="space-y-3 text-xs">
            {[
              { icon: Building2, label: '公司名称', value: '通士达科技股份有限公司' },
              { icon: MapPin, label: '总部地址', value: '福建省厦门市同安区通士达科技园' },
              { icon: Phone, label: '服务热线', value: '400-888-6688' },
              { icon: Mail, label: '商务邮箱', value: 'smart-lighting@topstar.com' },
            ].map((item) => {
              const Icon = item.icon;
              return <div key={item.label} className="flex items-start gap-3 rounded-xl bg-muted/45 p-3"><span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300"><Icon className="size-4" /></span><span><span className="block text-[9px] text-muted-foreground">{item.label}</span><span className="mt-1 block font-medium text-foreground">{item.value}</span></span></div>;
            })}
          </div>
        </SectionCard>
      </div>
    </div>
  );
}
