# 粤港一卡双号用户体验与价值运营驾驶舱

面向“粤港一卡双号”场景的 Vue 3 可视化大屏 Demo。页面基于真实漫游话单的脱敏静态聚合，识别使用体验行为信号、重点客群与运营机会，形成从体验改善到公司价值转化的展示闭环。

> 当前版本不连接生产数据库，只展示真实号码的 `前三位 + **** + 后四位` 脱敏形式，不包含完整号码、IMSI、IP 或位置明细。样本仅覆盖广东侧样本用户访问香港网络；行为标签不代表用户身份、收入或满意度认定。指标来源分层见 [大屏真实数据接入与指标溯源](docs/REAL_DATA_METRIC_PROVENANCE.md)。

## 功能

- 六项核心 KPI 及口径提示；
- 活跃用户、漫游流量、人均流量、重点客群和流量集中度；
- 活跃用户与漫游流量趋势，以及单侧样本覆盖场景；
- 低活跃召回、价值提升、高用量服务和企业场景等可重叠行为候选；
- 高用量重点关怀用户 TOP 10 与脱敏聚合证据抽屉；
- 用户体验改善路径、运营机会池和公司价值转化模块；
- 流量解析、用户映射、时间粒度与对侧样本覆盖边界；
- 可暂停、继续和重启的现场演示导览；
- 静态聚合、DataEase 与安全 API 数据适配边界。

## 本地开发

```bash
npm ci
npm run dev
```

## 检查与构建

```bash
npm run lint
npm run test:unit
npm run build
npm run verify:build
npx playwright install chromium
npm run test:e2e
npm run capture:local
```

`capture:local` 会在被 Git 忽略的 `test-results/visual/` 中生成 1920×1080、1600×900、1366×768 及用户聚合详情抽屉截图，用于视觉验收。

## GitHub Pages

Vite 基础路径固定为 `/LianTongSK-1785306945/`。`.github/workflows/ci-pages.yml` 使用 GitHub 官方 Pages Artifact 流程部署，不创建 `gh-pages` 分支，不使用第三方部署 Action，也不需要将个人 PAT 保存为 Repository Secret。

预期地址：<https://foxmaybeoi1761640545.github.io/LianTongSK-1785306945/>

## 数据适配

UI 只调用统一入口：

```js
dashboardDataAdapter.loadDashboardData(filters)
```

默认实现为 `StaticSampleDataAdapter`。DataEase 未配置时不会发出伪生产请求，会显示真实样本的脱敏静态聚合。正式接入方式见 [DataEase 接入说明](docs/DATAEASE_INTEGRATION.md)，字段与指标口径见 [数据契约](docs/DATA_CONTRACT.md)。

## 安全边界

- GitHub Pages 是完全公开的静态前端；
- 所有 `VITE_*` 变量都可能出现在浏览器构建产物中；
- 禁止在前端保存 GitHub PAT、DataEase APP Secret、数据库密码或服务端 Token；
- 需要动态签发 Token 或访问私有数据库时，必须增加后端或 Serverless 代理；
- 仓库只保存脱敏聚合 JSON 和中间四位掩码号码，不提交原始 Excel、完整号码、IMSI、IP、PDP 地址或位置明细。

## 已知限制

- 当前粤港区域为业务流向示意，不是运营商生产 GIS；
- 用户画像由行为规则驱动，不代表生产 AI 模型、身份、收入或满意度认定；
- 缺少香港用户访问广东的对侧话单，不能进行双边匹配和结算稽核；
- 正式 DataEase 数据源下发后仍需校准字段映射、鉴权方式、刷新频率和运营规则。
