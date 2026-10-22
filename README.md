# CityLight Platform

智慧照明与空间感知物联网平台。

## 项目结构

```
city-light-platform/
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
bun run dev
```

构建静态产物：

```bash
cd mock
bun run build
```
