import type { RootPageContent } from "@/content/root/types";

const koRootPageContent = {
  metadata: {
    title: "영상·라이브 스트림용 카운트다운 타이머 오버레이 생성기",
    description:
      "브라우저에서 깔끔한 카운트다운 타이머 오버레이를 바로 만들 수 있습니다. 즉시 미리 보고 투명 PNG 시퀀스 또는 WebM으로 내보내 영상 편집, 라이브 스트림, 튜토리얼에 활용하세요.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "길이를 설정하고 프레임을 미리본 뒤, 타이머 에셋을 내보내세요.",
    intro:
      "첫 시도 추천값: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "녹화와 라이브 스트림에서 깔끔하고 읽기 쉬운 카운트다운이 필요한 크리에이터를 위한 오버레이 타이머 도구입니다.",
    header: {
      shellLabel: "퍼블릭 셸",
      toolLinkLabel: "도구",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "시스템 레일",
      publicStatusLabel: "공개 상태",
      identityTitle: "아이덴티티",
      jumpTitle: "바로가기",
      productTitle: "제품",
      jumpLinks: [
        { anchorId: "tool", label: "생성기" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "포맷" },
      ],
      productDescription:
        "카운트다운 오버레이, 간결한 FAQ, 내보내기 포맷 가이드를 한 곳에 모은 로컬 우선 단일 도구 페이지입니다.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "테마 프리셋",
      description:
        "기본 스타일을 먼저 고르고, 필요할 때만 컨트롤을 세부 조정하세요.",
      presetLabels: {
        "minimal-neon": "미니멀 네온",
        "broadcast-alert": "브로드캐스트 알림",
        "calm-studio": "차분한 스튜디오",
      },
    },
    controlPanel: {
      title: "컨트롤",
      subtitle: "입력 스택",
      timerSetupTitle: "타이머 설정",
      durationLabel: "길이(초)",
      displayFormatLabel: "표시 형식",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "캔버스",
      resolutionPresetLabel: "해상도 프리셋",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "배경 모드",
      styleTitle: "스타일",
      fontFamilyLabel: "글꼴 패밀리",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "앵커",
      anchorOptions: {
        "top-left": "왼쪽 위",
        "top-center": "위 중앙",
        "top-right": "오른쪽 위",
        "center-left": "왼쪽 중앙",
        center: "정중앙",
        "center-right": "오른쪽 중앙",
        "bottom-left": "왼쪽 아래",
        "bottom-center": "아래 중앙",
        "bottom-right": "오른쪽 아래",
      },
      transparentOptionLabel: "투명",
      solidOptionLabel: "단색",
    },
    previewPanel: {
      title: "미리보기",
      subtitle: "실시간 캔버스",
      playButton: "미리보기 재생",
      pauseButton: "일시정지",
      resetButton: "초기화",
      safeAreaOnButton: "세이프 영역 켜짐",
      safeAreaOffButton: "세이프 영역 꺼짐",
      currentReadoutLabel: "현재 표시",
    },
    exportPanel: {
      title: "내보내기",
      subtitle: "출력 베이",
      outputFormatTitle: "출력 포맷",
      pngSequenceLabel: "PNG 시퀀스",
      pngSequenceDescription:
        "편집기 전달과 투명 배경 워크플로에서 가장 안정적인 선택입니다.",
      webmLabel: "WebM",
      webmDescription:
        "지원 브라우저에서 가벼운 로컬 영상 내보내기에 적합합니다.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "품질",
      launchNoteTitle: "출시 노트",
      launchNoteFallback:
        "MVP에서는 내보내기가 계속 로컬 우선으로 동작합니다. 현재 브라우저에서 포맷이 지원되지 않으면 UI가 PNG 시퀀스로 안내합니다.",
      exportButtonIdle: "에셋 내보내기",
      exportButtonBusy: "내보내는 중...",
      exportStatusTitle: "내보내기 상태",
      exportStatusIdle:
        "대기 중입니다. 포맷을 선택하고 로컬 내보내기를 시작하세요.",
      qualityOptions: {
        standard: "표준",
        high: "고품질",
      },
      advisoryMessages: {
        workerSupportError:
          "이 브라우저는 백그라운드 워커를 시작할 수 없어 로컬 비디오 내보내기가 비활성화됩니다. 최신 데스크톱 브라우저에서 PNG 시퀀스를 사용하세요.",
        webmUnavailableError:
          "이 브라우저에서는 WebM 내보내기를 사용할 수 없습니다. PNG 시퀀스가 가장 안전한 대안으로 남습니다.",
        heavyExportWarning:
          "이 내보내기는 메모리와 CPU를 많이 사용할 가능성이 큽니다. 브라우저가 버거워지면 720p, 30초 또는 PNG 시퀀스를 고려하세요.",
        pngSequenceInfo:
          "PNG 시퀀스는 특히 투명도가 중요할 때 편집기에 전달하기 가장 안정적인 로컬 우선 형식입니다.",
      },
      runtimeMessages: {
        exportReadyTemplate: "내보내기 준비 완료: {fileName}",
        preparingWebm: "로컬 WebM 내보내기 준비 중",
        preparingPngSequence: "로컬 PNG 시퀀스 내보내기 준비 중",
        exportWorkerUnavailable:
          "이 브라우저 세션에서는 export worker를 사용할 수 없습니다.",
        webmFailedUnexpectedly: "WebM 내보내기가 예기치 않게 실패했습니다.",
        pngSequenceFailedUnexpectedly:
          "PNG 시퀀스 내보내기가 예기치 않게 실패했습니다.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "도구 메모",
    heading: "한 페이지 도구에, 실제 사용에 필요한 최소한의 맥락만 담았습니다.",
    description:
      "Time Overlay는 로컬 우선 오버레이 타이머 생성기로 설계되었습니다. 위 컨트롤에서 길이, 스타일, 위치, 내보내기 포맷을 설정하고, 아래 섹션에서는 SEO와 실제 제작 워크플로에 중요한 핵심 질문만 확인하세요.",
    exportFormatsTitle: "내보내기 포맷",
    exportFormatsPngText:
      "투명 오버레이나 편집기 친화적 에셋이 필요할 때는 PNG 시퀀스가 가장 신뢰할 수 있는 로컬 내보내기입니다.",
    exportFormatsWebmText:
      "현재 환경에서 안정적으로 지원된다면 WebM을 브라우저 기본 편의 경로로 사용할 수 있습니다.",
    workflowEyebrow: "작동 방식",
    workflowHeading: "오버레이 타이머 내보내기 방식",
    workflowSteps: [
      {
        title: "카운트다운 길이와 레이아웃 설정",
        body:
          "위의 생성기에서 시작하세요. 전체 길이를 정하고, 깔끔한 시계 레이아웃을 고른 다음, gameplay나 제품 영상, talking-head 화면 위에서도 잘 읽히는 위치에 오버레이를 배치합니다.",
      },
      {
        title: "영상에 맞는 타이머 스타일 선택",
        body:
          "타이포그래피, 대비, 크기, 위치를 조정해 타이머가 억지로 붙은 요소가 아니라 의도된 구성처럼 보이게 하세요. 좋은 오버레이 타이머는 보통 굵은 숫자, 안정적인 간격, 프레임 가장자리와의 충분한 여백을 사용합니다.",
      },
      {
        title: "편집기에 맞는 포맷으로 내보내기",
        body:
          "가장 안전한 투명 에셋 워크플로가 필요하면 PNG 시퀀스를, 더 가벼운 로컬 비디오 파일이면 충분하다면 WebM을 선택하세요.",
      },
    ],
    usageEyebrow: "사용 방법",
    usageHeading: "Time Overlay 사용 방법",
    usageNotes: [
      "생성기를 열고 타이머 길이를 설정한 뒤 어떤 것도 내보내기 전에 카운트다운을 미리 확인하세요.",
      "CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve 또는 이미지 기반 에셋을 선호하는 워크플로에서는 PNG 시퀀스를 사용하세요.",
      "목업, 러프 컷, 가벼운 소셜 편집에는 브라우저에서 빠르게 내보낼 수 있는 WebM을 사용하세요.",
      "모바일에서도 읽히도록 타이머는 짧고 대비가 높게 유지하고, 자막이나 얼굴 프레이밍과 겹치지 않게 배치하세요.",
    ],
    usageCta: {
      beforeFirstLink: "",
      firstLinkLabel: "라이브 생성기",
      betweenLinks: "에서 시작하고 아래 ",
      secondLinkLabel: "내보내기 가이드",
      afterSecondLink:
        "를 활용해 투명 프레임과 브라우저 비디오 출력 중 어떤 쪽이 맞는지 결정하세요.",
    },
    aboutEyebrow: "소개",
    aboutHeading: "Time Overlay 소개",
    aboutPoints: [
      "Time Overlay는 원격 렌더 서비스에 영상을 업로드하지 않고도 카운트다운 그래픽이 필요한 크리에이터를 위한 로컬 우선 오버레이 타이머 생성기입니다.",
      "이 페이지는 의도적으로 압축되어 있습니다. 실제로 작동하는 도구 표면 하나, 명확한 내보내기 형식 설명 하나, 그리고 사람들이 타이머 도구를 신뢰하기 전에 검색하는 워크플로 질문에 답하는 SEO 지원 영역 하나로 구성됩니다.",
      "그 덕분에 homepage는 실제 제작용 유틸리티이면서 overlay timer, countdown timer overlay, transparent countdown overlay, timer overlay for video editing 같은 검색어에 대응하는 랜딩 페이지 역할도 합니다.",
    ],
    aboutCta: {
      beforeLink: "실무적인 질문부터 빠르게 확인하고 싶다면 ",
      linkLabel: "오버레이 타이머 FAQ",
      afterLink: "로 이동하세요.",
    },
    faqTitle: "FAQ",
    faqSubtitle: "오버레이 타이머 핵심 가이드",
    faqItems: [
      {
        question: "투명 배경이 있는 오버레이 타이머를 내보낼 수 있나요?",
        answer:
          "가능합니다. 가장 안전한 로컬 우선 경로는 PNG 시퀀스입니다. 편집기들이 압축 비디오보다 이미지 기반 투명 에셋을 더 안정적으로 처리하기 때문입니다. 브라우저가 지원하면 WebM도 가능하지만, 투명도가 중요할 때는 PNG 시퀀스가 더 안전한 전달 방식입니다.",
      },
      {
        question: "어떤 내보내기 포맷을 먼저 선택해야 하나요?",
        answer:
          "실제 영상 위에 합성하는 경우처럼 편집기 전달 안정성이 중요하면 PNG 시퀀스를 먼저 선택하세요. 파일을 가볍게 유지하고 브라우저 지원이 충분할 때는 WebM이 적합합니다.",
      },
      {
        question: "이 도구는 서버에서 렌더링되나요?",
        answer:
          "아니요. 핵심 경험은 로컬 우선입니다. 미리보기와 내보내기는 사용자 기기에서 실행되므로, 원격 렌더 큐를 기다리는 대신 실제 도구처럼 즉시 동작합니다.",
      },
      {
        question: "영상에서 가장 잘 읽히는 타이머 스타일은 무엇인가요?",
        answer:
          "강한 대비의 단순한 숫자가 보통 가장 잘 읽힙니다. 모노스페이스 숫자, 과하지 않은 글로우, 신중한 코너 배치가 복잡한 화면에서도 장식적인 스타일보다 가독성이 높습니다.",
      },
      {
        question:
          "TikTok, YouTube, CapCut·Premiere 같은 편집기 워크플로에도 쓸 수 있나요?",
        answer:
          "네, 다만 전달 경로가 달라집니다. 숏폼과 편집기 워크플로에서는 투명 또는 이미지 시퀀스 내보내기가 유리한 경우가 많고, 가벼운 결과물만 필요하면 로컬 WebM 내보내기도 충분히 실용적입니다.",
      },
    ],
  },
} satisfies RootPageContent;

export default koRootPageContent;
