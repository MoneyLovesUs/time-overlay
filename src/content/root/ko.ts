import type { RootPageContent } from "@/content/root/types";

const koRootPageContent = {
  metadata: {
    title: "PNG 시퀀스 및 WebM 내보내기를 위한 오버레이 타이머 생성기",
    description:
      "브라우저에서 바로 오버레이 타이머를 만들고 실시간 미리보기를 확인한 뒤, 한 페이지의 로컬 우선 도구에서 PNG 시퀀스 또는 WebM으로 내보내세요.",
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
    },
    controlPanel: {
      title: "컨트롤",
      subtitle: "입력 스택",
      timerSetupTitle: "타이머 설정",
      durationLabel: "길이(초)",
      displayFormatLabel: "표시 형식",
      canvasTitle: "캔버스",
      resolutionPresetLabel: "해상도 프리셋",
      backgroundModeLabel: "배경 모드",
      styleTitle: "스타일",
      fontFamilyLabel: "글꼴 패밀리",
      anchorLabel: "앵커",
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
      qualityLabel: "품질",
      launchNoteTitle: "출시 노트",
      launchNoteFallback:
        "MVP에서는 내보내기가 계속 로컬 우선으로 동작합니다. 현재 브라우저에서 포맷이 지원되지 않으면 UI가 PNG 시퀀스로 안내합니다.",
      exportButtonIdle: "에셋 내보내기",
      exportButtonBusy: "내보내는 중...",
      exportStatusTitle: "내보내기 상태",
      exportStatusIdle:
        "대기 중입니다. 포맷을 선택하고 로컬 내보내기를 시작하세요.",
      standardQualityLabel: "표준",
      highQualityLabel: "고품질",
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
