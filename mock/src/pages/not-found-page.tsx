import { ArrowLeft, SearchX } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto flex size-20 items-center justify-center rounded-3xl border border-brand-500/20 bg-brand-500/10 text-brand-600 shadow-xl shadow-brand-500/10 dark:text-brand-300"><SearchX className="size-8" /></div>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.24em] text-brand-600 dark:text-brand-300">404 · Page Not Found</p>
        <h1 className="mt-2 text-2xl font-semibold">页面不存在</h1>
        <p className="mt-2 text-sm text-muted-foreground">你访问的页面可能已移动，或者路由地址输入有误。</p>
        <Button asChild className="mt-5 brand-gradient border-0 text-white"><Link to="/"><ArrowLeft className="size-4" />返回首页</Link></Button>
      </div>
    </div>
  );
}
