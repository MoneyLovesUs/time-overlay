# Time Overlay 本地构建发布 spec

日期：2026-10-13。范围：发布工具、Vercel Git 配置及操作文档。

## 已确认的现状

- 最新远端 main 为 `3b9bbc8`，已包含移动端 MP4 和 Pro 支付接口。
- Vercel 项目为 `time-overlay`，项目 ID `prj_IHTU6bhE36lhZcooqWo50dQ3hjGy`，团队 ID `team_nyAa8oJCujnSymAWbsZ0xiDl`，生产 Node 为 24.x。
- 当前 main 更新会触发 Vercel 拉取源码、安装依赖、执行 `pnpm run build`；消耗云端构建用量。
- VideoDance 的最新生产发布实际使用 `local-linux-amd64-prebuilt`；本方案采用相同的 Docker 构建和 `--prebuilt` 上传方式。
- 本项目使用 Next.js 16.2.3，包含动态页面、Proxy 和支付 Route Handlers，不能改成纯静态导出。

## 目标和边界

生产构建在本地 Docker 的 linux/amd64 容器内完成，Vercel 接收 `.vercel/output` 成品并继续托管页面、函数及运行时环境变量。省掉远程源码构建用量；不承诺流量、函数或第三方服务免费。本次完成 spec、实现、验证和 Git 提交，正式生产部署另行执行。

不改动业务页面、付费逻辑、域名、安全头、现有 Vercel 环境变量和用户本地工作产物。Docker 仅作为构建环境，上传的是 Vercel Build Output API 产物，不是 Docker 镜像。

## 发布接口

- `pnpm release:solo`：仅允许 main 干净且等于最新 origin/main，验证后本地构建并发布生产。
- `pnpm release:solo --build-only`：允许在干净分支上验证已提交的代码；只生成并检查本地产物，无部署、域名切换或生产请求。
- `pnpm release:solo --reuse-artifact`：只复用当前 SHA、源码树、构建环境、构建工具和项目设置完全匹配的已验证缓存；产物被改动时失败，不上传。
- `pnpm release:test`：运行发布工具的独立 Node 测试。

## 实施流程

1. 新增 `vercel.json`，设置 `git.deploymentEnabled=false`，禁止所有分支 Git 自动部署。
2. 检查 Node >=22、pnpm 9.15.9、已登录 Vercel CLI 和 Docker；工具或认证不可用则失败，不自动登录、不回退云端构建。
3. 生产模式要求 clean main 并 fetch 核对 origin/main；build-only 不要求 main 或远端同步。所有模式使用精确提交的 `git archive`，不复制可变工作目录。
4. 校验项目和团队 ID、Node 24.x、Next.js preset、根目录；写入固定项目链接后 `vercel pull --environment=production`。环境内容只保存在 mode 700 的临时目录，文件 mode 600，不打印值。
5. Docker 固定 Node 24、pnpm 9.15.9、Vercel CLI 53.2.0，强制 linux/amd64；独立依赖缓存。容器内安装锁定依赖、执行 lint、业务测试和发布测试，再 `vercel build --prod`。
6. 用 Next.js 的环境变量加载器加载 pulled production 环境。可选的仓库外 mode 600 `TIME_OVERLAY_BUILD_ENV_FILE` 补充无法拉取的构建值；不要求复制运行时 Stripe 密钥，缺失构建必需值应正常失败。环境文件不能进入产物。
7. 检查 `.vercel/output/config.json` 版本、静态资源和函数目录；拒绝 env 文件、macOS 原生文件及逃逸符号链接。记录 SHA、源码树、环境/工具/项目指纹、产物内容哈希及构建耗时。环境按 dotenv 变量规范化，排除注释和每次 pull 轮换的临时 `VERCEL_OIDC_TOKEN`，保留所有应用配置/密钥变更；工具指纹包含实际 Docker image ID。缓存和记录存放仓库外、仅当前用户可读写。
8. build-only 在此结束。生产执行 `vercel deploy --prebuilt --prod`，附构建模式、Git SHA/源码树元数据，绝不上传源码触发远程构建。
9. 读取实际 deployment ID、READY 状态和元数据，核对 production target 和 `timeoverlay.co`、`www.timeoverlay.co` 别名。若未正确切换则明确失败并记录 deployment，避免悄悄改到错误项目。
10. 生产冒烟：首页、指南、中文页面、sitemap、robots，以及 www 到 apex 的 308 重定向；不发支付请求。失败时保留部署 ID和回滚信息，不自动重复部署。临时源码和环境在 finally 清理。

## 首次切换及回滚

提交代码本身不改变现有线上部署。配置进入远端 main 后，Git 更新不应再创建部署；第一次正式上线使用 `pnpm release:solo`。推送后检查部署列表确认停止自动构建，第一次 prebuilt 上线后检查日志出现 `Using prebuilt build artifacts`。

回滚优先用 `vercel promote <已验证旧 deployment>` 恢复完整 production target 和别名；也可在旧提交的干净 main checkout 重走同一 prebuilt 发布。不要使用 Dashboard Redeploy 或普通 `vercel --prod`，这会再次触发源码构建。

## 验收

- 发布测试覆盖未知参数、错项目、dirty/main/同步限制、build-only 不部署、失败不回退、缓存身份或内容不匹配、文件权限、Linux 原生产物和 symlink/env 泄漏。
- 当前锁定依赖在真实 linux/amd64 Docker 内通过 lint、业务测试和 Next/Vercel 构建；实际生成函数和静态资源，并通过产物扫描。
- 新命令及首次切换、环境补充、缓存、失败和回滚步骤均记录在 README/AGENTS/runbook；旧计划“合并 PR＝上线”的表述更新为当前发布入口。
- 本次验证不部署生产；生产日志和停止 Git 自动部署的实测留给首次正式发布。不能把 build-only 成功写成已上线或账单已归零。

## 参考

- VideoDance：`scripts/release-solo.mjs`、`scripts/lib/release-contract.mjs`、`scripts/Dockerfile.vercel-builder`、`docs/deploy/local-prebuilt-release.md`。
- 本地 Next 文档：`node_modules/next/dist/docs/01-app/01-getting-started/17-deploying.md`、`01-app/02-guides/environment-variables.md`。
- [Vercel prebuilt](https://vercel.com/docs/cli/deploying-from-cli#deploying-from-local-build-prebuilt)、[Git 自动部署开关](https://vercel.com/docs/project-configuration/git-configuration#turning-off-all-automatic-deployments)。
