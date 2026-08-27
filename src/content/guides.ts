import type { EnabledLocale } from "@/lib/i18n";
import type { GUIDE_SLUGS } from "@/lib/site";

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type GuideStep = {
  title: string;
  body: string;
};

export type GuideFaqItem = {
  question: string;
  answer: string;
};

export type GuideBaseContent = {
  title: string;
  description: string;
  intro: string;
  recommendedFormat: string;
  steps: readonly GuideStep[];
  closer: string;
  faqTitle?: string;
  faqItems?: readonly GuideFaqItem[];
};

export type GuideSource = {
  label: string;
  publisher: string;
  href: string;
};

export type GuideTroubleshootingItem = {
  symptom: string;
  resolution: string;
};

export type GuideEvidence = {
  publishedAt: string;
  reviewedAt: string;
  reviewNote: string;
  workflowTitle: string;
  workflowCaption: string;
  workflowStages: readonly [string, string, string];
  verificationHeading: string;
  verificationItems: readonly string[];
  troubleshootingHeading: string;
  troubleshootingItems: readonly GuideTroubleshootingItem[];
  sourcesHeading: string;
  sourcesIntro: string;
  sources: readonly GuideSource[];
  relatedHeading: string;
  relatedSlugs: readonly GuideSlug[];
};

export type GuideContent = GuideBaseContent & GuideEvidence;

export type GuideChromeContent = {
  eyebrow: string;
  recommendedExportPrefix: string;
  openGeneratorLabel: string;
  stepLabelTemplate: string;
  tipsHeading: string;
  compareCtaBefore: string;
  compareCtaLabel: string;
  compareCtaAfter: string;
  markdownRecommendedExportLabel: string;
  markdownStepsHeading: string;
  markdownTipsHeading: string;
};

export type GuideLocaleContent = {
  chrome: GuideChromeContent;
  guides: Record<GuideSlug, GuideBaseContent>;
};

export const guideContentLocales = ["en", "zh-hans"] as const satisfies readonly EnabledLocale[];
export type GuideContentLocale = (typeof guideContentLocales)[number];

function formatStepLabel(template: string, index: number): string {
  return template.replace("{number}", String(index + 1).padStart(2, "0"));
}

export function renderGuideStepLabel(chrome: GuideChromeContent, index: number): string {
  return formatStepLabel(chrome.stepLabelTemplate, index);
}

const enGuideChrome: GuideChromeContent = {
  eyebrow: "Time Overlay guide",
  recommendedExportPrefix: "Recommended Time Overlay export:",
  openGeneratorLabel: "Open the Time Overlay generator",
  stepLabelTemplate: "Step {number}",
  tipsHeading: "Time Overlay tips",
  compareCtaBefore: "Not sure which export format to pick? ",
  compareCtaLabel:
    "Compare every transparent overlay format by editor and browser support",
  compareCtaAfter: ".",
  markdownRecommendedExportLabel: "Recommended export",
  markdownStepsHeading: "Steps",
  markdownTipsHeading: "Tips",
};

const enGuides: Record<GuideSlug, GuideBaseContent> = {
  "add-countdown-to-obs": {
    title: "OBS Timer Overlay: Add a Transparent Countdown Timer to OBS",
    description:
      "Add a transparent countdown timer overlay to OBS Studio with WebM alpha as a Media Source, plus a PNG sequence fallback for precise loops.",
    intro:
      "To add a timer overlay to OBS, export a transparent countdown from Time Overlay and add the file as a source. Use WebM with alpha as a Media Source for the simplest OBS timer overlay, or use a PNG sequence as an Image Slideshow Source when you want frame-accurate loops. Both routes keep the background already cut out, so you do not need chroma key or a green screen.",
    recommendedFormat:
      "WebM (with alpha) for most OBS scenes. PNG sequence when you want frame-accurate loops or maximum quality.",
    steps: [
      {
        title: "Set the countdown duration and OBS canvas size",
        body:
          "Open the Time Overlay generator, pick a duration that matches your starting soon, break, or challenge scene, then set the canvas to the same resolution OBS is recording or streaming at.",
      },
      {
        title: "Place the timer where it will not block the stream",
        body:
          "Choose a corner or lower-third placement that avoids your webcam, chat box, captions, and game UI. Simple digits with strong contrast are easier to read after stream compression.",
      },
      {
        title: "Export WebM with alpha for OBS",
        body:
          "Choose 'WebM (with alpha)' from the export panel. The output is a transparent VP8 WebM file that OBS can read directly as a Media Source with the background already removed.",
      },
      {
        title: "Add the timer overlay as a Media Source",
        body:
          "In OBS, add a Media Source, browse to the downloaded .webm, and enable Loop if the timer should repeat. Resize the source on the OBS canvas until it reads clearly without covering the main action.",
      },
      {
        title: "Use PNG sequence if WebM playback is unstable",
        body:
          "If your OBS setup stutters on WebM playback, export a PNG sequence instead and load it through an Image Slideshow Source. This keeps the same transparency but shifts the work from video decoding to image playback.",
      },
      {
        title: "Record a short test before going live",
        body:
          "Start a local OBS recording for 10 to 20 seconds. Confirm the timer composites cleanly over the scene, stays readable at stream bitrate, and restarts at the moment you expect.",
      },
    ],
    closer:
      "For most creators, the honest choice is WebM first and PNG sequence second. WebM is easier because it is one transparent video file. PNG sequence is better when you need exact frame control, want to avoid codec issues, or plan to reuse the countdown as a high-quality transparent asset outside OBS.",
    faqTitle: "OBS timer overlay questions",
    faqItems: [
      {
        question: "What is the best timer overlay format for OBS?",
        answer:
          "WebM with alpha is the best first choice for OBS because it is a single transparent video file that works as a Media Source. Use a PNG sequence when WebM playback stutters, when you need frame-accurate loops, or when maximum visual quality matters more than convenience.",
      },
      {
        question: "How do I make a timer overlay transparent in OBS?",
        answer:
          "Export the timer from Time Overlay with a transparent background, then add the WebM file as a Media Source or the PNG sequence as an Image Slideshow Source. The alpha channel is already in the export, so OBS does not need chroma key, luma key, or a green-screen color.",
      },
      {
        question: "Should an OBS countdown timer be a browser source or a media source?",
        answer:
          "Use a browser source when you need a live, remote-controlled timer that changes during the stream. Use a media source when you want a designed transparent countdown asset that is predictable, local, and easy to reuse across scenes.",
      },
      {
        question: "Can OBS loop a transparent countdown timer overlay?",
        answer:
          "Yes. Add the exported WebM as a Media Source and enable Loop if the countdown should repeat. For scene-based countdowns, also test when the source starts so the first visible frame lines up with your stream transition.",
      },
    ],
  },
  "add-countdown-to-premiere": {
    title: "How to add a transparent countdown timer in Premiere Pro",
    description:
      "Add a transparent countdown timer to Adobe Premiere Pro with a numbered Time Overlay PNG sequence, plus an optional ProRes 4444 single-file master.",
    intro:
      "To add a transparent countdown timer in Premiere Pro, import the numbered Time Overlay PNG frames as one image-sequence clip and place that clip above your footage. PNG is the documented, reliability-first path: every frame is lossless and carries an explicit alpha channel. If the project requires one master file, convert the same frames to ProRes 4444 before import rather than assuming that a WebM file will decode natively.",
    recommendedFormat:
      "PNG sequence for direct import. ProRes 4444 when the project requires one master clip.",
    steps: [
      {
        title: "Generate the overlay",
        body:
          "In Time Overlay, set the duration to match your edit beat, pick a style preset that fits your project tone, and pick your export format based on the quality you need.",
      },
      {
        title: "Import into Premiere",
        body:
          "Choose File -> Import, select only the first numbered PNG frame, enable 'Image Sequence', and confirm. Premiere then interprets the numbered stills as one video clip.",
      },
      {
        title: "Place above the base footage",
        body:
          "Drop the clip on V2 or higher above your main footage on V1. The countdown composites with the alpha intact and you can scale or reposition with Motion controls.",
      },
      {
        title: "Adjust scale and position",
        body:
          "Use the Effect Controls panel to scale and position the overlay. Apply a small drop shadow if the timer needs more separation from busy backgrounds.",
      },
    ],
    closer:
      "If a folder of frames is inconvenient on a long timeline, convert the PNG sequence to ProRes 4444 with the bundled `convert-to-prores` script and use that master clip instead. Keep the PNG source until the final composite has been checked.",
  },
  "add-countdown-to-davinci-resolve": {
    title: "How to add a transparent countdown timer in DaVinci Resolve",
    description:
      "Add a transparent countdown timer to DaVinci Resolve with a Time Overlay PNG sequence and stack the alpha clip above your base footage.",
    intro:
      "To add a transparent countdown timer in DaVinci Resolve, import the Time Overlay PNG sequence into the Media Pool and stack the resulting clip above your base footage. Blackmagic Design's current codec list explicitly documents PNG sequence decode with alpha support across supported desktop platforms. Because that list does not document WebM as an import container, this guide keeps PNG as the safe path instead of promising a codec-dependent shortcut.",
    recommendedFormat:
      "PNG sequence for documented alpha support and grading flexibility.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "Set up the Time Overlay generator with your duration, preset, resolution, and frame rate. Export the PNG sequence and keep the extracted frames in their original numbered order.",
      },
      {
        title: "Import into Resolve Media Pool",
        body:
          "Open the Media Storage or Import Media workflow, make sure numbered frames are grouped as a sequence, and add the sequence to the Media Pool. Confirm its clip frame rate before editing.",
      },
      {
        title: "Drop onto the timeline above base footage",
        body:
          "Stack the overlay on Video 2 above your Video 1 base clip. The alpha channel composites without further setup. Resolve respects the transparency through Color and Deliver pages.",
      },
      {
        title: "Trim and align",
        body:
          "Use the Edit page to position the countdown so the final frame lands on the cut you want. Resolve's snap-to-edit features make this fast.",
      },
    ],
    closer:
      "When you need to grade the overlay independently from the base footage, place it on its own video track and use Local Versions in Color page. The PNG sequence path preserves the cleanest alpha edge under aggressive grading.",
  },
  "add-countdown-to-final-cut-pro": {
    title: "How to add a transparent countdown timer in Final Cut Pro",
    description:
      "Add a transparent countdown timer to Final Cut Pro by converting a Time Overlay PNG sequence to a ProRes 4444 alpha master and connecting it above the storyline.",
    intro:
      "To add a transparent countdown timer in Final Cut Pro, export a lossless Time Overlay PNG sequence, convert those frames to one ProRes 4444 MOV, then connect the alpha clip above the primary storyline. Apple lists PNG stills and all Apple ProRes variants as supported media, and describes ProRes 4444 as suitable for alpha-bearing 4:4:4:4 sources. WebM is not a native Final Cut Pro container, so this workflow avoids it.",
    recommendedFormat: "PNG sequence as the source; ProRes 4444 MOV for the Final Cut timeline.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "In Time Overlay, pick a duration that aligns to your edit beat and a style preset that fits your project. Export 'PNG Sequence' from the export panel.",
      },
      {
        title: "Convert the frames to ProRes 4444",
        body:
          "Extract the PNG package and run the bundled convert-to-prores script. It uses FFmpeg to create one output.mov with a 4444 profile and an alpha-capable pixel format.",
      },
      {
        title: "Import and connect above the primary storyline",
        body:
          "Import output.mov, select it in the browser, and connect it above your base footage. The alpha channel controls the composite without a chroma key.",
      },
      {
        title: "Resize and align",
        body:
          "Use Transform controls to scale and position the overlay. Preview it over a non-black frame, verify the zero point, and retain the PNG source until final delivery is approved.",
      },
    ],
    closer:
      "Keep the original PNG sequence as the lossless source of truth. If the ProRes clip ever looks opaque or the timing changes, compare it against those frames, rerun the conversion with the correct frame rate, and inspect the result before replacing the timeline clip.",
  },
  "png-to-prores": {
    title: "How to convert a PNG sequence to ProRes 4444 with alpha (ffmpeg)",
    description:
      "Convert a Time Overlay PNG sequence to Apple ProRes 4444 with the alpha channel intact using the bundled script or a one-line ffmpeg command.",
    intro:
      "To convert a Time Overlay PNG sequence to ProRes 4444 with alpha, run the bundled conversion script or a one-line ffmpeg command - both keep the alpha and color quality in a single file editors prefer. The PNG sequence export already ships with that script for macOS, Linux, and Windows.",
    recommendedFormat: "PNG sequence export, then convert with ffmpeg.",
    steps: [
      {
        title: "Install ffmpeg",
        body:
          "macOS: `brew install ffmpeg`. Windows: download from ffmpeg.org and add the bin folder to PATH. Linux: `sudo apt install ffmpeg` or your package manager equivalent.",
      },
      {
        title: "Download the Time Overlay PNG sequence",
        body:
          "Export 'PNG Sequence' from the Time Overlay generator. The downloaded zip includes the frames plus `convert-to-prores.sh`, `convert-to-prores.bat`, and a README.",
      },
      {
        title: "Run the bundled script",
        body:
          "Unzip the archive. On macOS or Linux, run `./convert-to-prores.sh` from a terminal. On Windows, double-click `convert-to-prores.bat`. The script writes `output.mov` next to the frames.",
      },
      {
        title: "Manual one-liner if you prefer",
        body:
          "Run `ffmpeg -framerate 30 -i frame-%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov` from inside the frames folder.",
      },
    ],
    closer:
      "ProRes 4444 alpha is large but lossless. Use it as a master, then transcode for delivery if file size matters. Premiere, DaVinci, and Final Cut all import this file as transparent media without further setup.",
  },
  "transparent-overlay-for-twitch": {
    title: "How to add a transparent countdown overlay for Twitch (OBS/Streamlabs)",
    description:
      "Add a transparent countdown timer to a Twitch stream in OBS or Streamlabs: export WebM (with alpha) from Time Overlay and add it as a Media Source.",
    intro:
      "To add a transparent countdown overlay for Twitch, export WebM (with alpha) from Time Overlay and add it as a Media Source in OBS or Streamlabs—the background is already cut out, so it reads over busy gameplay or webcam scenes. Twitch ended support for Twitch Studio after May 30, 2024, so this guide does not recommend it as a current production path. PNG sequence remains the alternate source when maximum visual quality matters.",
    recommendedFormat:
      "WebM (with alpha) for streaming software. PNG sequence when quality matters more than file size.",
    steps: [
      {
        title: "Pick a duration that matches the scene transition",
        body:
          "BRB scenes usually want 60 to 180 seconds. Pre-stream countdowns can run 5 to 10 minutes. Test with the default 30s, then dial in the exact length for your routine.",
      },
      {
        title: "Export WebM with alpha",
        body:
          "Choose a style preset that fits your stream aesthetic, then export 'WebM (with alpha)' from the export panel.",
      },
      {
        title: "Add to OBS or Streamlabs",
        body:
          "Add a Media Source. Point it at the downloaded WebM. Enable Loop if the countdown should restart. Resize the source so the timer is readable but does not block your face cam.",
      },
      {
        title: "Test with a local recording before going live",
        body:
          "Start a local OBS recording for 30 seconds. Confirm the alpha is preserved and the readability holds at your stream bitrate. Adjust opacity or position as needed.",
      },
    ],
    closer:
      "If your streaming software lags on WebM playback, fall back to PNG sequence routed through an Image Slideshow Source. The transparency is identical and the CPU load shifts to image decoding, which most systems handle more predictably under live load.",
  },
};

const zhHansGuideChrome: GuideChromeContent = {
  eyebrow: "Time Overlay 指南",
  recommendedExportPrefix: "推荐的 Time Overlay 导出：",
  openGeneratorLabel: "打开 Time Overlay 生成器",
  stepLabelTemplate: "步骤 {number}",
  tipsHeading: "Time Overlay 使用提示",
  compareCtaBefore: "不确定该选哪种导出格式？",
  compareCtaLabel: "按剪辑软件和浏览器支持对比所有透明叠加格式",
  compareCtaAfter: "。",
  markdownRecommendedExportLabel: "推荐导出",
  markdownStepsHeading: "步骤",
  markdownTipsHeading: "提示",
};

const zhHansGuides: Record<GuideSlug, GuideBaseContent> = {
  "add-countdown-to-obs": {
    title: "如何在 OBS Studio 中添加倒计时叠加",
    description:
      "为 OBS Studio 场景添加透明倒计时：可把带 alpha 的 WebM 作为媒体源，也可把 PNG 序列作为图片幻灯片源，两种方式都已抠除背景。",
    intro:
      "要在 OBS Studio 中添加倒计时叠加，先从 Time Overlay 导出透明素材，再把它作为来源添加到场景中，不需要绿幕抠像。最可靠的两条路径是：把带 alpha 的 WebM 作为媒体源用于直播叠加，或把 PNG 序列通过图片幻灯片源载入以获得更精确的循环。两者都能把透明通道从 Time Overlay 保留到 OBS 画布。",
    recommendedFormat:
      "快速直播叠加使用 WebM（带 alpha）。需要逐帧循环或最高质量时使用 PNG 序列。",
    steps: [
      {
        title: "配置计时器",
        body:
          "打开 Time Overlay 生成器，选择与你的场景间隔匹配的时长，避开摄像头区域选择位置，并把画布设置为 OBS 当前录制或推流的分辨率。",
      },
      {
        title: "导出带 alpha 的 WebM",
        body:
          "在导出面板选择“WebM（带 alpha）”。输出文件是带透明背景的 VP8 WebM，OBS 可直接作为媒体源读取。",
      },
      {
        title: "添加到 OBS 场景",
        body:
          "在 OBS 中添加媒体源，选择下载的 .webm 文件，并按需要启用循环。调整来源尺寸，让计时器在画布上清楚可读，同时不遮挡摄像头。",
      },
      {
        title: "用本地录制测试",
        body:
          "在 OBS 中录制 10 秒本地视频。用 VLC 或剪辑软件打开录制结果，确认倒计时背景在基础场景上保持透明。",
      },
    ],
    closer:
      "如果旧版 OBS（28.x 之前）播放 WebM 媒体源不稳定，就改导出 PNG 序列，并通过图片幻灯片源载入。透明效果相同，只是性能负载会从视频播放转向图像解码。",
  },
  "add-countdown-to-premiere": {
    title: "如何在 Premiere Pro 中添加透明倒计时",
    description:
      "在 Adobe Premiere Pro 中添加透明倒计时：把 Time Overlay 编号 PNG 帧作为图像序列导入，或转换成单文件 ProRes 4444 母版。",
    intro:
      "要在 Premiere Pro 中添加透明倒计时，请把 Time Overlay 编号 PNG 帧作为一个图像序列片段导入，再放到基础素材上方。PNG 是 Adobe 文档明确支持、可靠性优先的路径：每一帧都无损且带明确 alpha。如果项目需要单个母版文件，先把同一组帧转换为 ProRes 4444，不要默认 WebM 能被原生解码。",
    recommendedFormat:
      "直接导入使用 PNG 序列；需要单个母版片段时使用 ProRes 4444。",
    steps: [
      {
        title: "生成叠加素材",
        body:
          "在 Time Overlay 中设置与剪辑节奏匹配的时长，选择符合项目氛围的样式预设，并根据质量需求选择导出格式。",
      },
      {
        title: "导入 Premiere",
        body:
          "选择文件 -> 导入，只选第一张编号 PNG，启用“图像序列”后确认。Premiere 会把连续编号静帧解释为一个视频片段。",
      },
      {
        title: "放到基础素材上方",
        body:
          "把倒计时素材放到 V2 或更高轨道，位于 V1 的主素材上方。倒计时会带透明通道合成，你可以用运动控制调整缩放和位置。",
      },
      {
        title: "调整缩放和位置",
        body:
          "在效果控件中调整叠加层的缩放和位置。如果繁忙背景影响可读性，可以给计时器加一点投影。",
      },
    ],
    closer:
      "如果长时间线里管理一组帧不方便，可以用附带的 `convert-to-prores` 脚本转成 ProRes 4444，再使用这个母版文件。最终合成验证完成前，请保留 PNG 源序列。",
  },
  "add-countdown-to-davinci-resolve": {
    title: "如何在 DaVinci Resolve 中添加透明倒计时",
    description:
      "在 DaVinci Resolve 中添加透明倒计时：导入 Time Overlay PNG 序列，并把带 alpha 的片段叠到基础素材上方。",
    intro:
      "要在 DaVinci Resolve 中添加透明倒计时，请把 Time Overlay PNG 序列导入媒体池，再叠到基础素材上方。Blackmagic Design 当前编码列表明确记录了 PNG 序列解码和 alpha 支持；同一份列表没有把 WebM 列为导入容器，因此本指南把 PNG 作为安全路径，不承诺依赖本机编码环境的捷径。",
    recommendedFormat:
      "使用官方文档明确支持 alpha 的 PNG 序列。",
    steps: [
      {
        title: "导出叠加素材",
        body:
          "在 Time Overlay 中设置时长、预设、分辨率和帧率，导出 PNG 序列，并保持解压后的帧文件连续编号。",
      },
      {
        title: "导入 Resolve 媒体池",
        body:
          "在 Media Storage 或导入媒体流程中确认编号帧被组合为序列，再加入媒体池。剪辑前检查片段帧率是否与导出设置一致。",
      },
      {
        title: "放到基础片段上方轨道",
        body:
          "把叠加素材放在 Video 2，位于 Video 1 的基础片段上方。alpha 通道会自动合成，Resolve 在 Color 和 Deliver 页面都会保留透明效果。",
      },
      {
        title: "修剪并对齐",
        body:
          "在 Edit 页面调整倒计时位置，让最后一帧落在你想要的剪辑点上。Resolve 的吸附到剪辑点功能会让这个过程更快。",
      },
    ],
    closer:
      "如果需要把叠加层与基础素材分开调色，请把它放在独立视频轨道，并在 Color 页面使用 Local Versions。激进调色时，PNG 序列能保留最干净的 alpha 边缘。",
  },
  "add-countdown-to-final-cut-pro": {
    title: "如何在 Final Cut Pro 中添加透明倒计时",
    description:
      "在 Final Cut Pro 中添加透明倒计时：把 Time Overlay PNG 序列转换成 ProRes 4444 alpha 母版，再连接到主故事线上方。",
    intro:
      "要在 Final Cut Pro 中添加透明倒计时，请先导出无损 Time Overlay PNG 序列，再把这些帧转换为一个 ProRes 4444 MOV，最后把 alpha 片段连接到主故事线上方。Apple 把 PNG 静帧和所有 Apple ProRes 版本列为支持格式，也说明 ProRes 4444 适用于包含 alpha 的 4:4:4:4 图像源。WebM 不是 Final Cut Pro 原生容器，因此本流程不使用它。",
    recommendedFormat: "PNG 序列作为源文件；Final Cut 时间线使用 ProRes 4444 MOV。",
    steps: [
      {
        title: "导出叠加素材",
        body:
          "在 Time Overlay 中选择与剪辑节奏一致的时长和适合项目的样式预设，然后在导出面板选择“PNG 序列”。",
      },
      {
        title: "转换为 ProRes 4444",
        body:
          "解压 PNG 导出包并运行附带的 convert-to-prores 脚本。脚本使用 FFmpeg 生成一个采用 4444 profile 和 alpha 像素格式的 output.mov。",
      },
      {
        title: "导入并连接到主故事线上方",
        body:
          "导入 output.mov，在浏览器中选中它并连接到基础素材上方。alpha 通道会直接控制合成，不需要色键。",
      },
      {
        title: "调整大小和对齐",
        body:
          "使用变换控制调整缩放和位置，在非黑色画面上预览透明边缘，并确认零点落在目标剪辑位置。最终交付通过前保留 PNG 源文件。",
      },
    ],
    closer:
      "PNG 序列是无损源文件。如果 ProRes 片段变成不透明或时长改变，请与原始帧对比，使用正确帧率重新转换，并在替换时间线片段前检查结果。",
  },
  "png-to-prores": {
    title: "如何用 ffmpeg 把 PNG 序列转换为带 alpha 的 ProRes 4444",
    description:
      "使用附带脚本或一行 ffmpeg 命令，把 Time Overlay PNG 序列转换为保留 alpha 通道的 Apple ProRes 4444。",
    intro:
      "要把 Time Overlay PNG 序列转换为带 alpha 的 ProRes 4444，可以运行附带转换脚本，也可以使用一行 ffmpeg 命令。两种方式都会把透明通道和颜色质量保留到剪辑软件更喜欢的单个文件里。PNG 序列导出包已经包含适用于 macOS、Linux 和 Windows 的脚本。",
    recommendedFormat: "先导出 PNG 序列，再用 ffmpeg 转换。",
    steps: [
      {
        title: "安装 ffmpeg",
        body:
          "macOS：`brew install ffmpeg`。Windows：从 ffmpeg.org 下载并把 bin 文件夹加入 PATH。Linux：使用 `sudo apt install ffmpeg` 或对应发行版的包管理器安装。",
      },
      {
        title: "下载 Time Overlay PNG 序列",
        body:
          "在 Time Overlay 生成器中导出“PNG 序列”。下载的 zip 包含所有帧，以及 `convert-to-prores.sh`、`convert-to-prores.bat` 和 README。",
      },
      {
        title: "运行附带脚本",
        body:
          "解压压缩包。在 macOS 或 Linux 上，从终端运行 `./convert-to-prores.sh`。在 Windows 上，双击 `convert-to-prores.bat`。脚本会在帧文件旁生成 `output.mov`。",
      },
      {
        title: "也可以手动运行一行命令",
        body:
          "在帧文件夹内运行 `ffmpeg -framerate 30 -i frame-%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov`。",
      },
    ],
    closer:
      "ProRes 4444 alpha 文件较大，但质量无损。把它作为母版使用；如果交付时需要更小体积，再转码为发布格式。Premiere、DaVinci 和 Final Cut 都能把这个文件作为透明媒体导入。",
  },
  "transparent-overlay-for-twitch": {
    title: "如何为 Twitch 添加透明倒计时叠加（OBS/Streamlabs）",
    description:
      "为使用 OBS 或 Streamlabs 的 Twitch 直播添加透明倒计时：从 Time Overlay 导出 WebM（带 alpha），并作为媒体源添加。",
    intro:
      "要为 Twitch 添加透明倒计时叠加，从 Time Overlay 导出 WebM（带 alpha），并在 OBS 或 Streamlabs 中作为媒体源添加。背景已经被抠除，因此它能清楚叠在游戏画面或摄像头场景上。Twitch 已在 2024 年 5 月 30 日后停止支持 Twitch Studio，因此本指南不再把它列为当前生产路径。视觉质量优先时，可保留 PNG 序列作为源文件。",
    recommendedFormat:
      "直播软件使用 WebM（带 alpha）。质量比文件体积更重要时使用 PNG 序列。",
    steps: [
      {
        title: "选择匹配场景切换的时长",
        body:
          "BRB 场景通常适合 60 到 180 秒。开播前倒计时可以是 5 到 10 分钟。先用默认 30 秒测试，再调整到符合你直播流程的长度。",
      },
      {
        title: "导出带 alpha 的 WebM",
        body:
          "选择符合直播风格的样式预设，然后在导出面板选择“WebM（带 alpha）”。",
      },
      {
        title: "添加到 OBS 或 Streamlabs",
        body:
          "添加媒体源，指向下载的 WebM 文件。如果倒计时需要循环，启用循环。调整来源尺寸，让计时器清楚可读，但不要挡住摄像头画面。",
      },
      {
        title: "开播前用本地录制测试",
        body:
          "先录制 30 秒 OBS 本地视频。确认 alpha 被保留，并且在你的直播码率下仍然可读。必要时调整透明度或位置。",
      },
    ],
    closer:
      "如果直播软件播放 WebM 时卡顿，可以改用 PNG 序列，并通过图片幻灯片源载入。透明效果相同，CPU 负载会转向图像解码，许多系统在直播时处理这种方式更稳定。",
  },
};

const enGuideEvidence: Record<GuideSlug, GuideEvidence> = {
  "add-countdown-to-obs": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "Time Overlay output behavior was checked against the current generator. Source types and PNG alpha behavior were cross-checked against current OBS documentation. Always run a short local recording in the exact OBS version and scene collection used for production.",
    workflowTitle: "A predictable file-based OBS workflow",
    workflowCaption:
      "Generate the designed asset first, then let OBS handle playback and scene timing. This differs from a live Browser Source timer that changes remotely during a stream.",
    workflowStages: ["Render locally", "Add as source", "Record a test"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "Time Overlay can produce a transparent PNG sequence in every supported browser and a VP8-alpha WebM where the browser encoder is available.",
      "OBS documents Media Source for local audio/video files and Image Slide Show for PNG files with alpha support.",
      "The guide does not treat documentation review as proof for every GPU, codec build, or OBS plug-in combination.",
    ],
    troubleshootingHeading: "OBS troubleshooting",
    troubleshootingItems: [
      {
        symptom: "The background appears black instead of transparent",
        resolution:
          "Confirm that the exported file actually contains alpha, then remove any chroma-key filter that was added for a different asset. If WebM remains opaque in your build, switch to the PNG sequence and verify one frame first.",
      },
      {
        symptom: "The countdown restarts at the wrong time",
        resolution:
          "Open Media Source properties and test the restart/visibility behavior for the scene transition you use. Record a scene switch before relying on it live.",
      },
      {
        symptom: "Playback stutters while streaming",
        resolution:
          "Try a 720p asset, shorten the timer, disable unnecessary filters, or use the PNG fallback. Keep a local recording open while checking dropped frames and render load.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "These references establish the OBS source behavior used above. Codec behavior can still vary by operating system and installed components.",
    sources: [
      {
        label: "OBS Sources Guide",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/sources-guide",
      },
      {
        label: "OBS Media Sources",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/media-sources",
      },
      {
        label: "OBS Image Sources and Image Slide Show",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/image-sources",
      },
    ],
    relatedHeading: "Continue with a related workflow",
    relatedSlugs: ["transparent-overlay-for-twitch", "png-to-prores"],
  },
  "add-countdown-to-premiere": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "The PNG-sequence workflow was checked against Adobe's current import instructions. Premiere was not installed on the review machine, so the recommendation is limited to Adobe-documented formats and does not claim a hands-on WebM import test.",
    workflowTitle: "Use the lossless handoff Premiere documents",
    workflowCaption:
      "A numbered PNG sequence gives Premiere one frame per file and keeps the alpha channel unambiguous. Convert the same source sequence to ProRes 4444 when a single master clip is required.",
    workflowStages: ["Export PNG", "Import sequence", "Composite on V2"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "Adobe's 2026 guide says numbered still files can be imported as one image-sequence clip by selecting the first frame and Image Sequence.",
      "The generated Time Overlay package uses consistent numbered frames and retains transparent PNG pixels.",
      "WebM is not presented as a native Premiere path because Adobe's current supported-format guidance does not establish that claim.",
    ],
    troubleshootingHeading: "Premiere troubleshooting",
    troubleshootingItems: [
      {
        symptom: "Premiere imports hundreds of separate stills",
        resolution:
          "Remove the loose imports, choose File > Import again, select only the first numbered frame, and enable Image Sequence before confirming.",
      },
      {
        symptom: "The timer runs too fast or too slowly",
        resolution:
          "Set the Indeterminate Media Timebase to the frame rate used for the Time Overlay export, or interpret the imported clip at the intended frame rate before editing.",
      },
      {
        symptom: "The alpha edge looks dark",
        resolution:
          "Check the footage interpretation and sequence color settings, then compare against an original PNG frame. Do not add a color key to a file that already has alpha.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "Adobe's current import documentation is the authority for the sequence workflow. The FFmpeg reference covers the optional ProRes conversion.",
    sources: [
      {
        label: "Import images as an image sequence",
        publisher: "Adobe",
        href: "https://helpx.adobe.com/premiere/desktop/organize-media/import-files/import-images-as-image-sequence.html",
      },
      {
        label: "Supported export file formats in Premiere",
        publisher: "Adobe",
        href: "https://helpx.adobe.com/premiere/desktop/render-and-export/export-files/supported-export-file-formats.html",
      },
      {
        label: "FFmpeg ProRes encoder documentation",
        publisher: "FFmpeg",
        href: "https://ffmpeg.org/ffmpeg-codecs.html#ProRes",
      },
    ],
    relatedHeading: "Continue with a related workflow",
    relatedSlugs: ["png-to-prores", "add-countdown-to-davinci-resolve"],
  },
  "add-countdown-to-davinci-resolve": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "The recommendation was checked against Blackmagic Design's DaVinci Resolve 20 codec list. The current list explicitly documents PNG decode and alpha support; it does not list WebM as a supported container, so PNG is the guide's safe default.",
    workflowTitle: "Start from Resolve's documented PNG path",
    workflowCaption:
      "Import the numbered transparent frames, confirm the clip frame rate, and place the result above the base video. This keeps the master independent from operating-system codec differences.",
    workflowStages: ["Export PNG", "Add to Media Pool", "Stack on Video 2"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "Blackmagic Design lists PNG under still and sequence formats with decode and alpha support on macOS, Windows, and Rocky Linux.",
      "The Time Overlay PNG package uses RGBA frames with consistent numbering suitable for sequence import.",
      "WebM is treated as an experiment rather than the recommended handoff because it is absent from the current official container list.",
    ],
    troubleshootingHeading: "DaVinci Resolve troubleshooting",
    troubleshootingItems: [
      {
        symptom: "Frames appear as separate clips",
        resolution:
          "Enable sequence grouping in the Media Storage view and verify that filenames have uninterrupted, zero-padded numbers before adding the first frame to the Media Pool.",
      },
      {
        symptom: "The countdown duration is wrong",
        resolution:
          "Check the project frame rate and the clip attributes for the imported sequence. They must match the FPS selected during export.",
      },
      {
        symptom: "The transparent edge changes after grading",
        resolution:
          "Keep the overlay on its own track or node path, inspect the alpha channel, and avoid applying a base-footage grade to the overlay clip unless that is intentional.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "Blackmagic's codec list is platform-specific and changes between Resolve releases. Recheck it after a major upgrade.",
    sources: [
      {
        label: "DaVinci Resolve 20 Supported Codecs",
        publisher: "Blackmagic Design",
        href: "https://documents.blackmagicdesign.com/SupportNotes/DaVinci_Resolve_20_Supported_Codec_List.pdf",
      },
      {
        label: "DaVinci Resolve training and documentation",
        publisher: "Blackmagic Design",
        href: "https://www.blackmagicdesign.com/products/davinciresolve/training",
      },
    ],
    relatedHeading: "Continue with a related workflow",
    relatedSlugs: ["png-to-prores", "add-countdown-to-premiere"],
  },
  "add-countdown-to-final-cut-pro": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "The workflow was checked against Apple's current supported-media and alpha-compositing guides. Final Cut Pro was not installed on the review machine. The guide therefore recommends converting the generated PNG sequence to an Apple-documented ProRes 4444 alpha master before import.",
    workflowTitle: "Bridge browser frames into an Apple-native master",
    workflowCaption:
      "Keep PNG as the lossless browser output, then convert it to ProRes 4444 for a single alpha clip that Final Cut Pro officially supports.",
    workflowStages: ["Export PNG", "Convert to ProRes", "Connect above story"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "Apple lists PNG as a supported still format and every Apple ProRes version as supported video media in Final Cut Pro.",
      "Apple describes ProRes 4444 as appropriate for 4:4:4:4 image sources including alpha channels.",
      "WebM is not listed as a native Final Cut Pro container and is not recommended in this workflow.",
    ],
    troubleshootingHeading: "Final Cut Pro troubleshooting",
    troubleshootingItems: [
      {
        symptom: "The PNG files do not behave like one video clip",
        resolution:
          "Use the bundled FFmpeg conversion step to create one ProRes 4444 MOV, then import that file instead of managing individual stills in the timeline.",
      },
      {
        symptom: "The clip is opaque after conversion",
        resolution:
          "Inspect an original PNG for transparency, rerun the conversion with the documented alpha pixel format, and confirm the resulting clip's alpha interpretation in the inspector.",
      },
      {
        symptom: "The countdown does not align with the edit point",
        resolution:
          "Connect the ProRes clip above the primary storyline, then trim or slip it so the zero frame lands on the intended transition.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "Apple's media and compositing guides define the supported handoff; FFmpeg performs the local conversion from the lossless frame source.",
    sources: [
      {
        label: "Media formats supported in Final Cut Pro",
        publisher: "Apple",
        href: "https://support.apple.com/guide/final-cut-pro/ver2833f855/mac",
      },
      {
        label: "Use alpha channels in Final Cut Pro",
        publisher: "Apple",
        href: "https://support.apple.com/guide/final-cut-pro/ver52cf382e/mac",
      },
      {
        label: "FFmpeg ProRes encoder documentation",
        publisher: "FFmpeg",
        href: "https://ffmpeg.org/ffmpeg-codecs.html#ProRes",
      },
    ],
    relatedHeading: "Continue with a related workflow",
    relatedSlugs: ["png-to-prores", "add-countdown-to-premiere"],
  },
  "png-to-prores": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "The conversion path uses the FFmpeg prores_ks encoder with a 4444 profile and an alpha-capable pixel format. A generated MOV must still be inspected with ffprobe and in the target editor before delivery.",
    workflowTitle: "Turn lossless frames into one alpha master",
    workflowCaption:
      "The PNG sequence remains the source of truth. FFmpeg reads the numbered frames at the chosen FPS and writes one ProRes 4444 MOV for editing.",
    workflowStages: ["Inspect frames", "Run FFmpeg", "Verify alpha MOV"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "The command uses FFmpeg's prores_ks encoder and the 4444 profile rather than a delivery codec that discards alpha.",
      "The input frame rate must match the Time Overlay export or the resulting duration will be wrong.",
      "Verification requires both technical inspection and a visible composite over a non-black background.",
    ],
    troubleshootingHeading: "FFmpeg troubleshooting",
    troubleshootingItems: [
      {
        symptom: "FFmpeg reports that no input files were found",
        resolution:
          "Run the command inside the extracted frame directory and make the input pattern match the actual zero-padded filenames exactly.",
      },
      {
        symptom: "The MOV duration is incorrect",
        resolution:
          "Set -framerate to the FPS used during export. A 30 FPS sequence interpreted at 24 FPS will play longer than intended.",
      },
      {
        symptom: "The output has no alpha channel",
        resolution:
          "Confirm the source PNGs contain RGBA pixels, use profile 4444 with yuva444p10le, then inspect pix_fmt and alpha behavior before deleting the source frames.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "The encoder and command-line behavior come from FFmpeg; Apple's ProRes description explains why 4444 is used for alpha-bearing masters.",
    sources: [
      {
        label: "FFmpeg ProRes encoder documentation",
        publisher: "FFmpeg",
        href: "https://ffmpeg.org/ffmpeg-codecs.html#ProRes",
      },
      {
        label: "FFmpeg image sequence documentation",
        publisher: "FFmpeg",
        href: "https://ffmpeg.org/ffmpeg-formats.html#image2-1",
      },
      {
        label: "Apple ProRes 4444 and alpha overview",
        publisher: "Apple",
        href: "https://support.apple.com/105049",
      },
    ],
    relatedHeading: "Use the master in an editor",
    relatedSlugs: ["add-countdown-to-final-cut-pro", "add-countdown-to-premiere"],
  },
  "transparent-overlay-for-twitch": {
    publishedAt: "2026-07-03",
    reviewedAt: "2026-08-28",
    reviewNote:
      "The overlay workflow was reviewed against current OBS source documentation and the Time Overlay export path. Twitch receives the composited OBS program feed; the local source must be tested at the actual streaming canvas and bitrate before going live.",
    workflowTitle: "Treat the timer as part of the scene system",
    workflowCaption:
      "Build a local asset, place it in the starting-soon or break scene, then validate the full stream composition rather than judging the transparent file by itself.",
    workflowStages: ["Design for scene", "Add media source", "Test stream output"],
    verificationHeading: "What was verified for this guide",
    verificationItems: [
      "The timer asset is composited by the streaming application before Twitch receives the program output.",
      "OBS documents source ordering, sizing, local media, and alpha-capable PNG image sources.",
      "Readability must be checked at the delivered stream resolution and bitrate, not only in the local preview canvas.",
    ],
    troubleshootingHeading: "Livestream troubleshooting",
    troubleshootingItems: [
      {
        symptom: "The timer is clear locally but unreadable on Twitch",
        resolution:
          "Record or preview at the actual output resolution and bitrate. Increase numeral size, reduce glow and thin strokes, and move the timer away from detailed gameplay.",
      },
      {
        symptom: "The overlay covers chat, captions, or a webcam",
        resolution:
          "Use a safe corner template, test the scene with every dock or caption layer visible, and keep enough margin for mobile crops.",
      },
      {
        symptom: "The countdown keeps looping after the scene ends",
        resolution:
          "Review the source's loop and visibility behavior, then test transitions into and out of the scene with a local recording before the broadcast.",
      },
    ],
    sourcesHeading: "First-party references",
    sourcesIntro:
      "OBS documentation defines how the local asset enters the scene. Twitch receives the final encoded scene rather than the source file directly. Twitch's own notice documents why Twitch Studio is no longer included as a current workflow.",
    sources: [
      {
        label: "OBS Sources Guide",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/sources-guide",
      },
      {
        label: "OBS Media Sources",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/media-sources",
      },
      {
        label: "OBS Image Sources and alpha support",
        publisher: "OBS Project",
        href: "https://obsproject.com/kb/image-sources",
      },
      {
        label: "Twitch Studio support discontinuation notice",
        publisher: "Twitch",
        href: "https://blog.twitch.tv/en/2019/08/08/twitch-studio-going-live-is-getting-a-whole-lot-easier-ee64251bcf5/",
      },
    ],
    relatedHeading: "Continue with a related workflow",
    relatedSlugs: ["add-countdown-to-obs", "png-to-prores"],
  },
};

const zhHansEvidenceCopy: Record<
  GuideSlug,
  Pick<
    GuideEvidence,
    | "workflowTitle"
    | "workflowCaption"
    | "workflowStages"
    | "verificationItems"
    | "troubleshootingItems"
  >
> = {
  "add-countdown-to-obs": {
    workflowTitle: "一个可预测的 OBS 本地文件流程",
    workflowCaption:
      "先生成设计好的素材，再由 OBS 控制播放和场景时机。需要直播中远程改变时间时，才应选择 Browser Source 类型的实时计时器。",
    workflowStages: ["本地渲染", "添加为来源", "录制测试"],
    verificationItems: [
      "Time Overlay 可在支持的浏览器中输出透明 PNG 序列，并在编码器可用时输出 VP8 alpha WebM。",
      "OBS 官方资料说明了本地音视频的媒体源，以及支持 PNG 与 alpha 的图片幻灯片源。",
      "本页不会把文档核验扩大为对所有显卡、编码版本和插件组合的保证。",
    ],
    troubleshootingItems: [
      {
        symptom: "背景变成黑色而不是透明",
        resolution:
          "先检查导出文件是否真的包含 alpha，并移除为其他素材添加的色键滤镜。如果当前 OBS 构建仍无法正确解码 WebM，改用 PNG 序列并先验证单帧。",
      },
      {
        symptom: "场景切换后倒计时起点不对",
        resolution:
          "检查媒体源的循环、可见性和重启行为，并用本地录制完整测试一次进入与离开场景的过程。",
      },
      {
        symptom: "直播时播放卡顿",
        resolution:
          "尝试 720p、缩短时长、关闭不必要滤镜或改用 PNG。测试时同时观察 OBS 丢帧和渲染负载。",
      },
    ],
  },
  "add-countdown-to-premiere": {
    workflowTitle: "使用 Adobe 文档明确支持的无损交付",
    workflowCaption:
      "连续编号 PNG 可让 Premiere 把每个文件解释为一帧并保留明确 alpha。需要单个母版片段时，再从同一源序列转换 ProRes 4444。",
    workflowStages: ["导出 PNG", "导入图像序列", "放到 V2 合成"],
    verificationItems: [
      "Adobe 2026 年文档说明：选择第一张编号静帧并启用图像序列，可导入为一个视频片段。",
      "Time Overlay 导出包使用连续编号并保留透明 PNG 像素。",
      "Adobe 当前支持格式资料没有确认 WebM 原生导入，因此本页不把 WebM 作为 Premiere 默认路径。",
    ],
    troubleshootingItems: [
      {
        symptom: "Premiere 导入了几百张独立图片",
        resolution:
          "移除散开的素材，重新选择文件 -> 导入，只选第一张编号帧，并在确认前启用“图像序列”。",
      },
      {
        symptom: "计时器播放速度不正确",
        resolution:
          "把不确定媒体时基或片段解释帧率设置为 Time Overlay 导出时选择的 FPS。",
      },
      {
        symptom: "透明边缘出现暗边",
        resolution:
          "检查素材解释与序列颜色设置，并和原始 PNG 单帧比较。已有 alpha 的素材不应再添加色键。",
      },
    ],
  },
  "add-countdown-to-davinci-resolve": {
    workflowTitle: "从 Resolve 官方记录的 PNG 路径开始",
    workflowCaption:
      "导入连续透明帧，确认片段帧率，再放到基础视频上方。这条路径不依赖操作系统中的额外视频解码器。",
    workflowStages: ["导出 PNG", "加入媒体池", "叠到 Video 2"],
    verificationItems: [
      "Blackmagic Design 在 macOS、Windows 和 Rocky Linux 的列表中都记录了 PNG 解码与 alpha 支持。",
      "Time Overlay PNG 包使用带 RGBA 的连续编号帧。",
      "官方容器列表没有列出 WebM，因此本页只把它视为需自行测试的路径。",
    ],
    troubleshootingItems: [
      {
        symptom: "每一帧都显示为独立片段",
        resolution:
          "在 Media Storage 中启用序列分组，并确认文件名连续且位数一致，再把第一帧加入媒体池。",
      },
      {
        symptom: "倒计时时长不正确",
        resolution:
          "检查项目帧率和导入序列的片段属性，确保它们与导出 FPS 一致。",
      },
      {
        symptom: "调色后透明边缘发生变化",
        resolution:
          "让叠加层保持独立轨道或节点路径，检查 alpha 通道，避免无意中套用基础素材的调色。",
      },
    ],
  },
  "add-countdown-to-final-cut-pro": {
    workflowTitle: "把浏览器帧转换为 Apple 原生母版",
    workflowCaption:
      "保留 PNG 作为无损浏览器输出，再转换成 Final Cut Pro 官方支持的 ProRes 4444 单文件 alpha 片段。",
    workflowStages: ["导出 PNG", "转换 ProRes", "连接到主故事线"],
    verificationItems: [
      "Apple 把 PNG 列为支持静帧，把所有 Apple ProRes 版本列为 Final Cut Pro 支持视频。",
      "Apple 说明 ProRes 4444 适用于包含 alpha 的 4:4:4:4 图像源。",
      "WebM 不在 Final Cut Pro 原生容器列表中，因此本流程不推荐它。",
    ],
    troubleshootingItems: [
      {
        symptom: "PNG 文件无法像一个视频片段一样使用",
        resolution:
          "运行附带的 FFmpeg 转换，生成单个 ProRes 4444 MOV，再导入该文件。",
      },
      {
        symptom: "转换后的片段变成不透明",
        resolution:
          "先检查源 PNG 是否透明，再用 4444 profile 和 alpha 像素格式重新转换，并在检查器中核对 alpha。",
      },
      {
        symptom: "倒计时没有对齐剪辑点",
        resolution:
          "把 ProRes 片段连接到主故事线上方，修剪或滑动片段，使零点落在目标转场位置。",
      },
    ],
  },
  "png-to-prores": {
    workflowTitle: "把无损帧转换为单个 alpha 母版",
    workflowCaption:
      "PNG 序列始终是源文件。FFmpeg 按指定 FPS 读取编号帧，写出一个供剪辑使用的 ProRes 4444 MOV。",
    workflowStages: ["检查源帧", "运行 FFmpeg", "验证 alpha MOV"],
    verificationItems: [
      "命令使用 FFmpeg prores_ks 编码器、4444 profile 和支持 alpha 的像素格式。",
      "输入帧率必须与 Time Overlay 导出一致，否则输出时长会变化。",
      "验证需要同时检查技术元数据，并在非黑色背景上完成可见合成。",
    ],
    troubleshootingItems: [
      {
        symptom: "FFmpeg 找不到输入文件",
        resolution:
          "在解压后的帧目录内运行命令，并让输入通配模式与实际补零文件名完全一致。",
      },
      {
        symptom: "MOV 时长不正确",
        resolution:
          "把 -framerate 设置为导出时的 FPS。30 FPS 序列按 24 FPS 解释会变得更长。",
      },
      {
        symptom: "输出文件没有 alpha",
        resolution:
          "确认源 PNG 为 RGBA，使用 4444 profile 和 yuva444p10le，并在删除源帧前检查 pix_fmt 与实际合成。",
      },
    ],
  },
  "transparent-overlay-for-twitch": {
    workflowTitle: "把计时器当作直播场景系统的一部分",
    workflowCaption:
      "先生成本地素材，放入开播前或休息场景，再验证完整直播画面，而不是只查看透明文件本身。",
    workflowStages: ["按场景设计", "添加媒体源", "测试直播输出"],
    verificationItems: [
      "计时器先由直播软件合成，Twitch 接收到的是最终节目画面。",
      "OBS 官方资料记录了来源顺序、尺寸、本地媒体和支持 alpha 的 PNG 图片源。",
      "可读性必须在实际输出分辨率和码率下验证，不能只看本地画布。",
    ],
    troubleshootingItems: [
      {
        symptom: "本地很清楚，但 Twitch 画面看不清",
        resolution:
          "按实际输出分辨率和码率录制，增大数字、减少发光和细线，并避开细节复杂的游戏画面。",
      },
      {
        symptom: "计时器遮挡聊天、字幕或摄像头",
        resolution:
          "选择安全角落模板，显示所有字幕与摄像头层后测试，并为移动端裁切保留边距。",
      },
      {
        symptom: "离开场景后倒计时仍在循环",
        resolution:
          "检查来源的循环与可见性行为，并在直播前用本地录制测试进入和离开场景。",
      },
    ],
  },
};

const zhHansGuideEvidence: Record<GuideSlug, GuideEvidence> = Object.fromEntries(
  Object.entries(enGuideEvidence).map(([slug, evidence]) => [
    slug,
    {
      ...evidence,
      ...zhHansEvidenceCopy[slug as GuideSlug],
      reviewNote:
        "本页已在 2026-08-28 依据当前 Time Overlay 输出行为和所列第一方资料复核。没有在当前设备完成的编辑器导入测试会明确说明，不把文档核验表述为实机结论。",
      verificationHeading: "本页核验范围",
      troubleshootingHeading: "常见问题排查",
      sourcesHeading: "第一方参考资料",
      sourcesIntro:
        "以下链接用于核对软件支持边界。第三方软件升级后可能改变行为，重要项目仍应在当前版本中重新测试。",
      relatedHeading: "继续查看相关工作流",
    },
  ]),
) as Record<GuideSlug, GuideEvidence>;

export const guideLocaleContent = {
  en: {
    chrome: enGuideChrome,
    guides: enGuides,
  },
  "zh-hans": {
    chrome: zhHansGuideChrome,
    guides: zhHansGuides,
  },
} satisfies Record<GuideContentLocale, GuideLocaleContent>;

export const GUIDES = enGuides;

export function isGuideContentLocale(locale: EnabledLocale): locale is GuideContentLocale {
  return (guideContentLocales as readonly EnabledLocale[]).includes(locale);
}

export function getGuideLocaleContent(locale: GuideContentLocale): GuideLocaleContent {
  return guideLocaleContent[locale];
}

export function getGuidePageContent(
  locale: GuideContentLocale,
  slug: GuideSlug,
): { chrome: GuideChromeContent; guide: GuideContent } {
  const content = getGuideLocaleContent(locale);
  return {
    chrome: content.chrome,
    guide: {
      ...content.guides[slug],
      ...(locale === "zh-hans" ? zhHansGuideEvidence[slug] : enGuideEvidence[slug]),
    },
  };
}
