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
    themePresetPicker: {
      title: "النسق المسبق",
      description: "اختر مظهرًا ابتدائيًا، ثم عدّل عناصر التحكم فقط عند الحاجة.",
      presetLabels: {
        "minimal-neon": "نيون بسيط",
        "broadcast-alert": "تنبيه البث",
        "calm-studio": "استوديو هادئ",
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
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
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
      webmLabel: "WebM",
      webmDescription: "مناسب لتصدير فيديو محلي خفيف على المتصفحات المدعومة.",
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
          "تصدير WebM غير متاح في هذا المتصفح. ما يزال PNG Sequence هو البديل الأكثر أمانًا.",
        heavyExportWarning:
          "قد يستهلك هذا التصدير قدرًا كبيرًا من الذاكرة والمعالج. جرّب 720p أو 30 ثانية أو PNG Sequence إذا بدأ المتصفح بالتباطؤ.",
        pngSequenceInfo:
          "يظل PNG Sequence أكثر مسار local-first موثوقية للتسليم إلى برامج المونتاج، خصوصًا عندما تكون الشفافية مهمة.",
      },
      runtimeMessages: {
        exportReadyTemplate: "اكتمل التصدير: {fileName}",
        preparingWebm: "جارٍ تجهيز تصدير WebM المحلي",
        preparingPngSequence: "جارٍ تجهيز تصدير PNG Sequence المحلي",
        exportWorkerUnavailable: "عامل التصدير غير متاح في جلسة المتصفح هذه.",
        webmFailedUnexpectedly: "فشل تصدير WebM بشكل غير متوقع.",
        pngSequenceFailedUnexpectedly: "فشل تصدير PNG Sequence بشكل غير متوقع.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "ملاحظات الأداة",
    heading: "صفحة أداة واحدة، ومعها فقط أقل قدر من السياق الذي تحتاجه لاستخدامها جيدًا.",
    description:
      "تم تصميم Time Overlay كمولد overlay timer بنهج local-first. استخدم أدوات التحكم أعلاه لتحديد المدة والنمط والموضع وصيغة التصدير، ثم احتفظ بالقسم السفلي للأسئلة التي ما تزال مهمة فعلاً لـ SEO وقرارات سير العمل الواقعية.",
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
      "الصفحة مقصودة أن تبقى مضغوطة: سطح أداة فعلي واحد، وشرح واضح لصيغ التصدير، ومنطقة دعم SEO تجيب عن أسئلة سير العمل التي يبحث عنها الناس قبل أن يثقوا في أداة مؤقت.",
      "لذلك تعمل الصفحة الرئيسية كأداة إنتاج حقيقية وكصفحة هبوط قابلة للفهرسة لعبارات مثل overlay timer وcountdown timer overlay وtransparent countdown overlay وtimer overlay for video editing.",
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
