# Pro 转化冲刺：执行文档（2026-10-28）

执行者：MacBook 上的 Claude Code（DeepSeek 模型）。审查与合并：主会话 / 仓库所有者。

## 0. 背景与数据依据

GA4 `properties/538700953`，窗口 2026-10-14 → 2026-10-27（Pro 结账 10/13 上线，10/19 加入撞时长上限自动弹 paywall）：

| 指标 | 用户数 |
|---|---|
| 全站用户 | 1,233 |
| 导出下载 `export_download_requested` | 203（16.5%） |
| 撞 300s 上限 `duration_limit_hit` | 337（27%；桌面 214 / 手机 119） |
| 看到 paywall `pro_upsell_viewed` | 147 |
| 报价 `pro_price_quoted` | 129 |
| 点击结账 `pro_checkout_clicked` | 9 |
| Stripe 成功付款 | 2（$18） |
| `export_unsupported` | 21（已不是问题，本冲刺不处理） |

关键发现：自动弹窗把 paywall 曝光从 24 人（10/14–18）提高到 123 人（10/19–27），但结账点击反而从 5 降到 4。主动点开 paywall 的人约 20% 会点结账，被动弹出的只有约 3%。所以本冲刺的重点是：**在用户主动想要的时刻让他看到 Pro**（顶栏、导出完成、`/pro` 页），并且**让 Pro 的付费点落在专业用户真正需要的东西上**（4K 和透明通道视频格式）。

明确不做：A/B 测试、OBS Live Browser Source 新功能、价格调整、`export_unsupported` 修复。Creator Pack 已不在代码中，无需处理（只需在 PR 1 中顺手确认 `grep -ri "creator" src` 无残留）。

## 1. 全局规则（每个 PR 都必须遵守）

1. 仓库：`~/Personal/money-loves-me/time-overlay`。每个 PR 从最新 `origin/main` 新建分支，分支名见各节。
2. 动手前先读 `AGENTS.md`。这个仓库的 Next.js 版本有破坏性变更：写路由、metadata、layout 代码前，先读 `node_modules/next/dist/docs/` 里对应的指南，并照着仓库里已有的同类文件写（例如新页面就模仿 `src/app/(default)/about` 或 `presenter-timer` 页的结构）。
3. 风格：跟周边代码保持一致，注释密度、命名、组件写法都照抄现有代码，不引入新依赖。
4. 文案：所有用户可见文案都走现有 i18n 机制（`src/lib/i18n.ts` 和对应字典），**`enabledLocales` 里的每个语言都要补齐**，不能只写英文后让其它语言回退。
5. 每个 PR 提交前必须全部通过：
   ```
   pnpm lint
   pnpm exec tsc --noEmit
   pnpm test
   pnpm build
   ```
   任何一项失败都要修到通过，不允许跳过测试或删除测试来过关。
6. 新增行为必须带测试（vitest，放在 `tests/` 下对应目录，模仿现有测试写法）。
7. 提交信息用 Conventional Commits，结尾加：
   ```
   Co-Authored-By: Claude <noreply@anthropic.com>
   ```
8. 用 `gh pr create` 开 PR，PR 描述写清：改了什么、为什么（引用本文档对应小节）、如何验证、截图（UI 改动用 `pnpm dev` 本地截图）。PR 描述结尾加：
   ```
   🤖 Generated with [Claude Code](https://claude.com/claude-code)
   ```
9. **只开 PR，不要合并，不要发布。** 绝对不要运行 `pnpm release:solo`、`vercel` 任何命令，不要改 Vercel 环境变量，不要动 Stripe。
10. 不要打印或提交任何密钥、`.env*` 文件。
11. PR 之间按顺序做：PR 1 → PR 2 → PR 3 → PR 4。每个 PR 都从 `origin/main` 起分支；如果后一个 PR 依赖前一个未合并的改动，就基于前一个分支并在 PR 描述里注明 "Depends on #N"。
12. 全部完成后，在仓库根目录写 `docs/plans/2026-10-28-pro-conversion-sprint.report.md`（不提交），列出每个 PR 的链接、验证结果、未完成项和你不确定的地方。

## 2. PR 1：下掉 Adsterra Social Bar

分支：`chore/remove-adsterra-social-bar`

为什么：Social Bar 是浮动推送广告，收入极低，却让一个要用户付 $9 的工具显得廉价，并干扰导出和付费路径。

要做：
- 删除 `src/components/site/adsterra-ads.tsx`，并从 `src/app/app-shell.tsx` 移除 `<AdsterraSocialBar />` 及其 import。
- 在 `src/lib/content-security-policy.ts` 里删掉只为 Adsterra 服务的域名；如果 `ads.txt`（`src/app/ads.txt` 或 `public/ads.txt`）里有 Adsterra 的行，也删掉。**AdSense 相关的代码、CSP 和 ads.txt 行全部保留不动。**
- 全仓搜索 `adsterra`（不区分大小写），清理残留引用和对应测试。
- 确认 `grep -ri "creator" src` 没有 Creator Pack 残留，有的话一并删除。

验收：
- 全仓 `grep -ri adsterra` 无结果（文档和 changelog 除外）。
- 本地 `pnpm dev` 打开首页和生成器，不再出现浮动广告，控制台没有新增 CSP 报错。
- 第 1 节第 5 条全部通过。

## 3. PR 2：主动售卖面（顶栏 Upgrade、`/pro` 页、导出完成 CTA）

分支：`feat/pro-sales-surface`

为什么：数据显示主动想要 Pro 的人转化率是被动弹窗的约 7 倍，但现在没有主动入口。

### 3.1 顶栏 Upgrade 按钮
- 在 `src/components/site/site-header.tsx` 加一个 "Upgrade to Pro" / "Pro" 按钮，链接到 `/pro`（多语言站点链接到对应语言的 `/pro`，照 header 里其它链接的处理方式）。
- 已是 Pro 的用户：显示 "Pro" 徽标或直接隐藏按钮，不要再推销。用现有的 Pro 状态读取方式（看 `src/lib/pro/client.ts` 和生成器里 `isPro` 的来源），不要自己新写一套。注意 header 若是服务端组件，需要把这部分拆成一个小的客户端组件，避免影响 SSR 和 SEO。
- 点击时上报事件 `pro_cta_clicked`，参数 `{ placement: "header" }`。新事件名加到 `src/lib/analytics/events.ts` 的类型里。

### 3.2 `/pro` 营销页
- 新增路由 `/pro`（英文，放在 `src/app/(default)/pro/page.tsx`，注意不要破坏已有的 `/pro/success`），以及各语言版本 `/[locale]/pro`（照 about、compare 等页面的本地化做法）。
- 页面内容（文案写得具体、口语化，不要营销腔）：
  1. 标题 + 一句话价值：一次买断 $9，终身使用，无订阅。
  2. 免费 vs Pro 对比表。权益以代码为准，从 `src/lib/pro/entitlements.ts` 和生成器 gating 逻辑读取，不要编造。PR 3 合并后表中会多出 4K 和透明视频格式两行；本 PR 先写当前已有的权益（时长 300s → 60 分钟、60fps、签名模板、Live Link）。
  3. 适合谁：主播（OBS 倒计时）、做视频的人（Premiere / DaVinci 叠加）、演讲和活动。
  4. FAQ：一次性付款吗（是）；换浏览器或换设备怎么办（用购买邮箱在 restore 入口恢复，链接到现有恢复流程）；能退款吗（参照 `src/app/(default)/terms` 或现有政策页的说法，不要自己编政策）；支持哪些支付方式（Stripe Checkout）。
  5. 购买按钮：复用生成器 paywall 里现有的结账逻辑（`pro-paywall-modal.tsx` 和 `src/lib/pro/client.ts` 的报价、结账调用），不要另写一套结账流程；区域价格报价也要沿用现有接口。
- SEO：加 metadata（title、description、canonical、hreflang alternates，照现有页面的写法），把 `/pro` 及各语言版本加进 `src/app/sitemap.ts`，按现有规则补 `llms.txt` / md 路由（如果其它页面都有的话）。
- 事件：页面曝光上报 `pro_page_viewed`；购买按钮点击沿用 `pro_checkout_clicked`，参数里 `trigger` 用 `"direct"`，并带上 `source: "pro_page"`（见 3.4）。

### 3.3 导出完成 CTA
- 在导出完成视图（`src/components/generator/export-progress-view.tsx` 或导出完成状态所在组件）加一个次级 CTA："Need longer timers, 60fps or 4K? Get Pro — $9 once"（各语言翻译）。只对非 Pro 用户显示。
- 不要用弹窗，不要挡住下载按钮，视觉上要比下载按钮弱。
- 点击后打开现有 paywall（`openPaywall("direct", ...)`），上报 `pro_cta_clicked`，参数 `{ placement: "export_complete" }`。

### 3.4 给 paywall 事件加来源
- 现在 `pro_upsell_viewed` 已带 `source`，但 `pro_price_quoted` 和 `pro_checkout_clicked` 没有，导致分不清是自动弹出还是用户主动打开。把 paywall 打开时的 `source` 存下来，在这两个事件里也带上。取值统一为：`auto`（撞上限自动弹出）、`inline`（生成器内的小 CTA）、`header`、`export_complete`、`pro_page`、`feature`（点 60fps、签名模板等被拦）。
- 补充对应单测（参考 `tests/generator/pro-analytics.test.ts`）。

验收：
- 非 Pro 用户：顶栏能看到 Upgrade，进入 `/pro` 能看到对比表和购买按钮，点击能跳到 Stripe Checkout（本地无 Stripe 配置时会返回 `not_configured`，确认前端正确提示即可）。
- Pro 用户（可在本地用测试 token 或 mock 模拟）：顶栏不推销，导出完成不显示 CTA。
- 所有语言的 `/[locale]/pro` 都能打开且文案已翻译。
- sitemap 包含新页面。
- 第 1 节第 5 条全部通过。

## 4. PR 3：把 4K 和透明通道视频格式放进 Pro

分支：`feat/pro-gate-4k-alpha`

为什么：300 秒上限可以通过分段导出绕开，而 4K 和单文件透明视频（OBS、Premiere 叠加直接用）是专业用户真正需要、免费用户也很难绕开的价值点。

范围（严格按此划分）：
- **Pro 专属**：
  - 分辨率预设里的 4K（`src/lib/generator/defaults.ts` 中 `landscape-2160`、`portrait-2160`，以及任何宽或高 ≥ 2160 的预设或自定义尺寸）。
  - 格式 `webm-vp9-alpha` 和 `mov-hevc-alpha`。
- **保持免费**：`mp4`、`webm`、`gif`、`png-sequence`（PNG 序列仍可做透明，免费用户的透明需求仍有出路，这一点不要改）。1080p 及以下所有分辨率。

要做：
- 在 `src/lib/pro/entitlements.ts` 扩展 `ProTrigger`，新增 `"resolution"` 和 `"format"`，并加判断函数（例如 `isProResolution(width, height)`、`isProFormat(format)`），带单测。
- 生成器交互照 60fps 的处理方式（`generator-shell.tsx` 里 `handleFpsChange`）：免费用户选中这些选项时，不切换设置，改为打开 paywall（`openPaywall("resolution")` / `openPaywall("format")`），`source` 为 `feature`。选项旁边加 Pro 小徽标（照签名模板或 60fps 现有的 Pro 标记样式）。
- 导出前兜底：即使设置里因为历史 localStorage 残留了 4K 或 alpha 格式，免费用户导出时也要回退到免费的等价选项（4K → 1080p 同方向；`webm-vp9-alpha` / `mov-hevc-alpha` → `png-sequence`），并给出轻提示。复用现有的 "pro-aware generator settings fallback" 逻辑（`git log --oneline | grep -i fallback` 找到对应提交），不要另写一套。
- paywall（`pro-paywall-modal.tsx`）为新的两个 trigger 提供各自的标题和说明文案，所有语言补齐。
- 更新 `/pro` 页对比表（如果 PR 2 已合并；未合并则在本 PR 基于 PR 2 分支并注明依赖），以及首页、guides 中任何写着 "free 4K" 或 "free transparent WebM/MOV" 的文案，改成准确说法。用 `grep -rni "4k" src` 和 `grep -rni "alpha\|transparent" src/lib src/app` 逐个检查。
- Pro 用户行为完全不变。

验收：
- 免费用户：选择 4K 或两种 alpha 格式时弹出 paywall，设置保持原值；PNG 序列透明导出照常可用。
- 本地 localStorage 写入 4K + `mov-hevc-alpha` 后刷新，免费用户导出时自动回退并有提示。
- Pro 用户：所有选项照常可用。
- 新增单测覆盖判断函数、回退逻辑和 paywall trigger。
- 第 1 节第 5 条全部通过。

## 5. PR 4：测量修正 + 邮箱收集

分支：`feat/funnel-metrics-email-capture`

### 5.1 `duration_limit_hit` 只在越过上限时上报一次
- 现在 `handleDurationChange` 每改一次值都会上报（10/14–27 共 1,522 次 / 337 人，次数严重虚高）。改为：从 ≤300 变到 >300 时上报一次；之后一直停留在 >300 期间不再上报；回到 ≤300 后再越过才再报。
- 补单测。

### 5.2 导出完成后收集邮箱
- 在导出完成视图（与 3.3 的 CTA 放在一起但分开展示）加一个轻量表单："Get new templates and updates by email"（各语言翻译），一个邮箱输入框加一个按钮。只出现在导出完成后，每个浏览器提交成功后不再显示（用 localStorage 记，读写包在 try/catch 里）。
- 后端复用现有 `/api/waitlist`（`src/app/api/waitlist/route.ts` 和 `src/lib/waitlist.ts`）：读懂它现在怎么区分演讲者计时器的等候名单，扩展出一个新的列表标识（例如 `time-overlay-updates`），**不要破坏演讲者计时器等候名单现有的行为和数据格式**。如果当前接口不支持区分列表，以最小改动加一个可选的 `list` 字段，默认值保持原行为，并补测试。
- 成功后上报事件 `email_captured`，参数 `{ placement: "export_complete" }`。
- 隐私：表单下方一行小字说明用途，并链接到隐私政策页；不要预勾选任何东西。

验收：
- 越过上限一次只产生一个 `duration_limit_hit`。
- 导出完成后能提交邮箱，成功后表单消失，刷新后不再出现。
- 演讲者计时器等候名单页面提交流程不受影响（跑现有测试，并在本地手动提交一次）。
- 第 1 节第 5 条全部通过。

## 6. 不由执行者处理（留给所有者手动完成）

- 打开区域定价：在 Vercel Production 设置 `PRO_REGIONAL_PRICING_ENABLED=true` 并发布。
- 在 Stripe Dashboard 开启成功付款的收据邮件（Settings → Customer emails → Successful payments）。
- PR 审查、合并与生产发布（按 `docs/deploy/local-prebuilt-release.md` 走 `pnpm release:solo`）。
- 上线两周后按周复盘四个数：主动 paywall 曝光人数、点击结账率、付费数、邮箱收集数；再决定是否测试价格。
