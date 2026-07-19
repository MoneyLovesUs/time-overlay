import type { RootPageContent } from "@/content/root/types";

const zhHansRootPageContent = {
  metadata: {
    title: "透明倒计时叠加生成器 - 免费导出 PNG/WebM | Time Overlay",
    description:
      "Time Overlay 是免费的倒计时叠加生成器。在浏览器里预览透明计时器，并导出 PNG 序列或带 alpha 的 WebM，用于剪辑和直播。",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "制作透明倒计时叠加，实时预览，然后导出到你的视频项目。",
    intro: "第一次建议使用：`30s`、`PNG sequence`、`bottom-right`。",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Time Overlay 是面向创作者的免费倒计时叠加工具，适合在录屏、剪辑和直播中制作清晰易读的计时器素材。",
    header: {
      shellLabel: "公开界面",
      toolLinkLabel: "工具",
      faqLinkLabel: "FAQ",
      languagePickerLabel: "语言",
      primaryNavAriaLabel: "主导航",
    },
    footer: {
      systemRailLabel: "系统栏",
      publicStatusLabel: "公开状态",
      identityTitle: "身份",
      jumpTitle: "跳转",
      productTitle: "产品",
      navAriaLabel: "页脚导航",
      jumpLinks: [
        { anchorId: "tool", label: "生成器" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "格式" },
      ],
      productDescription:
        "一个本地优先的 Time Overlay 页面，包含倒计时素材生成器、精简 FAQ 和透明导出格式说明。",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "模板库",
      description: "从成熟版式开始，切换模板时保留时长和导出选项。",
      browseLabel: "浏览全部 48 款",
      searchPlaceholder: "搜索模板或使用场景",
      categoryLabels: {
        all: "全部",
        editing: "剪辑",
        streaming: "直播",
        social: "社交",
        events: "活动",
        fitness: "健身",
        cinematic: "电影感",
        minimal: "极简",
      },
      selectedLabel: "已选择",
      editedLabel: "已修改",
      resultTemplate: "{count} 款模板",
      noResults: "没有符合当前筛选条件的模板。",
      closeLabel: "关闭模板库",
    },
    themePresetPicker: {
      title: "主题预设",
      description: "先选一个起始风格，需要时再微调控制项。",
      presetLabels: {
        cyber: "赛博",
        minimal: "极简",
        mono: "等宽",
        neon: "霓虹",
        glow: "柔光",
        scanline: "扫描线",
        classic: "经典",
        retro: "复古 80s",
        glass: "玻璃",
        neumorphic: "拟物柔面",
      },
    },
    controlPanel: {
      title: "控制",
      subtitle: "输入面板",
      timerSetupTitle: "计时器设置",
      durationLabel: "时长（秒）",
      displayFormatLabel: "显示格式",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "画布",
      resolutionPresetLabel: "分辨率预设",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "背景模式",
      styleTitle: "样式",
      fontFamilyLabel: "字体",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "锚点",
      anchorOptions: {
        "top-left": "左上",
        "top-center": "上方居中",
        "top-right": "右上",
        "center-left": "左侧居中",
        center: "居中",
        "center-right": "右侧居中",
        "bottom-left": "左下",
        "bottom-center": "下方居中",
        "bottom-right": "右下",
      },
      transparentOptionLabel: "透明",
      solidOptionLabel: "纯色",
      audioTitle: "音频",
      audioVariantLabel: "音频提示",
      audioVariantOptions: {
        none: "无",
        tick: "每秒滴答",
        beep: "结束提示音",
        "tick-and-beep": "滴答 + 结束提示音",
      },
      audioNote: "音频会写入带 alpha 的 WebM 导出。PNG 序列不包含声音。",
    },
    previewPanel: {
      title: "预览",
      subtitle: "实时画布",
      playButton: "播放预览",
      pauseButton: "暂停",
      resetButton: "重置",
      safeAreaOnButton: "开启安全区",
      safeAreaOffButton: "关闭安全区",
      currentReadoutLabel: "当前读数",
    },
    exportPanel: {
      title: "导出",
      subtitle: "输出区",
      outputFormatTitle: "输出格式",
      pngSequenceLabel: "PNG 序列",
      pngSequenceDescription: "对剪辑软件和透明交付最稳妥。",
      webmLabel: "WebM（带 alpha）",
      webmDescription:
        "透明 VP8 视频。可作为背景已抠除的视频层放入 OBS、Premiere、DaVinci、CapCut 和 Streamlabs。",
      vp9AlphaLabel: "WebM（VP9 + alpha）",
      vp9AlphaDescription:
        "适合 Premiere、DaVinci Resolve、Final Cut 和 CapCut 的透明视频。",
      hevcAlphaLabel: "MOV（HEVC + alpha）",
      hevcAlphaDescription: "Apple 工作流友好的透明视频，最适合 Safari 和 macOS。",
      fpsLabel: "帧率",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "质量",
      launchNoteTitle: "发布说明",
      launchNoteFallback:
        "导出保持本地优先。如果当前浏览器不支持某种格式，界面会引导你改用 PNG 序列。",
      exportButtonIdle: "导出素材",
      exportButtonBusy: "正在导出...",
      exportStatusTitle: "导出状态",
      exportStatusIdle: "空闲。选择格式后开始本地导出。",
      qualityOptions: {
        standard: "标准",
        high: "高质量",
      },
      advisoryMessages: {
        workerSupportError:
          "这个浏览器无法启动后台 worker，因此本地视频导出已禁用。请在现代桌面浏览器中使用 PNG 序列。",
        webmUnavailableError:
          "当前浏览器不支持 WebM 导出（Safari 17 之前支持有限）。这里推荐使用 PNG 序列。",
        vp9AlphaUnavailableError:
          "当前浏览器不支持 WebM VP9 + alpha。请尝试 Chrome、Edge 或 Firefox 130+ 来导出透明视频。",
        hevcAlphaUnavailableError:
          "MOV HEVC + alpha 需要 macOS 上的 Safari 17.4+。其他平台请使用 WebM VP9 + alpha。",
        heavyExportWarning:
          "这次导出可能会占用较多内存和 CPU。如果浏览器吃力，建议改用 720p、30 秒以内或 PNG 序列。",
        pngSequenceInfo:
          "PNG 序列是最可靠的本地优先剪辑交付格式，尤其适合需要透明通道的场景。",
        vp9AlphaInfo:
          "WebM VP9 + alpha 是现代剪辑软件中推荐的透明视频格式。",
        hevcAlphaInfo:
          "MOV HEVC + alpha 是 Final Cut Pro 推荐的透明视频格式。",
      },
      runtimeMessages: {
        exportReadyTemplate: "导出完成：{fileName}",
        preparingWebm: "正在准备本地 WebM 导出",
        preparingPngSequence: "正在准备本地 PNG 序列导出",
        preparingAlphaVideo: "正在准备透明视频导出",
        exportWorkerUnavailable: "当前浏览器会话中无法使用导出 worker。",
        webmFailedUnexpectedly: "WebM 导出意外失败。",
        alphaVideoFailedUnexpectedly: "透明视频导出意外失败。",
        pngSequenceFailedUnexpectedly: "PNG 序列导出意外失败。",
      },
      progress: {
        remainingTemplate: "剩余 {time}",
        previewLabel: "实时预览",
        elapsedLabel: "正在生成叠加素材",
        tips: [
          "所有帧都在你的浏览器本地渲染，不会离开这台设备。",
          "PNG 序列可稳定导入 Premiere、DaVinci Resolve、Final Cut 和 CapCut。",
          "保持当前标签页在前台，导出速度通常更快。",
          "透明导出可直接叠到素材上，不需要绿幕抠像。",
        ],
        desktopNote:
          "提示：导出在桌面浏览器上最稳定。手机端建议使用 PNG 序列，或在电脑上打开这个页面。",
        fallbackSuggestionTemplate: "建议：改试 {format}。",
        stageLabels: {
          validating: "正在准备导出",
          rendering: "正在渲染帧",
          encoding: "正在编码视频",
          packaging: "正在打包文件",
          complete: "完成",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "工具说明",
    heading: "一个倒计时叠加工具，加上真正落地所需的格式判断。",
    description:
      "这是一个本地优先的倒计时叠加生成器，用来制作清晰易读的透明计时器素材。你可以在上方设置时长、样式、位置和导出格式，再根据下方说明选择适合真实剪辑项目的交付方式。",
    exportFormatsTitle: "导出格式",
    exportFormatsPngText:
      "当你需要透明帧或剪辑软件友好的图像素材时，PNG 序列是最可靠的倒计时叠加导出方式。",
    exportFormatsWebmText:
      "WebM（带 alpha）是单文件透明倒计时视频。VP8 输出可以作为背景已抠除的视频层放入 Premiere、DaVinci、CapCut、OBS 和 Streamlabs。",
    workflowEyebrow: "工作方式",
    workflowHeading: "倒计时叠加导出如何工作",
    workflowSteps: [
      {
        title: "设置倒计时叠加的时长和布局",
        body:
          "从上方生成器开始。选择总时长，挑一个清晰的倒计时布局，并把叠加层放在不会遮挡游戏画面、产品素材或人物画面的区域。",
      },
      {
        title: "为画面选择合适的计时器样式",
        body:
          "调整字体、对比度、缩放和位置，让叠加层像是画面设计的一部分，而不是临时贴上去的元素。优秀的计时器通常使用醒目的数字、稳定的间距，并与画面边缘保持呼吸感。",
      },
      {
        title: "导出适合剪辑软件的透明格式",
        body:
          "如果要在 Premiere、DaVinci 或 Final Cut 中获得最稳妥的透明通道，导出 PNG 序列。如果想要一个可直接拖入 CapCut 或 OBS 的透明视频文件，导出 WebM（带 alpha）。",
      },
    ],
    usageEyebrow: "使用方式",
    usageHeading: "如何在视频中使用 Time Overlay",
    usageNotes: [
      "打开生成器，设置计时器长度，并在导出前预览叠加效果。",
      "如果你要在 CapCut、Premiere Pro、Final Cut Pro、DaVinci Resolve 或偏好图像素材的流程中使用透明计时器，优先选择 PNG 序列。",
      "如果你想得到一个用于 OBS、Streamlabs 或快速社媒剪辑的单文件透明倒计时视频，选择 WebM（带 alpha）。",
      "让叠加层保持简短、高对比，并避开字幕和人脸构图区域，这样在移动端观看时也能读清。",
    ],
    usageCta: {
      beforeFirstLink: "先从",
      firstLinkLabel: "实时倒计时叠加生成器",
      betweenLinks: "开始；如果还在比较透明帧和单文件视频，请继续看",
      secondLinkLabel: "倒计时叠加导出指南",
      afterSecondLink: "。",
    },
    aboutEyebrow: "关于",
    aboutHeading: "关于 Time Overlay",
    aboutPoints: [
      "Time Overlay 是一个本地优先的倒计时叠加生成器，适合不想把素材上传到远程渲染服务的创作者。",
      "页面刻意保持紧凑：一个可用的工具界面、一个导出说明区，以及一个回答真实使用问题的帮助区。",
      "它既能作为实际生产工具，也能覆盖视频剪辑中常见的搜索需求，例如计时器叠加、透明倒计时叠加、屏幕计时器和视频倒计时 overlay。",
    ],
    aboutCta: {
      beforeLink: "如果你想先解决实际顾虑，可以直接跳到",
      linkLabel: "计时器叠加 FAQ",
      afterLink: "。",
    },
    faqTitle: "FAQ",
    faqSubtitle: "倒计时叠加基础问题",
    faqItems: [
      {
        question: "如何给视频添加倒计时叠加？",
        answer:
          "在上方生成器里设置时长和样式，然后导出。需要最稳定的透明计时器时选择 PNG 序列；需要单文件透明视频时选择 WebM（带 alpha），再把它放到 CapCut、Premiere Pro、Final Cut Pro、DaVinci Resolve 或 OBS 中素材上方的图层。",
      },
      {
        question: "可以为 OBS 或 Twitch 制作透明倒计时叠加吗？",
        answer:
          "可以。导出 WebM（带 alpha），然后在 OBS、Streamlabs 或 Twitch Studio 中作为视频层添加。背景已经被抠除，不需要额外绿幕抠像步骤。",
      },
      {
        question: "timer overlay 和 countdown overlay 有什么区别？",
        answer:
          "它们通常指同一类内容：叠在视频上方、从设定时长倒数到零的计时器。本工具生成的是倒计时叠加，你只要设置总秒数，选择 MM:SS 等显示格式，然后导出到剪辑软件即可。",
      },
      {
        question: "Time Overlay 可以导出带透明通道的素材吗？",
        answer:
          "可以。最稳妥的方式是 PNG 序列，因为剪辑软件通常比压缩视频更可靠地处理图像透明通道。WebM（带 alpha）则适合你想要一个单文件透明视频层的场景。",
      },
      {
        question: "第一次应该选择哪种导出格式？",
        answer:
          "如果你想要最可靠的交付，尤其是要叠到真实视频素材上，先选 PNG 序列。如果你想要一个可直接用于 CapCut、OBS 或 Streamlabs 的透明视频文件，再选 WebM（带 alpha）。",
      },
      {
        question: "这个计时器叠加是在服务器上渲染的吗？",
        answer:
          "不是。生成器是本地优先的。预览和导出都在你的设备上运行，所以它更像一个真实工具，而不是等待远程渲染队列的上传服务。",
      },
      {
        question: "什么样的计时器样式在视频里最清楚？",
        answer:
          "简单数字和强对比通常最好。等宽数字、克制的发光效果，以及谨慎的角落位置，比装饰性很强的皮肤更能在复杂画面上保持可读。",
      },
      {
        question: "它适合 TikTok、YouTube、CapCut 和 Premiere 吗？",
        answer:
          "适合。它支持短视频和剪辑流程常用的透明或图像序列导出；WebM（带 alpha）也覆盖 OBS、CapCut 和 Streamlabs 的快速本地视频导出，不需要额外合成步骤。",
      },
    ],
  },
  guidesSection: {
    eyebrow: "指南",
    heading: "如何在剪辑软件里添加倒计时叠加",
    intro:
      "这些分步指南会说明如何把透明倒计时叠加放进创作者真正使用的工具里。",
    links: [
      {
        slug: "add-countdown-to-obs",
        label: "在 OBS Studio 中添加倒计时叠加",
      },
      {
        slug: "add-countdown-to-premiere",
        label: "在 Premiere Pro 中添加透明计时器叠加",
      },
      {
        slug: "add-countdown-to-davinci-resolve",
        label: "在 DaVinci Resolve 中添加倒计时叠加",
      },
      {
        slug: "add-countdown-to-final-cut-pro",
        label: "在 Final Cut Pro 中添加倒计时叠加",
      },
      {
        slug: "transparent-overlay-for-twitch",
        label: "为 Twitch 制作透明倒计时叠加",
      },
      {
        slug: "png-to-prores",
        label: "把计时器 PNG 序列转换为 ProRes 4444",
      },
    ],
  },
} satisfies RootPageContent;

export default zhHansRootPageContent;
