import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '@/components/app-sidebar';
import { TopHeader } from '@/components/top-header';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { AuthSession, ThemeMode } from '@/types';

export function AppShell({
  session,
  theme,
  onThemeChange,
  onLogout,
}: {
  session: AuthSession;
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  onLogout: () => void;
}) {
  return (
    <SidebarProvider
      defaultOpen
      style={
        {
          '--sidebar-width': '17.5rem',
          '--sidebar-width-icon': '4.75rem',
        } as CSSProperties
      }
      className="min-h-screen bg-transparent"
    >
      <AppSidebar session={session} onLogout={onLogout} />
      <SidebarInset className="min-w-0 bg-transparent">
        <TopHeader theme={theme} onThemeChange={onThemeChange} />
        <main className="mx-auto w-full max-w-[1600px] flex-1 space-y-6 p-4 md:p-6">
          <Outlet />
        </main>
        <footer className="flex flex-wrap items-center justify-between gap-2 border-t border-border/60 px-5 py-4 font-mono text-[10px] text-muted-foreground">
          <span>通士达智慧照明 SaaS 平台 · Smart Lighting IoT Platform</span>
          <span>Mock Environment · 2026</span>
        </footer>
      </SidebarInset>
    </SidebarProvider>
  );
}
