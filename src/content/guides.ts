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

export type GuideContent = {
  title: string;
  description: string;
  intro: string;
  recommendedFormat: string;
  steps: readonly GuideStep[];
  closer: string;
  faqTitle?: string;
  faqItems?: readonly GuideFaqItem[];
};

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
  guides: Record<GuideSlug, GuideContent>;
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

const enGuides: Record<GuideSlug, GuideContent> = {
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
      "Add a transparent countdown timer to Adobe Premiere Pro: import a Time Overlay PNG sequence or WebM (with alpha) and drop it on a track above your footage.",
    intro:
      "To add a transparent countdown timer in Premiere Pro, import a Time Overlay export and place it on a track above your footage - the alpha channel composites with no extra setup. The most reliable workflow is a PNG sequence imported as an image sequence: quality is lossless and the alpha channel is unambiguous. WebM (with alpha) is the quick path when you want a single file and do not need master-grade compression.",
    recommendedFormat:
      "PNG sequence for master-grade quality. WebM (with alpha) for fast iteration.",
    steps: [
      {
        title: "Generate the overlay",
        body:
          "In Time Overlay, set the duration to match your edit beat, pick a style preset that fits your project tone, and pick your export format based on the quality you need.",
      },
      {
        title: "Import into Premiere",
        body:
          "For PNG sequence: File -> Import -> select the first frame, tick 'Image Sequence', click Import. For WebM: drag the .webm directly into your project bin.",
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
      "If the WebM playback feels CPU-heavy on a long timeline, transcode the PNG sequence to ProRes 4444 with the bundled `convert-to-prores` script and use that master clip instead. ProRes is the most editor-friendly alpha codec on Premiere.",
  },
  "add-countdown-to-davinci-resolve": {
    title: "How to add a transparent countdown timer in DaVinci Resolve",
    description:
      "Add a transparent countdown timer to DaVinci Resolve (Free or Studio): import a Time Overlay PNG sequence or WebM (with alpha) and stack it above your base clip.",
    intro:
      "To add a transparent countdown timer in DaVinci Resolve, import a Time Overlay export into the Media Pool and stack it above your base clip - the alpha composites automatically. Resolve (Free and Studio) imports both PNG sequences and VP8-alpha WebM as transparent footage. PNG sequence is the safe master-grade path; WebM is the quick path when you want a single asset to drop in.",
    recommendedFormat:
      "PNG sequence for clean alpha and grading flexibility. WebM (with alpha) for rapid iteration.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "Set up the Time Overlay generator with your duration, preset, and resolution. Pick PNG sequence or WebM based on whether you want lossless frames or a single file.",
      },
      {
        title: "Import into Resolve Media Pool",
        body:
          "For PNG sequence: File -> Import Media -> select the first frame and let Resolve detect the sequence. For WebM: drag the .webm into the Media Pool.",
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
      "Add a transparent countdown timer to Final Cut Pro: import a Time Overlay PNG sequence (the dependable path on macOS) and connect it above your primary storyline.",
    intro:
      "To add a transparent countdown timer in Final Cut Pro, import a Time Overlay PNG sequence and connect it above your primary storyline - Final Cut treats it as native alpha media. WebM playback inside Final Cut has historically been inconsistent on macOS, so the recommended path on the Mac side is PNG sequence: quality is master-grade and alpha is unambiguous.",
    recommendedFormat: "PNG sequence is the dependable path on macOS.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "In Time Overlay, pick a duration that aligns to your edit beat and a style preset that fits your project. Export 'PNG Sequence' from the export panel.",
      },
      {
        title: "Import into Final Cut Pro",
        body:
          "File -> Import -> Media -> select the first frame and let Final Cut auto-detect the image sequence. The overlay arrives as a single clip with the transparency preserved.",
      },
      {
        title: "Stack above the primary storyline",
        body:
          "Drop the overlay on a connected layer above your base footage. The countdown shows transparent over the shot below with no further setup.",
      },
      {
        title: "Resize and align",
        body:
          "Use the Transform controls to scale and reposition. Final Cut respects alpha across Color and Compressor delivery, so you can encode for delivery without losing transparency.",
      },
    ],
    closer:
      "If you want a true ProRes 4444 master with alpha, unzip the Time Overlay PNG sequence export and run the bundled `convert-to-prores.sh` script. Final Cut imports ProRes 4444 natively as transparent media.",
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
      "Add a transparent countdown timer to a Twitch stream in OBS, Streamlabs, or Twitch Studio: export WebM (with alpha) from Time Overlay and add it as a Media Source.",
    intro:
      "To add a transparent countdown overlay for Twitch, export WebM (with alpha) from Time Overlay and add it as a Media Source in OBS, Streamlabs, or Twitch Studio - the background is already cut out, so it reads over busy gameplay or webcam scenes. PNG sequence is the alternate path when you want frame-perfect loops or maximum visual quality.",
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
        title: "Add to OBS, Streamlabs, or Twitch Studio",
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

const zhHansGuides: Record<GuideSlug, GuideContent> = {
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
      "在 Adobe Premiere Pro 中添加透明倒计时：导入 Time Overlay 的 PNG 序列或 WebM（带 alpha），并放到素材上方轨道。",
    intro:
      "要在 Premiere Pro 中添加透明倒计时，把 Time Overlay 导出的素材导入项目，并放到原视频上方轨道即可，alpha 通道会自动合成。最稳妥的流程是把 PNG 序列作为图像序列导入：质量无损，透明通道明确。WebM（带 alpha）适合想快速得到单文件、且不需要母版级压缩质量的场景。",
    recommendedFormat:
      "母版级质量使用 PNG 序列。快速迭代使用 WebM（带 alpha）。",
    steps: [
      {
        title: "生成叠加素材",
        body:
          "在 Time Overlay 中设置与剪辑节奏匹配的时长，选择符合项目氛围的样式预设，并根据质量需求选择导出格式。",
      },
      {
        title: "导入 Premiere",
        body:
          "PNG 序列：文件 -> 导入 -> 选择第一帧，勾选“图像序列”，点击导入。WebM：直接把 .webm 拖入项目面板。",
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
      "如果长时间线里 WebM 播放占用 CPU 较高，可以用 PNG 序列附带的 `convert-to-prores` 脚本转成 ProRes 4444，再使用这个母版文件。对 Premiere 来说，ProRes 是最友好的 alpha 编码。",
  },
  "add-countdown-to-davinci-resolve": {
    title: "如何在 DaVinci Resolve 中添加透明倒计时",
    description:
      "在 DaVinci Resolve（免费版或 Studio）中添加透明倒计时：导入 Time Overlay 的 PNG 序列或 WebM（带 alpha），并叠到基础片段上方。",
    intro:
      "要在 DaVinci Resolve 中添加透明倒计时，把 Time Overlay 导出的素材导入媒体池，再叠到基础片段上方，alpha 会自动合成。Resolve（免费版和 Studio）都能把 PNG 序列和 VP8-alpha WebM 作为透明素材导入。PNG 序列是稳妥的母版级路径；WebM 则适合想快速拖入单个素材的场景。",
    recommendedFormat:
      "需要干净 alpha 和调色灵活性时使用 PNG 序列。快速迭代使用 WebM（带 alpha）。",
    steps: [
      {
        title: "导出叠加素材",
        body:
          "在 Time Overlay 生成器中设置时长、预设和分辨率。根据你需要无损帧还是单文件，选择 PNG 序列或 WebM。",
      },
      {
        title: "导入 Resolve 媒体池",
        body:
          "PNG 序列：文件 -> 导入媒体 -> 选择第一帧，让 Resolve 自动识别序列。WebM：直接把 .webm 拖入媒体池。",
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
      "在 Final Cut Pro 中添加透明倒计时：导入 Time Overlay PNG 序列（macOS 上最稳妥），并连接到主故事线上方。",
    intro:
      "要在 Final Cut Pro 中添加透明倒计时，导入 Time Overlay PNG 序列，并把它连接到主故事线上方，Final Cut 会把它当作原生 alpha 媒体处理。WebM 在 macOS 的 Final Cut 内播放一直不够稳定，因此 Mac 端推荐使用 PNG 序列：质量是母版级，alpha 通道也最明确。",
    recommendedFormat: "macOS 上最稳妥的方式是 PNG 序列。",
    steps: [
      {
        title: "导出叠加素材",
        body:
          "在 Time Overlay 中选择与剪辑节奏一致的时长和适合项目的样式预设，然后在导出面板选择“PNG 序列”。",
      },
      {
        title: "导入 Final Cut Pro",
        body:
          "文件 -> 导入 -> 媒体 -> 选择第一帧，让 Final Cut 自动识别图像序列。叠加层会作为一个保留透明通道的片段进入项目。",
      },
      {
        title: "叠到主故事线上方",
        body:
          "把叠加素材放到基础素材上方的连接层。倒计时会透明显示在下方画面之上，不需要额外设置。",
      },
      {
        title: "调整大小和对齐",
        body:
          "使用变换控制调整缩放和位置。Final Cut 在调色和 Compressor 输出中都会保留 alpha，因此交付编码时不会丢失透明通道。",
      },
    ],
    closer:
      "如果你想得到真正带 alpha 的 ProRes 4444 母版，请解压 Time Overlay 的 PNG 序列导出，并运行附带的 `convert-to-prores.sh` 脚本。Final Cut 会把 ProRes 4444 作为透明媒体原生导入。",
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
      "为 OBS、Streamlabs 或 Twitch Studio 的 Twitch 直播添加透明倒计时：从 Time Overlay 导出 WebM（带 alpha），并作为媒体源添加。",
    intro:
      "要为 Twitch 添加透明倒计时叠加，从 Time Overlay 导出 WebM（带 alpha），并在 OBS、Streamlabs 或 Twitch Studio 中作为媒体源添加。背景已经被抠除，因此它能清楚叠在游戏画面或摄像头场景上。需要逐帧循环或最高视觉质量时，可以改用 PNG 序列。",
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
        title: "添加到 OBS、Streamlabs 或 Twitch Studio",
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
    guide: content.guides[slug],
  };
}
