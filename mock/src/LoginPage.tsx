import { useState, type FormEvent } from 'react';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Laptop,
  LoaderCircle,
  LockKeyhole,
  Moon,
  ShieldCheck,
  Sun,
  UserRound,
} from 'lucide-react';

type ThemeMode = 'system' | 'dark' | 'light';

interface LoginPageProps {
  themeMode: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onLogin: (username: string, remember: boolean) => void;
}

const DEMO_USERNAME = 'admin';
const DEMO_PASSWORD = '123456';

const THEME_OPTIONS: Array<{ id: ThemeMode; label: string; icon: typeof Laptop }> = [
  { id: 'system', label: '跟随系统', icon: Laptop },
  { id: 'light', label: '白天模式', icon: Sun },
  { id: 'dark', label: '黑夜模式', icon: Moon },
];

export default function LoginPage({ themeMode, onThemeChange, onLogin }: LoginPageProps) {
  const [username, setUsername] = useState(() => localStorage.getItem('citylight_remembered_user') || DEMO_USERNAME);
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDemoCredentials = () => {
    setUsername(DEMO_USERNAME);
    setPassword(DEMO_PASSWORD);
    setError(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const normalizedUsername = username.trim();
    if (!normalizedUsername || !password) {
      setError('请输入账号和密码');
      return;
    }

    setIsLoading(true);

    window.setTimeout(() => {
      if (normalizedUsername === DEMO_USERNAME && password === DEMO_PASSWORD) {
        if (remember) {
          localStorage.setItem('citylight_remembered_user', normalizedUsername);
        } else {
          localStorage.removeItem('citylight_remembered_user');
        }
        setIsLoading(false);
        onLogin(normalizedUsername, remember);
        return;
      }

      setError('账号或密码不正确，请使用页面下方展示的演示账号。');
      setIsLoading(false);
    }, 600);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-zinc-50 text-zinc-900 selection:bg-brand-500/20 selection:text-brand-600 transition-colors duration-200 dark:bg-zinc-950 dark:text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(59,130,246,0.22),transparent_32%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_50%_105%,rgba(37,99,235,0.18),transparent_38%)] dark:bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,0.28),transparent_34%),radial-gradient(circle_at_85%_20%,rgba(14,165,233,0.16),transparent_30%),radial-gradient(circle_at_50%_110%,rgba(29,78,216,0.22),transparent_42%)]"
      />
      <div aria-hidden="true" className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-80" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-24 top-1/4 h-72 w-72 rounded-full border border-brand-500/15 bg-brand-500/5 blur-[1px]" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full border border-cyan-500/15 bg-cyan-500/5" />
      <div aria-hidden="true" className="pointer-events-none absolute bottom-0 left-1/2 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

      <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 sm:px-8">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-brand-500/30 bg-brand-500/10 text-brand-600 shadow-sm shadow-brand-500/10 dark:text-brand-400">
            <Activity className="h-[18px] w-[18px]" />
          </div>
          <div className="leading-none">
            <p className="text-sm font-semibold tracking-tight">CityLight OS</p>
            <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">Smart City Control</p>
          </div>
        </div>

        <div className="flex items-center rounded-lg border border-zinc-200/80 bg-white/70 p-0.5 shadow-sm backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-900/70">
          {THEME_OPTIONS.map((option) => {
            const Icon = option.icon;
            const isActive = themeMode === option.id;
            return (
              <button
                key={option.id}
                type="button"
                title={option.label}
                aria-label={option.label}
                aria-pressed={isActive}
                onClick={() => onThemeChange(option.id)}
                className={`rounded-md p-2 transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25'
                    : 'text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
              </button>
            );
          })}
        </div>
      </header>

      <main className="relative z-10 flex min-h-screen items-center justify-center px-4 py-24 sm:px-6">
        <section className="relative w-full max-w-[430px] overflow-hidden rounded-2xl border border-zinc-200/80 bg-white/90 p-6 shadow-2xl shadow-brand-950/10 backdrop-blur-xl sm:p-8 dark:border-brand-500/15 dark:bg-zinc-900/85 dark:shadow-black/40">
          <div className="absolute inset-x-12 top-0 h-px bg-gradient-to-r from-transparent via-brand-500 to-transparent" />
          <div aria-hidden="true" className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl" />

          <div className="relative text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-brand-500/25 bg-gradient-to-br from-brand-500/20 to-cyan-500/10 text-brand-600 shadow-lg shadow-brand-500/10 dark:text-brand-400">
              <Activity className="h-6 w-6" />
            </div>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.24em] text-brand-600 dark:text-brand-400">Secure Access Gateway</p>
            <h1 className="mt-2 text-2xl font-semibold tracking-tight">登录 CityLight 控制中枢</h1>
            <p className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">智慧照明与空间感知物联网平台 Mock 演示环境</p>
          </div>

          <form className="relative mt-7 space-y-4" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="username" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">账号</label>
              <div className="relative">
                <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  placeholder="请输入账号"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white/80 pl-10 pr-3 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-zinc-700 dark:text-zinc-300">密码</label>
              <div className="relative">
                <LockKeyhole className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="请输入密码"
                  className="h-11 w-full rounded-xl border border-zinc-200 bg-white/80 pl-10 pr-11 text-sm text-zinc-900 outline-none transition-all placeholder:text-zinc-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 dark:border-zinc-700 dark:bg-zinc-950/60 dark:text-zinc-100 dark:placeholder:text-zinc-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  title={showPassword ? '隐藏密码' : '显示密码'}
                  aria-label={showPassword ? '隐藏密码' : '显示密码'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 text-xs">
              <label className="flex cursor-pointer items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(event) => setRemember(event.target.checked)}
                  className="h-3.5 w-3.5 rounded border-zinc-300 accent-brand-600"
                />
                记住登录状态
              </label>
              <span className="flex items-center gap-1 font-mono text-[10px] text-zinc-400"><ShieldCheck className="h-3 w-3" />Mock Secure</span>
            </div>

            {error && (
              <div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-500/25 bg-rose-500/10 px-3 py-2.5 text-xs leading-relaxed text-rose-600 dark:text-rose-400">
                <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="group flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-brand-500/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-brand-500/30 disabled:cursor-wait disabled:opacity-80 disabled:hover:translate-y-0"
            >
              {isLoading ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  正在验证身份
                </>
              ) : (
                <>
                  登录控制中枢
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>

          <div className="relative mt-5 rounded-xl border border-brand-500/20 bg-brand-500/5 p-3.5 dark:bg-brand-500/10">
            <div className="flex items-start gap-2.5">
              <KeyRound className="mt-0.5 h-4 w-4 shrink-0 text-brand-600 dark:text-brand-400" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-zinc-800 dark:text-zinc-200">演示账号</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11px] text-zinc-600 dark:text-zinc-400">
                  <span>账号 <strong className="text-brand-700 dark:text-brand-300">admin</strong></span>
                  <span>密码 <strong className="text-brand-700 dark:text-brand-300">123456</strong></span>
                </div>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="shrink-0 rounded-lg border border-brand-500/25 bg-white/70 px-2.5 py-1.5 text-[10px] font-medium text-brand-700 transition-colors hover:bg-brand-50 dark:bg-zinc-900/70 dark:text-brand-300 dark:hover:bg-brand-950/60"
              >
                一键填入
              </button>
            </div>
            <p className="mt-2.5 flex items-center gap-1.5 text-[10px] text-zinc-500 dark:text-zinc-400">
              <CheckCircle2 className="h-3 w-3 text-emerald-500" />
              登录校验为前端 Mock，不会连接真实鉴权服务
            </p>
          </div>
        </section>
      </main>

      <footer className="absolute inset-x-0 bottom-4 z-10 hidden items-center justify-between px-8 font-mono text-[10px] text-zinc-400 sm:flex dark:text-zinc-600">
        <span>CityLight OS · Next-Gen Smart City IoT Platform</span>
        <span>Mock Environment · 2026</span>
      </footer>
    </div>
  );
}
