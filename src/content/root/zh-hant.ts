import type { RootPageContent } from "@/content/root/types";

const zhHantRootPageContent = {
  metadata: {
    title: "可匯出 PNG Sequence 與 WebM 的 Overlay Timer 產生器",
    description:
      "直接在瀏覽器中建立 overlay timer，即時預覽，並在同一個 local-first 工具頁匯出 PNG Sequence 或 WebM。",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "設定時長、預覽畫面，然後匯出你的計時器素材。",
    intro: "建議第一次先試：`30s`、`PNG sequence`、`bottom-right`。",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "提供給創作者的 overlay timer 工具，適合需要在錄影與直播中使用清楚、易讀倒數計時的人。",
    header: {
      shellLabel: "公開介面",
      toolLinkLabel: "工具",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "系統軌道",
      publicStatusLabel: "公開狀態",
      identityTitle: "識別",
      jumpTitle: "快速前往",
      productTitle: "產品",
      jumpLinks: [
        { anchorId: "tool", label: "產生器" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "格式" },
      ],
      productDescription:
        "一個 local-first 的單頁工具，整合倒數 overlay、精簡 FAQ 與匯出格式說明。",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "主題預設",
      description: "先選一個起始風格，只有在需要時再微調控制項。",
      presetLabels: {
        "minimal-neon": "極簡霓虹",
        "broadcast-alert": "轉播警示",
        "calm-studio": "沉靜工作室",
      },
    },
    controlPanel: {
      title: "控制項",
      subtitle: "輸入堆疊",
      timerSetupTitle: "計時器設定",
      durationLabel: "時長（秒）",
      displayFormatLabel: "顯示格式",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "畫布",
      resolutionPresetLabel: "解析度預設",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "背景模式",
      styleTitle: "樣式",
      fontFamilyLabel: "字型家族",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "錨點",
      anchorOptions: {
        "top-left": "左上",
        "top-center": "上方置中",
        "top-right": "右上",
        "center-left": "左側置中",
        center: "正中央",
        "center-right": "右側置中",
        "bottom-left": "左下",
        "bottom-center": "下方置中",
        "bottom-right": "右下",
      },
      transparentOptionLabel: "透明",
      solidOptionLabel: "實色",
    },
    previewPanel: {
      title: "預覽",
      subtitle: "即時畫布",
      playButton: "播放預覽",
      pauseButton: "暫停",
      resetButton: "重設",
      safeAreaOnButton: "安全區域已開啟",
      safeAreaOffButton: "安全區域已關閉",
      currentReadoutLabel: "目前顯示",
    },
    exportPanel: {
      title: "匯出",
      subtitle: "輸出區",
      outputFormatTitle: "輸出格式",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "對剪輯軟體與透明素材交接最穩定。",
      webmLabel: "WebM",
      webmDescription: "適合在支援的瀏覽器中匯出較輕量的本機影片。",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "品質",
      launchNoteTitle: "提示",
      launchNoteFallback:
        "在 MVP 階段，匯出仍維持 local-first。如果目前瀏覽器不支援某個格式，介面會引導你改用 PNG Sequence。",
      exportButtonIdle: "匯出素材",
      exportButtonBusy: "匯出中…",
      exportStatusTitle: "匯出狀態",
      exportStatusIdle: "待命中。請選擇格式並開始本機匯出。",
      qualityOptions: {
        standard: "標準",
        high: "高",
      },
      advisoryMessages: {
        workerSupportError:
          "此瀏覽器無法啟動背景 worker，因此本機影片匯出已停用。請改用現代桌面瀏覽器搭配 PNG Sequence。",
        webmUnavailableError:
          "此瀏覽器無法使用 WebM 匯出。PNG Sequence 仍是最安全的替代方案。",
        heavyExportWarning:
          "這次匯出可能會吃掉較多記憶體與 CPU。如果瀏覽器開始吃力，請考慮 720p、30 秒或 PNG Sequence。",
        pngSequenceInfo:
          "PNG Sequence 是給剪輯軟體最可靠的 local-first 交接方式，特別是在透明度很重要時。",
      },
      runtimeMessages: {
        exportReadyTemplate: "匯出完成：{fileName}",
        preparingWebm: "正在準備本機 WebM 匯出",
        preparingPngSequence: "正在準備本機 PNG Sequence 匯出",
        exportWorkerUnavailable: "此瀏覽器工作階段無法使用匯出 worker。",
        webmFailedUnexpectedly: "WebM 匯出發生未預期錯誤。",
        pngSequenceFailedUnexpectedly: "PNG Sequence 匯出發生未預期錯誤。",
      },
    },
  },
  seoSection: {
    notesEyebrow: "工具說明",
    heading: "一個工具頁面，加上真正用得上的最少必要說明。",
    description:
      "Time Overlay 是一個 local-first 的 overlay timer 產生器。你可以在上方設定時長、樣式、位置與匯出格式，下方則保留給 SEO 與實際工作流程中真正重要的問題。",
    exportFormatsTitle: "匯出格式",
    exportFormatsPngText:
      "如果你需要透明 overlay 或方便剪輯的素材，PNG Sequence 是最可靠的本機匯出方式。",
    exportFormatsWebmText:
      "如果目前環境支援穩定，WebM 可作為瀏覽器原生、較方便的輸出選項。",
    workflowEyebrow: "運作方式",
    workflowHeading: "Overlay timer 匯出怎麼做",
    workflowSteps: [
      {
        title: "設定倒數長度與版面",
        body:
          "先從上方產生器開始。決定總時長、挑選乾淨的時鐘版面，並把 overlay 放在不論是遊戲畫面、產品影片還是 talking-head 影片上都能清楚閱讀的位置。",
      },
      {
        title: "選擇適合素材的計時器樣式",
        body:
          "調整字體、對比、大小與位置，讓倒數看起來像是刻意設計的一部分，而不是事後硬貼上去的元素。好的 overlay timer 通常會使用清楚的數字、穩定的節奏與足夠的邊界留白。",
      },
      {
        title: "匯出適合你剪輯流程的格式",
        body:
          "當你需要最穩定的透明素材流程時，使用 PNG Sequence；如果較輕量的本機影片檔就夠用，則可以選擇 WebM。",
      },
    ],
    usageEyebrow: "使用方式",
    usageHeading: "如何使用 Time Overlay",
    usageNotes: [
      "打開產生器，先設定計時長度，再決定是否要匯出。",
      "如果你要在 CapCut、Premiere Pro、Final Cut Pro、DaVinci Resolve 或其他偏好圖片素材的流程中使用透明 overlay，請選 PNG Sequence。",
      "如果你只想快速在瀏覽器中匯出做 mockup、rough cut 或較輕量的社群剪輯，使用 WebM 即可。",
      "請保持計時器短、對比高，並避開字幕與人臉區域，這樣在手機上也會比較好讀。",
    ],
    usageCta: {
      beforeFirstLink: "先從",
      firstLinkLabel: "即時產生器",
      betweenLinks: "開始，再搭配下方的",
      secondLinkLabel: "匯出指南",
      afterSecondLink: "判斷你需要的是透明影格還是瀏覽器影片輸出。",
    },
    aboutEyebrow: "關於",
    aboutHeading: "關於 Time Overlay",
    aboutPoints: [
      "Time Overlay 是為了那些想製作倒數圖形、但不想把影片上傳到遠端渲染服務的創作者而打造的 local-first overlay timer 產生器。",
      "這個頁面刻意維持精簡：一個真的可用的工具區、一個清楚的匯出格式說明，以及一個回答工作流程問題的 SEO 支援區。",
      "因此這個首頁既可以作為真實製作工具，也可以成為對應 overlay timer、countdown timer overlay、transparent countdown overlay、timer overlay for video editing 等搜尋詞的著陸頁。",
    ],
    aboutCta: {
      beforeLink: "如果你想先處理實務上的疑問，請直接查看",
      linkLabel: "overlay timer FAQ",
      afterLink: "。",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay timer 重點整理",
    faqItems: [
      {
        question: "我可以匯出帶透明背景的 overlay timer 嗎？",
        answer:
          "可以。最穩妥的 local-first 路徑是 PNG Sequence，因為剪輯軟體通常比起壓縮影片更能穩定處理帶透明度的圖片素材。若瀏覽器支援也可以用 WebM，但在透明度很重要的情境下，PNG Sequence 仍然更保險。",
      },
      {
        question: "我應該先選哪個匯出格式？",
        answer:
          "如果你最在意的是穩定交接到剪輯軟體，尤其是要疊在真實影片上做 compositing，先從 PNG Sequence 開始。若你需要較輕量的本機影片檔，而且瀏覽器支援良好，就可以選 WebM。",
      },
      {
        question: "這個工具是伺服器端渲染嗎？",
        answer:
          "不是。核心體驗是 local-first。預覽與匯出都在使用者裝置上完成，因此首頁表現得像一個真正的工具，而不是依賴遠端渲染佇列。",
      },
      {
        question: "哪種計時器樣式在影片裡最易讀？",
        answer:
          "通常是高對比、簡單俐落的數字最容易讀。等寬數字、節制的發光效果與謹慎的角落位置，往往比裝飾性較強的樣式更適合複雜畫面。",
      },
      {
        question: "這可以用在 TikTok、YouTube，以及像 CapCut 或 Premiere 這類剪輯器嗎？",
        answer:
          "可以，但交接路徑會不同。短影音與剪輯流程通常更適合透明素材或圖片序列；如果你只需要一個輕量檔案，本機 WebM 匯出也很實用。",
      },
    ],
  },
} satisfies RootPageContent;

export default zhHantRootPageContent;
