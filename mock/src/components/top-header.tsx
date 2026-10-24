import { useEffect, useMemo, useState } from 'react';
import { Clock3, Command, Cpu, FolderKanban, Moon, Search, Sun, Zap } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { devices, projects } from '@/data/mock-data';
import { flatNavItems, getBreadcrumbs } from '@/navigation';
import type { ThemeMode } from '@/types';
import { cn } from '@/lib/utils';

function useClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);
  return now;
}

export function TopHeader({ theme, onThemeChange }: { theme: ThemeMode; onThemeChange: (theme: ThemeMode) => void }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const now = useClock();
  const [commandOpen, setCommandOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [ecoMode, setEcoMode] = useState(true);
  const breadcrumbs = getBreadcrumbs(pathname);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandOpen((current) => !current);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const results = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const navResults = flatNavItems
      .filter((item) => item.path && (!normalized || item.label.toLowerCase().includes(normalized)))
      .slice(0, 8)
      .map((item) => ({ id: item.id, label: item.label, detail: item.path!, path: item.path!, type: '页面' }));
    const projectResults = projects
      .filter((item) => normalized && `${item.name}${item.city}${item.id}`.toLowerCase().includes(normalized))
      .slice(0, 5)
      .map((item) => ({ id: item.id, label: item.name, detail: item.city, path: '/projects/list', type: '项目' }));
    const deviceResults = devices
      .filter((item) => normalized && `${item.name}${item.id}${item.station}`.toLowerCase().includes(normalized))
      .slice(0, 5)
      .map((item) => ({ id: item.id, label: item.name, detail: item.station, path: '/devices/list', type: '设备' }));
    return [...navResults, ...projectResults, ...deviceResults];
  }, [query]);

  const goToResult = (path: string) => {
    navigate(path);
    setCommandOpen(false);
    setQuery('');
  };

  const timestamp = `${now.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })} ${now.toLocaleTimeString('zh-CN', { hour12: false })}`;

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/70 bg-background/80 px-3 backdrop-blur-xl md:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <SidebarTrigger className="text-muted-foreground hover:text-foreground" />
          <div className="hidden min-w-0 items-center gap-1.5 text-xs sm:flex">
            {breadcrumbs.map((item, index) => (
              <span key={`${item}-${index}`} className="flex items-center gap-1.5">
                {index > 0 && <span className="text-muted-foreground/35">/</span>}
                <span className={index === breadcrumbs.length - 1 ? 'truncate font-medium text-foreground' : 'text-muted-foreground'}>{item}</span>
              </span>
            ))}
          </div>
          <Badge variant="outline" className="hidden border-emerald-500/25 bg-emerald-500/10 text-[10px] text-emerald-700 dark:text-emerald-300 lg:inline-flex">
            <span className="mr-1 size-1.5 rounded-full bg-emerald-500" />99.84% 在线率
          </Badge>
        </div>

        <button onClick={() => setCommandOpen(true)} className="hidden h-9 w-72 items-center justify-between rounded-xl border border-border/80 bg-card/70 px-3 text-xs text-muted-foreground shadow-xs transition-colors hover:border-brand-400/60 hover:text-foreground md:flex">
          <span className="flex items-center gap-2"><Search className="size-3.5" />搜索页面、项目或设备...</span>
          <span className="flex items-center gap-1 rounded-md border border-border bg-background/70 px-1.5 py-0.5 font-mono text-[9px]"><Command className="size-2.5" />K</span>
        </button>

        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-border/80 bg-card/70 p-0.5 shadow-xs">
            <button
              onClick={() => { onThemeChange('light'); toast.success('已切换为科技蓝模式'); }}
              title="科技蓝模式"
              className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors', theme === 'light' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
            >
              <Sun className="size-3.5" /><span className="hidden sm:inline">科技蓝</span>
            </button>
            <button
              onClick={() => { onThemeChange('dark'); toast.success('已切换为深空蓝模式'); }}
              title="深空蓝模式"
              className={cn('flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[11px] font-medium transition-colors', theme === 'dark' ? 'bg-brand-600 text-white shadow-sm' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}
            >
              <Moon className="size-3.5" /><span className="hidden sm:inline">深空蓝</span>
            </button>
          </div>
          <div className="hidden items-center gap-1.5 font-mono text-[10px] text-muted-foreground xl:flex"><Clock3 className="size-3.5" />{timestamp}</div>
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-xl border-brand-400/30 bg-brand-500/8 text-[11px] text-brand-700 hover:bg-brand-500/14 dark:text-brand-200"
            onClick={() => {
              setEcoMode((current) => !current);
              toast.success(ecoMode ? '已切换为高亮模式' : '已切换为节能模式');
            }}
          >
            <Zap className="size-3.5" /><span className="hidden sm:inline">{ecoMode ? '节能模式' : '高亮模式'}</span>
          </Button>
        </div>
      </header>

      <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
        <DialogContent className="gap-0 overflow-hidden border-brand-500/20 bg-popover/95 p-0 shadow-2xl shadow-brand-950/20 sm:max-w-xl">
          <DialogHeader className="sr-only">
            <DialogTitle>全局搜索</DialogTitle>
            <DialogDescription>搜索页面、项目或设备</DialogDescription>
          </DialogHeader>
          <div className="flex items-center gap-3 border-b border-border px-4 py-3">
            <Search className="size-4 text-brand-500" />
            <Input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="输入页面、项目或设备关键词" className="h-8 border-0 bg-transparent px-0 shadow-none focus-visible:ring-0" />
          </div>
          <div className="max-h-[420px] overflow-y-auto p-2">
            {results.length === 0 ? (
              <div className="px-4 py-10 text-center text-sm text-muted-foreground">没有找到匹配结果</div>
            ) : results.map((result) => (
              <button key={`${result.type}-${result.id}`} onClick={() => goToResult(result.path)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-brand-500/10">
                <span className="flex size-8 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600 dark:text-brand-300">
                  {result.type === '项目' ? <FolderKanban className="size-4" /> : result.type === '设备' ? <Cpu className="size-4" /> : <Search className="size-4" />}
                </span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium text-foreground">{result.label}</span><span className="block truncate text-[10px] text-muted-foreground">{result.detail}</span></span>
                <Badge variant="outline" className="text-[9px] text-muted-foreground">{result.type}</Badge>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
