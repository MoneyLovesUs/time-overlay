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
    templateGallery: {
      title: "템플릿 라이브러리",
      description:
        "검증된 레이아웃으로 시작하세요. 재생 시간과 내보내기 설정은 유지됩니다.",
      browseLabel: "48개 모두 보기",
      searchPlaceholder: "템플릿 또는 용도 검색",
      categoryLabels: {
        all: "전체",
        editing: "편집",
        streaming: "스트리밍",
        social: "소셜",
        events: "이벤트",
        fitness: "피트니스",
        cinematic: "시네마틱",
        minimal: "미니멀",
      },
      selectedLabel: "선택됨",
      editedLabel: "편집됨",
      resultTemplate: "템플릿 {count}개",
      noResults: "이 필터와 일치하는 템플릿이 없습니다.",
      closeLabel: "템플릿 라이브러리 닫기",
    },
    themePresetPicker: {
      title: "테마 프리셋",
      description:
        "기본 스타일을 먼저 고르고, 필요할 때만 컨트롤을 세부 조정하세요.",
      presetLabels: {
        cyber: "Cyber",
        minimal: "Minimal",
        mono: "Mono",
        neon: "Neon",
        glow: "Glow",
        scanline: "Scanline",
        classic: "Classic",
        retro: "Retro 80s",
        glass: "Glass",
        neumorphic: "Neumorphic",
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
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
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
    audioTitle: "Audio",
    audioVariantLabel: "Audio cues",
    audioVariantOptions: {
      none: "None",
      tick: "Tick every second",
      beep: "Final beep only",
      "tick-and-beep": "Tick + final beep",
    },
    audioNote: "Audio is embedded in WebM (with alpha) exports. PNG sequence is silent.",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "OBS와 Streamlabs용 투명 VP8 영상이에요. 배경이 제거된 상태로 미디어 소스에 추가할 수 있어요.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "OBS와 VP9 alpha가 확인된 작업 환경을 위한 더 작은 투명 영상이에요. 편집기별 가져오기 지원은 달라요.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
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
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "이 내보내기는 메모리와 CPU를 많이 사용할 가능성이 큽니다. 브라우저가 버거워지면 720p, 30초 또는 PNG 시퀀스를 고려하세요.",
        pngSequenceInfo:
          "PNG 시퀀스는 특히 투명도가 중요할 때 편집기에 전달하기 가장 안정적인 로컬 우선 형식입니다.",
      vp9AlphaInfo:
        "WebM VP9 + alpha는 OBS와 이미 확인된 VP9 alpha 작업 환경을 위한 용량이 작은 투명 형식이에요.",
      hevcAlphaInfo:
        "MOV HEVC + alpha는 호환되는 Mac의 Final Cut Pro에 권장하는 직접 내보내기 형식이에요.",
      },
      png: {
        prepareTitle: "PNG 시퀀스 준비",
        prepareIntro:
          "투명 PNG 시퀀스를 내보냅니다. 프레임 저장 위치를 선택하기 전에 아래 계획을 확인하세요.",
        prepareSummaryTemplate:
          "{duration}초 · {fps} fps · {frames}프레임 · {width}×{height}",
        estimateTemplate:
          "약 {size}, ZIP {parts}개, 인코딩에 대략 {time}. 실제 프레임이 기록되면서 예상치가 갱신됩니다.",
        estimateUnknown:
          "샘플 프레임을 가져오지 못해 크기와 시간 예상치를 알 수 없습니다. 내보내기는 계속할 수 있습니다.",
        sampleProgress: "크기와 시간을 예상하기 위해 샘플 프레임을 렌더링하는 중…",
        longJobTitle: "긴 내보내기입니다",
        longJobBody:
          "프레임은 파트별로 디스크에 기록되므로 전체 시퀀스가 메모리에 유지되지 않습니다. 가져오기 전에 모든 ZIP 파트의 압축을 풀어 병합해야 합니다.",
        saveFolderButton: "저장 폴더 선택 후 시작",
        saveFolderHint:
          "브라우저가 쓰기 권한을 한 번 요청합니다. 그 안에 작업 폴더가 만들어지고, 완료된 파트는 디스크에 남습니다.",
        opfsButton: "브라우저에서 생성하고 파트 다운로드",
        opfsHint:
          "브라우저는 다운로드하고 정리할 때까지 임시 파일을 보관합니다. 임시 사본, 다운로드, 압축을 푼 프레임을 위한 공간을 확보하세요.",
        continueButton: "이 탭에서 계속",
        cancelPrepButton: "준비 취소",
        adviceDesktopSafari:
          "더 나은 내보내기 성능을 위해 데스크톱 Chrome을 사용하세요. 계속할 수는 있지만 긴 PNG 내보내기는 주로 Chrome에서 검증됩니다.",
        adviceMobile:
          "더 나은 내보내기 성능을 위해 컴퓨터에서 내보내세요. 이 기기가 저장 공간 검사를 통과하면 계속할 수 있습니다.",
        capabilityMissing:
          "이 내보내기에는 재개 가능한 로컬 저장소와 하나의 활성 탭이 필요하지만, 이 브라우저나 프로필에서는 제공되지 않습니다.",
        longStorageMissing:
          "긴 내보내기에는 쓰기 가능한 폴더나 실제로 쓰기를 받아들이는 브라우저 저장소가 필요합니다. 이 브라우저에는 안전한 저장 위치가 없어 프레임이 생성되지 않았습니다.",
        runTitle: "PNG 시퀀스 내보내기",
        modeDirectory: "저장 폴더",
        modeBrowserStorage: "브라우저 저장소",
        modeMemory: "임시 메모리",
        runFramesTemplate: "처리된 프레임",
        runCommittedTemplate: "안전하게 저장된 프레임",
        runPartTemplate: "현재 파트 · 저장된 파트",
        runBytesTemplate: "기록됨",
        stoppingButton: "중지 중…",
        cancelButton: "내보내기 취소",
        cancelledMessage:
          "내보내기를 중지했습니다. 완료된 ZIP 파트는 유지되며 마지막으로 저장된 파트부터 재개할 수 있습니다.",
        resultTitle: "PNG 내보내기 완료",
        directorySavedTemplate:
          "{folder}에 {frames}프레임을 ZIP {parts}개({size})로 저장했습니다.",
        opfsPartsTitle:
          "ZIP {parts}개, {size}. 목록에 표시되는 동안 각 파트를 다운로드하세요.",
        partDownloadButton: "다운로드",
        partRangeTemplate: "프레임 {first}–{last} · {size}",
        mergeInstructionsTitle: "가져오기 전에",
        mergeInstructionsBody:
          "모든 파트의 압축을 풀고 frame-*.png 파일을 한 폴더로 모은 뒤, 선택한 fps로 해당 폴더를 이미지 시퀀스로 가져오세요. 각 파트를 별도의 카운트다운으로 가져오지 마세요. 첫 번째 ZIP에는 누락된 프레임을 확인하는 변환 스크립트가 포함되어 있습니다.",
        autoDownloadNote:
          "브라우저 다운로드가 시작되었습니다. 완료될 때까지 이 탭을 열어 두세요.",
        openFolderHint:
          "브라우저에서는 파일 관리자를 열 수 없습니다. 필요하면 운영체제의 폴더 창을 사용하세요.",
        cleanupButton: "브라우저 임시 파일 정리",
        recoveryTitle: "완료되지 않은 PNG 내보내기를 찾았습니다",
        recoveryBodyTemplate:
          "전체 {total}프레임 중 {frames}프레임이 {parts}개 파트에 나뉘어 안전하게 저장되었습니다. 완료되지 않은 파트는 다시 처리됩니다.",
        restoreButton: "내보내기 재개",
        authorizeButton: "승인하고 계속",
        selectFolderButton: "내보내기 폴더 선택",
        removeRecordButton: "복구 기록 삭제",
        fontRequired:
          "이 내보내기는 사용자 지정 글꼴을 사용했습니다. 재개하려면 같은 글꼴 파일을 지정하세요.",
        fontButton: "글꼴 파일 선택",
        downloadFailed:
          "다운로드를 시작하지 못했습니다. 완료된 파일은 위에 남아 있습니다. 다시 시도하세요.",
        errorTitle: "PNG 내보내기 문제",
        errorMessages: {
          pngStorageUnavailable:
            "이 브라우저가 PNG 내보내기에 필요한 로컬 저장소를 차단했습니다. 데스크톱 Chrome의 일반 창을 사용하세요.",
          pngDirectoryPermissionDenied:
            "선택한 폴더에 대한 쓰기 권한이 허용되지 않았습니다. 폴더를 다시 선택하고 쓰기를 허용하세요. 내보내기는 시작되지 않았습니다.",
          pngStorageFull:
            "이 PNG 파트를 완료할 여유 공간이 부족합니다. 공간을 확보한 뒤 재개하세요. 저장된 파트는 유지됩니다.",
          pngWriteFailed:
            "PNG 파트 저장에 실패했습니다. 저장된 파트는 유지됩니다. 폴더나 저장소를 확인하고 재개하세요.",
          pngZipValidationFailed:
            "저장된 ZIP 파트가 검증을 통과하지 못했습니다. 해당 파트는 다시 처리되며 이전 파트는 유지됩니다.",
          pngFrameTooLarge:
            "PNG 프레임 한 장 또는 필요한 ZIP 메타데이터가 파트당 한도를 초과했습니다. 해상도를 낮추거나 더 단순한 스타일을 사용하세요.",
          pngMemoryLimitExceeded:
            "이 내보내기에는 메모리 내 처리 한도보다 많은 임시 메모리가 필요합니다. 긴 내보내기에는 쓰기 가능한 폴더와 데스크톱 Chrome을 사용하세요.",
          pngResumeVersionMismatch:
            "저장된 내보내기는 설정, 에셋 또는 앱 버전이 달라 안전하게 이어붙일 수 없습니다. 새 내보내기를 시작하고 기존 파트는 보관하세요.",
          pngResumeFileMissing:
            "저장된 ZIP 파트가 없거나 변경되었습니다. 해당 파트를 다시 처리해야 합니다. 작업 폴더를 다시 선택하고 재개하세요.",
          pngLocked:
            "이 내보내기가 다른 탭에서 열려 있거나 이 브라우저가 작업을 잠글 수 없습니다. 다른 탭을 닫고 다시 시도하세요.",
          pngCheckpointFailed:
            "이 브라우저는 재개 가능한 PNG 내보내기에 필요한 로컬 체크포인트를 유지할 수 없습니다. 데스크톱 Chrome을 사용하거나 메모리에 들어가는 짧은 작업을 내보내세요.",
          pngFailedUnexpectedly:
            "PNG 내보내기가 예기치 않게 중단되었습니다. 저장된 파트가 있으면 유지됩니다. 재개하거나 새 내보내기를 시작하세요.",
        },
      },
      runtimeMessages: {
        exportReadyTemplate: "내보내기 준비 완료: {fileName}",
        preparingWebm: "로컬 WebM 내보내기 준비 중",
        preparingPngSequence: "로컬 PNG 시퀀스 내보내기 준비 중",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "이 브라우저 세션에서는 export worker를 사용할 수 없습니다.",
        webmFailedUnexpectedly: "WebM 내보내기가 예기치 않게 실패했습니다.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "PNG 시퀀스 내보내기가 예기치 않게 실패했습니다.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "도구 메모",
    heading: "한 페이지 도구에, 실제 사용에 필요한 최소한의 맥락만 담았습니다.",
    description:
      "Time Overlay는 로컬 우선 생성기예요. 위에서 길이, 스타일, 위치, 형식을 정하고 아래에서 투명도를 유지하는 방법과 실제 제작 전에 확인할 항목을 살펴보세요.",
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
      "조작 도구, 내보내기 안내, 문제 해결 내용을 한곳에 모아 에셋을 만들고 다른 앱으로 정확하게 넘길 수 있도록 구성했어요.",
      "가이드는 공식 문서로 확인한 지원과 실무 권장 사항을 구분하고, 참고한 출처와 마지막 검토일을 표시해 호환성 정보를 다시 확인할 수 있게 해요.",
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
        question: "영상에 오버레이 타이머를 어떻게 추가하나요?",
        answer:
          "위 생성기에서 길이와 스타일을 설정한 다음 내보내세요. 가장 안정적인 투명 오버레이 타이머가 필요하면 PNG 시퀀스를, 단일 투명 영상 파일이 필요하면 WebM을 선택한 뒤 CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, OBS 등에서 영상 위 레이어에 올리면 됩니다.",
      },
      {
        question: "OBS나 Twitch용 투명 오버레이 타이머를 만들 수 있나요?",
        answer:
          "네. 투명 WebM으로 내보낸 뒤 OBS 또는 Streamlabs에 미디어 소스로 추가하세요. 배경이 이미 제거되어 별도의 크로마키가 필요 없어요. Twitch Studio는 2024년 5월 30일 이후 지원이 종료됐어요.",
      },
      {
        question:
          "오버레이 타이머와 카운트다운 오버레이의 차이는 무엇인가요?",
        answer:
          "보통 같은 것을 의미합니다. 설정한 길이에서 0까지 영상 위에서 카운트다운하는 오버레이 타이머입니다. 이 도구는 카운트다운 방식의 오버레이 타이머를 만들기 때문에 전체 초를 설정하고 MM:SS 같은 표시 형식을 고른 뒤 편집기용으로 내보내면 됩니다.",
      },
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
