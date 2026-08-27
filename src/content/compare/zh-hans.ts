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
    "Premiere Pro 和 DaVinci Resolve 用户可先选 PNG 序列：两者都有图像序列工作流，并能保留导出的 alpha 通道。Final Cut Pro 用户可使用带 HEVC alpha 的 MOV，或把 PNG 帧转换为 ProRes 4444。OBS 和 Streamlabs 更适合使用带 alpha 的 WebM 单文件。CapCut 的支持会随平台和版本变化，长时间导出前请先测试短片段。下表会把已有文档依据的路径与需要在具体环境中验证的格式分开。",
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
        "专业剪辑中最稳妥的浏览器直出格式。Premiere Pro 和 DaVinci Resolve 都有图像序列导入流程，PNG 可保留无损透明通道。",
      weakness:
        "它是一组帧而不是单个视频。Final Cut 和 CapCut 可能需要其他静帧或转换流程，交付前应检查时序。",
      verdict:
        "Premiere 或 Resolve 用户可优先选择。Final Cut 用户若要时间线可直接使用的单文件，建议转为 ProRes 4444。",
    },
    "webm-vp8": {
      name: "WebM（VP8 + alpha）",
      bestFor:
        "快速直播叠加。可作为背景已抠除的媒体源放入 OBS 和 Streamlabs，播放负担较低。",
      weakness:
        "alpha 边缘比 VP9 更压缩；Adobe、Blackmagic 和 Apple 的文档不足以证明这种 WebM alpha 文件是可靠的原生剪辑路径。",
      verdict:
        "直播场景的快速单文件路径。用于剪辑时，请选择 PNG 或有明确文档支持的专业编码。",
    },
    "webm-vp9": {
      name: "WebM（VP9 + alpha）",
      bestFor:
        "适合 OBS，以及已经验证 VP9 alpha 的浏览器工作流；相比 VP8 文件通常更小。",
      weakness:
        "Safari 无法导出；Premiere Pro、DaVinci Resolve 和 Final Cut Pro 都没有足够的原生 alpha 导入文档可作为可靠承诺。",
      verdict:
        "需要控制 OBS 素材体积时可选。交付专业剪辑软件时，使用 PNG 或 ProRes 4444。",
    },
    "mov-hevc": {
      name: "MOV（HEVC + alpha）",
      bestFor:
        "Apple 工作流。Apple 文档明确将带 alpha 的 HEVC 作为 Final Cut Pro 的透明媒体路径。",
      weakness:
        "只能在 macOS 的 Safari 17.4+ 中导出。Premiere、Resolve 和 CapCut 的兼容性应在本机具体版本中测试。",
      verdict:
        "在受支持 Mac 上用于 Final Cut 时，这是合适的直出单文件。其他场景请选择 PNG，或转换为有文档依据的编码。",
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
        "PNG 序列是较稳妥的浏览器直出剪辑格式，Premiere Pro 和 DaVinci Resolve 都有图像序列工作流。需要单个专业剪辑文件时，可把帧转换为 ProRes 4444；使用受支持 Mac 的 Final Cut 用户也可选择带 HEVC alpha 的 MOV。",
    },
    {
      question: "Final Cut Pro 支持哪种透明视频格式？",
      answer:
        "在受支持的 Mac 上，Final Cut Pro 可使用带 HEVC alpha 的 MOV，或把 PNG 序列转换为 ProRes 4444。Apple 文档明确这两种编码支持 alpha。除非已在你的具体版本中验证，不要依赖 WebM alpha 剪辑流程。",
    },
    {
      question: "OBS 应该使用哪种透明叠加格式？",
      answer:
        "OBS 或 Streamlabs 推荐导出 WebM（带 alpha），再作为媒体源添加。如果播放负担较重，可缩短叠加时长，或降低分辨率和帧率，然后在测试场景中检查循环与透明效果。",
    },
    {
      question: "透明计时器叠加一定需要 ProRes 4444 吗？",
      answer:
        "只有当你需要在专业剪辑软件中保留无损 alpha 母版时才需要。ProRes 4444 是用附带 ffmpeg 脚本从 PNG 序列转换而来。多数剪辑场景中，PNG 序列本身已经无损且足够。",
    },
  ],
} satisfies ComparePageContent;

export default zhHansCompareContent;
