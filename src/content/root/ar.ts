import type { RootPageContent } from "@/content/root/types";

const arRootPageContent = {
  metadata: {
    title: "مولد مؤقت عدّ تنازلي كطبقة فوقية للفيديو والبث المباشر",
    description:
      "أنشئ مؤقتات عدّ تنازلي واضحة داخل المتصفح. اعرض المعاينة فورًا وصدّر تسلسلات PNG شفافة أو WebM لتحرير الفيديو والبث المباشر والدروس.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "حدّد المدة، عاين الإطار، ثم صدّر أصل المؤقت.",
    intro: "أول إعداد مقترح: `30s` و`PNG sequence` و`bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "أداة overlay timer للمبدعين الذين يحتاجون إلى عدّ تنازلي واضح وسهل القراءة في التسجيلات والبث المباشر.",
    header: {
      shellLabel: "الواجهة العامة",
      toolLinkLabel: "الأداة",
      faqLinkLabel: "الأسئلة",
    },
    footer: {
      systemRailLabel: "مسار النظام",
      publicStatusLabel: "الحالة العامة",
      identityTitle: "الهوية",
      jumpTitle: "انتقل إلى",
      productTitle: "المنتج",
      jumpLinks: [
        { anchorId: "tool", label: "المولد" },
        { anchorId: "faq", label: "الأسئلة" },
        { anchorId: "export-formats", label: "الصيغ" },
      ],
      productDescription:
        "صفحة أداة واحدة بنهج local-first لعدّ تنازلي overlay مع FAQ مختصر وإرشادات صيغ التصدير.",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "مكتبة القوالب",
      description:
        "ابدأ بتخطيط مجرّب. ستبقى المدة وخيارات التصدير كما هي.",
      browseLabel: "تصفح جميع القوالب الـ 48",
      searchPlaceholder: "ابحث في القوالب أو حالات الاستخدام",
      categoryLabels: {
        all: "الكل",
        editing: "المونتاج",
        streaming: "البث",
        social: "التواصل",
        events: "الفعاليات",
        fitness: "اللياقة",
        cinematic: "سينمائي",
        minimal: "بسيط",
      },
      selectedLabel: "محدد",
      editedLabel: "معدل",
      resultTemplate: "{count} قالبًا",
      noResults: "لا توجد قوالب تطابق هذا الفلتر.",
      closeLabel: "إغلاق مكتبة القوالب",
    },
    themePresetPicker: {
      title: "النسق المسبق",
      description: "اختر مظهرًا ابتدائيًا، ثم عدّل عناصر التحكم فقط عند الحاجة.",
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
      title: "عناصر التحكم",
      subtitle: "طبقة الإدخال",
      timerSetupTitle: "إعداد المؤقت",
      durationLabel: "المدة (بالثواني)",
      displayFormatLabel: "صيغة العرض",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "اللوحة",
      resolutionPresetLabel: "إعداد الدقة",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "وضع الخلفية",
      styleTitle: "النمط",
      fontFamilyLabel: "عائلة الخط",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "الموضع",
      anchorOptions: {
        "top-left": "أعلى اليسار",
        "top-center": "أعلى الوسط",
        "top-right": "أعلى اليمين",
        "center-left": "الوسط يسار",
        center: "الوسط",
        "center-right": "الوسط يمين",
        "bottom-left": "أسفل اليسار",
        "bottom-center": "أسفل الوسط",
        "bottom-right": "أسفل اليمين",
      },
      transparentOptionLabel: "شفاف",
      solidOptionLabel: "مصمت",
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
      title: "المعاينة",
      subtitle: "لوحة مباشرة",
      playButton: "تشغيل المعاينة",
      pauseButton: "إيقاف مؤقت",
      resetButton: "إعادة ضبط",
      safeAreaOnButton: "المنطقة الآمنة مفعلة",
      safeAreaOffButton: "المنطقة الآمنة متوقفة",
      currentReadoutLabel: "القراءة الحالية",
    },
    exportPanel: {
      title: "التصدير",
      subtitle: "منطقة الإخراج",
      outputFormatTitle: "صيغة الإخراج",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "الخيار الأكثر موثوقية للمحررات وللتسليم الشفاف.",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "فيديو VP8 شفاف لـ OBS وStreamlabs. أضِفه كمصدر وسائط بخلفية مزالة مسبقًا.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "فيديو شفاف أصغر لـ OBS ولمسارات العمل التي اختُبر فيها VP9 alpha؛ يختلف دعم الاستيراد بين برامج التحرير.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "الجودة",
      launchNoteTitle: "ملاحظة",
      launchNoteFallback:
        "يبقى التصدير local-first في هذه النسخة MVP. إذا لم تكن الصيغة مدعومة في المتصفح الحالي، ستوجّهك الواجهة إلى PNG Sequence.",
      exportButtonIdle: "تصدير الأصل",
      exportButtonBusy: "جارٍ التصدير...",
      exportStatusTitle: "حالة التصدير",
      exportStatusIdle: "في وضع الانتظار. اختر الصيغة وابدأ التصدير المحلي.",
      qualityOptions: {
        standard: "قياسية",
        high: "مرتفعة",
      },
      advisoryMessages: {
        workerSupportError:
          "هذا المتصفح لا يستطيع تشغيل عامل في الخلفية، لذلك تم تعطيل تصدير الفيديو المحلي. استخدم PNG Sequence في متصفح مكتبي حديث.",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "قد يستهلك هذا التصدير قدرًا كبيرًا من الذاكرة والمعالج. جرّب 720p أو 30 ثانية أو PNG Sequence إذا بدأ المتصفح بالتباطؤ.",
        pngSequenceInfo:
          "يظل PNG Sequence أكثر مسار local-first موثوقية للتسليم إلى برامج المونتاج، خصوصًا عندما تكون الشفافية مهمة.",
      vp9AlphaInfo:
        "WebM VP9 + alpha تنسيق شفاف مدمج لـ OBS ولمسارات العمل التي تم التحقق منها مع VP9 alpha.",
      hevcAlphaInfo:
        "MOV HEVC + alpha هو خيار التصدير المباشر الموصى به لـ Final Cut Pro على جهاز Mac متوافق.",
      },
      png: {
        prepareTitle: "تجهيز تسلسل PNG",
        prepareIntro:
          "أنت تصدّر تسلسل PNG شفافًا. راجع الخطة أدناه قبل اختيار مكان حفظ الإطارات.",
        prepareSummaryTemplate:
          "{duration} ثانية · {fps} fps · {frames} إطارًا · {width}×{height}",
        estimateTemplate:
          "نحو {size}، و{parts} جزء ZIP، وحوالي {time} من الترميز. تتحدث التقديرات مع كتابة الإطارات الفعلية.",
        estimateUnknown:
          "لم تتوفر إطارات عيّنة، لذا تقديرات الحجم والوقت غير معروفة. يمكن أن يستمر التصدير مع ذلك.",
        sampleProgress: "جارٍ عرض إطارات عيّنة لتقدير الحجم والوقت…",
        longJobTitle: "هذا تصدير طويل",
        longJobBody:
          "تُكتب الإطارات على القرص جزءًا بعد جزء، لذا لا يبقى التسلسل كاملًا في الذاكرة. يجب فك ضغط كل جزء ZIP ودمجه قبل الاستيراد.",
        saveFolderButton: "اختر مجلد الحفظ وابدأ",
        saveFolderHint:
          "يطلب المتصفح إذن الكتابة مرة واحدة. يُنشأ مجلد مهمة داخله، وتبقى الأجزاء المكتملة على القرص.",
        opfsButton: "أنشئ داخل المتصفح ونزّل الأجزاء",
        opfsHint:
          "يحتفظ المتصفح بالملفات المؤقتة حتى تنزّلها وتنظّفها. اترك مساحة للنسخة المؤقتة ولتنزيلاتك وللإطارات بعد فك الضغط.",
        continueButton: "تابع في هذا التبويب",
        cancelPrepButton: "إلغاء التجهيز",
        adviceDesktopSafari:
          "لأداء تصدير أفضل، استخدم Chrome على سطح المكتب. يمكنك المتابعة، لكن عمليات تصدير PNG الطويلة تُختبر أساسًا في Chrome.",
        adviceMobile:
          "لأداء تصدير أفضل، صدّر على حاسوب. يمكنك المتابعة إذا نجح هذا الجهاز في فحص التخزين.",
        capabilityMissing:
          "يحتاج هذا التصدير إلى تخزين محلي قابل للاستئناف وإلى تبويب نشط واحد، وهو ما لا يوفره هذا المتصفح أو هذا الملف الشخصي.",
        longStorageMissing:
          "يحتاج التصدير الطويل إلى مجلد قابل للكتابة أو إلى تخزين متصفح يقبل الكتابة فعليًا. لا يوفّر هذا المتصفح وجهة آمنة، لذلك لم تُنشأ أي إطارات.",
        runTitle: "تصدير تسلسل PNG",
        modeDirectory: "مجلد الحفظ",
        modeBrowserStorage: "تخزين المتصفح",
        modeMemory: "ذاكرة مؤقتة",
        runFramesTemplate: "الإطارات المعالجة",
        runCommittedTemplate: "الإطارات المحفوظة بأمان",
        runPartTemplate: "الجزء الحالي · الأجزاء المحفوظة",
        runBytesTemplate: "المكتوب",
        stoppingButton: "جارٍ الإيقاف…",
        cancelButton: "إلغاء التصدير",
        cancelledMessage:
          "توقف التصدير. أجزاء ZIP المكتملة محفوظة؛ استأنف من آخر جزء محفوظ.",
        resultTitle: "اكتمل تصدير PNG",
        directorySavedTemplate:
          "تم حفظ {frames} إطارًا في {parts} جزء ZIP داخل {folder} ({size}).",
        opfsPartsTitle:
          "{parts} جزء ZIP، {size}. نزّل كل جزء ما دام ظاهرًا هنا.",
        partDownloadButton: "تنزيل",
        partRangeTemplate: "الإطارات {first}–{last} · {size}",
        mergeInstructionsTitle: "قبل الاستيراد",
        mergeInstructionsBody:
          "فك ضغط كل الأجزاء، وانقل جميع ملفات frame-*.png إلى مجلد واحد، ثم استورد ذلك المجلد كتسلسل صور بالمعدل fps المختار. لا تستورد كل جزء كعدّ تنازلي منفصل. يتضمن ملف ZIP الأول نصوصًا برمجية للتحقق من الإطارات الناقصة.",
        autoDownloadNote:
          "بدأ تنزيل المتصفح. أبقِ هذا التبويب مفتوحًا حتى ينتهي.",
        openFolderHint:
          "لا يستطيع المتصفح فتح مدير الملفات؛ استخدم نافذة مجلدات النظام عند الحاجة.",
        cleanupButton: "نظّف الملفات المؤقتة للمتصفح",
        recoveryTitle: "تم العثور على تصدير PNG غير مكتمل",
        recoveryBodyTemplate:
          "تم حفظ {frames} من أصل {total} إطارًا بأمان على {parts} جزء. سيُعاد تنفيذ الجزء غير المكتمل.",
        restoreButton: "استئناف التصدير",
        authorizeButton: "اسمح وتابع",
        selectFolderButton: "اختر مجلد التصدير",
        removeRecordButton: "احذف سجل الاستعادة",
        fontRequired:
          "استخدم هذا التصدير خطًا مخصصًا. قدّم ملف الخط نفسه للاستئناف.",
        fontButton: "اختر ملف الخط",
        downloadFailed:
          "تعذّر بدء التنزيل. الملفات المكتملة ما زالت متاحة أعلاه؛ أعد المحاولة.",
        errorTitle: "مشكلة في تصدير PNG",
        errorMessages: {
          pngStorageUnavailable:
            "منع هذا المتصفح التخزين المحلي اللازم لتصدير PNG. استخدم نافذة عادية في Chrome على سطح المكتب.",
          pngDirectoryPermissionDenied:
            "لم يُمنح إذن الكتابة إلى المجلد المختار. اختر المجلد مجددًا واسمح بالكتابة؛ لم يبدأ أي تصدير.",
          pngStorageFull:
            "لا توجد مساحة حرة كافية لإكمال جزء PNG هذا. وفّر بعض المساحة ثم استأنف؛ الأجزاء المحفوظة تبقى.",
          pngWriteFailed:
            "فشل حفظ جزء PNG. الأجزاء المحفوظة تبقى؛ تحقق من المجلد أو التخزين ثم استأنف.",
          pngZipValidationFailed:
            "فشل التحقق من جزء ZIP محفوظ. سيُعاد تنفيذه؛ الأجزاء السابقة تبقى.",
          pngFrameTooLarge:
            "إطار PNG واحد أو البيانات الوصفية اللازمة في ZIP أكبر من الحد لكل جزء. خفّض الدقة أو استخدم نمطًا أبسط.",
          pngMemoryLimitExceeded:
            "يحتاج هذا التصدير إلى ذاكرة مؤقتة أكثر من المسار المحدود داخل الذاكرة. استخدم Chrome على سطح المكتب مع مجلد قابل للكتابة للتصدير الطويل.",
          pngResumeVersionMismatch:
            "حُفظ التصدير بإعدادات أو أصول أو إصدار تطبيق مختلف، ولا يمكن ضمه بأمان. ابدأ تصديرًا جديدًا واحتفظ بالأجزاء الحالية.",
          pngResumeFileMissing:
            "جزء ZIP محفوظ مفقود أو تغيّر. يجب إعادة تنفيذ الجزء المتأثر؛ أعد اختيار مجلد المهمة ثم استأنف.",
          pngLocked:
            "هذا التصدير مفتوح في تبويب آخر، أو لا يستطيع هذا المتصفح قفل المهمة. أغلق التبويب الآخر وأعد المحاولة.",
          pngCheckpointFailed:
            "لا يستطيع هذا المتصفح حفظ نقطة التحقق المحلية التي تحتاجها تصديرات PNG القابلة للاستئناف. استخدم Chrome على سطح المكتب، أو صدّر مهمة قصيرة تتسع في الذاكرة.",
          pngFailedUnexpectedly:
            "توقف تصدير PNG بشكل غير متوقع. الأجزاء المحفوظة، إن وُجدت، تبقى؛ استأنف أو ابدأ تصديرًا جديدًا.",
        },
      },
      runtimeMessages: {
        exportReadyTemplate: "اكتمل التصدير: {fileName}",
        preparingWebm: "جارٍ تجهيز تصدير WebM المحلي",
        preparingPngSequence: "جارٍ تجهيز تصدير PNG Sequence المحلي",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "عامل التصدير غير متاح في جلسة المتصفح هذه.",
        webmFailedUnexpectedly: "فشل تصدير WebM بشكل غير متوقع.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "فشل تصدير PNG Sequence بشكل غير متوقع.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "ملاحظات الأداة",
    heading: "صفحة أداة واحدة، ومعها فقط أقل قدر من السياق الذي تحتاجه لاستخدامها جيدًا.",
    description:
      "Time Overlay مولّد يعمل محليًا أولًا. حدّد المدة والنمط والموضع والصيغة في الأعلى، ثم راجع أدناه كيفية الحفاظ على الشفافية وما ينبغي اختباره قبل استخدام الملف في الإنتاج.",
    exportFormatsTitle: "صيغ التصدير",
    exportFormatsPngText:
      "عندما تحتاج إلى overlay شفاف أو ملفات مناسبة للمونتاج، فإن PNG Sequence هو أكثر أساليب التصدير المحلي موثوقية.",
    exportFormatsWebmText:
      "إذا كانت البيئة الحالية تدعمه بثبات، فيمكن استخدام WebM كخيار مريح من المتصفح نفسه.",
    workflowEyebrow: "كيف يعمل",
    workflowHeading: "كيف تعمل عملية تصدير overlay timer",
    workflowSteps: [
      {
        title: "حدّد مدة العدّ التنازلي وتخطيطه",
        body:
          "ابدأ من المولد في الأعلى. اختر المدة الكاملة، وحدد تخطيط ساعة نظيفًا، وضع الـ overlay في مكان يبقى فيه مقروءًا فوق gameplay أو تصوير المنتجات أو فيديو talking-head.",
      },
      {
        title: "اختر نمط المؤقت المناسب للمشهد",
        body:
          "اضبط الخط والتباين والحجم والموضع حتى يبدو العدّ التنازلي جزءًا مقصودًا من الصورة لا عنصرًا أُلصق لاحقًا. أفضل overlay timers غالبًا ما تعتمد على أرقام واضحة، وإيقاع بصري ثابت، ومساحة كافية عن أطراف الإطار.",
      },
      {
        title: "صدّر الصيغة المناسبة للمحرر الذي تستخدمه",
        body:
          "استخدم PNG Sequence عندما تحتاج إلى أكثر مسار آمن للأصول الشفافة، أو اختر WebM إذا كان ملف فيديو محلي أخف يكفي لمشروعك.",
      },
    ],
    usageEyebrow: "طريقة الاستخدام",
    usageHeading: "كيف تستخدم Time Overlay",
    usageNotes: [
      "افتح المولد، اضبط مدة المؤقت، وعاين العدّ التنازلي قبل أن تصدّر أي شيء.",
      "استخدم PNG Sequence للـ overlays الشفافة في CapCut وPremiere Pro وFinal Cut Pro وDaVinci Resolve أو أي سير عمل يفضّل الأصول المبنية على الصور.",
      "استخدم WebM عندما تحتاج إلى تصدير سريع من المتصفح من أجل mockups أو rough cuts أو تعديلات اجتماعية خفيفة.",
      "اجعل المؤقت قصيرًا وعالي التباين وبعيدًا عن الترجمة أو الوجوه حتى يبقى مقروءًا على الهاتف.",
    ],
    usageCta: {
      beforeFirstLink: "ابدأ من ",
      firstLinkLabel: "المولد المباشر",
      betweenLinks: "واستخدم ",
      secondLinkLabel: "دليل التصدير",
      afterSecondLink: "في الأسفل عندما تقارن بين الإطارات الشفافة وإخراج الفيديو من المتصفح.",
    },
    aboutEyebrow: "حول",
    aboutHeading: "حول Time Overlay",
    aboutPoints: [
      "Time Overlay هو مولد overlay timer بنهج local-first للمبدعين الذين يحتاجون إلى رسومات عدّ تنازلي من دون رفع اللقطات إلى خدمة رندر بعيدة.",
      "يجمع المولّد عناصر التحكم وإرشادات التصدير وخطوات استكشاف الأعطال في مكان واحد، لتنشئ الأصل وتنقله بصورة صحيحة إلى تطبيق آخر.",
      "تفصل الأدلة بين الدعم الموثق والتوصيات العملية، وتعرض المصادر التي تمت مراجعتها وتاريخ آخر مراجعة حتى يمكن إعادة التحقق من التوافق.",
    ],
    aboutCta: {
      beforeLink: "إذا كنت تريد أولًا حسم الاعتراضات العملية، فانتقل إلى ",
      linkLabel: "FAQ الخاصة بـ overlay timer",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "أساسيات overlay timer",
    faqItems: [
      {
        question: "هل يمكنني تصدير overlay timer مع شفافية؟",
        answer:
          "نعم. أكثر مسار local-first أمانًا هو PNG Sequence، لأن برامج المونتاج تتعامل مع الأصول الشفافة المعتمدة على الصور بشكل أوثق من مسارات الفيديو المضغوط. WebM متاح إذا كان المتصفح يدعمه، لكن عندما تكون الشفافية مهمة يبقى PNG Sequence الخيار الأكثر أمانًا.",
      },
      {
        question: "أي صيغة تصدير أختار أولًا؟",
        answer:
          "ابدأ بـ PNG Sequence إذا كنت تريد أكثر تسليم موثوق إلى برامج المونتاج، خاصة عند التركيب فوق فيديو حقيقي. اختر WebM عندما تحتاج إلى ملف فيديو محلي أخف ويكون المتصفح داعمًا له بشكل جيد.",
      },
      {
        question: "هل تُرندر هذه الأداة على الخادم؟",
        answer:
          "لا. التجربة الأساسية local-first. تتم المعاينة والتصدير على جهاز المستخدم نفسه، بحيث تتصرف الصفحة كأداة حقيقية بدل انتظار طابور رندر بعيد.",
      },
      {
        question: "ما النمط الأكثر قابلية للقراءة داخل الفيديو؟",
        answer:
          "عادةً ما تعمل الأرقام البسيطة ذات التباين العالي بشكل أفضل. الأرقام أحادية العرض، والوهج المعتدل، والتموضع الحذر في الزوايا تبقى أكثر وضوحًا فوق المشاهد المزدحمة من الأشكال الزخرفية.",
      },
      {
        question: "هل يصلح هذا لـ TikTok وYouTube ومحررات مثل CapCut أو Premiere؟",
        answer:
          "نعم، لكن مسار التسليم يختلف حسب الاستخدام. مسارات الفيديو القصير والمونتاج تستفيد غالبًا من أصول شفافة أو تسلسل صور، بينما يكفي WebM المحلي السريع عندما تحتاج فقط إلى ملف خفيف.",
      },
    ],
  },
} satisfies RootPageContent;

export default arRootPageContent;
