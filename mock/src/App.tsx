import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BatteryCharging,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  Compass,
  Cpu,
  Download,
  Eye,
  Filter,
  Flame,
  Layers,
  Lightbulb,
  Maximize2,
  Moon,
  Navigation,
  PanelLeftClose,
  PanelLeftOpen,
  Power,
  QrCode,
  Radio,
  RefreshCw,
  Search,
  Server,
  Settings,
  ShieldAlert,
  Sliders,
  SlidersHorizontal,
  Sun,
  TrendingDown,
  TrendingUp,
  User,
  Wifi,
  Zap
} from 'lucide-react';

// Types
type TabType = 'overview' | 'monitor' | 'assets' | 'lighting' | 'incidents';

interface PoleData {
  id: string;
  name: string;
  road: string;
  type: string;
  status: 'online' | 'dimmed' | 'warning' | 'offline';
  circuit: string;
  dimming: number; // 0 - 100%
  power: number; // Watts
  voltage: number;
  current: number;
  temperature: number;
  lat: number;
  lng: number;
  protocol: 'Cat.1' | 'NB-IoT' | 'PLC' | 'LoRaWAN';
  lastSeen: string;
}

const INITIAL_POLES: PoleData[] = [
  { id: 'PL-XM-0101', name: '环岛南路 01# 智慧杆', road: '环岛南路示范段', type: '多功能智慧杆', status: 'online', circuit: 'A回路-东段', dimming: 85, power: 120.4, voltage: 221.8, current: 0.54, temperature: 34.2, lat: 24.4358, lng: 118.1254, protocol: 'Cat.1', lastSeen: '刚刚' },
  { id: 'PL-XM-0102', name: '环岛南路 02# 智慧杆', road: '环岛南路示范段', type: '多功能智慧杆', status: 'online', circuit: 'A回路-东段', dimming: 85, power: 121.2, voltage: 221.5, current: 0.55, temperature: 35.1, lat: 24.4365, lng: 118.1268, protocol: 'Cat.1', lastSeen: '刚刚' },
  { id: 'PL-XM-0103', name: '环岛南路 03# 智能杆', road: '环岛南路示范段', type: 'LED高杆灯', status: 'dimmed', circuit: 'A回路-东段', dimming: 40, power: 64.0, voltage: 220.9, current: 0.29, temperature: 31.8, lat: 24.4372, lng: 118.1281, protocol: 'NB-IoT', lastSeen: '1分钟前' },
  { id: 'PL-XM-0104', name: '环岛南路 04# 智慧杆', road: '环岛南路示范段', type: '多功能智慧杆', status: 'warning', circuit: 'B回路-西段', dimming: 75, power: 142.8, voltage: 236.4, current: 0.61, temperature: 48.9, lat: 24.4379, lng: 118.1295, protocol: 'Cat.1', lastSeen: '3分钟前' },
  { id: 'PL-XM-0105', name: '环岛南路 05# 景观杆', road: '环岛南路示范段', type: '景观氛围灯杆', status: 'online', circuit: 'B回路-西段', dimming: 90, power: 88.5, voltage: 221.0, current: 0.40, temperature: 33.4, lat: 24.4387, lng: 118.1309, protocol: 'PLC', lastSeen: '刚刚' },
  { id: 'PL-XM-0106', name: '演武大桥 01# 枢纽杆', road: '演武路匝道', type: '多功能智慧杆', status: 'online', circuit: 'C回路-桥面', dimming: 100, power: 160.0, voltage: 222.1, current: 0.72, temperature: 36.7, lat: 24.4395, lng: 118.1322, protocol: 'Cat.1', lastSeen: '刚刚' },
  { id: 'PL-XM-0107', name: '演武大桥 02# 枢纽杆', road: '演武路匝道', type: 'LED高杆灯', status: 'offline', circuit: 'C回路-桥面', dimming: 0, power: 0.0, voltage: 0.0, current: 0.0, temperature: 21.0, lat: 24.4402, lng: 118.1336, protocol: 'NB-IoT', lastSeen: '25分钟前' },
  { id: 'PL-XM-0108', name: '演武大桥 03# 景观杆', road: '演武路匝道', type: '景观氛围灯杆', status: 'online', circuit: 'C回路-桥面', dimming: 80, power: 75.3, voltage: 220.4, current: 0.34, temperature: 32.1, lat: 24.4410, lng: 118.1350, protocol: 'PLC', lastSeen: '刚刚' },
];

interface NavGroup {
  groupName: string;
  items: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: string;
    badgeColor?: string;
  }[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    groupName: '核心感知',
    items: [
      { id: 'overview', label: '态势感知', icon: Activity },
      { id: 'monitor', label: '极夜数字孪生', icon: Compass },
    ],
  },
  {
    groupName: '控制与资产',
    items: [
      { id: 'assets', label: '资产矩阵', icon: Server, badge: '5,420' },
      { id: 'lighting', label: '光网时序调控', icon: Sliders },
    ],
  },
  {
    groupName: '运维中枢',
    items: [
      {
        id: 'incidents',
        label: '告警与运维',
        icon: AlertTriangle,
        badge: '2',
        badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      },
    ],
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [poles, setPoles] = useState<PoleData[]>(INITIAL_POLES);
  const [selectedPole, setSelectedPole] = useState<PoleData | null>(INITIAL_POLES[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Lighting schedules
  const [globalDimming, setGlobalDimming] = useState(75);
  const [isEcoMode, setIsEcoMode] = useState(true);
  const [isAstroActive, setIsAstroActive] = useState(true);

  // Clock ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }) +
          ' ' +
          now.toLocaleTimeString('zh-CN', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3200);
  };

  // Keyboard shortcut ⌘K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsCommandOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filtered poles
  const filteredPoles = useMemo(() => {
    return poles.filter((p) => {
      const matchesSearch =
        p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.name.includes(searchQuery) ||
        p.road.includes(searchQuery);
      const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [poles, searchQuery, filterStatus]);

  // Adjust dimming for specific pole
  const handlePoleDimming = (id: string, val: number) => {
    setPoles((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          const newPower = Number(((val / 100) * 140).toFixed(1));
          return { ...p, dimming: val, power: newPower, status: val === 0 ? 'offline' : val < 50 ? 'dimmed' : 'online' };
        }
        return p;
      })
    );
    if (selectedPole && selectedPole.id === id) {
      setSelectedPole((prev) => (prev ? { ...prev, dimming: val } : null));
    }
  };

  // Current tab metadata
  const currentTabLabel = useMemo(() => {
    for (const g of NAV_GROUPS) {
      for (const item of g.items) {
        if (item.id === activeTab) return item.label;
      }
    }
    return '概览';
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-lg shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      {/* Global Command Palette (⌘K) Modal */}
      {isCommandOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-start justify-center pt-24 px-4 animate-in fade-in duration-150">
          <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col">
            <div className="flex items-center px-4 py-3 border-b border-zinc-800/80 gap-3">
              <Search className="w-4 h-4 text-zinc-400" />
              <input
                autoFocus
                placeholder="键入以搜索设备编码、配电箱、告警或执行策略指令..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none"
              />
              <kbd className="px-2 py-0.5 text-[10px] font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 rounded">ESC</kbd>
            </div>
            <div className="p-2 max-h-80 overflow-y-auto space-y-1">
              <div className="px-2 py-1 text-[11px] font-mono uppercase tracking-wider text-zinc-500">快捷跳转与设备</div>
              {filteredPoles.slice(0, 5).map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSelectedPole(p);
                    setActiveTab('assets');
                    setIsCommandOpen(false);
                    showToast(`已切换至设备: ${p.name}`);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-sm hover:bg-zinc-900 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-1.5 h-1.5 rounded-full ${p.status === 'online' ? 'bg-emerald-400' : p.status === 'warning' ? 'bg-amber-400' : 'bg-rose-400'}`} />
                    <div>
                      <p className="font-medium text-zinc-200">{p.name}</p>
                      <p className="text-xs text-zinc-500 font-mono">{p.id} · {p.road}</p>
                    </div>
                  </div>
                  <span className="text-xs font-mono text-zinc-400">{p.power} W</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 🚀 COLLAPSIBLE LEFT SIDEBAR (Vercel & Cloudflare Style) */}
      {/* ========================================================= */}
      <aside
        className={`sticky top-0 h-screen bg-zinc-950/90 backdrop-blur-md border-r border-zinc-800/80 flex flex-col justify-between transition-all duration-300 ease-in-out z-40 ${
          isSidebarCollapsed ? 'w-16' : 'w-64'
        }`}
      >
        {/* Top: Brand Header */}
        <div className="flex flex-col">
          <div className="h-14 border-b border-zinc-800/80 px-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-zinc-900 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0 shadow-sm">
                <Lightbulb className="w-4 h-4" />
              </div>
              {!isSidebarCollapsed && (
                <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
                  <span className="text-sm font-semibold tracking-tight text-zinc-100">CityLight</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                    v2.4
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle button inside header */}
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              title={isSidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}
              className="p-1.5 rounded-md hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="w-4 h-4 text-zinc-400" />
              ) : (
                <PanelLeftClose className="w-4 h-4 text-zinc-400" />
              )}
            </button>
          </div>

          {/* Workspace Pill */}
          {!isSidebarCollapsed ? (
            <div className="p-3 border-b border-zinc-900">
              <div className="flex items-center justify-between p-2 rounded-lg bg-zinc-900/60 border border-zinc-850 text-xs text-zinc-300 cursor-pointer hover:border-zinc-700 transition-colors">
                <div className="flex flex-col overflow-hidden">
                  <span className="text-[10px] text-zinc-500 font-mono uppercase">当前网格</span>
                  <span className="font-medium truncate text-zinc-200">厦门市思明区 · 环岛路</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 shrink-0 ml-1" />
              </div>
            </div>
          ) : (
            <div className="py-2 flex justify-center border-b border-zinc-900">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="网格在线" />
            </div>
          )}

          {/* Nav Groups */}
          <div className="p-2 space-y-4 overflow-y-auto">
            {NAV_GROUPS.map((group, gIdx) => (
              <div key={gIdx} className="space-y-1">
                {!isSidebarCollapsed && (
                  <div className="px-2.5 py-1 text-[10px] font-mono uppercase tracking-wider text-zinc-500">
                    {group.groupName}
                  </div>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center rounded-lg text-xs font-medium transition-all duration-150 ${
                        isSidebarCollapsed ? 'justify-center p-2.5' : 'justify-between px-3 py-2'
                      } ${
                        isActive
                          ? 'bg-zinc-850 text-zinc-100 shadow-sm border border-zinc-700/60'
                          : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-zinc-500'}`} />
                        {!isSidebarCollapsed && <span>{item.label}</span>}
                      </div>

                      {!isSidebarCollapsed && item.badge && (
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full border ${
                            item.badgeColor || 'bg-zinc-900 text-zinc-400 border-zinc-800'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Sidebar: System Status & User Profile */}
        <div className="p-2 border-t border-zinc-800/80 space-y-2">
          {/* Status info */}
          {!isSidebarCollapsed && (
            <div className="px-3 py-2 rounded-lg bg-zinc-900/40 border border-zinc-850/80 text-[11px] font-mono text-zinc-400 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>全网正常运行</span>
              </span>
              <span className="text-zinc-500">99.8%</span>
            </div>
          )}

          {/* User profile */}
          <div
            className={`flex items-center rounded-lg hover:bg-zinc-900 cursor-pointer p-2 transition-colors ${
              isSidebarCollapsed ? 'justify-center' : 'justify-between'
            }`}
          >
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-medium text-zinc-300 shrink-0">
                叶
              </div>
              {!isSidebarCollapsed && (
                <div className="flex flex-col overflow-hidden">
                  <span className="text-xs font-medium text-zinc-200 truncate">叶文来</span>
                  <span className="text-[10px] text-zinc-500 font-mono truncate">运维调度总管</span>
                </div>
              )}
            </div>
            {!isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(true)}
                title="收起侧边栏"
                className="p-1 text-zinc-500 hover:text-zinc-300"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 💻 MAIN CONTENT WRAPPER */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 w-full h-14 bg-zinc-950/80 backdrop-blur-md border-b border-zinc-800/80 px-4 md:px-6 flex items-center justify-between">
          {/* Left: Breadcrumbs & Quick Toggle */}
          <div className="flex items-center gap-3">
            {isSidebarCollapsed && (
              <button
                onClick={() => setIsSidebarCollapsed(false)}
                className="p-1.5 rounded-md hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                title="展开侧边栏"
              >
                <PanelLeftOpen className="w-4 h-4 text-zinc-300" />
              </button>
            )}

            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-zinc-500">主控中枢</span>
              <ChevronRight className="w-3 h-3 text-zinc-600" />
              <span className="font-semibold text-zinc-200">{currentTabLabel}</span>
            </div>

            {/* Cloudflare Style Status Badge */}
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/40 border border-emerald-800/40 text-[11px] font-mono text-emerald-400 ml-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>99.84% 在线率 · 遥测正常</span>
            </div>
          </div>

          {/* Middle: Command Search Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-400 hover:text-zinc-200 transition-all w-64 justify-between"
          >
            <div className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-zinc-500" />
              <span>按 ⌘K 快速检索...</span>
            </div>
            <kbd className="text-[10px] font-mono text-zinc-500 bg-zinc-950 px-1.5 py-0.5 rounded border border-zinc-800">⌘K</kbd>
          </button>

          {/* Right: Clock & Quick Mode */}
          <div className="flex items-center gap-3">
            <div className="hidden xl:flex items-center gap-2 text-xs font-mono text-zinc-400">
              <Clock className="w-3.5 h-3.5 text-zinc-500" />
              <span>{currentTime || '2026-10-22 15:30:00'}</span>
            </div>

            <button
              onClick={() => {
                const newDim = isEcoMode ? 100 : 50;
                setIsEcoMode(!isEcoMode);
                setPoles((prev) => prev.map((p) => ({ ...p, dimming: newDim, power: Number(((newDim / 100) * 140).toFixed(1)) })));
                showToast(isEcoMode ? '已切换至「全功率迎宾模式」(100%)' : '已切换至「深度节能模式」(50%)');
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.2 rounded-md bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs font-medium text-amber-400 hover:border-amber-500/40 transition-colors shadow-sm"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{isEcoMode ? '节能模式' : '高亮模式'}</span>
            </button>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 md:p-6 max-w-7xl w-full mx-auto space-y-6">
          {/* ========================================================= */}
          {/* TAB 1: 态势感知 (Overview) */}
          {/* ========================================================= */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* KPI Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Card 1: 在线率 */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>全网路灯在线率</span>
                    <span className="flex items-center text-emerald-400 font-mono text-[11px]">
                      <TrendingUp className="w-3 h-3 mr-0.5" /> +0.12%
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold tracking-tight text-white">99.84%</span>
                    <span className="text-xs text-zinc-500 font-mono">5,411 / 5,420 杆</span>
                  </div>
                  <div className="mt-3 w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-emerald-400 h-1 rounded-full" style={{ width: '99.84%' }} />
                  </div>
                </div>

                {/* Card 2: 实时功率 */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>实时总负荷功率</span>
                    <span className="text-zinc-500 font-mono text-[11px]">额定 320 kW</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold tracking-tight text-amber-400">184.6</span>
                    <span className="text-xs font-mono text-zinc-400">kW</span>
                    <span className="text-xs text-zinc-500 ml-auto font-mono">负载率 57.6%</span>
                  </div>
                  <div className="mt-3 w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-amber-400 h-1 rounded-full" style={{ width: '57.6%' }} />
                  </div>
                </div>

                {/* Card 3: 碳减排 */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>今日智能节能减排</span>
                    <span className="text-emerald-400 font-mono text-[11px]">节能率 41.2%</span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold tracking-tight text-white">1,428.5</span>
                    <span className="text-xs font-mono text-zinc-400">kWh</span>
                    <span className="text-xs text-zinc-500 ml-auto font-mono">-1.12 tCO₂</span>
                  </div>
                  <div className="mt-3 w-full bg-zinc-900 rounded-full h-1 overflow-hidden">
                    <div className="bg-cyan-400 h-1 rounded-full" style={{ width: '41.2%' }} />
                  </div>
                </div>

                {/* Card 4: 告警与工单 */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 hover:border-zinc-700/80 transition-all shadow-sm">
                  <div className="flex items-center justify-between text-zinc-400 text-xs">
                    <span>待处置异常事件</span>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      2 告警
                    </span>
                  </div>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-2xl font-mono font-semibold tracking-tight text-rose-400">2</span>
                    <span className="text-xs text-zinc-500 font-mono">处异常 · 14 已闭环</span>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                    <span>平均修复时延 (MTTR)</span>
                    <span className="font-mono text-zinc-300">24.5 min</span>
                  </div>
                </div>
              </div>

              {/* Middle Section: Chart & Telemetry Stream */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left 2 Cols: 24小时功率分时走势图 */}
                <div className="lg:col-span-2 p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-semibold text-zinc-100 tracking-tight">24 小时光网功率与调光走势</h3>
                      <p className="text-xs text-zinc-500">分时动态调光策略联动效果分析 (kW)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400">
                        <span className="w-2 h-2 rounded-full bg-amber-400" /> 实际功率 (kW)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[11px] font-mono text-zinc-400 ml-2">
                        <span className="w-2 h-2 rounded-full bg-zinc-600" /> 基线满载
                      </span>
                    </div>
                  </div>

                  {/* Custom SVG Line Chart */}
                  <div className="h-56 w-full pt-4">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 600 160">
                      <defs>
                        <linearGradient id="powerGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {[0, 40, 80, 120, 160].map((y, i) => (
                        <line key={i} x1="0" y1={y} x2="600" y2={y} stroke="#27272a" strokeDasharray="3 3" strokeWidth="0.8" />
                      ))}
                      <path
                        d="M 0,20 L 150,20 L 250,20 L 350,20 L 450,20 L 600,20"
                        fill="none"
                        stroke="#3f3f46"
                        strokeWidth="1.2"
                        strokeDasharray="4 4"
                      />
                      <path
                        d="M 0,160 L 0,140 Q 80,120 150,80 T 300,50 T 450,75 T 600,140 L 600,160 Z"
                        fill="url(#powerGrad)"
                      />
                      <path
                        d="M 0,140 Q 80,120 150,80 T 300,50 T 450,75 T 600,140"
                        fill="none"
                        stroke="#f59e0b"
                        strokeWidth="2.5"
                      />
                      <circle cx="150" cy="80" r="3.5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                      <circle cx="300" cy="50" r="3.5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                      <circle cx="450" cy="75" r="3.5" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
                    </svg>
                    <div className="flex justify-between text-[11px] font-mono text-zinc-500 pt-2 border-t border-zinc-800/80">
                      <span>18:00 (日落启辉)</span>
                      <span>21:00 (全功率 100%)</span>
                      <span>00:00 (深夜降光 50%)</span>
                      <span>03:00 (微光巡航 30%)</span>
                      <span>06:00 (日出熄灯)</span>
                    </div>
                  </div>
                </div>

                {/* Right Col: 实时事件流水 */}
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80">
                      <div className="flex items-center gap-2">
                        <Radio className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                        <h3 className="text-sm font-semibold text-zinc-100">边缘事件流水</h3>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500">Live SSE</span>
                    </div>

                    <div className="mt-3 space-y-3">
                      {[
                        { time: '15:28:12', node: 'PL-XM-0104', msg: '温度遥测预警 (48.9°C)', type: 'warn' },
                        { time: '15:26:05', node: 'BX-02-WEST', msg: '配电箱三相电流自检正常', type: 'info' },
                        { time: '15:20:30', node: 'PL-XM-0107', msg: '单灯控制器通信心跳超时', type: 'error' },
                        { time: '15:15:00', node: 'SYS-TIMER', msg: '天文钟同步: 日落时间 18:24', type: 'info' },
                      ].map((evt, idx) => (
                        <div key={idx} className="flex items-start gap-2.5 text-xs">
                          <span className="font-mono text-zinc-500 text-[11px] mt-0.5">{evt.time}</span>
                          <div className="flex-1">
                            <p className="font-mono text-zinc-300 font-medium">{evt.node}</p>
                            <p className="text-zinc-400 text-[11px]">{evt.msg}</p>
                          </div>
                          <span
                            className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                              evt.type === 'error' ? 'bg-rose-400' : evt.type === 'warn' ? 'bg-amber-400' : 'bg-emerald-400'
                            }`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-zinc-800/80">
                    <button
                      onClick={() => {
                        showToast('全网 5,420 处节点健康自检完成: 正常率 99.84%');
                      }}
                      className="w-full py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 transition-colors flex items-center justify-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>执行全网拓扑自检</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 2: 极夜数字孪生大屏 (Dark Vector Map) */}
          {/* ========================================================= */}
          {activeTab === 'monitor' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-zinc-950/80 border border-zinc-800/80 rounded-xl">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-zinc-400">空间视点:</span>
                  <span className="text-xs font-mono px-2 py-1 rounded bg-zinc-900 border border-zinc-800 text-zinc-200">
                    厦门市思明区 · 环岛南路示范路段 (24.438°N, 118.129°E)
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 font-mono text-zinc-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/90 shadow-[0_0_8px_#f59e0b]" /> 运行发光
                  </span>
                  <span className="flex items-center gap-1 font-mono text-zinc-400 ml-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400/30" /> 节能调光
                  </span>
                  <span className="flex items-center gap-1 font-mono text-zinc-400 ml-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> 告警离线
                  </span>
                </div>
              </div>

              {/* Dark Mode GIS Vector Canvas */}
              <div className="relative w-full h-[580px] bg-[#030303] rounded-xl border border-zinc-800 overflow-hidden bg-grid-pattern flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M 0,420 Q 350,380 700,430 T 1300,400" fill="none" stroke="#18181b" strokeWidth="60" opacity="0.4" />
                  <path d="M 0,420 Q 350,380 700,430 T 1300,400" fill="none" stroke="#09090b" strokeWidth="58" />
                  <path d="M 50,450 Q 380,390 750,320 T 1200,180" fill="none" stroke="#27272a" strokeWidth="22" strokeLinecap="round" />
                  <path d="M 50,450 Q 380,390 750,320 T 1200,180" fill="none" stroke="#3f3f46" strokeWidth="1" strokeDasharray="6 8" />
                  <path d="M 380,100 L 480,500" fill="none" stroke="#27272a" strokeWidth="14" strokeLinecap="round" />
                  <path d="M 780,80 L 860,520" fill="none" stroke="#27272a" strokeWidth="14" strokeLinecap="round" />
                </svg>

                {poles.map((pole, index) => {
                  const xPos = 80 + index * 130;
                  const yPos = 440 - index * 32 + (index % 2 === 0 ? 8 : -8);
                  const isSelected = selectedPole?.id === pole.id;
                  const glowColor = pole.status === 'offline' ? '#f43f5e' : '#f59e0b';
                  const opacity = pole.status === 'offline' ? 0.3 : pole.dimming / 100;

                  return (
                    <div
                      key={pole.id}
                      onClick={() => setSelectedPole(pole)}
                      style={{ left: `${xPos}px`, top: `${yPos}px` }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                    >
                      {pole.status !== 'offline' && (
                        <div
                          style={{
                            width: `${40 + (pole.dimming / 100) * 40}px`,
                            height: `${40 + (pole.dimming / 100) * 40}px`,
                            backgroundColor: glowColor,
                            opacity: opacity * 0.35,
                          }}
                          className="absolute -top-1/2 -left-1/2 rounded-full blur-md pointer-events-none transition-all duration-300"
                        />
                      )}

                      <div
                        className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                          isSelected
                            ? 'border-white bg-amber-400 scale-125 shadow-[0_0_12px_#f59e0b]'
                            : pole.status === 'offline'
                            ? 'border-rose-400 bg-rose-950'
                            : pole.status === 'warning'
                            ? 'border-amber-400 bg-amber-950'
                            : 'border-zinc-500 bg-zinc-900 group-hover:border-amber-400'
                        }`}
                      >
                        <div
                          className={`w-1.5 h-1.5 rounded-full ${
                            pole.status === 'offline' ? 'bg-rose-400' : 'bg-amber-300'
                          }`}
                        />
                      </div>

                      <span className="absolute top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-zinc-400 whitespace-nowrap bg-black/80 px-1 rounded border border-zinc-800 opacity-80 group-hover:opacity-100 transition-opacity">
                        {pole.id.split('-').slice(2).join('')}
                      </span>
                    </div>
                  );
                })}

                {selectedPole && (
                  <div className="absolute top-4 right-4 z-30 w-80 bg-zinc-950/95 border border-zinc-800 rounded-xl p-4 shadow-2xl backdrop-blur-md space-y-4 animate-in fade-in duration-150">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-medium text-amber-400">{selectedPole.id}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                            selectedPole.status === 'online' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                            selectedPole.status === 'warning' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                            'bg-rose-500/10 text-rose-400 border-rose-500/20'
                          }`}>
                            {selectedPole.status === 'online' ? '在线运行' : selectedPole.status === 'warning' ? '预警中' : '离线故障'}
                          </span>
                        </div>
                        <h4 className="text-sm font-semibold text-zinc-100 mt-1">{selectedPole.name}</h4>
                        <p className="text-xs text-zinc-500">{selectedPole.road}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-zinc-800 text-xs font-mono">
                      <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850">
                        <span className="text-zinc-500 text-[10px] block">实时功率</span>
                        <span className="text-zinc-200 font-semibold">{selectedPole.power} W</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850">
                        <span className="text-zinc-500 text-[10px] block">工作电压</span>
                        <span className="text-zinc-200 font-semibold">{selectedPole.voltage} V</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850">
                        <span className="text-zinc-500 text-[10px] block">回路电流</span>
                        <span className="text-zinc-200 font-semibold">{selectedPole.current} A</span>
                      </div>
                      <div className="p-2 rounded-lg bg-zinc-900/60 border border-zinc-850">
                        <span className="text-zinc-500 text-[10px] block">核心温度</span>
                        <span className={`font-semibold ${selectedPole.temperature > 45 ? 'text-rose-400' : 'text-zinc-200'}`}>
                          {selectedPole.temperature} °C
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-zinc-800">
                      <div className="flex justify-between text-xs">
                        <span className="text-zinc-400 font-medium">即时调光控制</span>
                        <span className="font-mono text-amber-400 font-semibold">{selectedPole.dimming}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedPole.dimming}
                        onChange={(e) => handlePoleDimming(selectedPole.id, Number(e.target.value))}
                        className="w-full accent-amber-400 bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-[10px] font-mono text-zinc-500">
                        <span>0% 熄灯</span>
                        <span>50% 节能</span>
                        <span>100% 满功率</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 3: 资产矩阵 (Assets Data Table) */}
          {/* ========================================================= */}
          {activeTab === 'assets' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="按编码、杆名检索..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-700"
                    />
                  </div>

                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 focus:outline-none"
                  >
                    <option value="all">全部状态 (All)</option>
                    <option value="online">正常在线 (Online)</option>
                    <option value="dimmed">调光运行 (Dimmed)</option>
                    <option value="warning">存在预警 (Warning)</option>
                    <option value="offline">离线断电 (Offline)</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => showToast('已导出 5,420 条灯杆物理资产台账清单 (CSV)')}
                    className="px-3 py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-xs font-medium text-zinc-300 transition-colors flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>导出清单</span>
                  </button>
                  <button
                    onClick={() => showToast('已批量下发巡检二维码并归档至资产卡片')}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-xs font-medium text-amber-300 transition-colors flex items-center gap-1.5"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>批量二维码</span>
                  </button>
                </div>
              </div>

              {/* High Density Data Table */}
              <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/80 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-zinc-900/60 border-b border-zinc-800/80 text-zinc-400 font-mono text-[11px] uppercase tracking-wider">
                      <tr>
                        <th className="py-3 px-4">资产编码</th>
                        <th className="py-3 px-4">设备名称 / 道路</th>
                        <th className="py-3 px-4">杆体类型</th>
                        <th className="py-3 px-4">回路 / 通信</th>
                        <th className="py-3 px-4">状态</th>
                        <th className="py-3 px-4">调光</th>
                        <th className="py-3 px-4">功率</th>
                        <th className="py-3 px-4">电压 / 温度</th>
                        <th className="py-3 px-4 text-center">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-850">
                      {filteredPoles.map((p) => (
                        <tr
                          key={p.id}
                          className={`hover:bg-zinc-900/50 transition-colors ${selectedPole?.id === p.id ? 'bg-zinc-900/40' : ''}`}
                        >
                          <td className="py-3 px-4 font-mono font-medium text-zinc-300">{p.id}</td>
                          <td className="py-3 px-4">
                            <p className="font-medium text-zinc-200">{p.name}</p>
                            <p className="text-[11px] text-zinc-500">{p.road}</p>
                          </td>
                          <td className="py-3 px-4 text-zinc-400">{p.type}</td>
                          <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                            {p.circuit} · <span className="text-zinc-500">{p.protocol}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                                p.status === 'online'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                                : p.status === 'dimmed'
                                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                                : p.status === 'warning'
                                ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                              }`}
                            >
                              <span className="w-1 h-1 rounded-full bg-current" />
                              {p.status === 'online' ? '正常' : p.status === 'dimmed' ? '节能' : p.status === 'warning' ? '预警' : '离线'}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-mono font-medium text-amber-400">{p.dimming}%</td>
                          <td className="py-3 px-4 font-mono text-zinc-200">{p.power} W</td>
                          <td className="py-3 px-4 font-mono text-zinc-400 text-[11px]">
                            {p.voltage}V · <span className={p.temperature > 40 ? 'text-rose-400' : ''}>{p.temperature}°C</span>
                          </td>
                          <td className="py-3 px-4 text-center">
                            <button
                              onClick={() => {
                                setSelectedPole(p);
                                setActiveTab('monitor');
                                showToast(`已在极夜地图中高亮: ${p.id}`);
                              }}
                              className="px-2 py-1 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-[11px] transition-colors"
                            >
                              定位
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 4: 光网时序调控 (Lighting Schedules & Loop Control) */}
          {/* ========================================================= */}
          {activeTab === 'lighting' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="p-6 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-zinc-100">全网全局调光下发</h3>
                    <p className="text-xs text-zinc-500">统一向所有活跃配电箱及 NB-IoT 单灯控制器下发 PWM 调光指令</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-mono font-bold text-amber-400">{globalDimming}%</span>
                    <button
                      onClick={() => {
                        setPoles((prev) => prev.map((p) => ({ ...p, dimming: globalDimming, power: Number(((globalDimming / 100) * 140).toFixed(1)) })));
                        showToast(`已成功广播下发全局亮度: ${globalDimming}%`);
                      }}
                      className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold text-xs transition-colors shadow-lg shadow-amber-500/20"
                    >
                      立即广播下发
                    </button>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={globalDimming}
                  onChange={(e) => setGlobalDimming(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs font-mono text-zinc-500">
                  <span>0% 全关</span>
                  <span>30% 深夜节能微光</span>
                  <span>75% 推荐标定值</span>
                  <span>100% 满功率防汛迎宾</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <h4 className="text-sm font-semibold text-zinc-100">天文钟经纬度光感联动</h4>
                    </div>
                    <button
                      onClick={() => {
                        setIsAstroActive(!isAstroActive);
                        showToast(isAstroActive ? '已暂停天文钟自动计算' : '已启动高精度经纬度日出日落自适应调控');
                      }}
                      className={`w-10 h-5 rounded-full p-0.5 transition-colors ${isAstroActive ? 'bg-amber-400' : 'bg-zinc-800'}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-zinc-950 transition-transform ${isAstroActive ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    基于北纬 24.48°、东经 118.08° 实时太阳高度角计算。今日推算日落开灯时刻为 <span className="font-mono text-amber-300">18:24:10</span>，日出关灯时刻为 <span className="font-mono text-amber-300">06:12:35</span>。
                  </p>
                  <div className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-850 flex items-center justify-between text-xs font-mono">
                    <span className="text-zinc-500">外部照度传感器遥测:</span>
                    <span className="text-amber-300 font-semibold">142.5 Lux (白昼正常)</span>
                  </div>
                </div>

                <div className="p-5 rounded-xl bg-zinc-950/80 border border-zinc-800/80 space-y-3">
                  <h4 className="text-sm font-semibold text-zinc-100">独立回路接触器状态</h4>
                  {[
                    { name: '回路 A (环岛路机动车道)', poles: '2,140 杆', status: '合闸供电', active: true },
                    { name: '回路 B (非机动车与辅道)', poles: '1,860 杆', status: '合闸供电', active: true },
                    { name: '回路 C (沿海景观与洗墙氛围)', poles: '1,420 杆', status: '微光调控', active: true },
                  ].map((c, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-lg bg-zinc-900/40 border border-zinc-850 text-xs">
                      <div>
                        <p className="font-medium text-zinc-200">{c.name}</p>
                        <p className="text-[11px] font-mono text-zinc-500">{c.poles}</p>
                      </div>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <span className="w-1 h-1 rounded-full bg-emerald-400" />
                        {c.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* TAB 5: 告警与运维工单 (Incidents) */}
          {/* ========================================================= */}
          {activeTab === 'incidents' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="p-4 rounded-xl bg-zinc-950/80 border border-zinc-800/80 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-zinc-100">实时告警事件与工单中枢</h3>
                  <p className="text-xs text-zinc-500">毫秒级遥测异常捕获与派单流转</p>
                </div>
                <span className="text-xs font-mono text-zinc-400">当前活跃: 2 起</span>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: 'ALM-2026-0842',
                    level: '紧急',
                    levelColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
                    title: 'PL-XM-0104 驱动电源过温告警 (48.9°C)',
                    location: '环岛南路示范段 04# 智慧杆',
                    time: '15:28:12 (3分钟前)',
                    status: '处理中',
                  },
                  {
                    id: 'ALM-2026-0839',
                    level: '主要',
                    levelColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
                    title: 'PL-XM-0107 NB-IoT 无线载波信号丢失超过 25 分钟',
                    location: '演武路匝道 02# 枢纽高杆灯',
                    time: '15:05:00 (25分钟前)',
                    status: '待派单',
                  },
                ].map((alm) => (
                  <div key={alm.id} className="p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-zinc-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono border ${alm.levelColor}`}>{alm.level}</span>
                        <span className="font-mono text-xs text-zinc-400">{alm.id}</span>
                        <span className="text-xs text-zinc-500 font-mono">· {alm.time}</span>
                      </div>
                      <h4 className="text-sm font-medium text-zinc-100">{alm.title}</h4>
                      <p className="text-xs text-zinc-500">{alm.location}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => showToast(`已通过企微派发工单给片区工程师 (陈工)`)}
                        className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-200 transition-colors"
                      >
                        派发工单
                      </button>
                      <button
                        onClick={() => showToast(`告警已确认解除并已归档`)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs transition-colors"
                      >
                        确认消除
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        {/* Minimal Footer */}
        <footer className="w-full border-t border-zinc-900/80 py-4 px-6 text-xs text-zinc-600 font-mono flex items-center justify-between mt-auto">
          <span>CityLight OS · Next-Gen Smart City IoT Platform</span>
          <span>Vercel & Cloudflare Aesthetic · 2026</span>
        </footer>
      </div>
    </div>
  );
}
