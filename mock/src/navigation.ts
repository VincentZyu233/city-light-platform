import {
  Activity,
  BadgeInfo,
  Building2,
  ChartNoAxesCombined,
  CircleGauge,
  Cpu,
  FolderKanban,
  Gauge,
  MapPinned,
  MonitorPlay,
  Network,
  Radar,
  ShieldAlert,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from 'lucide-react';
import type { NavGroup, NavItem } from '@/types';

export const navigationGroups: NavGroup[] = [
  {
    label: '运营总览',
    items: [
      { id: 'home', label: '首页', path: '/', icon: Gauge },
      { id: 'big-screen', label: '可视化大屏', path: '/big-screen', icon: MonitorPlay },
    ],
  },
  {
    label: '业务中心',
    items: [
      {
        id: 'projects',
        label: '项目管理',
        icon: FolderKanban,
        children: [
          { id: 'project-list', label: '项目列表', path: '/projects/list', icon: FolderKanban },
          { id: 'station-list', label: '场站管理', path: '/projects/stations', icon: MapPinned },
        ],
      },
      {
        id: 'devices',
        label: '设备管理',
        icon: Cpu,
        badge: '5,420',
        children: [
          { id: 'device-types', label: '设备类型', path: '/devices/types', icon: Network },
          { id: 'device-models', label: '设备型号', path: '/devices/models', icon: Cpu },
          { id: 'device-list', label: '设备列表', path: '/devices/list', icon: Radar },
          { id: 'device-deployments', label: '设备部署', path: '/devices/deployments', icon: MapPinned },
        ],
      },
      {
        id: 'monitoring',
        label: '监控与控制',
        icon: Activity,
        children: [
          { id: 'realtime-monitor', label: '实时监控', path: '/monitoring/realtime', icon: CircleGauge },
          { id: 'strategy', label: '策略管理', path: '/monitoring/strategies', icon: SlidersHorizontal },
          { id: 'alerts', label: '告警管理', path: '/monitoring/alerts', icon: ShieldAlert, badge: '2' },
        ],
      },
    ],
  },
  {
    label: '数据与组织',
    items: [
      { id: 'reports', label: '数据统计', path: '/reports', icon: ChartNoAxesCombined },
      {
        id: 'organization',
        label: '组织管理',
        icon: Building2,
        children: [
          { id: 'departments', label: '部门管理', path: '/organization/departments', icon: Building2 },
          { id: 'roles', label: '角色管理', path: '/organization/roles', icon: ShieldCheck },
          { id: 'users', label: '用户管理', path: '/organization/users', icon: Users },
        ],
      },
      { id: 'brand', label: '品牌信息', path: '/brand', icon: BadgeInfo },
    ],
  },
];

export const flatNavItems: NavItem[] = navigationGroups.flatMap((group) =>
  group.items.flatMap((item) => (item.children ? item.children : [item])),
);

export function findNavigationItem(pathname: string): NavItem | undefined {
  return flatNavItems.find((item) => item.path === pathname);
}

export function getBreadcrumbs(pathname: string): string[] {
  for (const group of navigationGroups) {
    for (const item of group.items) {
      if (item.path === pathname) return [group.label, item.label];
      const child = item.children?.find((entry) => entry.path === pathname);
      if (child) return [group.label, item.label, child.label];
    }
  }
  return ['通士达智慧照明 SaaS 平台'];
}
