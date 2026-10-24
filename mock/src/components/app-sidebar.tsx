import { useEffect, useState } from 'react';
import { ChevronDown, ChevronsUpDown, LogOut, MapPin, ShieldCheck } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import topstarLogo from '@/assets/topstar-logo.svg';
import topstarLogoDark from '@/assets/topstar-logo-dark.svg';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { navigationGroups } from '@/navigation';
import type { AuthSession, NavItem } from '@/types';
import { cn } from '@/lib/utils';

function isItemActive(pathname: string, item: NavItem) {
  if (item.path) return pathname === item.path;
  return item.children?.some((child) => pathname === child.path) ?? false;
}

export function AppSidebar({ session, onLogout }: { session: AuthSession; onLogout: () => void }) {
  const { pathname } = useLocation();
  const { isMobile, setOpenMobile } = useSidebar();
  const activeParent = navigationGroups
    .flatMap((group) => group.items)
    .find((item) => item.children?.some((child) => child.path === pathname))?.id;
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    return activeParent ? { [activeParent]: true } : {};
  });

  useEffect(() => {
    if (activeParent) {
      setOpenGroups((prev) => ({ ...prev, [activeParent]: true }));
    }
  }, [activeParent]);

  const toggleGroup = (id: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleNavigate = () => {
    if (isMobile) setOpenMobile(false);
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader className="border-b border-sidebar-border/80 px-3 py-3">
        <div className="flex h-11 items-center gap-3 overflow-hidden rounded-xl px-2">
          <div className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-brand-500/25 bg-white/90 p-1 shadow-sm shadow-brand-500/10 dark:bg-white/95">
            <img src={topstarLogo} alt="通士达" className="size-full object-contain dark:hidden" />
            <img src={topstarLogoDark} alt="通士达" className="hidden size-full object-contain dark:block" />
          </div>
          <div className="min-w-0 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-sm font-semibold tracking-tight text-sidebar-foreground">通士达智慧照明</p>
            <p className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.17em] text-sidebar-foreground/55">Smart Lighting SaaS</p>
          </div>
        </div>

        <button className="mt-2 flex w-full items-center justify-between rounded-xl border border-sidebar-border bg-white/55 px-3 py-2.5 text-left shadow-xs transition-colors hover:bg-sidebar-accent/70 dark:bg-sidebar-accent/35 group-data-[collapsible=icon]:hidden">
          <span className="flex min-w-0 items-center gap-2.5">
            <MapPin className="size-4 shrink-0 text-brand-600 dark:text-brand-300" />
            <span className="min-w-0">
              <span className="block text-[9px] font-medium uppercase tracking-wider text-sidebar-foreground/45">当前工作区</span>
              <span className="mt-0.5 block truncate text-xs font-medium text-sidebar-foreground">厦门智慧照明</span>
            </span>
          </span>
          <ChevronsUpDown className="size-3.5 text-sidebar-foreground/45" />
        </button>
      </SidebarHeader>

      <SidebarContent className="px-1 py-2">
        {navigationGroups.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel className="px-3 font-mono text-[9px] uppercase tracking-[0.18em] text-sidebar-foreground/45">
              {group.label}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = isItemActive(pathname, item);
                  if (!item.children) {
                    return (
                      <SidebarMenuItem key={item.id}>
                        <SidebarMenuButton
                          asChild
                          isActive={active}
                          tooltip={item.label}
                          className={cn(
                            'h-9 rounded-lg px-2.5 text-xs font-medium text-sidebar-foreground/72 hover:bg-sidebar-accent/75 hover:text-sidebar-accent-foreground',
                            active && 'bg-brand-600 text-white font-medium shadow-sm hover:bg-brand-600 hover:text-white dark:bg-brand-500',
                          )}
                        >
                          <Link to={item.path!} onClick={handleNavigate}>
                            <Icon className="size-4" />
                            <span>{item.label}</span>
                          </Link>
                        </SidebarMenuButton>
                        {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                      </SidebarMenuItem>
                    );
                  }

                  const expanded = !!openGroups[item.id];
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={active}
                        onClick={() => toggleGroup(item.id)}
                        className={cn(
                          'h-9 rounded-lg px-2.5 text-xs font-medium text-sidebar-foreground/72 hover:bg-sidebar-accent/75 hover:text-sidebar-accent-foreground',
                          active && 'bg-sidebar-accent text-sidebar-accent-foreground font-medium',
                        )}
                      >
                        <Icon className="size-4" />
                        <span>{item.label}</span>
                        <ChevronDown className={cn('ml-auto size-3.5 transition-transform duration-200 group-data-[collapsible=icon]:hidden', expanded && 'rotate-180')} />
                      </SidebarMenuButton>
                      {item.badge && <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>}
                      <div
                        className={cn(
                          'grid transition-all duration-200 ease-in-out group-data-[collapsible=icon]:hidden',
                          expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none',
                        )}
                      >
                        <div className="overflow-hidden">
                          <SidebarMenuSub className="ml-5 gap-0.5 border-sidebar-border/70 py-0.5">
                            {item.children.map((child) => {
                              const ChildIcon = child.icon;
                              const childActive = pathname === child.path;
                              return (
                                <SidebarMenuSubItem key={child.id}>
                                  <SidebarMenuSubButton
                                    asChild
                                    isActive={childActive}
                                    className={cn(
                                      'h-8 rounded-md text-[11px] text-sidebar-foreground/65',
                                      childActive && 'bg-brand-500/12 font-medium text-brand-700 dark:bg-brand-400/12 dark:text-brand-200',
                                    )}
                                  >
                                    <Link to={child.path!} onClick={handleNavigate}>
                                      <ChildIcon className="size-3.5" />
                                      <span>{child.label}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                  {child.badge && <Badge className="absolute right-1 top-1 h-4 min-w-4 rounded-full bg-rose-500 px-1 text-[9px] text-white">{child.badge}</Badge>}
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        </div>
                      </div>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border/80 p-2">
        <div className="flex items-center justify-between rounded-xl border border-sidebar-border/80 bg-sidebar-accent/45 px-3 py-2 text-[10px] text-sidebar-foreground/60 group-data-[collapsible=icon]:hidden">
          <span className="flex items-center gap-1.5"><span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />全网运行正常</span>
          <span className="font-mono">99.8%</span>
        </div>
        <SidebarSeparator />
        <div className="flex items-center gap-2 rounded-xl px-2 py-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-brand-500/12 text-xs font-semibold text-brand-700 ring-1 ring-brand-500/20 dark:text-brand-200">
            {session.username.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
            <p className="truncate text-xs font-medium text-sidebar-foreground">{session.username}</p>
            <p className="mt-0.5 flex items-center gap-1 text-[9px] text-sidebar-foreground/45"><ShieldCheck className="size-2.5" />系统管理员</p>
          </div>
          <Button size="icon-xs" variant="ghost" onClick={onLogout} title="退出登录" className="text-sidebar-foreground/45 hover:text-rose-500 group-data-[collapsible=icon]:hidden">
            <LogOut className="size-3.5" />
          </Button>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
