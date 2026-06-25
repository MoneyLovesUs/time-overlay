import { CONTENT_YEAR } from "@/lib/site";

import type { ComparePageContent } from "./types";

const zhHansCompareContent = {
  metadata: {
    title: `视频剪辑透明计时器叠加导出格式对比（${CONTENT_YEAR}）`,
    description:
      "按剪辑软件、浏览器支持和透明质量对比透明计时器叠加导出格式：PNG 序列、带 alpha 的 WebM/MOV 和 ProRes 4444。",
  },
  breadcrumbLabel: "格式对比",
  eyebrow: "格式对比",
  h1: `${CONTENT_YEAR} 年各剪辑软件最适合的透明叠加导出格式`,
  leadAnswer:
    "对大多数剪辑软件来说，优先导出 PNG 序列：它是最可靠的透明计时器叠加格式，可无损导入 Premiere Pro、DaVinci Resolve、Final Cut Pro 和 CapCut。需要单文件透明视频时，在 Chrome 或 Firefox 工作流和 OBS 中使用 WebM（VP9 + alpha）；在 Safari 和 macOS 上使用 MOV（HEVC + alpha），它是 Final Cut Pro 更原生的选择。只有当你需要在专业剪辑软件中保留无损母版时，才把 PNG 序列转换为 ProRes 4444。下表按剪辑软件支持、浏览器支持和透明质量对比 Time Overlay 的所有导出格式。",
  tableCaption: `${CONTENT_YEAR} 年透明计时器叠加导出格式的剪辑软件和浏览器支持对比。`,
  columns: {
    format: "格式",
    transparency: "透明质量",
    browsers: "可导出浏览器",
    bestFor: "最适合",
  },
  transparencyLabels: {
    lossless: "无损",
    high: "高",
    compressed: "压缩",
  },
  supportLabels: {
    native: "原生",
    works: "可用",
    unreliable: "不稳定",
    unsupported: "不支持",
    "n/a": "—",
  },
  editorLabels: {
    premiere: "Premiere Pro",
    davinci: "DaVinci Resolve",
    finalcut: "Final Cut Pro",
    capcut: "CapCut",
    obs: "OBS / Streamlabs",
  },
  browserLabels: {
    chrome: "Chrome",
    edge: "Edge",
    firefox: "Firefox",
    safari: "Safari",
  },
  formats: {
    "png-sequence": {
      name: "PNG 序列",
      bestFor:
        "所有剪辑软件的默认首选。提供母版级、无损的透明通道，Premiere、DaVinci 和 Final Cut 都能作为图像序列原生导入。",
      weakness:
        "占用磁盘空间最大，而且是一组帧文件而不是单个文件。不包含音频。",
      verdict:
        "除非你明确需要单个视频文件，否则先选它。它是最可靠的透明交付方式，并且可在所有浏览器中导出。",
    },
    "webm-vp8": {
      name: "WebM（VP8 + alpha）",
      bestFor:
        "快速直播叠加。可作为背景已抠除的媒体源放入 OBS 和 Streamlabs，播放负担较低。",
      weakness:
        "alpha 边缘比 VP9 更压缩；Safari 17 之前和 macOS 上的 Final Cut Pro 中不够可靠。",
      verdict:
        "直播场景的快速单文件路径。用于剪辑时，更建议选择 VP9 或 PNG 序列。",
    },
    "webm-vp9": {
      name: "WebM（VP9 + alpha）",
      bestFor:
        "面向 Chrome、Edge、Firefox 130+ 工作流、OBS、CapCut、Premiere 或 DaVinci 的单文件透明视频。",
      weakness:
        "Safari 无法导出，macOS 上 Final Cut Pro 播放不稳定。",
      verdict:
        "非 Apple 平台上最好的单文件透明格式。在 macOS 上优先考虑 HEVC 或 PNG。",
    },
    "mov-hevc": {
      name: "MOV（HEVC + alpha）",
      bestFor:
        "Apple 工作流。它是 Final Cut Pro 的原生透明视频选择，在 macOS 上的 Premiere 和 DaVinci 中也很干净。",
      weakness:
        "只能在 macOS 的 Safari 17.4+ 中导出，Chrome、Edge 和 Firefox 不支持。",
      verdict:
        "如果你在 Mac 上使用 Safari，这是正确的单文件格式。离开 Apple 生态时使用 VP9。",
    },
    "prores-4444": {
      name: "ProRes 4444（通过 ffmpeg）",
      bestFor:
        "在 Premiere、DaVinci 或 Final Cut 中保存无损 alpha 母版，由 PNG 序列通过附带脚本转换而来。",
      weakness:
        "不是浏览器直接导出的格式，文件体积极大。不适合 CapCut 或直播软件。",
      verdict:
        "只有需要专业剪辑软件中的真正无损母版时才使用。其他情况下 PNG 序列已经足够。",
    },
  },
  benchmarkPendingNote: "文件大小和导出耗时会按版本测量，记录完成后发布在这里。",
  benchmarkTestedTemplate: "已测试 · {config}",
  bestForLabel: "最适合：",
  watchOutLabel: "注意：",
  markdownComparisonHeading: "对比",
  markdownFormatNotesHeading: "格式说明",
  ctaGeneratorLabel: "打开 Time Overlay 生成器",
  ctaGuidesLabel: "查看剪辑软件指南",
  faqTitle: "格式 FAQ",
  faqItems: [
    {
      question: "视频剪辑中最好的透明计时器叠加格式是什么？",
      answer:
        "PNG 序列是剪辑中最可靠的透明计时器叠加格式。Premiere Pro、DaVinci Resolve 和 Final Cut Pro 都能原生导入，并保留无损、明确的 alpha 通道。只有当你明确想要单个视频文件而不是一组帧时，再使用 WebM（VP9 + alpha）或 MOV（HEVC + alpha）。",
    },
    {
      question: "Final Cut Pro 支持哪种透明视频格式？",
      answer:
        "在 macOS 上，Final Cut Pro 推荐使用 PNG 序列或 MOV（HEVC + alpha）。WebM 在 Final Cut 内播放一直不够可靠，因此应避免 VP8/VP9 WebM。HEVC + alpha 可从 Safari 17.4+ 导出，并作为原生透明媒体导入。",
    },
    {
      question: "OBS 应该使用哪种透明叠加格式？",
      answer:
        "OBS 或 Streamlabs 推荐导出 WebM（带 alpha），它可以作为背景已抠除的媒体源直接添加。如果播放负担较重，可改用 PNG 序列并通过图片幻灯片源载入，透明效果相同。",
    },
    {
      question: "透明计时器叠加一定需要 ProRes 4444 吗？",
      answer:
        "只有当你需要在专业剪辑软件中保留无损 alpha 母版时才需要。ProRes 4444 是用附带 ffmpeg 脚本从 PNG 序列转换而来。多数剪辑场景中，PNG 序列本身已经无损且足够。",
    },
  ],
} satisfies ComparePageContent;

export default zhHansCompareContent;
