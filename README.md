# 通士达智慧照明SaaS平台

面向智慧照明与空间感知场景的 SaaS 平台。

## 演示信息

- 账号：`admin`
- 密码：`123456`

## 在线演示

https://vincentzyu233.github.io/topstar-smart-lighting-saas/

## 项目结构

```
topstar-smart-lighting-saas/
├── mock/                  # 纯前端 UI 交互演示工程 (React + Vite + Tailwind + Geist)
│   ├── src/               # 页面视图与业务组件
│   └── dist/              # 静态构建产物
├── temp/                  # 竞品/原型站点逆向脚本与 Mock 提取数据
│   ├── scripts/           # 探查脚本 (01_ ~ 14_)
│   └── mock/              # 逆向捕获的路由、字典、接口数据与界面快照
└── .github/workflows/     # 自动化构建与 GitHub Pages 部署工作流
```

## 本地运行 Mock

```bash
cd mock
bun install
bun run dev --host 127.0.0.1
```

构建静态产物：

```bash
cd mock
bun run build
```

## 生成发布包

默认会构建最新前端，并输出带 commit hash 和时间戳的 ZIP：

```bash
uv run python scripts/package_release.py
```

发布包输出到 `archive/`，该目录不会提交到 Git。复用已有构建时可使用：

```bash
uv run python scripts/package_release.py --skip-build
```

如需更新界面截图，先单独运行：

```bash
uv run --with playwright python mock/scripts/01_capture_theme_screenshots.py
```
