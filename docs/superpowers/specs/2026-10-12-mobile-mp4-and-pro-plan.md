# 手机 MP4 导出修复 + Pro 一次性买断 · 总规格

日期：2026-10-12　状态：已拍板，待执行
三份执行任务书（A、B、C）都以本文为准。本文的接口、数值、文件归属是硬性规定；标「建议」的部分执行者可以换更好的做法，但要在 `PROGRESS.md` 写明原因。

---

## 1. 为什么做

数据来自 PostHog 项目 457066，统计窗口为截至 2026-10-12 的近 60 天：

- 734 人成功导出。手机上被导出拦截（`mobileExportLimitError`）的有 **393 人**，其中只有 94 人后来改参数导出成功；在限制内的手机导出，成功率 92%。
- 拦截是我们自己在 `src/lib/generator/feature-detection.ts` 里设的保护：手机上时长 >60s、分辨率 >1080p、总像素帧数 >1.9e9 都会被拦。原因是 PNG 序列要把整个 zip 攒在内存里，手机扛不住。而且手机剪辑软件（CapCut 等）根本用不了 PNG 序列。
- 有 143 人（占导出用户 19%）导出的时长正好是 300 秒，也就是现在的上限，说明有人需要更长的时长。
- 8 月卖过一次「Creator Pack 模板包 $2.99」：29 个真实用户看到入口，0 人点购买，结论是光卖模板卖不动。所以这次卖的是「上限不够用」，模板只当附赠。

**目标**：①手机用户能导出 CapCut 能直接用的视频；②在不拿走任何现有免费功能的前提下，上线 $9 一次性买断的 Pro。

## 2. 拍板结论

| 项 | 结论 |
|---|---|
| 手机修复方式 | 新增 `mp4` 格式：H.264 编码，纯色背景（默认是抠像用的绿色 `#00FF00`），在浏览器 Worker 里用已有依赖 `mediabunny` 编码，不用服务器 |
| Pro 价格 | $9 美元，一次性买断，不是订阅 |
| Pro 包含 | ① 时长上限从 300s 提到 3600s；② 60fps；③ 新增的 12 个 signature 模板（`SIGNATURE_TEMPLATE_IDS`）可以导出 |
| 免费保持不变 | ≤300s、24/30fps、原有 48 个模板（`LEGACY_FREE_TEMPLATE_IDS`）、所有现有格式、4K、提示音、高画质 |
| 不做 | 水印、页面一打开就弹付费、订阅、服务端渲染、邮件收集服务 |
| 支付 | Stripe Checkout 托管页面，mode=payment；验证靠查询 checkout session，不做 webhook |
| 解锁凭证 | 服务端签发 HMAC token，存在 localStorage；接受「懂技术的人能绕过」这个风险 |
| 找回购买 | 输入购买时用的邮箱就能找回（$9 的价位接受被冒用的风险） |

## 3. 执行编排

```
A 手机 MP4 导出 + 拦截埋点补参数 ─┐（并行）
B Pro 购买后端（只新建文件）    ─┤
                                  └─> 两者合并后 ─> C Pro 前端接入 + 付费埋点
```

### 3.1 文件归属（越界改动＝不合格）

| 路径 | A | B | C |
|---|---|---|---|
| `src/workers/generator-export.worker.ts` | ✅ | ❌ | ❌ |
| `src/lib/generator/encode/**`、`src/lib/generator/export/**` | ✅ | ❌ | 只读 |
| `src/lib/generator/feature-detection.ts` | ✅ | ❌ | ✅（A 合并后） |
| `src/lib/generator/types.ts`、`defaults.ts` | ✅ | ❌ | ✅（A 合并后） |
| `src/lib/generator/templates.ts` | ❌ | ❌ | ✅ |
| `src/components/generator/**` | ✅ | ❌ | ✅（A 合并后） |
| `src/content/root/**`（生成器 UI 文案） | ✅ | ❌ | ✅（A 合并后） |
| `src/lib/analytics/events.ts` | ❌ | ✅ | ✅（B 合并后） |
| `src/lib/analytics/environment.ts` | ✅ | ❌ | ❌ |
| `src/app/api/pro/**`、`src/lib/pro/**`、`src/app/(default)/pro/**` | ❌ | ✅ | 只读 |
| `src/content/info-pages.ts`（条款/隐私页） | ❌ | ✅ | ❌ |
| `package.json` / `pnpm-lock.yaml` | ❌ | ✅（只加 `stripe@23.0.0`） | ❌ |
| `tests/**` | 只加或改自己负责的那部分 | 同左 | 同左 |

A 和 B 改的文件完全不重叠，所以可以同时跑。C 必须等 A、B 都合并进 main 之后，再从最新的 main 开分支。

### 3.2 统一命令（基线实测于 2026-10-12）

- `pnpm test -- --run` → 33 个测试文件，143 条，全部通过
- `pnpm lint` → 退出码 0
- `npx tsc --noEmit -p .` → 退出码 0
- `pnpm build` → 退出码 0（会联网拉 Google 字体，偶尔失败，失败先重跑一次）
- Node 22（`.nvmrc`），包管理器 pnpm 9

## 4. A：手机 MP4 导出

### 4.1 行为规格

1. `GeneratorFormat` 新增 `"mp4"`，同时加进 `GENERATOR_SUPPORTED_FORMATS`。
2. 新文件 `src/lib/generator/encode/mp4-encoder.ts`：用 `mediabunny` 的 `Output` + `Mp4OutputFormat` + `BufferTarget` + `CanvasSource`，视频编码 `avc`（H.264）。码率：standard 画质 4Mbps，high 画质 8Mbps。关键帧间隔 2 秒。
   - 音频：`canEncodeAudio('aac')` 为真时用 AAC 混入提示音，否则输出无声视频，不能报错。
   - 背景：画布的 `backgroundMode === "transparent"` 时，每帧先用 `#00FF00` 填满再画；`solid` 时用用户自己选的 `backgroundColor`。
3. Worker 处理 mp4 请求，进度、取消、错误码与现有视频导出保持一致。新错误码命名为 `mp4FailedUnexpectedly`。
4. 能力检测：`LocalExportSupport` 新增 `supportsMp4`，检测方式为 `canEncodeVideo('avc', { width: 1280, height: 720 })`，异步探测（参照 `probeAlphaExportSupport`）。为 false 时禁用 mp4。
5. 手机端限制（`getExportAdvisory`）：
   - **mp4**：时长 ≤300s、分辨率 ≤1920×1080、总帧数 ≤9000，满足就放行。
   - **png-sequence / webm**：现有规则**一字不改**，不许放宽。
6. 默认格式：在手机上、`supportsMp4 === true`、用户还没手动选过格式时，自动切到 mp4。桌面端默认格式不变（png-sequence）。
7. 导出面板新增 MP4 按钮，提示文案（英文基准）：`MP4 with a solid green background. Works in CapCut, InShot and other phone editors — use Chroma Key to remove the green.`
8. 文案字段在 `src/content/root/types.ts` 里设为可选，组件里放英文兜底，`en` 和 `zh-hans` 必须写；其余语言可以不写，自动用英文兜底（照搬 `mobileExportLimitError?` 的现有写法）。
9. 下载文件名后缀 `.mp4`，mime 类型 `video/mp4`。

### 4.2 埋点

- `export_unsupported` 补齐和 `export_started` 一样的参数：`format, fps, durationSeconds, resolution, width, height, pixelFrames, quality, audioVariant`，再加上模板和环境字段。建议抽一个函数，两处共用。
- 环境字段新增 `supportsMp4`。
- **A 不许改 `events.ts`**，因为不需要新增事件名。

### 4.3 必须有的测试（测试名就是需求）

- 手机 + mp4 + 300s + 1080p → 没有 error 级提示
- 手机 + mp4 + 301s → `mobileExportLimitError`
- 手机 + png-sequence + 61s → 仍然是 `mobileExportLimitError`（证明没放宽）
- `supportsMp4 === false` 时，mp4 在 `disabledFormats` 里
- 桌面默认格式仍然是 png-sequence
- 手机 + supportsMp4 → 默认格式选 mp4（如果这段逻辑在组件里，就把判断抽成纯函数来测）
- 背景：transparent → 用 `#00FF00` 填充（抽出纯函数测试）

### 4.4 真机验收（执行者做不了，由验收方做）

iPhone Safari 和 Android Chrome 各导出一次 300s / 720p / mp4，导入 CapCut 能播放、能抠绿。iOS 支持 `VideoEncoder` avc + Worker 里的 `OffscreenCanvas`（需要 iOS 16.4+）这一点**是推测，还没验证**。如果不支持，`supportsMp4` 会是 false，手机端行为退回到现在这样，不会变得更糟。

## 5. B：Pro 购买后端

### 5.1 环境变量（缺了不能崩溃）

`STRIPE_SECRET_KEY`、`STRIPE_PRO_PRICE_ID`、`PRO_LICENSE_SECRET`。任何一个缺失时，所有 `/api/pro/*` 接口返回 `503 {"error":"not_configured"}`。密钥不许出现在日志、响应和前端代码里。

### 5.2 接口（Next 16 App Router 的 route handler，写之前先读 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md`）

| 接口 | 入参 | 返回 |
|---|---|---|
| `POST /api/pro/checkout` | `{ trigger: ProTrigger, locale: string, returnPath: string }` | `200 {url}`；参数不对返回 400 |
| `GET /api/pro/verify?session_id=` | | 已付款：`200 {token, email}`；未付款：`402 {error:"unpaid"}`；session 不存在或商品不对：`404` |
| `POST /api/pro/restore` | `{ email }` | `200 {token}` 或 `404 {error:"not_found"}` |
| `POST /api/pro/validate` | `{ token }` | `200 {valid: boolean}` |

- 创建 checkout：`mode: "payment"`，`line_items` 用 `STRIPE_PRO_PRICE_ID`，`customer_creation: "always"`，`allow_promotion_codes: true`，`metadata: { product: "time-overlay-pro", trigger, locale }`。`success_url` = `${origin}/pro/success?session_id={CHECKOUT_SESSION_ID}&return=<编码后的 returnPath>`，`cancel_url` = `${origin}${returnPath}`。
- `returnPath` 必须是以 `/` 开头、而且不是以 `//` 开头的站内路径，否则一律改成 `/`（防止被利用跳转到外站）。
- verify / restore 都要同时校验 `payment_status === "paid"` 和 `metadata.product === "time-overlay-pro"`。restore 用 `checkout.sessions.list({ customer_details: { email }, status: "complete" })` 查询。
- Token 格式：`v1.<base64url(JSON{sid, iat})>.<base64url(HMAC-SHA256(PRO_LICENSE_SECRET, 中间那段))>`。校验时比较签名必须用 `timingSafeEqual`。
- 依赖：只允许新增 `stripe@23.0.0`（2026-10-01 发布，满足「发布满 7 天」的要求），版本号写死。

### 5.3 前端接口（C 只依赖下面这些，签名不许改）

`src/lib/pro/entitlements.ts`：
```ts
export const PRO_PRICE_LABEL = "$9";
export const FREE_MAX_DURATION_SECONDS = 300;
export const PRO_MAX_DURATION_SECONDS = 3600;
export const PRO_PNG_SEQUENCE_MAX_SECONDS = 600;
export type ProTrigger = "duration" | "fps" | "template" | "direct";
```
`src/lib/pro/client.ts`：
```ts
export type ProStatus = "unknown" | "free" | "pro";
export function usePro(): { status: ProStatus };          // useSyncExternalStore + localStorage key "timeoverlay.pro.v1"
export function startProCheckout(trigger: ProTrigger, locale: string, returnPath: string): Promise<"redirected" | "unavailable" | "error">;
export function restorePro(email: string): Promise<"restored" | "not_found" | "unavailable" | "error">;
```
- `usePro`：本地有 token 时显示 `pro`；每 7 天调用一次 `/api/pro/validate`，返回无效就清掉 token。服务端渲染和首屏阶段返回 `unknown`。

### 5.4 成功页 `/pro/success`

放在 `src/app/(default)/pro/success/`。行为：调用 verify → 存 token → 上报 `pro_purchase_verified` → 显示「Pro 已解锁」，并提供一个按钮跳回 `return`（同样做站内路径校验）。设置 `robots: noindex`，不进 sitemap。文案先只写英文。

### 5.5 埋点（B 往 `events.ts` 里加的事件名）

`pro_checkout_redirected`、`pro_purchase_verified`、`pro_purchase_verify_failed`、`pro_restore_succeeded`、`pro_restore_failed`。参数里带 `trigger`（verify 时从 session metadata 取）。

### 5.6 条款和隐私（`src/content/info-pages.ts`）

- 条款页加一节：Pro 是一次性付款、在当前设备的浏览器里解锁、可以凭邮箱找回、14 天内无理由退款，联系邮箱沿用站内现有配置。
- 隐私页加一节：付款由 Stripe 处理，本站不存储银行卡信息。
- 写 `en` 和 `zh-hans` 两个语言版本。

### 5.7 测试

用 mock 替换 Stripe SDK（只 mock Stripe 这个外部服务边界，自己写的逻辑不许 mock）。至少覆盖：缺环境变量返回 503；未付款返回 402；商品对不上返回 404；`returnPath` 传 `//evil.com` 会被改成 `/`；token 被篡改一个字符就校验失败；restore 查不到返回 404。

## 6. C：Pro 前端接入

### 6.1 拦截规则

| 场景 | 免费用户 | Pro 用户 |
|---|---|---|
| 时长输入超过 300 | 回落到 300 ＋ 输入框下方出现付费提示 ＋ `duration_limit_hit {requestedSeconds}` | 上限 3600 |
| PNG 序列超过 600s | — | 显示错误提示，建议改用 MP4/WebM（新错误码 `pngSequenceTooLongError`） |
| 点 60fps | 弹付费弹窗，fps 不改 | 可以选 |
| 手机 + 60fps | — | 沿用 A 的总帧数 ≤9000 限制，相当于 ≤150s |
| 12 个新 signature 模板 | 可以选、可以预览，带「Pro」标记；点导出时弹付费弹窗，不开始导出 | 可以导出 |
| 原有 48 个模板、所有格式、4K | 行为与现在完全一致 | 同左 |

- `normalizeGeneratorSettings` 的时长回落上限要能根据用户是否 Pro 取值，免费用户的结果必须和现在完全一样。

### 6.2 付费弹窗

- 标题加三条好处：最长 60 分钟、60fps、12 个 Pro 模板。
- 价格写「$9 一次性付款，不是订阅」。
- 按钮「解锁 Pro」→ 调 `startProCheckout`；返回 `unavailable` 时提示「支付暂时不可用」。
- 「已经买过？找回购买」→ 输入邮箱 → 调 `restorePro`。
- 规则：不在页面加载时弹出；同一个会话里，付费提示的曝光事件只上报一次；用户关掉弹窗后不再自动弹。
- Pro 用户在导出面板显示「Pro 已启用」。

### 6.3 埋点（C 往 `events.ts` 里加的事件名）

`duration_limit_hit`、`pro_upsell_viewed {trigger}`、`pro_checkout_clicked {trigger}`、`pro_restore_clicked`、`pro_feature_used {feature: "duration"|"fps60"|"template", value}`。`pro_feature_used` 在 Pro 用户 `export_started` 时上报。另外 `export_started` 新增参数 `isPro`。

### 6.4 文案

规则同 4.1 第 8 条：`en` 和 `zh-hans` 必须写，其余语言用英文兜底。

### 6.5 必须有的测试

- 免费用户设 301 → 回落到 300
- Pro 用户设 3600 → 允许；设 3601 → 回落到 3600
- 原有 48 个模板在免费状态下都能导出（不弹付费）
- 12 个 signature 模板在免费状态下导出会被拦
- 免费用户选不了 60fps
- Pro + PNG + 601s → `pngSequenceTooLongError`
- 以上新增的事件名都在 `AnalyticsEventName` 里

## 7. 上线配置（任务 D，执行 AI 做，可与 A、B 同时跑）

现状（2026-10-12 用 `vercel env ls` 实测）：Vercel 项目 `sean-lius-projects-484b037e/time-overlay` 的 Production 和 Preview 环境里**已经有 `STRIPE_SECRET_KEY`**，是 8 月 Creator Pack 那次留下的，直接复用，不要改。同一批留下的还有 `STRIPE_CREATOR_PACK_PRICE_ID`、`STRIPE_WEBHOOK_SECRET`、`COMMERCE_*`、`SUPABASE_*`，**一律不删**，只在 `BLOCKED.md` 里列为待清理候选。

1. Stripe（Pocket Tools Inc. 账户 `acct_1TNWqFPuE0QRKBbW`，live 模式）：
   - 新建商品「Time Overlay Pro」：`tax_code: txcd_10000000`，`metadata.product = time-overlay-pro`。价格：一次性，900 美分，USD。建之前先搜一下，同名商品已存在就复用，不许重复建。
   - 旧商品 `prod_V0PXNYkWyntmPZ`（Creator Pack $2.99）设为 `active=false`。只能归档，不许删除。
2. Vercel（Production + Preview 两个环境）：
   - 新增 `STRIPE_PRO_PRICE_ID` = 上一步得到的 price id
   - 新增 `PRO_LICENSE_SECRET` = `openssl rand -base64 32` 生成的随机串，两个环境分别生成
3. 任何密钥都不许打印、不许写进仓库。需要确认密钥类型时，只看前 8 个字符（例如 `sk_live_` / `rk_live_`）。
4. 发布流程更新（2026-10-13）：所有分支的 Git 自动部署关闭，**合并 PR 不再等于上线**。验收并合并后，从干净且与 origin/main 同步的 main 执行 `pnpm release:solo`，在本地 Docker 构建，再 prebuilt 上传。操作说明见 `docs/deploy/local-prebuilt-release.md`。

## 7.1 合并和上线顺序

1. 以下 A/B/C 顺序为原任务计划；2026-10-13 起推送仅同步代码，不再触发生产构建，上线统一走 `pnpm release:solo`。
2. A、B 各自 push 分支、开 PR，不自己合并。
3. 验收 AI 按第 9 节验收，通过后合并。顺序是先 B 后 A；合并之后按本地 prebuilt 流程发布。
4. A、B 都合并后，从最新的 origin/main 跑 C。C 验收通过、合并并通过 `pnpm release:solo` 发布之后，Pro 才算真正上线。
5. C 上线后的人工冒烟测试：领导用自己的卡在正式环境买一单 $9，确认解锁，然后在 Stripe 后台退款。这一步 AI 做不了，因为需要真实银行卡。

## 8. 上线后怎么判断成败（跑满 4 周再看）

| 指标 | 现状（近 60 天） | 目标 |
|---|---|---|
| 手机端被拦截的人数 | 393 | 下降 70% 以上 |
| 手机端导出成功的人数 | 150 | 翻倍 |
| 付费提示 → 点「解锁 Pro」的比例 | 无数据 | ≥5% |
| 购买数 | 0 | 4 周 ≥3 单；不到 3 单就停止在 Pro 上继续投入，先试 $5 定价，不撤功能 |

## 9. 验收标准（合并前由独立的验收 AI 执行，不能由执行者自己判）

通用（A、B、C 都适用），在 PR 分支的干净 checkout 上跑：
1. `pnpm install --frozen-lockfile && pnpm test -- --run && pnpm lint && npx tsc --noEmit -p . && pnpm build` 全部退出码为 0；测试条数大于基线，跳过数为 0
2. `git diff origin/main...HEAD --stat` 只涉及该任务的白名单路径（见 3.1）
3. 已有测试文件里，没有任何一条被删除的 `expect`、没有 `.skip` / `.todo` / `.only`
4. 拿 PR 里的「反向验证」做法自己复现一遍：确实能变红，还原后确实全绿

| 任务 | 额外的合并门槛 |
|---|---|
| A | 4.3 的 7 条测试都存在；手机端 png-sequence / webm 的判断条件和 main 上逐字相同；`next start` 起来后，用 Chromium 的手机模拟（iPhone 尺寸 + 手机 UA）打开首页，导出面板里能看到 MP4，导出 30s/720p 能得到大于 0 字节的 `.mp4`，控制台没有未捕获的异常 |
| B | 5.7 的 6 种情况都有测试；全仓库搜不到 `sk_live` / `rk_live` / `sk_test`；`/pro/success` 返回的 HTML 里有 noindex，`/sitemap.xml` 里没有 `/pro`；在没配环境变量时请求 `/api/pro/checkout` 返回 503 |
| C | 6.5 的 7 条测试都存在；免费状态下用 48 个原有模板各导出一次，都不会被拦（可以用测试遍历）；Preview 部署上把时长输入 301 会回落到 300 并出现付费提示，点「解锁 Pro」会跳转到 `checkout.stripe.com` 且页面显示 $9（只看页面，不付款） |
| D | Stripe 中「Time Overlay Pro」商品处于 active，价格 900 USD、一次性；`prod_V0PXNYkWyntmPZ` 已变为 `active=false` 且没被删除；`vercel env ls` 在 Production 和 Preview 都能看到 `STRIPE_PRO_PRICE_ID` 和 `PRO_LICENSE_SECRET`；旧的环境变量一个都没少 |

只要有一项不通过，就不合并：在 PR 里写明是哪一项、贴出原始输出，退回给执行者。
