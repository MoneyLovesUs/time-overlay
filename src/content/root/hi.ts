import type { RootPageContent } from "@/content/root/types";

const hiRootPageContent = {
  metadata: {
    title: "वीडियो और लाइव स्ट्रीम के लिए काउंटडाउन टाइमर ओवरले जनरेटर",
    description:
      "ब्राउज़र में साफ और पढ़ने में आसान काउंटडाउन टाइमर ओवरले बनाएं। तुरंत प्रीव्यू देखें और वीडियो एडिटिंग, लाइव स्ट्रीम और ट्यूटोरियल के लिए पारदर्शी PNG सीक्वेंस या WebM निर्यात करें।",
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
    themePresetPicker: {
      title: "थीम प्रीसेट",
      description: "पहले एक शुरुआती लुक चुनें, फिर ज़रूरत हो तो कंट्रोल समायोजित करें।",
      presetLabels: {
        "minimal-neon": "मिनिमल नीयॉन",
        "broadcast-alert": "ब्रॉडकास्ट अलर्ट",
        "calm-studio": "शांत स्टूडियो",
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
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
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
      webmLabel: "WebM",
      webmDescription: "समर्थित ब्राउज़रों पर हल्के लोकल वीडियो निर्यात के लिए उपयुक्त।",
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
          "इस ब्राउज़र में WebM निर्यात उपलब्ध नहीं है। PNG Sequence सबसे सुरक्षित विकल्प बना रहता है।",
        heavyExportWarning:
          "यह निर्यात मेमोरी और CPU पर भारी पड़ सकता है। यदि ब्राउज़र संघर्ष करे तो 720p, 30 सेकंड या PNG Sequence पर विचार करें।",
        pngSequenceInfo:
          "PNG Sequence, खासकर जब पारदर्शिता महत्वपूर्ण हो, एडिटर्स को local-first हैंडऑफ़ देने का सबसे भरोसेमंद तरीका है।",
      },
      runtimeMessages: {
        exportReadyTemplate: "निर्यात तैयार: {fileName}",
        preparingWebm: "लोकल WebM निर्यात तैयार किया जा रहा है",
        preparingPngSequence: "लोकल PNG Sequence निर्यात तैयार किया जा रहा है",
        exportWorkerUnavailable: "इस ब्राउज़र सत्र में export worker उपलब्ध नहीं है।",
        webmFailedUnexpectedly: "WebM निर्यात अप्रत्याशित रूप से विफल हो गया।",
        pngSequenceFailedUnexpectedly: "PNG Sequence निर्यात अप्रत्याशित रूप से विफल हो गया।",
      },
    },
  },
  seoSection: {
    notesEyebrow: "टूल नोट्स",
    heading: "एक टूल पेज, और उसे अच्छी तरह उपयोग करने के लिए जितना ज़रूरी हो उतना ही संदर्भ।",
    description:
      "Time Overlay को local-first overlay timer generator के रूप में बनाया गया है। ऊपर दिए गए कंट्रोल्स से अवधि, स्टाइल, स्थिति और निर्यात फॉर्मैट चुनें, और नीचे का भाग उन सवालों के लिए रखें जो SEO और वास्तविक workflow फ़ैसलों में सचमुच मायने रखते हैं।",
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
      "यह पेज जानबूझकर संक्षिप्त रखा गया है: एक वास्तविक working tool surface, एक स्पष्ट export explanation block, और एक SEO support area जो उन workflow सवालों का जवाब देता है जिन्हें लोग किसी timer tool पर भरोसा करने से पहले खोजते हैं।",
      "इससे homepage एक वास्तविक production utility भी बनती है और साथ ही overlay timer, countdown timer overlay, transparent countdown overlay और timer overlay for video editing जैसे प्रश्नों के लिए crawlable landing page भी।",
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
