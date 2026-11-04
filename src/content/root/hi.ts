import type { RootPageContent } from "@/content/root/types";

const hiRootPageContent = {
  metadata: {
    title: "वीडियो और लाइव स्ट्रीम के लिए काउंटडाउन टाइमर ओवरले जनरेटर",
    description:
      "ब्राउज़र में साफ काउंटडाउन टाइमर ओवरले बनाएं। तुरंत प्रीव्यू देखें और वीडियो एडिटिंग के लिए पारदर्शी PNG सीक्वेंस या WebM निर्यात करें।",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "अवधि सेट करें, फ़्रेम का प्रीव्यू देखें, फिर अपना टाइमर एसेट निर्यात करें।",
    intro: "पहले प्रयास के लिए सुझाव: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "उन क्रिएटर्स के लिए overlay timer टूल जो रिकॉर्डिंग और लाइव स्ट्रीम में साफ और पढ़ने योग्य काउंटडाउन चाहते हैं।",
    header: {
      shellLabel: "पब्लिक शेल",
      toolLinkLabel: "टूल",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "सिस्टम रेल",
      publicStatusLabel: "सार्वजनिक स्थिति",
      identityTitle: "पहचान",
      jumpTitle: "यहाँ जाएँ",
      productTitle: "उत्पाद",
      jumpLinks: [
        { anchorId: "tool", label: "जनरेटर" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "फॉर्मैट" },
      ],
      productDescription:
        "एक local-first टूल पेज जिसमें countdown overlay, संक्षिप्त FAQ और निर्यात फॉर्मैट मार्गदर्शन शामिल है।",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "टेम्पलेट लाइब्रेरी",
      description:
        "एक आजमाए हुए लेआउट से शुरू करें। आपकी अवधि और निर्यात विकल्प बने रहेंगे।",
      browseLabel: "सभी 48 देखें",
      searchPlaceholder: "टेम्पलेट या उपयोग खोजें",
      categoryLabels: {
        all: "सभी",
        editing: "एडिटिंग",
        streaming: "स्ट्रीमिंग",
        social: "सोशल",
        events: "इवेंट",
        fitness: "फिटनेस",
        cinematic: "सिनेमैटिक",
        minimal: "मिनिमल",
      },
      selectedLabel: "चुना गया",
      editedLabel: "संपादित",
      resultTemplate: "{count} टेम्पलेट",
      noResults: "इस फ़िल्टर से कोई टेम्पलेट मेल नहीं खाता।",
      closeLabel: "टेम्पलेट लाइब्रेरी बंद करें",
    },
    themePresetPicker: {
      title: "थीम प्रीसेट",
      description: "पहले एक शुरुआती लुक चुनें, फिर ज़रूरत हो तो कंट्रोल समायोजित करें।",
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
      title: "कंट्रोल",
      subtitle: "इनपुट स्टैक",
      timerSetupTitle: "टाइमर सेटअप",
      durationLabel: "अवधि (सेकंड)",
      displayFormatLabel: "डिस्प्ले फॉर्मैट",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "कैनवास",
      resolutionPresetLabel: "रिज़ॉल्यूशन प्रीसेट",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "बैकग्राउंड मोड",
      styleTitle: "स्टाइल",
      fontFamilyLabel: "फ़ॉन्ट परिवार",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "एंकर",
      anchorOptions: {
        "top-left": "ऊपर बाएँ",
        "top-center": "ऊपर बीच",
        "top-right": "ऊपर दाएँ",
        "center-left": "बीच बाएँ",
        center: "बीच",
        "center-right": "बीच दाएँ",
        "bottom-left": "नीचे बाएँ",
        "bottom-center": "नीचे बीच",
        "bottom-right": "नीचे दाएँ",
      },
      transparentOptionLabel: "पारदर्शी",
      solidOptionLabel: "ठोस",
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
      title: "प्रीव्यू",
      subtitle: "लाइव कैनवास",
      playButton: "प्रीव्यू चलाएँ",
      pauseButton: "रोकें",
      resetButton: "रीसेट",
      safeAreaOnButton: "सेफ एरिया चालू",
      safeAreaOffButton: "सेफ एरिया बंद",
      currentReadoutLabel: "मौजूदा रीडआउट",
    },
    exportPanel: {
      title: "निर्यात",
      subtitle: "डिलीवरी बे",
      outputFormatTitle: "आउटपुट फॉर्मैट",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "एडिटर्स और पारदर्शी हैंडऑफ़ के लिए सबसे विश्वसनीय विकल्प।",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "OBS और Streamlabs के लिए पारदर्शी VP8 वीडियो। इसे हटाए हुए बैकग्राउंड के साथ Media Source के रूप में जोड़ें।",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "OBS और जाँचे गए VP9 alpha वर्कफ़्लो के लिए छोटा पारदर्शी वीडियो; इम्पोर्ट सपोर्ट हर एडिटर में अलग हो सकता है।",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "गुणवत्ता",
      launchNoteTitle: "नोट",
      launchNoteFallback:
        "MVP में निर्यात local-first ही रहता है। यदि वर्तमान ब्राउज़र कोई फॉर्मैट नहीं संभालता, तो UI आपको PNG Sequence की ओर मार्गदर्शित करेगा।",
      exportButtonIdle: "एसेट निर्यात करें",
      exportButtonBusy: "निर्यात हो रहा है...",
      exportStatusTitle: "निर्यात स्थिति",
      exportStatusIdle: "निष्क्रिय। कोई फॉर्मैट चुनें और लोकल निर्यात शुरू करें।",
      qualityOptions: {
        standard: "मानक",
        high: "उच्च",
      },
      advisoryMessages: {
        workerSupportError:
          "यह ब्राउज़र बैकग्राउंड worker शुरू नहीं कर सकता, इसलिए लोकल वीडियो निर्यात बंद है। आधुनिक डेस्कटॉप ब्राउज़र में PNG Sequence का उपयोग करें।",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "यह निर्यात मेमोरी और CPU पर भारी पड़ सकता है। यदि ब्राउज़र संघर्ष करे तो 720p, 30 सेकंड या PNG Sequence पर विचार करें।",
        pngSequenceInfo:
          "PNG Sequence, खासकर जब पारदर्शिता महत्वपूर्ण हो, एडिटर्स को local-first हैंडऑफ़ देने का सबसे भरोसेमंद तरीका है।",
      vp9AlphaInfo:
        "WebM VP9 + alpha, OBS और जाँचे गए VP9 alpha वर्कफ़्लो के लिए कॉम्पैक्ट पारदर्शी फ़ॉर्मैट है।",
      hevcAlphaInfo:
        "MOV HEVC + alpha, संगत Mac पर Final Cut Pro के लिए सुझाया गया सीधा एक्सपोर्ट फ़ॉर्मैट है।",
      },
      runtimeMessages: {
        exportReadyTemplate: "निर्यात तैयार: {fileName}",
        preparingWebm: "लोकल WebM निर्यात तैयार किया जा रहा है",
        preparingPngSequence: "लोकल PNG Sequence निर्यात तैयार किया जा रहा है",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "इस ब्राउज़र सत्र में export worker उपलब्ध नहीं है।",
        webmFailedUnexpectedly: "WebM निर्यात अप्रत्याशित रूप से विफल हो गया।",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "PNG Sequence निर्यात अप्रत्याशित रूप से विफल हो गया।",
      },
      png: {
        prepareTitle: "PNG सीक्वेंस तैयार करें",
        prepareIntro:
          "आप पारदर्शी PNG सीक्वेंस एक्सपोर्ट कर रहे हैं। फ़्रेम कहाँ सहेजे जाएँ यह चुनने से पहले नीचे दी योजना देखें।",
        prepareSummaryTemplate:
          "{duration}से · {fps} fps · {frames} फ़्रेम · {width}×{height}",
        estimateTemplate:
          "लगभग {size}, {parts} ZIP भाग में, एक्सपोर्ट में करीब {time}।",
        estimateUnknown:
          "एक्सपोर्ट चलने के दौरान आकार और समय का अनुमान दिखाई देगा।",
        sampleProgress:
          "आकार और समय का अनुमान लगाने के लिए नमूना फ़्रेम बनाए जा रहे हैं…",
        longJobTitle: "यह एक लंबा एक्सपोर्ट है",
        longJobBody:
          "फ़्रेम भाग-भाग करके डिस्क पर लिखे जाते हैं, इसलिए पूरा सीक्वेंस कभी मेमोरी में नहीं रखा जाता। आयात से पहले हर ZIP भाग को अनज़िप और मर्ज करना होगा।",
        saveFolderButton: "सहेजने का फ़ोल्डर चुनें और शुरू करें",
        saveFolderHint:
          "ब्राउज़र एक बार लिखने की अनुमति माँगता है। इसके अंदर एक टास्क फ़ोल्डर बनता है, और पूरे हुए भाग डिस्क पर रहते हैं।",
        opfsButton: "ब्राउज़र में बनाएँ, भाग डाउनलोड करें",
        opfsHint:
          "ब्राउज़र अस्थायी फ़ाइलें तब तक रखता है जब तक आप उन्हें डाउनलोड और साफ़ नहीं करते। अस्थायी कॉपी, डाउनलोड और अनज़िप किए फ़्रेम के लिए जगह रखें।",
        continueButton: "इस टैब में जारी रखें",
        cancelPrepButton: "तैयारी रद्द करें",
        adviceDesktopSafari:
          "Safari इतना बड़ा एक्सपोर्ट सहेज नहीं सकता — इसका बिल्ट-इन स्टोरेज ख़त्म होने से पहले ही भर जाएगा। इतने लंबे टाइमर के लिए अपने कंप्यूटर पर Chrome या Edge इस्तेमाल करें।",
        adviceMobile:
          "इतने लंबे टाइमर के लिए कंप्यूटर इस्तेमाल करें। फ़ोन और टैबलेट में अक्सर एक्सपोर्ट ख़त्म होने से पहले ही स्टोरेज ख़त्म हो जाता है।",
        capabilityMissing:
          "यह ब्राउज़र एक्सपोर्ट फ़ाइलें सहेज नहीं सकता। इस पेज के अन्य टैब बंद करें और फिर कोशिश करें, या अपने कंप्यूटर पर Chrome इस्तेमाल करें।",
        longStorageMissing:
          "आपका ब्राउज़र फ़्रेम सहेजने की जगह नहीं बना सका। स्टोरेज खाली करें या कंप्यूटर पर Chrome इस्तेमाल करें, फिर दोबारा कोशिश करें।",
        runTitle: "PNG सीक्वेंस एक्सपोर्ट",
        modeDirectory: "सहेजने का फ़ोल्डर",
        modeBrowserStorage: "ब्राउज़र में सहेजा गया",
        modeMemory: "मेमोरी में रखा गया",
        runFramesTemplate: "संसाधित फ़्रेम",
        runCommittedTemplate: "सुरक्षित सहेजे गए फ़्रेम",
        runPartTemplate: "मौजूदा भाग · सहेजे गए भाग",
        runBytesTemplate: "लिखा गया",
        stoppingButton: "रोका जा रहा है…",
        cancelButton: "एक्सपोर्ट रद्द करें",
        cancelledMessage:
          "एक्सपोर्ट रुक गया। पूरे हुए ZIP भाग सुरक्षित हैं; अंतिम सहेजे गए भाग से फिर शुरू करें।",
        resultTitle: "PNG एक्सपोर्ट पूरा",
        directorySavedTemplate:
          "{frames} फ़्रेम {parts} ZIP भाग के रूप में {folder} ({size}) में सहेजे गए।",
        opfsPartsTitle:
          "{parts} ZIP भाग, {size}। जब तक हर भाग सूची में है, उसे डाउनलोड करें।",
        partDownloadButton: "डाउनलोड",
        partRangeTemplate: "फ़्रेम {first}–{last} · {size}",
        mergeInstructionsTitle: "आयात से पहले",
        mergeInstructionsBody:
          "हर भाग को अनज़िप करें, सभी frame-*.png फ़ाइलें एक फ़ोल्डर में लाएँ, फिर उस फ़ोल्डर को चुने गए fps पर इमेज सीक्वेंस के रूप में आयात करें। हर भाग को अलग काउंटडाउन के रूप में आयात न करें। पहले ZIP में गुम फ़्रेम जाँचने की स्क्रिप्ट शामिल हैं।",
        autoDownloadNote:
          "ब्राउज़र डाउनलोड शुरू हो गया है। पूरा होने तक यह टैब खुला रखें।",
        openFolderHint: "अपने फ़ाइल मैनेजर में फ़ोल्डर खोलें।",
        cleanupButton: "अस्थायी फ़ाइलें हटाएँ",
        recoveryTitle: "अधूरा PNG एक्सपोर्ट मिला",
        recoveryBodyTemplate:
          "{total} में से {frames} फ़्रेम {parts} भागों में सुरक्षित हैं। अधूरा भाग फिर से बनाया जाएगा।",
        restoreButton: "एक्सपोर्ट फिर शुरू करें",
        authorizeButton: "अनुमति दें और जारी रखें",
        selectFolderButton: "एक्सपोर्ट फ़ोल्डर चुनें",
        removeRecordButton: "रिकवरी रिकॉर्ड हटाएँ",
        fontRequired:
          "इस एक्सपोर्ट में कस्टम फ़ॉन्ट इस्तेमाल हुआ था। फिर शुरू करने के लिए वही फ़ॉन्ट फ़ाइल दें।",
        fontButton: "फ़ॉन्ट फ़ाइल चुनें",
        downloadFailed:
          "डाउनलोड शुरू नहीं हो सका। तैयार फ़ाइलें अभी भी ऊपर उपलब्ध हैं; फिर कोशिश करें।",
        errorTitle: "PNG एक्सपोर्ट में समस्या",
        errorMessages: {
          pngStorageUnavailable:
            "इस ब्राउज़र ने PNG एक्सपोर्ट के लिए ज़रूरी लोकल स्टोरेज रोक दिया। डेस्कटॉप Chrome में सामान्य विंडो इस्तेमाल करें।",
          pngDirectoryPermissionDenied:
            "चुने गए फ़ोल्डर में लिखने की अनुमति नहीं मिली। फ़ोल्डर फिर चुनें और लिखने दें; कोई एक्सपोर्ट शुरू नहीं हुआ।",
          pngStorageFull:
            "यह PNG भाग पूरा करने के लिए पर्याप्त खाली जगह नहीं है। जगह खाली करें, फिर जारी रखें; सहेजे गए भाग बने रहते हैं।",
          pngWriteFailed:
            "PNG भाग सहेजना विफल रहा। सहेजे गए भाग बने रहते हैं; फ़ोल्डर या स्टोरेज जाँचें और जारी रखें।",
          pngZipValidationFailed:
            "सहेजा गया ZIP भाग जाँच में विफल रहा। इसे फिर से बनाया जाएगा; पिछले भाग बने रहेंगे।",
          pngFrameTooLarge:
            "एक PNG फ़्रेम प्रति-भाग सीमा से बड़ा है। रिज़ॉल्यूशन घटाएँ या सरल स्टाइल चुनें।",
          pngMemoryLimitExceeded:
            "यह एक्सपोर्ट इस ब्राउज़र में पूरा करने के लिए बहुत बड़ा है। अपने कंप्यूटर पर Chrome इस्तेमाल करें और “सहेजने का फ़ोल्डर” चुनें ताकि फ़्रेम सीधे डिस्क पर लिखे जाएँ।",
          pngResumeVersionMismatch:
            "सहेजा गया एक्सपोर्ट अलग सेटिंग्स या पुराने वर्ज़न से बना था। इसे जारी नहीं रखा जा सकता; नया एक्सपोर्ट शुरू करें और मौजूदा भागों को वैसे ही रखें।",
          pngResumeFileMissing:
            "सहेजा गया ZIP भाग गायब है या बदल गया है। वह भाग फिर से बनाया जाएगा; टास्क फ़ोल्डर फिर चुनें और जारी रखें।",
          pngLocked:
            "यह एक्सपोर्ट दूसरे टैब में खुला है। दूसरा टैब बंद करें और फिर कोशिश करें।",
          pngCheckpointFailed:
            "यह ब्राउज़र बाद में जारी रखने के लिए प्रगति सहेज नहीं सकता। अपने कंप्यूटर पर Chrome इस्तेमाल करें, या छोटा टाइमर एक्सपोर्ट करें।",
          pngFailedUnexpectedly:
            "PNG एक्सपोर्ट अचानक रुक गया। सहेजे गए भाग, यदि कोई हों, बने रहते हैं; जारी रखें या नया एक्सपोर्ट शुरू करें।",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "टूल नोट्स",
    heading: "एक टूल पेज, और उसे अच्छी तरह उपयोग करने के लिए जितना ज़रूरी हो उतना ही संदर्भ।",
    description:
      "Time Overlay एक local-first जनरेटर है। ऊपर अवधि, स्टाइल, स्थान और फ़ॉर्मैट चुनें; नीचे जानें कि पारदर्शिता कैसे बचानी है और प्रोडक्शन में फ़ाइल इस्तेमाल करने से पहले क्या जाँचना चाहिए।",
    exportFormatsTitle: "निर्यात फॉर्मैट",
    exportFormatsPngText:
      "जब आपको पारदर्शी overlay या editor-friendly assets चाहिए हों, तब PNG Sequence सबसे विश्वसनीय लोकल निर्यात है।",
    exportFormatsWebmText:
      "यदि मौजूदा वातावरण इसे स्थिर रूप से सपोर्ट करता है, तो WebM ब्राउज़र-आधारित सुविधाजनक विकल्प है।",
    workflowEyebrow: "कैसे काम करता है",
    workflowHeading: "Overlay timer निर्यात कैसे काम करता है",
    workflowSteps: [
      {
        title: "काउंटडाउन की अवधि और लेआउट तय करें",
        body:
          "ऊपर दिए गए जनरेटर से शुरुआत करें। कुल अवधि चुनें, साफ़ घड़ी लेआउट चुनें, और overlay को ऐसी जगह रखें जहाँ वह gameplay, product footage या talking-head वीडियो पर भी पढ़ने योग्य रहे।",
      },
      {
        title: "अपने फुटेज के लिए सही टाइमर स्टाइल चुनें",
        body:
          "टाइपोग्राफी, कॉन्ट्रास्ट, स्केल और पोज़िशन को ऐसा समायोजित करें कि काउंटडाउन इरादतन डिज़ाइन लगे, चिपकाया हुआ नहीं। अच्छे overlay timers अक्सर स्पष्ट अंकों, स्थिर स्पेसिंग और फ्रेम किनारे से पर्याप्त दूरी का उपयोग करते हैं।",
      },
      {
        title: "अपने एडिटर के हिसाब से सही फॉर्मैट निर्यात करें",
        body:
          "पारदर्शी assets के लिए सबसे सुरक्षित workflow चाहिए तो PNG Sequence चुनें, या WebM चुनें जब एक हल्की लोकल वीडियो फ़ाइल आपके प्रोजेक्ट के लिए पर्याप्त हो।",
      },
    ],
    usageEyebrow: "कैसे उपयोग करें",
    usageHeading: "Time Overlay का उपयोग कैसे करें",
    usageNotes: [
      "जनरेटर खोलें, टाइमर की लंबाई सेट करें, और कुछ भी निर्यात करने से पहले काउंटडाउन का प्रीव्यू देखें।",
      "CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve या किसी भी image-based workflow के लिए पारदर्शी overlay हेतु PNG Sequence का उपयोग करें।",
      "मॉकअप, rough cut या हल्के सोशल एडिट के लिए तेज़ ब्राउज़र निर्यात चाहिए तो WebM का उपयोग करें।",
      "टाइमर को छोटा, हाई-कॉन्ट्रास्ट और सबटाइटल या फेस फ्रेमिंग से दूर रखें ताकि मोबाइल पर भी वह पढ़ने योग्य रहे।",
    ],
    usageCta: {
      beforeFirstLink: "शुरुआत करें ",
      firstLinkLabel: "लाइव जनरेटर",
      betweenLinks: "से, और नीचे दिए गए ",
      secondLinkLabel: "निर्यात गाइड",
      afterSecondLink: "की मदद से तय करें कि आपको पारदर्शी फ़्रेम चाहिए या ब्राउज़र वीडियो आउटपुट।",
    },
    aboutEyebrow: "परिचय",
    aboutHeading: "Time Overlay के बारे में",
    aboutPoints: [
      "Time Overlay एक local-first overlay timer generator है जो उन क्रिएटर्स के लिए बनाया गया है जिन्हें दूरस्थ render सेवा पर फुटेज अपलोड किए बिना countdown graphics चाहिए।",
      "जनरेटर कंट्रोल, एक्सपोर्ट सलाह और समस्या निवारण को एक जगह रखता है, ताकि आप एसेट बना सकें और उसे दूसरे ऐप में सही ढंग से ले जा सकें।",
      "गाइड दस्तावेज़ों में बताए सपोर्ट और व्यावहारिक सलाह को अलग रखते हैं, जाँचे गए स्रोत और आखिरी समीक्षा की तारीख दिखाते हैं, ताकि संगतता दोबारा परखी जा सके।",
    ],
    aboutCta: {
      beforeLink: "अगर आप पहले व्यावहारिक सवाल सुलझाना चाहते हैं, तो जाएँ ",
      linkLabel: "overlay timer FAQ",
      afterLink: " पर।",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Overlay timer की बुनियादी बातें",
    faqItems: [
      {
        question: "क्या मैं पारदर्शिता के साथ overlay timer निर्यात कर सकता हूँ?",
        answer:
          "हाँ। सबसे सुरक्षित local-first रास्ता PNG Sequence है, क्योंकि एडिटर्स इमेज-आधारित पारदर्शी assets को compressed वीडियो workflows की तुलना में अधिक भरोसेमंद ढंग से संभालते हैं। यदि ब्राउज़र सपोर्ट करता है तो WebM भी उपलब्ध है, लेकिन जहाँ पारदर्शिता महत्वपूर्ण हो वहाँ PNG Sequence अभी भी अधिक सुरक्षित विकल्प है।",
      },
      {
        question: "मुझे पहले कौन-सा निर्यात फॉर्मैट चुनना चाहिए?",
        answer:
          "यदि आप एडिटरों तक सबसे भरोसेमंद हैंडऑफ़ चाहते हैं, खासकर जब वास्तविक वीडियो पर compositing करनी हो, तो PNG Sequence से शुरुआत करें। WebM तब चुनें जब आपको हल्की लोकल वीडियो फ़ाइल चाहिए और आपका ब्राउज़र उस रास्ते को अच्छे से सपोर्ट करता हो।",
      },
      {
        question: "क्या यह टूल सर्वर पर render होता है?",
        answer:
          "नहीं। मुख्य अनुभव local-first है। प्रीव्यू और निर्यात उपयोगकर्ता की मशीन पर चलते हैं, ताकि पेज एक असली टूल की तरह काम करे, किसी दूरस्थ render queue की तरह नहीं।",
      },
      {
        question: "वीडियो में किस तरह का timer स्टाइल सबसे अच्छी तरह पढ़ा जाता है?",
        answer:
          "आमतौर पर सरल अंकों और उच्च contrast वाला स्टाइल सबसे अच्छा काम करता है। monospace अंक, नियंत्रित glow और कोने में सावधानी से की गई placement, सजावटी स्किन की तुलना में भीड़भाड़ वाले फुटेज पर अधिक पढ़ने योग्य रहती है।",
      },
      {
        question: "क्या यह TikTok, YouTube और CapCut या Premiere जैसे एडिटरों के लिए भी उपयोगी है?",
        answer:
          "हाँ, लेकिन हैंडऑफ़ पाथ अलग हो सकता है। short-form और editing workflows अक्सर पारदर्शी assets या image sequence से अधिक लाभ पाते हैं, जबकि हल्की लोकल WebM export तब पर्याप्त होती है जब आपको सिर्फ एक छोटा फ़ाइल चाहिए।",
      },
    ],
  },
} satisfies RootPageContent;

export default hiRootPageContent;
