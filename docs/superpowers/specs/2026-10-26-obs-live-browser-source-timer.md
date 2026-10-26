# OBS 在线计时器（Browser Source 链接）· 第一期工程规格

日期：2026-10-26　状态：已拍板，待执行　执行人：实习生　评审：Sean

本文是唯一的需求来源。**标「硬性」的部分必须照做**：接口、数值、文件归属、文案、样式类名都算。标「建议」的部分可以换更好的做法，但要在 PR 描述里写明原因。遇到本文没写到的情况，**先停下来问，不要自己发挥**。

---

## 0. 一句话说明

用户在 timeoverlay.co 的生成器里设计好计时器，点「OBS 直播链接」，拿到一个网址。用户把这个网址粘贴进 OBS 的「浏览器源」，直播画面里就会出现一个**背景透明、实时走动的倒计时**，不需要下载视频文件。

计时器的所有设置都写在网址参数里，**服务器什么都不存**。第一期不需要后端、不需要数据库，也不需要账号。

### 术语表

| 术语 | 意思 |
|---|---|
| OBS | 主播最常用的免费推流软件，Streamlabs Desktop 是它的衍生版 |
| 浏览器源（Browser Source） | OBS 自带的一种「来源」，会打开一个网页并叠加到直播画面上。网页背景透明的地方，直播画面也透明 |
| 在线页 | 本次新做的 `/live` 页面，专门给 OBS 打开，只画计时器，没有任何其他 UI |
| 链接对话框 | 本次在生成器里新做的弹窗，用来配置并复制在线页的网址 |
| 模板 | 生成器现有的 60 个计时器样式（`src/lib/generator/templates.ts`），在线页直接复用 |
| Pro 模板 | 现有的 12 个 signature 模板（`isProTemplateId()` 返回 true 的那些） |

---

## 1. 为什么做

- **搜索数据（GSC，2026-07-27 到 2026-10-24）**：OBS 相关的词有需求，但我们排不上去。`obs timer overlay` 排第 12.4 位，`timer overlay obs` 第 14.6 位，`obs countdown timer` 第 34 位，`obs countdown timer browser source` 第 26 位。这些人要的是「在 OBS 里实时走的计时器」，而我们只能提供视频文件。
- **用户结构**：Windows 桌面用户占 55%，正是 OBS 的主力人群。
- **现在的痛点**：用视频文件做计时器，改个时长就得重新导出、重新下载；也做不到「倒计时到晚上 8 点开播」。
- **商业目的**：免费功能负责拉新和做 SEO。第二期再在它上面加「手机遥控」作为 Pro 功能（见第 15 节）。

---

## 2. 范围

### 2.1 第一期要做（全部是硬性要求）

1. 新页面 `/live`：读网址参数，用现有模板引擎把计时器画在透明背景上。
2. 三种计时模式：**倒计时**（固定时长）、**倒计时到某个时刻**、**正计时**。
3. 四种结束行为：停在 00:00、隐藏、显示一句文字、循环重来（循环只在倒计时模式可用）。
4. 生成器导出面板里加一个入口按钮，加上链接对话框（配置、复制、OBS 设置说明、预览）。
5. Pro 模板的处理：Pro 用户复制的链接里带 license；在线页校验 license，校验不通过就退回默认免费模板。
6. 埋点（第 10 节）。
7. 更新 OBS 指南的文案（第 11 节）。
8. 单元测试和手工 QA（第 13 节）。

### 2.2 第一期不做（做了就算越界）

- 遥控、暂停、加时，以及任何需要服务器存状态的功能
- 提示音、音频
- 自定义上传字体（在线页只用模板字体）
- 手机端入口（对话框入口在手机上隐藏）
- 新的 npm 依赖
- 改模板、改模板渲染器的视觉效果
- 给在线页做多语言（在线页本身没有 UI 文字）

---

## 3. 拍板结论

| 项 | 结论 |
|---|---|
| 收费 | 免费。免费模板在线使用**不限时长**（最长 99:59:59）。Pro 模板需要 Pro license |
| 状态存放 | 全部放在网址参数里，服务器不存任何东西 |
| 计时依据 | 倒计时和正计时用页面加载时刻作为起点（`performance.now()`）；「到某个时刻」用电脑系统时间（`Date.now()`） |
| 重新开始的方式 | 靠 OBS 的「场景激活时刷新浏览器」选项：页面一刷新，倒计时就从头开始 |
| 渲染 | 复用 `createRenderFrameState` 和 `renderStyledFrame`，只在显示的文字变化时重画（每秒最多一次） |
| 画布尺寸 | 等于生成器里选的分辨率预设（比如 1920×1080），用 CSS 铺满窗口 |
| 背景 | 默认跟模板一致。用户在生成器里选了透明，就是透明 |
| 广告和统计脚本 | 在线页**一律不加载** AdSense、GA、Clarity、Ahrefs。PostHog 只发一个 `live_overlay_loaded` 事件 |
| 搜索引擎 | `/live` 加 noindex，不进 sitemap |
| 链接对话框的文案语言 | 只写英文和简体中文，其他语言用英文兜底 |

---

## 4. 用户流程

### 4.1 生成器这一侧

1. 用户在生成器里选模板、调颜色、位置、字号、分辨率。
2. 在导出面板点「OBS live link」，弹出链接对话框。
3. 在对话框里选模式：
   - **Countdown**：时长默认取生成器当前的时长，可以在对话框里改分钟和秒。
   - **Count down to a time**：选一个本地日期时间，必须在未来、且不超过 99 小时后。
   - **Count up**：没有参数。
4. 选结束行为（结束时显示文字的话，再填文字）。
5. 链接框里的网址实时更新。用户点 Copy，或者点「Preview」在新标签页预览（预览页带棋盘格背景，能看出哪里是透明的）。
6. 按对话框里的四步说明，把链接粘贴进 OBS。

### 4.2 OBS 这一侧

1. 来源 → `+` → 浏览器（Browser）→ 新建。
2. URL 粘贴链接；宽度和高度填对话框里显示的数值（比如 1920 和 1080）。
3. 倒计时和正计时模式：勾选「场景激活时刷新浏览器」（Refresh browser when scene becomes active）。这样每次切到这个场景，计时都从头开始。
4. 确定。计时器出现在画面上，背景透明。

### 4.3 典型场景（QA 要逐个覆盖）

| 场景 | 模式 | 结束行为 |
|---|---|---|
| 开播前的「Starting soon」，倒计时到 20:00 | until | message：「LIVE NOW」 |
| 中场休息 BRB 5 分钟 | countdown 300 | hide |
| 游戏挑战限时 30 分钟 | countdown 1800 | hold |
| 每轮 60 秒的循环 | countdown 60 | loop |
| 显示已经播了多久 | countup | （不适用） |

---

## 5. 网址协议（核心，全部硬性）

### 5.1 基本形式

```
https://timeoverlay.co/live?v=1&mode=countdown&duration=300&template=obs-break-timer&size=landscape-1080&format=mmss&anchor=bottom-right&ox=0&oy=0&color=F8FAFC&fontSize=88&bg=transparent&end=hide
```

### 5.2 参数表

| 参数 | 含义 | 合法值 | 缺失或不合法时 |
|---|---|---|---|
| `v` | 协议版本 | `1` | 缺失按 1 处理；是其他值时记一条警告，仍按 1 解析 |
| `mode` | 计时模式 | `countdown` \| `until` \| `countup` | `countdown` |
| `duration` | 倒计时秒数（仅 countdown） | 整数，1–359999 | `300` |
| `until` | 目标时刻（仅 until） | ISO 8601，必须带 `Z` 或 `±HH:MM` 时区，例如 `2026-10-26T20:00:00.000Z` | mode 退回 `countdown`，duration 用 300，记警告 |
| `template` | 模板 ID | `TemplateId` 联合类型里的任意值 | `DEFAULT_GENERATOR_TEMPLATE_ID`（center-mono） |
| `size` | 分辨率预设 | `ResolutionPresetId` 里的任意值 | 用模板自己的默认预设 |
| `format` | 显示格式 | `ss` \| `mmss` \| `hhmmss`，分别对应 `ss`、`mm:ss`、`hh:mm:ss` | 用模板默认 |
| `anchor` | 位置锚点 | `PlacementAnchor` 里的任意值 | 用模板默认 |
| `ox`、`oy` | 偏移量（像素） | 整数，-240 到 240 | 0 |
| `color` | 文字颜色 | 6 位十六进制，**不带 #**，例如 `F8FAFC` | 用模板默认 |
| `fontSize` | 字号 | 整数，36–180 | 用模板默认 |
| `bg` | 背景 | `transparent`，或 6 位十六进制（不带 #） | 用模板默认 |
| `end` | 结束行为 | `hold` \| `hide` \| `message` \| `loop` | `hold`。mode 不是 countdown 却写了 `loop` 时，按 `hold` 处理并记警告 |
| `message` | 结束时显示的文字 | 1–40 个字符，去掉控制字符和首尾空格 | 写了 `end=message` 但 message 为空时，用 `LIVE` |
| `license` | Pro license | 现有 Pro token 原样放进来（`v1.xxx.yyy`） | 没有 |
| `preview` | 预览模式 | `1` | 关闭。**对话框复制出去的链接里永远不带这个参数** |
| `debug` | 显示解析警告 | `1` | 关闭 |

### 5.3 解析规则（硬性）

- **解析永远不抛异常。** 任何不合法的值，都用默认值替代，并在 `warnings` 数组里记一条英文说明。
- **不认识的参数直接忽略。** 第二期会加 `room` 参数，现在的解析器必须容忍它存在。
- `until` 的解析：先把字符串里的空格替换成 `+`（用户手打网址时，`+` 会被浏览器变成空格），再用下面的正则校验，最后用 `Date.parse` 解析：
  ```
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})$/
  ```
  正则不通过或解析结果是 `NaN`，都算不合法。
- 数字参数的处理：先用 `Number()` 转换，必须是有限整数，再检查范围。**超出范围不夹到边界，直接视为不合法**，用默认值。
- `message`：去掉 `\u0000-\u001F` 和 `\u007F`，再 trim，最长截到 40 个字符。（文字是画在 canvas 上的，没有 XSS 风险，但仍然要做清理。）

### 5.4 生成规则（硬性）

- 生成链接一律用 `new URL("/live", origin)` 加 `url.searchParams.set(...)` 来拼，**不要手动拼字符串**。
- 参数按 5.2 表格的顺序依次写入；`v=1` 必须写在第一个。
- `until` 一律用 `new Date(ms).toISOString()` 生成（带毫秒，以 `Z` 结尾）。
- `duration` 只在 countdown 模式写入，`until` 只在 until 模式写入，`message` 只在 end=message 时写入，`license` 只在 Pro 模板且用户是 Pro 时写入。
- 其他样式参数（template、size、format、anchor、ox、oy、color、fontSize、bg）**一律写入**。这样链接本身就说明了样式，以后模板默认值变了，旧链接的样子也不会变。
- `origin` 取 `window.location.origin`。在预览部署上生成的链接就指向预览站，这是预期行为。

---

## 6. 计时逻辑（硬性）

### 6.1 类型定义

新建文件 `src/lib/live/live-timer-config.ts`，里面要有这些类型：

```ts
import type {
  PlacementAnchor,
  ResolutionPresetId,
  TemplateId,
  TimerDisplayFormat,
} from "@/lib/generator/types";

export const LIVE_TIMER_MAX_SECONDS = 359_999; // 99:59:59
export const LIVE_MESSAGE_MAX_LENGTH = 40;
export const LIVE_DEFAULT_DURATION_SECONDS = 300;
export const LIVE_DEFAULT_MESSAGE = "LIVE";

export type LiveTimerMode = "countdown" | "until" | "countup";
export type LiveTimerEndBehavior = "hold" | "hide" | "message" | "loop";

export type LiveTimerConfig = {
  mode: LiveTimerMode;
  durationSeconds: number;          // 只在 countdown 模式有意义
  untilEpochMs: number | null;      // 只在 until 模式有意义
  templateId: TemplateId;
  // 下面这些字段为 null 时表示「用模板默认值」
  resolutionPresetId: ResolutionPresetId | null;
  displayFormat: TimerDisplayFormat | null;
  anchor: PlacementAnchor | null;
  offsetX: number;
  offsetY: number;
  textColor: string | null;         // 统一存成 "#RRGGBB"（带 #，大写）
  fontSize: number | null;
  background: "transparent" | string | null; // "#RRGGBB"，或 null 表示用模板默认
  endBehavior: LiveTimerEndBehavior;
  message: string;
  licenseToken: string | null;
};

export type LiveTimerParseResult = {
  config: LiveTimerConfig;
  preview: boolean;
  debug: boolean;
  warnings: string[];
};

export function parseLiveTimerParams(params: URLSearchParams): LiveTimerParseResult;
export function buildLiveTimerUrl(origin: string, config: LiveTimerConfig): string;
```

再加两个转换函数，都放在同一个文件里：

```ts
// 链接对话框用：把生成器的当前设置，加上对话框里的选项，转成 LiveTimerConfig
export function liveConfigFromGeneratorSettings(
  settings: GeneratorSettings,
  options: {
    mode: LiveTimerMode;
    durationSeconds: number;
    untilEpochMs: number | null;
    endBehavior: LiveTimerEndBehavior;
    message: string;
    licenseToken: string | null;
  },
): LiveTimerConfig;

// 在线页用：把 LiveTimerConfig 转成渲染器需要的 GeneratorSettings
export function generatorSettingsFromLiveConfig(config: LiveTimerConfig): GeneratorSettings;
```

`generatorSettingsFromLiveConfig` 的实现方式是调用现有的 `createGeneratorSettings(overrides, { isPro: true })`：

- `templateId` 永远传入。
- `canvas.resolutionPresetId`、`timer.displayFormat`、`placement.anchor`、`textStyle.textColor`、`textStyle.fontSize` 只在不为 null 时传。
- `placement.offsetX` 和 `placement.offsetY` 永远传。
- `background`：值是 `"transparent"` 时传 `canvas.backgroundMode: "transparent"`；是十六进制颜色时传 `backgroundMode: "solid"` 加上 `backgroundColor`；是 null 时不传。

（`isPro: true` 只是为了让 normalize 不去夹时长；在线页的时长根本不从 settings 里读，见 6.3。）

`liveConfigFromGeneratorSettings` 的取值规则：

| LiveTimerConfig 字段 | 取自 |
|---|---|
| templateId | `settings.templateId` |
| resolutionPresetId | `settings.canvas.resolutionPresetId` |
| displayFormat | `settings.timer.displayFormat` |
| anchor、offsetX、offsetY | `settings.placement` 对应字段 |
| textColor | `settings.textStyle.textColor` 转大写（如果不是 `#RRGGBB` 格式，就填 null） |
| fontSize | `settings.textStyle.fontSize` |
| background | backgroundMode 是 `"transparent"` 时填 `"transparent"`，否则填 `settings.canvas.backgroundColor` |
| 其余字段 | 来自 options |

生成器里的发光、描边、阴影、字间距、字重、自定义字体，**都不进链接**。对话框里会用一句话告诉用户这一点（见第 9 节文案 `styleNote`）。

### 6.2 每一帧显示什么

新建文件 `src/lib/live/live-timer-clock.ts`：

```ts
export type LiveFrame =
  | { kind: "digits"; seconds: number; displayFormat: TimerDisplayFormat }
  | { kind: "message"; text: string }
  | { kind: "hidden" };

export function computeLiveFrame(
  config: LiveTimerConfig,
  baseDisplayFormat: TimerDisplayFormat, // 来自 generatorSettingsFromLiveConfig 的结果
  clock: { nowEpochMs: number; elapsedMs: number },
): LiveFrame;

export function liveFrameKey(frame: LiveFrame): string; // 例如 "d:mm:ss:299"、"m:LIVE"、"h"
```

计算规则（`elapsed = clock.elapsedMs / 1000`）：

| 模式 | 剩余或已用秒数 | 何时算结束 |
|---|---|---|
| countdown | `remaining = duration - elapsed`；如果 end 是 loop，先算 `elapsed = elapsed % duration` | `remaining <= 0` |
| until | `remaining = (untilEpochMs - nowEpochMs) / 1000` | `remaining <= 0` |
| countup | `shown = floor(elapsed)`，最大到 `LIVE_TIMER_MAX_SECONDS` | 永不结束 |

- countdown 和 until 显示的秒数是 `Math.min(Math.ceil(remaining), LIVE_TIMER_MAX_SECONDS)`，和现有导出用的 `getRemainingDurationSeconds` 一样向上取整：剩 4.2 秒时显示 5。
- 结束之后：
  - `hold` → `{kind:"digits", seconds:0}`
  - `hide` → `{kind:"hidden"}`
  - `message` → `{kind:"message", text: config.message}`
  - `loop` 在 countdown 模式下永远不会进入「结束」。

**显示格式自动升级**（避免出现「3600」这种难看的显示）：

- 基础格式是 `ss`，而秒数 ≥ 100 → 改用 `mm:ss`
- 格式是 `mm:ss`（包括从 ss 升级上来的），而秒数 ≥ 6000（100 分钟）→ 改用 `hh:mm:ss`
- 其他情况保持原格式

### 6.3 怎么复用现有渲染器

`createRenderFrameState` 是用 `settings.timer.durationSeconds - elapsedSeconds` 来算显示文字的。在线页的做法是：每一帧拷贝一份 settings，把时长设成要显示的秒数，`elapsedSeconds` 传 0：

```ts
const frameSettings = {
  ...baseSettings,
  timer: { ...baseSettings.timer, durationSeconds: frame.seconds, displayFormat: frame.displayFormat },
};
```

显示文字（`message`）时，需要给渲染器加一个**向后兼容**的可选参数。这是本期唯一允许对 `src/lib/generator/render-frame.ts` 做的改动：

```ts
type RenderFrameStateInput = {
  settings: GeneratorSettings;
  elapsedSeconds: number;
  textBox: TextBoxSize;
  safeAreaInset: number;
  textOverride?: string; // 新增：有值时直接用它，不再格式化时间
};
// 函数体里：
const text = textOverride ?? formatCountdownTime(remainingSeconds, settings.timer.displayFormat);
```

`textBox` 必须用**实际要画的文字**来量（调用 `measureRenderTextBox(context, text, style)`）。文字较长时，现有的 `resolveTextScale` 会自动缩小字号，这是预期效果。

### 6.4 边界情况

| 情况 | 期望行为 |
|---|---|
| until 的目标时刻已经过去 | 一打开就直接进入结束行为 |
| until 距离现在超过 99 小时 | 显示 99:59:59，直到剩余时间小于这个值 |
| 电脑改了系统时间 | countdown 和 countup 不受影响（用的是 `performance.now()`）；until 跟着系统时间变，这是预期行为 |
| OBS 隐藏了这个来源（页面挂起） | 回来后按真实时间重新计算，不会累积误差 |
| 网址参数全错 | 显示默认的 5 分钟倒计时（center-mono），不报错不白屏；加上 `debug=1` 时显示警告 |
| Pro 模板但没有 license，或校验失败 | 先用 Pro 模板画，校验结果回来后切换到 `DEFAULT_GENERATOR_TEMPLATE_ID`，计时不中断 |
| `/api/pro/validate` 请求失败（网络错误或 5xx） | 保留 Pro 模板（失败时放行，和现有 Pro 的「接受被绕过」策略一致） |

---

## 7. 在线页 `/live` 的实现

### 7.1 路由结构（硬性）

`/live` 必须有**独立的根布局**，否则会带上全站的深色背景、AdSense 和 GA。项目里已经用 route group 做了多个根布局（`(default)`、`(localized)`），照着这个模式来：

```
src/app/(live)/layout.tsx         ← 新的根布局，只有 <html><body>
src/app/(live)/live/page.tsx      ← 服务端页面，只负责 metadata 和挂载客户端组件
src/components/live/live-timer-overlay.tsx  ← 客户端组件，canvas 和计时循环
```

注意 `(localized)/[locale]` 是动态路由，理论上也能匹配 `/live`。Next 会优先匹配静态路由，所以 `/live` 会进新页面。QA 时要确认打开 `/live` 看到的是计时器，不是 404 或首页。

动手写之前，先读 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route-groups.md` 和 `layout.md`。这个项目用的 Next 16 和你熟悉的版本可能不一样。

### 7.2 `src/app/(live)/layout.tsx`（照抄，不要加东西）

```tsx
import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";

import { CSP_NONCE_HEADER } from "@/lib/content-security-policy";

export const metadata: Metadata = {
  title: "Time Overlay Live",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default async function LiveRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // 读一次 nonce 头，让页面保持动态渲染，这样 Next 会给自己的 script 加上 CSP nonce。
  await headers().then((h) => h.get(CSP_NONCE_HEADER));

  return (
    <html lang="en" style={{ background: "transparent" }}>
      <body style={{ margin: 0, background: "transparent", overflow: "hidden" }}>{children}</body>
    </html>
  );
}
```

- **不要** import `../globals.css`（它会给 body 设深色背景）。
- **不要**引用 `AppDocument`、`app-shell.tsx`、GA、AdSense、Clarity、Ahrefs。
- 在线页需要的样式全部写成内联 style，不用 Tailwind。

### 7.3 `src/app/(live)/live/page.tsx`

```tsx
import { LiveTimerOverlay } from "@/components/live/live-timer-overlay";

export const dynamic = "force-dynamic";

export default function LivePage() {
  return <LiveTimerOverlay />;
}
```

### 7.4 `src/components/live/live-timer-overlay.tsx`（结构硬性，细节建议）

关键要求：

- 服务端渲染时只输出一个空的 `<canvas>`。读网址参数要放在 `useEffect` 里用 `window.location.search`，**不要用 `useSearchParams`**（避免 hydration 不一致和 Suspense 的麻烦）。
- 用 `requestAnimationFrame` 循环，但**只在 `liveFrameKey` 变化时才重画**。
- canvas 的内部尺寸等于 `settings.canvas.width` × `settings.canvas.height`；CSS 尺寸是 `100vw × 100vh`，并设 `object-fit: contain`。
- 组件卸载时要 `cancelAnimationFrame`，并用 AbortController 取消校验请求。

参考骨架：

```tsx
"use client";

import posthog from "posthog-js";
import { useEffect, useRef, useState } from "react";

import { createRenderFrameState, measureRenderTextBox, renderStyledFrame } from "@/lib/generator/render-frame";
import { DEFAULT_GENERATOR_TEMPLATE_ID, isProTemplateId } from "@/lib/generator/templates";
import type { GeneratorSettings } from "@/lib/generator/types";
import { computeLiveFrame, liveFrameKey, type LiveFrame } from "@/lib/live/live-timer-clock";
import { generatorSettingsFromLiveConfig, parseLiveTimerParams } from "@/lib/live/live-timer-config";

const SAFE_AREA_INSET = 32; // 和 preview-panel 保持一致

function paint(ctx: CanvasRenderingContext2D, base: GeneratorSettings, frame: LiveFrame) {
  if (frame.kind === "hidden") {
    ctx.clearRect(0, 0, base.canvas.width, base.canvas.height);
    return;
  }
  const settings: GeneratorSettings =
    frame.kind === "digits"
      ? { ...base, timer: { ...base.timer, durationSeconds: frame.seconds, displayFormat: frame.displayFormat } }
      : base;
  const textOverride = frame.kind === "message" ? frame.text : undefined;
  // 要画的文字：显示文字时就是 message，显示数字时用和渲染器相同的格式化函数
  const text = textOverride ?? formatCountdownTime(frame.seconds, frame.displayFormat);
  // 用「缩放前」的原始样式量文字尺寸，和 preview-panel.tsx 第 140–155 行的做法一致
  const textBox = measureRenderTextBox(ctx, text, settings.textStyle);
  const state = createRenderFrameState({ settings, elapsedSeconds: 0, textBox, safeAreaInset: SAFE_AREA_INSET, textOverride });
  renderStyledFrame(ctx, state, settings.themePresetId, settings.templateId);
}
```

（`measureRenderTextBox` 第三个参数的类型是 `FrameTextStyle`，它是 `TextStyleSettings` 的一个子集，所以直接传 `settings.textStyle` 能通过类型检查。还要在文件顶部 import `formatCountdownTime`，它来自 `@/lib/generator/time`。）

`useEffect` 里的流程：

1. `parseLiveTimerParams(new URLSearchParams(window.location.search))`
2. `let settings = generatorSettingsFromLiveConfig(config)`，设置 canvas 尺寸。
3. 记下 `startedAt = performance.now()`，启动 rAF 循环：
   ```
   frame = computeLiveFrame(config, settings.timer.displayFormat, { nowEpochMs: Date.now(), elapsedMs: performance.now() - startedAt })
   key = liveFrameKey(frame) + "|" + settings.templateId
   key 变了就 paint
   ```
4. 如果 `isProTemplateId(config.templateId)`：
   - 没有 license → 直接把 settings 换成默认模板版本。
   - 有 license → `POST /api/pro/validate`，body 为 `{ token }`：
     - 返回 `{ valid: false }` → 换成默认模板，并把 lastKey 清空，强制重画。
     - 网络错误或非 200 → 什么都不做（失败时放行）。
5. 发一次 `posthog.capture("live_overlay_loaded", {...})`，属性见第 10 节。
6. 返回清理函数。

`preview=1` 时，canvas 外面包一层 div，背景用棋盘格：

```ts
background: "repeating-conic-gradient(#2a2a35 0% 25%, #1a1a22 0% 50%) 50% / 32px 32px"
```

`debug=1` 时，左上角用 `position:fixed`、11px、等宽字体、白字黑底半透明，逐行列出 warnings。没有警告就显示 `ok`。

### 7.5 PostHog（修改 `src/instrumentation-client.ts`）

在线页会被 OBS 频繁刷新。如果照常自动采集，会把 pageview 数据弄乱。改法：在 `posthog.init` 之前判断路径。

```ts
const isLiveOverlay = typeof window !== "undefined" && window.location.pathname === "/live";
posthog.init(posthogConfig.key, {
  api_host: posthogConfig.apiHost,
  ui_host: posthogConfig.uiHost,
  defaults: "2025-05-24",
  ...(isLiveOverlay
    ? { autocapture: false, capture_pageview: false, capture_pageleave: false, disable_session_recording: true }
    : {}),
});
```

AI 来源识别那段代码保持不变。

---

## 8. 生成器这一侧：入口和链接对话框

### 8.1 入口按钮（`src/components/generator/export-panel.tsx`）

- `ExportPanelProps` 新增一个可选属性 `onOpenLiveLink?: () => void`。
- 放在主导出按钮**下面**，隔开 `mt-3`。`isMobile` 为 true 或 `onOpenLiveLink` 没传时不渲染。
- 样式（硬性，直接用这些类名）：

```tsx
<button
  type="button"
  onClick={onOpenLiveLink}
  className="flex min-h-11 w-full items-center justify-between gap-3 border border-tertiary/45 bg-tertiary/5 px-4 font-mono text-[11px] uppercase tracking-[0.24em] text-tertiary transition-colors hover:bg-tertiary/12 focus-visible:outline-2 focus-visible:outline-tertiary"
>
  <span className="flex items-center gap-2"><Radio className="size-4" />{ui.liveLinkButton}</span>
  <span className="border border-primary/60 px-1.5 py-0.5 text-[9px] tracking-[0.2em] text-primary">{ui.liveLinkBadge}</span>
</button>
```

图标用 lucide 的 `Radio`。文案见第 9 节，取自 `getLiveLinkCopy(locale)`，不要往 `RootPageContent` 类型里加字段。

### 8.2 接线（`src/components/generator/generator-shell.tsx`）

- 新增状态 `const [liveLinkOpen, setLiveLinkOpen] = useState(false);`
- 给 `<ExportPanel>` 传 `onOpenLiveLink={() => setLiveLinkOpen(true)}`
- 在 `<ProPaywallModal>` 旁边渲染：

```tsx
<LiveLinkDialog
  open={liveLinkOpen}
  settings={settings}
  isPro={isPro}
  locale={resolveGeneratorCheckoutContext(window.location.pathname, "").locale}
  onClose={() => setLiveLinkOpen(false)}
  onUnlockPro={() => { setLiveLinkOpen(false); openPaywall("template"); }}
/>
```

（`window` 在服务端不存在。`locale` 要用 `useMemo` 或 state 在客户端算；也可以直接沿用 shell 已有的 locale 来源。**建议**先看 shell 里有没有现成的 locale，有就用现成的。）

- `generator-shell.tsx` 只允许做上面这三处改动。

### 8.3 对话框组件 `src/components/generator/live-link-dialog.tsx`

**外壳**：照抄 `pro-paywall-modal.tsx` 的遮罩和面板结构（`fixed inset-0 z-50 ... bg-background/80`，`cyber-panel cyber-chamfer relative w-full`），只把宽度改成 `max-w-lg`，并给面板加 `max-h-[90vh] overflow-y-auto`。按 Esc 和点遮罩都要关闭；打开时焦点放在第一个模式按钮上；关闭后焦点回到入口按钮。

**线框图**（从上到下，间距照标注）：

```
┌──────────────────────────────────────────────┐
│ LIVE TIMER FOR OBS                        [X]│ ← 标题 text-lg font-semibold
│ Paste this link into an OBS Browser Source…  │ ← 副标题 mt-2 text-sm text-muted-foreground
│                                              │
│ MODE                                         │ ← 小标签（样式 A），mt-6
│ [Countdown][Count down to a time][Count up]  │ ← 分段按钮，mt-2
│                                              │
│ ┌ 随模式变化的字段区 ──────────────────────┐ │ mt-4
│ │ countdown: [ 05 ] min [ 00 ] sec          │ │
│ │ until:     [ 2026-10-26T20:00 ]           │ │
│ │            Your time zone: Asia/Shanghai  │ │
│ │ countup:   Counts up from 00:00 when the  │ │
│ │            source loads.                  │ │
│ └───────────────────────────────────────────┘ │
│ WHEN IT ENDS                                 │ ← 小标签，mt-6（countup 模式隐藏整块）
│ [Stay at 00:00 ▾]   [ LIVE NOW          ]    │ ← 下拉 + 文字框（仅 message 时显示）
│                                              │
│ YOUR LINK                                    │ ← 小标签，mt-6
│ [https://timeoverlay.co/live?v=1&mo…] [COPY] │ ← 只读输入框 + 主按钮
│ Template, color, size and position are saved │ ← styleNote，mt-2 text-xs
│ in the link. Glow, stroke and custom fonts…  │
│                                              │
│ IN OBS                                       │ ← 小标签，mt-6
│ 01 Sources → + → Browser                     │ ← 有序列表，样式 B
│ 02 Paste the link into URL                   │
│ 03 Width 1920 · Height 1080                  │
│ 04 Tick "Refresh browser when scene becomes  │ ← countdown/countup 才显示
│    active" to restart the timer              │
│                                              │
│ [↗ Preview in a new tab]                     │ ← 次要按钮，mt-6
└──────────────────────────────────────────────┘
```

**样式规范（硬性，不要自己加颜色、字体或圆角）**：

| 元素 | 类名 |
|---|---|
| 小标签（样式 A） | `font-mono text-[10px] uppercase tracking-[0.28em] text-muted-foreground` |
| 分段按钮组 | 外层 `grid grid-cols-3 gap-1`；每个按钮 `min-h-10 border px-2 text-xs transition-colors`；选中时加 `border-primary/70 bg-primary/10 text-primary`，未选中时加 `border-border/80 text-muted-foreground hover:text-foreground`；同时要设 `aria-pressed` |
| 输入框、下拉框 | 照抄 `pro-paywall-modal.tsx` 第 309 行邮箱输入框的类名：`h-10 w-full rounded-none border border-border/80 bg-background/65 px-3 text-sm ... focus:border-tertiary` |
| 链接框 | 输入框类名，再加 `font-mono text-xs`；`readOnly`；聚焦时全选（`onFocus={e => e.currentTarget.select()}`） |
| COPY 按钮 | `<Button className="h-10 shrink-0 rounded-none px-4 font-mono text-[11px] uppercase tracking-[0.24em]">`；复制成功后 2 秒内文字变成 `Copied` 并显示 lucide `Check` 图标 |
| OBS 步骤（样式 B） | `<ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">`；序号 `<span className="mr-2 font-mono text-tertiary">01</span>`；宽高数字 `<span className="font-mono text-foreground">1920</span>` |
| 预览按钮 | `<Button variant="outline" className="h-10 rounded-none ...">`，图标用 lucide `ExternalLink` |
| 校验错误文字 | `mt-2 text-sm text-destructive`，`role="alert"` |
| Pro 锁定提示 | 外框 `border border-primary/40 bg-primary/5 px-4 py-4`；图标 lucide `Lock`，类名 `size-4 text-primary`；按钮用默认 `<Button>`，文案见 `proLockedCta` |

**交互和状态（硬性）**：

| 状态 | 表现 |
|---|---|
| 刚打开 | 模式是 countdown；分钟和秒取自 `settings.timer.durationSeconds`；结束行为是 hold；message 默认 `LIVE NOW` |
| 切到 until | 默认值是「现在 + 1 小时，取整到下一个整 5 分钟」，转成 `datetime-local` 的格式 |
| until 填的时间不合法 | 时间不在未来 → 显示 `errorUntilPast`；超过 99 小时 → 显示 `errorUntilTooFar`。COPY 和预览都禁用 |
| countdown 时长不合法 | 时长为 0，或超过 99:59:59 → 显示 `errorDuration`，并禁用 COPY 和预览 |
| 结束行为选 message 但没填文字 | 不报错，用 `LIVE` |
| 当前是 Pro 模板但用户不是 Pro | 用 Pro 锁定提示框替换掉「YOUR LINK」整块和「IN OBS」整块；按钮调用 `onUnlockPro` |
| 用户是 Pro 且是 Pro 模板 | 正常显示；链接带上 `license`，值来自新加的 `getStoredProToken()`（见 8.4） |
| 用户是 Pro 但读不到 token | 按「不是 Pro」处理（显示锁定框） |
| 复制失败（剪贴板权限被拒） | 自动全选链接框，并在下面显示 `copyFallback` |

- 时区显示用 `Intl.DateTimeFormat().resolvedOptions().timeZone`。
- `datetime-local` 的值转时间戳：`new Date(value).getTime()`（浏览器会按本地时区解析不带时区的字符串）。

### 8.4 `src/lib/pro/client.ts` 小改

新增一个导出函数，不要改其他任何东西：

```ts
export function getStoredProToken(): string | null {
  return readStoredState()?.token ?? null;
}
```

---

## 9. 文案（硬性，一个字都不要改）

新建 `src/content/live-link.ts`：

```ts
export type LiveLinkCopy = { /* 下表的每一个 key，都是 string */ };
export function getLiveLinkCopy(locale: string): LiveLinkCopy; // "zh-hans" 返回中文，其他一律返回英文
```

| key | English | 简体中文 |
|---|---|---|
| liveLinkButton | OBS live link | OBS 直播链接 |
| liveLinkBadge | New | 新 |
| title | Live timer for OBS | OBS 实时计时器 |
| subtitle | Paste this link into an OBS Browser Source. The timer runs live, so there is no video file to export. | 把这个链接粘贴到 OBS 的浏览器源。计时器会实时运行，不需要导出视频文件。 |
| modeLabel | Mode | 模式 |
| modeCountdown | Countdown | 倒计时 |
| modeUntil | Count down to a time | 倒计时到某个时刻 |
| modeCountup | Count up | 正计时 |
| minutesLabel | min | 分 |
| secondsLabel | sec | 秒 |
| untilLabel | Ends at | 结束时间 |
| timeZoneLabel | Your time zone: {zone} | 你的时区：{zone} |
| countupHint | Counts up from 00:00 when the source loads. | 来源加载后从 00:00 开始正计时。 |
| endLabel | When it ends | 结束时 |
| endHold | Stay at 00:00 | 停在 00:00 |
| endHide | Hide the timer | 隐藏计时器 |
| endMessage | Show a message | 显示一句文字 |
| endLoop | Restart | 重新开始 |
| messagePlaceholder | LIVE NOW | LIVE NOW |
| linkLabel | Your link | 你的链接 |
| copy | Copy | 复制 |
| copied | Copied | 已复制 |
| copyFallback | Press Ctrl+C (⌘C on Mac) to copy the selected link. | 链接已选中，按 Ctrl+C（Mac 上按 ⌘C）复制。 |
| styleNote | Template, color, size and position are saved in the link. Glow, stroke and custom fonts use the template defaults. | 链接会保存模板、颜色、大小和位置。发光、描边和自定义字体使用模板默认值。 |
| obsLabel | In OBS | 在 OBS 中 |
| obsStep1 | Sources → + → Browser | 来源 → + → 浏览器 |
| obsStep2 | Paste the link into URL | 把链接粘贴到 URL |
| obsStep3 | Width {w} · Height {h} | 宽度 {w} · 高度 {h} |
| obsStep4 | Tick "Refresh browser when scene becomes active" to restart the timer each time the scene is shown. | 勾选「场景激活时刷新浏览器」，每次切到该场景时计时器会重新开始。 |
| preview | Preview in a new tab | 在新标签页预览 |
| errorDuration | Set a duration between 1 second and 99:59:59. | 请设置 1 秒到 99:59:59 之间的时长。 |
| errorUntilPast | Pick a time in the future. | 请选择一个未来的时间。 |
| errorUntilTooFar | Pick a time within the next 99 hours. | 请选择 99 小时以内的时间。 |
| proLockedTitle | {template} is a Pro template | {template} 是 Pro 模板 |
| proLockedBody | Live links can use Pro templates with Time Overlay Pro. All free templates work in live links at no cost. | 开通 Time Overlay Pro 后，直播链接可以使用 Pro 模板。所有免费模板都可以免费用于直播链接。 |
| proLockedCta | Unlock Pro | 解锁 Pro |
| close | Close | 关闭 |

`{zone}`、`{w}`、`{h}`、`{template}` 都用 `.replace()` 替换。`{template}` 填模板的 `name` 字段。

---

## 10. 埋点（硬性）

先在 `src/lib/analytics/events.ts` 的 `AnalyticsEventName` 里加下面这些名字。生成器侧的事件用现有的 `trackEvent`。

| 事件 | 触发时机 | 属性 |
|---|---|---|
| `live_link_dialog_opened` | 对话框打开 | `templateId`、`isPro` |
| `live_link_copied` | 复制成功（复制失败走兜底时也算） | `mode`、`templateId`、`endBehavior`、`resolution`、`isPro`、`proTemplate`（布尔） |
| `live_link_preview_opened` | 点了预览 | `mode`、`templateId` |
| `live_link_pro_locked` | 出现 Pro 锁定框（同一次打开对话框只报一次） | `templateId` |

在线页只发**一个**事件，**直接调用 `posthog.capture`，不用 `trackEvent`**（在线页没有 GA）：

| 事件 | 属性 |
|---|---|
| `live_overlay_loaded` | `mode`、`templateId`（最终使用的模板）、`requestedTemplateId`、`endBehavior`、`resolution`、`hasLicense`、`warningsCount`、`preview`（布尔） |

**不要**在计时循环里发任何事件。

---

## 11. SEO 文案更新（`src/content/guides.ts`，硬性）

**英文 `add-countdown-to-obs`：**

1. 把 `intro` 整段替换为：
   > To add a timer overlay to OBS, you have two options. For a live countdown that runs in real time, copy an OBS live link from the Time Overlay generator and paste it into a Browser Source; nothing is exported and the background is transparent. For a designed countdown clip, export WebM with alpha and add it as a Media Source, or use a PNG sequence as an Image Slideshow Source when you want frame-accurate loops. No chroma key or green screen is needed either way.
2. 把 FAQ「Should an OBS countdown timer be a browser source or a media source?」的答案替换为：
   > Use a browser source when the timer should run live, count down to a set time, or restart every time a scene is shown. Time Overlay's OBS live link gives you that without exporting anything. Use a media source when you want a fixed transparent clip that plays the same way every time.
3. 在 `faqItems` 的**第一项**之前插入一项：
   - question: `How do I add a live countdown timer to OBS without a video file?`
   - answer: `Open the Time Overlay generator, pick a template, then choose OBS live link in the export panel. Pick countdown, count down to a time, or count up, copy the link, and in OBS add Sources → + → Browser. Paste the link into URL and set the width and height shown in the dialog. The timer renders live with a transparent background.`

**简体中文 `add-countdown-to-obs`：**

1. 在 `intro` 末尾追加一句：
   > 如果需要实时走动的倒计时，可以在生成器的导出面板中复制「OBS 直播链接」，粘贴到 OBS 的浏览器源，无需导出文件，背景同样透明。
2. 如果中文版有 `faqItems`，在第一项之前插入对应的中文问答；如果没有，就不加。

标题和 description **都不要改**（7/3 和 10/26 已经优化过）。

---

## 12. 文件清单和归属（越界改动＝不合格）

| 路径 | 动作 |
|---|---|
| `src/lib/live/live-timer-config.ts` | 新建 |
| `src/lib/live/live-timer-clock.ts` | 新建 |
| `src/app/(live)/layout.tsx` | 新建 |
| `src/app/(live)/live/page.tsx` | 新建 |
| `src/components/live/live-timer-overlay.tsx` | 新建 |
| `src/components/generator/live-link-dialog.tsx` | 新建 |
| `src/content/live-link.ts` | 新建 |
| `src/lib/generator/render-frame.ts` | 只加 `textOverride`（见 6.3） |
| `src/lib/pro/client.ts` | 只加 `getStoredProToken`（见 8.4） |
| `src/components/generator/export-panel.tsx` | 只加入口按钮和 `onOpenLiveLink` 属性 |
| `src/components/generator/generator-shell.tsx` | 只做 8.2 里的三处改动 |
| `src/instrumentation-client.ts` | 只做 7.5 的改动 |
| `src/lib/analytics/events.ts` | 只加事件名 |
| `src/content/guides.ts` | 只做第 11 节的改动 |
| `tests/**` | 新建第 13 节列出的测试文件；**不许改现有测试的断言** |
| 其他所有文件 | ❌ 不许动。特别是 `templates.ts`、`template-decorators.ts`、`defaults.ts`、`src/workers/**`、`src/app/api/**`、`package.json`、`pnpm-lock.yaml`、`src/proxy.ts`、`src/lib/site.ts` |

---

## 13. 测试

### 13.1 单元测试（硬性，`pnpm test -- --run` 必须全部通过）

`tests/lib/live-timer-config.test.ts`，至少包括：

1. 参数全空 → 默认配置（countdown、300、center-mono），warnings 为空。
2. 完整的合法链接 → 每个字段都正确解析。
3. `mode=until` 但没写 `until` → 退回 countdown 300，有 1 条警告。
4. `until=2026-10-26T20:00:00+08:00`（`+` 被变成空格的情况）也能正确解析。
5. `until=2026-10-26T20:00` 这种不带时区的 → 判为不合法。
6. `duration` 取 0、360000、`abc`、`12.5` → 都判为不合法，用默认值。
7. `color` 取 `#F8FAFC`（带 #）、`F8FA`、`GGGGGG` → 不合法；取 `f8fafc` → 解析成 `#F8FAFC`。
8. `template=not-a-template` → 用默认模板，有警告。
9. `mode=until&end=loop` → end 按 hold 处理，有警告。
10. `message` 里有控制字符、超过 40 个字符 → 清理并截断。
11. 有不认识的参数 `room=abc` → 忽略，**不产生**警告。
12. **往返测试**：对每种 mode 和每种 end，都检查 `parseLiveTimerParams(new URL(buildLiveTimerUrl(o, cfg)).searchParams).config` 和 `cfg` 深度相等。
13. `buildLiveTimerUrl` 第一个参数是 `v=1`；非 countdown 模式不写 `duration`；非 Pro 情况不写 `license`；永远不写 `preview`。
14. `liveConfigFromGeneratorSettings` 能把背景是透明还是纯色正确对应上。
15. `generatorSettingsFromLiveConfig`：null 字段用模板默认值，非 null 字段覆盖模板默认值。

`tests/lib/live-timer-clock.test.ts`，至少包括：

1. countdown 300：elapsed 0 → 300；0.2 秒 → 300；1.0 秒 → 299；299.5 秒 → 1；300 秒 → 进入结束行为。
2. 四种结束行为在结束后分别返回 digits 0、hidden、message、以及 loop 的「重新从 300 开始」（elapsed 300.5 → 300）。
3. until：目标在 10 秒后 → 10；目标已经过去 → 进入结束行为。
4. countup：elapsed 59.9 → 59；elapsed 极大 → 最大到 359999。
5. 格式升级：ss 遇到 99 → ss；100 → mm:ss；mm:ss 遇到 5999 → mm:ss；6000 → hh:mm:ss。
6. 超过 99 小时 → 显示 359999。
7. `liveFrameKey` 在同一秒内保持稳定，跨秒才变化。

`tests/lib/render-frame-text-override.test.ts`：

1. 不传 `textOverride` 时结果和现在完全一样（对比现有输出）。
2. 传了 `textOverride: "LIVE NOW"` 时，`state.text === "LIVE NOW"`。

`tests/generator/live-link-dialog.test.tsx`（参考 `tests/generator/pro-paywall-modal.test.tsx` 的写法）：

1. `open=false` 时什么都不渲染。
2. 默认是 countdown 模式，链接里有 `duration=<settings 的时长>`。
3. 切到 until 并填一个过去的时间 → 出现错误提示，COPY 被禁用。
4. 非 Pro 用户 + Pro 模板 → 出现锁定框，点按钮会调用 `onUnlockPro`。
5. Pro 用户 + Pro 模板 + 有 token → 链接里带 `license=`。
6. `locale="zh-hans"` 时显示中文文案。
7. 点 COPY → 调用 `navigator.clipboard.writeText`（mock），按钮文字变成 Copied。

### 13.2 手工 QA（硬性，PR 里要附截图或录屏）

环境：OBS Studio 30 及以上，**Windows 11 和 macOS 各测一遍**；Streamlabs Desktop 至少在 Windows 上测一遍。

本地测试方法：`pnpm build && pnpm start`，然后在 OBS 里用 `http://localhost:3000/live?...` 测试。

| # | 操作 | 期望 |
|---|---|---|
| 1 | 4.3 节表格里的 5 个场景，各测一遍 | 显示和结束行为都正确 |
| 2 | 把浏览器源放在一张彩色图片上面 | 计时器以外的区域完全透明，看不到黑边或白边 |
| 3 | 选纯色背景的模板，比如 `webinar-slate` | 显示背景色 |
| 4 | 分辨率分别用 4K（`landscape-2160`）和竖屏（`portrait-1080`），OBS 来源设成对应宽高 | 字清楚，位置正确 |
| 5 | 勾选「场景激活时刷新浏览器」，来回切换场景 | 每次切回来，倒计时都从头开始 |
| 6 | until 模式开着跑 2 小时，和手机时钟对比 | 误差不超过 1 秒 |
| 7 | 正常运行时看 OBS 的 CPU 占用 | 和没有这个来源时相比，增加不超过 2% |
| 8 | 网址乱写（比如 `?mode=xx&color=zz`） | 显示默认 5 分钟倒计时，不白屏；加上 `&debug=1` 能看到警告 |
| 9 | 用 Pro 模板但不带 license | 最多 1 秒后切换成 center-mono，计时不中断 |
| 10 | 浏览器开发者工具的 Console | `/live` 页面没有 CSP 报错 |
| 11 | 在 Network 面板里查看 `/live` 页面 | 没有任何 googlesyndication、googletagmanager、clarity、ahrefs 的请求 |
| 12 | 在生成器里打开对话框，换模板、换模式、复制 | 链接实时更新；复制以后粘贴进 OBS 能正常工作 |
| 13 | 在手机上打开生成器 | 看不到 OBS 链接入口 |
| 14 | 用 Google 的富媒体测试工具或者看源码检查 `/live` | 有 `noindex` |

---

## 14. 验收标准（全部满足才算完成）

- [ ] 第 12 节以外的文件没有任何改动（`git diff --stat main` 自查）
- [ ] `pnpm test -- --run` 全部通过，新加的测试用例数量不少于第 13.1 节列出的数量
- [ ] `pnpm lint` 0 个 error，并且没有新增 warning
- [ ] `npx tsc --noEmit -p .` 没有报错
- [ ] `pnpm build` 成功，构建输出里有 `/live`
- [ ] 第 13.2 节 14 项手工 QA 全部通过，PR 里附 Windows 和 macOS 的 OBS 截图（至少 3 张：透明叠加效果、until 结束显示文字、对话框）
- [ ] 对话框的样式和第 8.3 节一致（评审会逐项对照）
- [ ] 第 9 节的文案一字不差

---

## 15. 交付流程

1. 从最新的 main 拉分支：`git checkout main && git pull && git checkout -b feat/obs-live-link`
2. **建议**按这个顺序提交，每步一个 commit：
   1. `feat(live): live timer config and clock (pure functions + tests)`
   2. `feat(live): /live overlay route with isolated root layout`
   3. `feat(generator): OBS live link dialog`
   4. `docs(seo): mention OBS live link in OBS guide`
3. 开 PR，描述里写清楚：做了什么、手工 QA 表格（每项写通过或不通过，附截图）、和本 spec 有出入的地方及原因。
4. **不要自己发布上线。** 合并以后由 Sean 跑 `pnpm release:solo`。

预计工作量：3–4 天（纯函数和测试 1 天，在线页 0.5 天，对话框 1 天，QA 和修改 1 天）。

---

## 16. 第二期预告（这次不做，但要给它留好位置）

第二期做「手机遥控」（Pro）：链接里多一个 `room=<id>`，在线页每 1–2 秒轮询 `/api/live/rooms/<id>`，拿到 `{ startedAtEpochMs, pausedRemainingMs, message }`，用来覆盖本地计时。所以这一期**必须**做到：

- 解析器忽略不认识的参数（第 5.3 节）。
- `computeLiveFrame` 是纯函数，只依赖传进来的时钟参数，不在里面读全局状态。第二期只需要换一种方式算出 `elapsedMs`。

---

## 17. 实习生常见问题

- **为什么不用 `useSearchParams`？** 它在 Next 16 里需要 Suspense 边界，还容易造成服务端和客户端渲染结果不一致。我们只需要在浏览器里读一次参数，`window.location.search` 最简单。
- **为什么不每帧都重画？** 4K canvas 每秒重画 60 次会明显增加 OBS 的 CPU 占用。显示的数字每秒才变一次，就只画一次。
- **为什么 countdown 用 `performance.now()`，until 却用 `Date.now()`？** `performance.now()` 不受系统改时间影响，适合算「过了多久」；until 要对齐真实世界的时刻，只能用系统时间。
- **canvas 为什么不跟着窗口大小变？** 模板的布局是按分辨率预设设计的。canvas 固定为预设尺寸，再用 CSS 缩放，看到的效果就和生成器预览完全一样。OBS 里把来源宽高设成同样的尺寸，就是 1:1 的像素，最清晰。
- **在普通浏览器里打开 `/live`，背景是白的？** 正常现象。普通浏览器窗口本身不透明，在 OBS 里才是透明的。要看透明效果，在链接后面加 `&preview=1`。
- **模板长得不对？** 先用 `&debug=1` 看有没有警告，再和生成器里同样设置的预览做对比。在线页和预览用的是同一套渲染函数，不应该有任何差别；有差别就说明 settings 的转换写错了。
