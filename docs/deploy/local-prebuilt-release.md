# 本地 Docker 构建与 prebuilt 发布

## 常用命令

```sh
pnpm release:test
pnpm release:solo --build-only
pnpm release:solo
pnpm release:solo --reuse-artifact
```

`--build-only` 在干净的已提交分支上生成生产格式产物，但不会部署或修改
线上域名。正常发布需要干净 main（包括未跟踪文件），且等于最新 origin/main。
用户的临时工具目录不应删除或提交；有此类文件时使用独立干净 worktree。
Docker 内运行锁定依赖安装、lint、业务测试、发布测试和 `vercel build --prod`。
随后只上传 `.vercel/output`，Vercel 不再执行远程源码构建。

## 前置条件

- 本机 Node >=22、pnpm 9.15.9、已登录的 Vercel CLI、运行中的 Docker。
- 能访问 `sean-lius-projects-484b037e/time-overlay`。项目 ID 和团队 ID 在
  `scripts/lib/release-contract.mjs` 固定；项目 Node 必须为 24.x。
- Docker 下载依赖/Google 字体需要联网；本机代理不要指向容器内的 localhost。
- 构建器为 Node 24 + pnpm 9.15.9 + Vercel CLI 53.2.0，强制 linux/amd64。
  Docker 只是本地构建工具，不作为服务端运行方式，也不会被上传。

缺工具、认证、构建、lint、测试或产物验证失败均终止，不自动登录，不改套餐，
不回退云端构建。构建占用本机资源，在 Apple Silicon 上 x64 仿真可能较慢。

## 环境变量与缓存

每次先读取线上项目配置，再在私有临时源码目录执行
`vercel pull --environment=production`。Next 的环境加载器读取 pulled production
环境，包含构建期 `NEXT_PUBLIC_*` 值；生产函数运行时仍读取 Vercel 项目环境。
脚本不输出变量值，不修改线上变量，结束会删除临时源码和 env 文件。

如构建需要 Vercel 无法拉取的敏感值，可使用 dotenv 格式的仓库外文件：

```sh
mkdir -p "$HOME/.time-overlay-release-secrets"
chmod 700 "$HOME/.time-overlay-release-secrets"
# 用编辑器填写 vercel-build.env；不要把密钥粘进命令参数或聊天。
chmod 600 "$HOME/.time-overlay-release-secrets/vercel-build.env"
TIME_OVERLAY_BUILD_ENV_FILE="$HOME/.time-overlay-release-secrets/vercel-build.env" pnpm release:solo
```

补充值覆盖 pulled 同名值，使用 Next dotenv 解析，不把 env 当 shell 执行。
该文件可选，不能位于仓库内、不能是符号链接，必须只允许当前用户访问。
运行时支付密钥不需要为了编译而复制到本地补充文件；本流程不会创建支付请求。

缓存默认在 `~/.time-overlay-release-cache`；可用 `TIME_OVERLAY_RELEASE_CACHE`
指定另一个仓库外私有目录。构建记录保存源码 SHA/树、环境/工具/项目指纹、
产物内容哈希、文件数/大小和耗时，不保存环境变量明文。源码或任一构建输入
变动均需要重建；缓存匹配但内容被改动时直接失败。环境指纹解析 dotenv 后
按变量排序，忽略注释和 Vercel 每次 pull 生成的临时 `VERCEL_OIDC_TOKEN`，
保留所有应用配置/密钥变更。复用时仍安装 Linux 依赖
并运行检查，因为 Vercel builds.json 可能引用 node_modules。

## 首次切换

1. 提交、推送并合并本次发布工具配置到 main。仓库的
   `git.deploymentEnabled=false` 覆盖所有分支，合并不再等于上线。
2. 检查 Vercel 部署列表，确认此次及后续 Git 更新没有创建远程源码构建。
   若看到旧提交的已排队构建，需要单独核查，不能把配置当成历史部署取消。
3. 在干净、同步的 main 执行 `pnpm release:solo --build-only`。
4. 正式发布时执行 `pnpm release:solo --reuse-artifact`。
5. 发布脚本核对实际 READY deployment 的构建模式/SHA、production target、
   apex 和 www 别名：首页、指南、中文页、sitemap、robots 返回 200，www 根路径
   返回到 apex 的 308。失败不会自动第二次发布，也不会悄悄修改错项目的别名。
6. 检查该 deployment 日志出现 `Using prebuilt build artifacts from .vercel/output`，
   且没有依赖安装或 Next 源码编译。控制台展示部署耗时不代表发生源码构建。

生产部署有明确的 releaseBuildMode/releaseGitSha/releaseGitTree 元数据。
运行记录位于缓存目录的 `releases/`，包括 deployment ID、URL 和 verified 状态。
验证失败时保留可追溯记录；脚本会报告已生成的 deployment，避免误以为发布未发生。

## 回滚

从 `releases/` 找到上一条已验证记录，确认 deployment 属于本项目：

```sh
vercel inspect <previous-deployment-url> --scope sean-lius-projects-484b037e
vercel promote <previous-deployment-url> --scope sean-lius-projects-484b037e
```

重新验证 production target、timeoverlay.co/www.timeoverlay.co 和公开页面。
该方法复用既有产物，不重新构建。不要点 Dashboard Redeploy，不要跑普通
`vercel --prod` 或上传源码回滚；如旧 deployment 不可用，应从旧提交走相同
本地 prebuilt 路径并明确安排 main/远端同步。

## 费用边界与验证记录

省掉的是 Vercel 的远程源码构建用量。带宽、函数 CPU/内存、请求、第三方服务
以及本机资源仍有各自成本；需要账单数据才能量化实际节省。

本次交付验证：发布契约测试和真实 linux/amd64 Docker build-only；不执行
生产部署。停止 Git 自动部署和首个正式发布的线上证明，应在首次切换时记录。

Spec：`docs/superpowers/specs/2026-10-13-local-prebuilt-release.md`。
