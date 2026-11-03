import type { RootPageContent } from "@/content/root/types";

const thRootPageContent = {
  metadata: {
    title: "เครื่องมือสร้างโอเวอร์เลย์ตัวจับเวลาถอยหลังสำหรับวิดีโอและไลฟ์สตรีม",
    description:
      "สร้างโอเวอร์เลย์ตัวจับเวลาถอยหลังที่คมชัดได้ในเบราว์เซอร์ ดูพรีวิวได้ทันที และส่งออกเป็นลำดับภาพ PNG โปร่งใสหรือ WebM สำหรับตัดต่อวิดีโอ ไลฟ์สตรีม และบทสอน",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading: "ตั้งเวลา ดูตัวอย่างเฟรม แล้วส่งออกไฟล์ไทเมอร์ของคุณ",
    intro: "ค่าที่แนะนำสำหรับการลองครั้งแรก: `30s`, `PNG sequence`, `bottom-right`",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "เครื่องมือ overlay timer สำหรับครีเอเตอร์ที่ต้องการตัวนับถอยหลังที่สะอาดและอ่านง่ายในวิดีโอและไลฟ์สตรีม",
    header: {
      shellLabel: "เชลล์สาธารณะ",
      toolLinkLabel: "เครื่องมือ",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "รางระบบ",
      publicStatusLabel: "สถานะสาธารณะ",
      identityTitle: "ตัวตน",
      jumpTitle: "ไปที่",
      productTitle: "ผลิตภัณฑ์",
      jumpLinks: [
        { anchorId: "tool", label: "ตัวสร้าง" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "รูปแบบ" },
      ],
      productDescription:
        "หน้าเครื่องมือ local-first เดียวสำหรับ countdown overlay, FAQ แบบกระชับ และแนวทางรูปแบบการส่งออก",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "คลังเทมเพลต",
      description:
        "เริ่มจากเลย์เอาต์ที่ผ่านการใช้งานจริง ระยะเวลาและตัวเลือกการส่งออกจะยังคงเดิม",
      browseLabel: "ดูทั้งหมด 48 แบบ",
      searchPlaceholder: "ค้นหาเทมเพลตหรือรูปแบบการใช้งาน",
      categoryLabels: {
        all: "ทั้งหมด",
        editing: "ตัดต่อ",
        streaming: "สตรีมมิง",
        social: "โซเชียล",
        events: "อีเวนต์",
        fitness: "ฟิตเนส",
        cinematic: "ภาพยนตร์",
        minimal: "มินิมอล",
      },
      selectedLabel: "เลือกแล้ว",
      editedLabel: "แก้ไขแล้ว",
      resultTemplate: "{count} เทมเพลต",
      noResults: "ไม่มีเทมเพลตที่ตรงกับตัวกรองนี้",
      closeLabel: "ปิดคลังเทมเพลต",
    },
    themePresetPicker: {
      title: "ธีมพรีเซ็ต",
      description: "เลือกสไตล์เริ่มต้น แล้วค่อยปรับค่าควบคุมเมื่อจำเป็น",
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
      title: "ตัวควบคุม",
      subtitle: "ชุดค่าป้อนเข้า",
      timerSetupTitle: "ตั้งค่าไทเมอร์",
      durationLabel: "ระยะเวลา (วินาที)",
      displayFormatLabel: "รูปแบบการแสดงผล",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "แคนวาส",
      resolutionPresetLabel: "พรีเซ็ตความละเอียด",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "โหมดพื้นหลัง",
      styleTitle: "สไตล์",
      fontFamilyLabel: "ตระกูลฟอนต์",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "ตำแหน่งยึด",
      anchorOptions: {
        "top-left": "ซ้ายบน",
        "top-center": "กึ่งกลางบน",
        "top-right": "ขวาบน",
        "center-left": "กึ่งกลางซ้าย",
        center: "กึ่งกลาง",
        "center-right": "กึ่งกลางขวา",
        "bottom-left": "ซ้ายล่าง",
        "bottom-center": "กึ่งกลางล่าง",
        "bottom-right": "ขวาล่าง",
      },
      transparentOptionLabel: "โปร่งใส",
      solidOptionLabel: "ทึบ",
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
      title: "พรีวิว",
      subtitle: "แคนวาสสด",
      playButton: "เล่นพรีวิว",
      pauseButton: "หยุดชั่วคราว",
      resetButton: "รีเซ็ต",
      safeAreaOnButton: "เปิดพื้นที่ปลอดภัย",
      safeAreaOffButton: "ปิดพื้นที่ปลอดภัย",
      currentReadoutLabel: "ค่าปัจจุบัน",
    },
    exportPanel: {
      title: "ส่งออก",
      subtitle: "พื้นที่ปล่อยไฟล์",
      outputFormatTitle: "รูปแบบผลลัพธ์",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription: "เหมาะที่สุดสำหรับงานตัดต่อและการส่งมอบไฟล์โปร่งใส",
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "วิดีโอ VP8 แบบโปร่งใสสำหรับ OBS และ Streamlabs เพิ่มเป็นแหล่งสื่อได้ทันทีโดยไม่ต้องลบพื้นหลังอีก",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "วิดีโอโปร่งใสขนาดเล็กลงสำหรับ OBS และเวิร์กโฟลว์ที่ทดสอบ VP9 alpha แล้ว การรองรับการนำเข้าขึ้นอยู่กับโปรแกรมตัดต่อ",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "คุณภาพ",
      launchNoteTitle: "หมายเหตุ",
      launchNoteFallback:
        "ในการเปิดตัว MVP การส่งออกยังคงเป็นแบบ local-first หากเบราว์เซอร์ปัจจุบันไม่รองรับรูปแบบนั้น UI จะพาคุณไปใช้ PNG Sequence",
      exportButtonIdle: "ส่งออกไฟล์",
      exportButtonBusy: "กำลังส่งออก...",
      exportStatusTitle: "สถานะการส่งออก",
      exportStatusIdle: "ยังไม่เริ่ม เลือกรูปแบบแล้วเริ่มการส่งออกในเครื่อง",
      qualityOptions: {
        standard: "มาตรฐาน",
        high: "สูง",
      },
      advisoryMessages: {
        workerSupportError:
          "เบราว์เซอร์นี้ไม่สามารถเริ่ม worker เบื้องหลังได้ จึงปิดการส่งออกวิดีโอในเครื่องไว้ ใช้ PNG Sequence บนเบราว์เซอร์เดสก์ท็อปสมัยใหม่แทน",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "การส่งออกนี้อาจใช้หน่วยความจำและ CPU สูง ลองใช้ 720p, 30 วินาที หรือ PNG Sequence หากเบราว์เซอร์เริ่มช้า",
        pngSequenceInfo:
          "PNG Sequence คือวิธี local-first ที่เชื่อถือได้ที่สุดสำหรับส่งต่อให้โปรแกรมตัดต่อ โดยเฉพาะเมื่อความโปร่งใสมีความสำคัญ",
      vp9AlphaInfo:
        "WebM VP9 + alpha เป็นรูปแบบโปร่งใสขนาดกะทัดรัดสำหรับ OBS และเวิร์กโฟลว์ VP9 alpha ที่ตรวจสอบแล้ว",
      hevcAlphaInfo:
        "MOV HEVC + alpha เป็นรูปแบบส่งออกโดยตรงที่แนะนำสำหรับ Final Cut Pro บน Mac ที่รองรับ",
      },
      runtimeMessages: {
        exportReadyTemplate: "ส่งออกพร้อมแล้ว: {fileName}",
        preparingWebm: "กำลังเตรียมการส่งออก WebM ในเครื่อง",
        preparingPngSequence: "กำลังเตรียมการส่งออก PNG Sequence ในเครื่อง",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable: "ไม่สามารถใช้ export worker ในเซสชันเบราว์เซอร์นี้ได้",
        webmFailedUnexpectedly: "การส่งออก WebM ล้มเหลวอย่างไม่คาดคิด",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly: "การส่งออก PNG Sequence ล้มเหลวอย่างไม่คาดคิด",
      },
      png: {
        prepareTitle: "เตรียมชุดภาพ PNG",
        prepareIntro:
          "คุณกำลังส่งออกชุดภาพ PNG แบบโปร่งใส ตรวจสอบแผนด้านล่างก่อนเลือกที่เก็บเฟรม",
        prepareSummaryTemplate:
          "{duration} วิ · {fps} fps · {frames} เฟรม · {width}×{height}",
        estimateTemplate:
          "ประมาณ {size}, {parts} ส่วน ZIP, ใช้เวลารหัสราว {time} ค่าประมาณจะอัปเดตเมื่อเขียนเฟรมจริง",
        estimateUnknown:
          "ไม่มีเฟรมตัวอย่าง จึงไม่ทราบขนาดและเวลาโดยประมาณ การส่งออกยังดำเนินต่อได้",
        sampleProgress: "กำลังเรนเดอร์เฟรมตัวอย่างเพื่อประเมินขนาดและเวลา…",
        longJobTitle: "นี่คือการส่งออกแบบยาว",
        longJobBody:
          "เฟรมถูกเขียนลงดิสก์ทีละส่วน จึงไม่เก็บทั้งชุดไว้ในหน่วยความจำ ต้องคลายซิปและรวมทุกส่วน ZIP ก่อนนำเข้า",
        saveFolderButton: "เลือกโฟลเดอร์บันทึกและเริ่ม",
        saveFolderHint:
          "เบราว์เซอร์จะขอสิทธิ์เขียนหนึ่งครั้ง ระบบจะสร้างโฟลเดอร์งานไว้ข้างใน และส่วนที่เสร็จแล้วจะอยู่บนดิสก์",
        opfsButton: "สร้างในเบราว์เซอร์แล้วดาวน์โหลดเป็นส่วน",
        opfsHint:
          "เบราว์เซอร์เก็บไฟล์ชั่วคราวไว้จนคุณดาวน์โหลดและล้าง เผื่อพื้นที่สำหรับสำเนาชั่วคราว ไฟล์ที่ดาวน์โหลด และเฟรมที่คลายซิป",
        continueButton: "ดำเนินการต่อในแท็บนี้",
        cancelPrepButton: "ยกเลิกการเตรียม",
        adviceDesktopSafari:
          "เพื่อประสิทธิภาพการส่งออกที่ดีขึ้น ใช้ Chrome บนเดสก์ท็อป คุณดำเนินต่อได้ แต่การส่งออก PNG แบบยาวได้รับการตรวจสอบหลักใน Chrome",
        adviceMobile:
          "เพื่อประสิทธิภาพการส่งออกที่ดีขึ้น ให้ส่งออกบนคอมพิวเตอร์ คุณดำเนินต่อได้หากอุปกรณ์นี้ผ่านการตรวจสอบพื้นที่เก็บข้อมูล",
        capabilityMissing:
          "การส่งออกนี้ต้องใช้ที่เก็บข้อมูลโลคอลที่ทำต่อได้และแท็บที่ใช้งานเพียงแท็บเดียว ซึ่งเบราว์เซอร์หรือโปรไฟล์นี้ไม่มีให้",
        longStorageMissing:
          "การส่งออกแบบยาวต้องมีโฟลเดอร์ที่เขียนได้ หรือที่เก็บข้อมูลเบราว์เซอร์ที่รับการเขียนได้จริง เบราว์เซอร์นี้ไม่มีปลายทางที่ปลอดภัย จึงไม่ได้สร้างเฟรมใด ๆ",
        runTitle: "ส่งออกชุดภาพ PNG",
        modeDirectory: "โฟลเดอร์บันทึก",
        modeBrowserStorage: "ที่เก็บเบราว์เซอร์",
        modeMemory: "หน่วยความจำชั่วคราว",
        runFramesTemplate: "เฟรมที่ประมวลผล",
        runCommittedTemplate: "เฟรมที่บันทึกอย่างปลอดภัย",
        runPartTemplate: "ส่วนปัจจุบัน · ส่วนที่บันทึกแล้ว",
        runBytesTemplate: "เขียนแล้ว",
        stoppingButton: "กำลังหยุด…",
        cancelButton: "ยกเลิกการส่งออก",
        cancelledMessage:
          "หยุดการส่งออกแล้ว ส่วน ZIP ที่เสร็จแล้วถูกเก็บไว้ ดำเนินต่อจากส่วนที่บันทึกล่าสุด",
        resultTitle: "ส่งออก PNG เสร็จสมบูรณ์",
        directorySavedTemplate:
          "บันทึก {frames} เฟรมเป็น {parts} ส่วน ZIP ใน {folder} ({size})",
        opfsPartsTitle:
          "{parts} ส่วน ZIP, {size} ดาวน์โหลดแต่ละส่วนขณะที่แสดงอยู่ในรายการ",
        partDownloadButton: "ดาวน์โหลด",
        partRangeTemplate: "เฟรม {first}–{last} · {size}",
        mergeInstructionsTitle: "ก่อนนำเข้า",
        mergeInstructionsBody:
          "คลายซิปทุกส่วน ย้ายไฟล์ frame-*.png ทั้งหมดไปไว้ในโฟลเดอร์เดียว แล้วนำเข้าโฟลเดอร์นั้นเป็นชุดภาพที่ fps ที่เลือก อย่านำเข้าแต่ละส่วนเป็นเคานต์ดาวน์แยกกัน ZIP แรกมีสคริปต์ตรวจหาเฟรมที่ขาดหาย",
        autoDownloadNote:
          "การดาวน์โหลดในเบราว์เซอร์เริ่มแล้ว เปิดแท็บนี้ไว้จนเสร็จ",
        openFolderHint:
          "เบราว์เซอร์ไม่สามารถเปิดตัวจัดการไฟล์ของคุณได้ ใช้หน้าต่างโฟลเดอร์ของระบบหากจำเป็น",
        cleanupButton: "ล้างไฟล์ชั่วคราวของเบราว์เซอร์",
        recoveryTitle: "พบการส่งออก PNG ที่ยังไม่เสร็จ",
        recoveryBodyTemplate:
          "บันทึก {frames} จาก {total} เฟรมอย่างปลอดภัยใน {parts} ส่วน ส่วนที่ยังไม่เสร็จจะถูกทำใหม่",
        restoreButton: "ดำเนินการส่งออกต่อ",
        authorizeButton: "อนุญาตและดำเนินต่อ",
        selectFolderButton: "เลือกโฟลเดอร์ส่งออก",
        removeRecordButton: "ลบระเบียนกู้คืน",
        fontRequired:
          "การส่งออกนี้ใช้ฟอนต์กำหนดเอง โปรดระบุไฟล์ฟอนต์เดียวกันเพื่อดำเนินต่อ",
        fontButton: "เลือกไฟล์ฟอนต์",
        downloadFailed:
          "ไม่สามารถเริ่มดาวน์โหลดได้ ไฟล์ที่เสร็จแล้วยังอยู่ด้านบน ลองอีกครั้ง",
        errorTitle: "ปัญหาในการส่งออก PNG",
        errorMessages: {
          pngStorageUnavailable:
            "เบราว์เซอร์นี้บล็อกที่เก็บข้อมูลโลคอลที่จำเป็นสำหรับการส่งออก PNG ใช้หน้าต่างปกติของ Chrome บนเดสก์ท็อป",
          pngDirectoryPermissionDenied:
            "ไม่ได้รับสิทธิ์เขียนในโฟลเดอร์ที่เลือก เลือกโฟลเดอร์อีกครั้งและอนุญาตการเขียน ยังไม่เริ่มการส่งออก",
          pngStorageFull:
            "พื้นที่ว่างไม่พอจะทำส่วน PNG นี้ให้เสร็จ ว่างพื้นที่แล้วดำเนินต่อ ส่วนที่บันทึกไว้ยังอยู่",
          pngWriteFailed:
            "บันทึกส่วน PNG ไม่สำเร็จ ส่วนที่บันทึกไว้ยังอยู่ ตรวจสอบโฟลเดอร์หรือที่เก็บข้อมูลแล้วดำเนินต่อ",
          pngZipValidationFailed:
            "ส่วน ZIP ที่บันทึกไว้ไม่ผ่านการตรวจสอบ จะถูกทำใหม่ ส่วนก่อนหน้ายังอยู่",
          pngFrameTooLarge:
            "เฟรม PNG หนึ่งเฟรมหรือข้อมูลเมตา ZIP ที่จำเป็นมีขนาดเกินขีดจำกัดต่อส่วน ลดความละเอียดหรือใช้สไตล์ที่เรียบง่ายขึ้น",
          pngMemoryLimitExceeded:
            "การส่งออกนี้ต้องใช้หน่วยความจำชั่วคราวมากกว่าที่เส้นทางในหน่วยความจำแบบจำกัดอนุญาต ใช้ Chrome บนเดสก์ท็อปที่มีโฟลเดอร์เขียนได้สำหรับการส่งออกแบบยาว",
          pngResumeVersionMismatch:
            "การส่งออกที่บันทึกไว้ถูกสร้างด้วยการตั้งค่า แอสเซ็ต หรือเวอร์ชันแอปที่ต่างออกไป ไม่สามารถรวมได้อย่างปลอดภัย เริ่มการส่งออกใหม่และเก็บส่วนที่มีอยู่",
          pngResumeFileMissing:
            "ส่วน ZIP ที่บันทึกไว้หายไปหรือถูกเปลี่ยน ต้องทำส่วนที่ได้รับผลกระทบใหม่ เลือกโฟลเดอร์งานอีกครั้งแล้วดำเนินต่อ",
          pngLocked:
            "การส่งออกนี้เปิดอยู่ในแท็บอื่น หรือเบราว์เซอร์นี้ล็อกงานไม่ได้ ปิดแท็บอื่นแล้วลองอีกครั้ง",
          pngCheckpointFailed:
            "เบราว์เซอร์นี้เก็บเช็กพอยต์โลคอลที่การส่งออก PNG แบบทำต่อได้ต้องการไม่ได้ ใช้ Chrome บนเดสก์ท็อป หรือส่งออกงานสั้นที่พอดีหน่วยความจำ",
          pngFailedUnexpectedly:
            "การส่งออก PNG หยุดลงอย่างไม่คาดคิด ส่วนที่บันทึกไว้ (ถ้ามี) ยังอยู่ ดำเนินต่อหรือเริ่มการส่งออกใหม่",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "หมายเหตุเครื่องมือ",
    heading: "หน้าเครื่องมือเดียว พร้อมบริบทเท่าที่จำเป็นสำหรับการใช้งานจริง",
    description:
      "Time Overlay เป็นตัวสร้างที่ทำงานบนอุปกรณ์เป็นหลัก ตั้งระยะเวลา สไตล์ ตำแหน่ง และรูปแบบได้ด้านบน แล้วดูวิธีรักษาความโปร่งใสกับสิ่งที่ควรทดสอบก่อนใช้งานจริงด้านล่าง",
    exportFormatsTitle: "รูปแบบการส่งออก",
    exportFormatsPngText:
      "หากคุณต้องการ overlay โปร่งใสหรือไฟล์ที่เหมาะกับโปรแกรมตัดต่อ PNG Sequence คือทางเลือกที่เสถียรที่สุด",
    exportFormatsWebmText:
      "หากสภาพแวดล้อมปัจจุบันรองรับได้อย่างเสถียร WebM ก็เป็นทางเลือกที่สะดวกจากเบราว์เซอร์",
    workflowEyebrow: "การทำงาน",
    workflowHeading: "การส่งออก overlay timer ทำงานอย่างไร",
    workflowSteps: [
      {
        title: "ตั้งระยะเวลาและเลย์เอาต์ของการนับถอยหลัง",
        body:
          "เริ่มจากตัวสร้างด้านบน เลือกระยะเวลารวม เลย์เอาต์นาฬิกาที่สะอาด และวาง overlay ในจุดที่ยังอ่านง่ายบน gameplay วิดีโอสินค้า หรือวิดีโอ talking-head",
      },
      {
        title: "เลือกสไตล์ไทเมอร์ให้เข้ากับฟุตเทจ",
        body:
          "ปรับตัวอักษร คอนทราสต์ ขนาด และตำแหน่ง เพื่อให้การนับถอยหลังดูเป็นส่วนหนึ่งของภาพ ไม่ใช่ของที่นำมาแปะทีหลัง overlay timer ที่ดีมักใช้ตัวเลขที่ชัดเจน จังหวะการจัดวางที่นิ่ง และมีระยะห่างจากขอบภาพอย่างพอเหมาะ",
      },
      {
        title: "ส่งออกรูปแบบที่เหมาะกับโปรแกรมตัดต่อของคุณ",
        body:
          "ใช้ PNG Sequence เมื่อคุณต้องการเวิร์กโฟลว์โปร่งใสที่ปลอดภัยที่สุด หรือเลือก WebM หากไฟล์วิดีโอในเครื่องแบบเบาก็เพียงพอสำหรับโปรเจกต์ของคุณ",
      },
    ],
    usageEyebrow: "วิธีใช้",
    usageHeading: "วิธีใช้ Time Overlay",
    usageNotes: [
      "เปิดตัวสร้าง ตั้งระยะเวลา และดูตัวอย่างการนับถอยหลังก่อนส่งออก",
      "ใช้ PNG Sequence สำหรับ overlay โปร่งใสใน CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve หรือเวิร์กโฟลว์ที่ชอบไฟล์ภาพ",
      "ใช้ WebM เมื่อคุณต้องการส่งออกเร็วจากเบราว์เซอร์สำหรับ mockup, rough cut หรือ social edit แบบเบา",
      "ให้ไทเมอร์สั้น คอนทราสต์สูง และไม่ชนกับซับไตเติลหรือกรอบใบหน้า เพื่อให้ยังอ่านง่ายบนมือถือ",
    ],
    usageCta: {
      beforeFirstLink: "เริ่มที่ ",
      firstLinkLabel: "ตัวสร้างแบบสด",
      betweenLinks: "แล้วใช้ ",
      secondLinkLabel: "คู่มือการส่งออก",
      afterSecondLink: "ด้านล่างเพื่อเลือกระหว่างเฟรมโปร่งใสกับวิดีโอจากเบราว์เซอร์",
    },
    aboutEyebrow: "เกี่ยวกับ",
    aboutHeading: "เกี่ยวกับ Time Overlay",
    aboutPoints: [
      "Time Overlay คือ overlay timer generator แบบ local-first สำหรับครีเอเตอร์ที่ต้องการกราฟิกนับถอยหลังโดยไม่ต้องอัปโหลดวิดีโอไปยังบริการเรนเดอร์ระยะไกล",
      "ตัวสร้างรวมเครื่องมือ คำแนะนำการส่งออก และวิธีแก้ปัญหาไว้ในที่เดียว คุณจึงสร้างไฟล์และนำไปใช้ในแอปอื่นได้อย่างถูกต้อง",
      "คู่มือแยกสิ่งที่เอกสารทางการรองรับออกจากคำแนะนำเชิงปฏิบัติ พร้อมแหล่งข้อมูลและวันที่ตรวจสอบล่าสุด เพื่อให้กลับมาตรวจสอบความเข้ากันได้อีกครั้งได้",
    ],
    aboutCta: {
      beforeLink: "ถ้าคุณต้องการเคลียร์คำถามเชิงปฏิบัติก่อน ให้ไปที่ ",
      linkLabel: "FAQ ของ overlay timer",
      afterLink: "",
    },
    faqTitle: "FAQ",
    faqSubtitle: "พื้นฐานของ overlay timer",
    faqItems: [
      {
        question: "ฉันสามารถส่งออก overlay timer แบบโปร่งใสได้ไหม",
        answer:
          "ได้ เส้นทาง local-first ที่ปลอดภัยที่สุดคือ PNG Sequence เพราะโปรแกรมตัดต่อมักจัดการกับไฟล์ภาพโปร่งใสได้เสถียรกว่าวิดีโอที่บีบอัด หากเบราว์เซอร์รองรับก็ใช้ WebM ได้เช่นกัน แต่เมื่อความโปร่งใสสำคัญ PNG Sequence ยังเป็นทางเลือกที่ปลอดภัยกว่า",
      },
      {
        question: "ควรเลือกรูปแบบการส่งออกแบบไหนก่อน",
        answer:
          "เริ่มจาก PNG Sequence หากคุณต้องการการส่งต่อที่เชื่อถือได้ที่สุดไปยังโปรแกรมตัดต่อ โดยเฉพาะเมื่อต้อง composite บนวิดีโอจริง เลือก WebM เมื่อคุณต้องการไฟล์วิดีโอที่เบากว่าและเบราว์เซอร์รองรับได้ดี",
      },
      {
        question: "เครื่องมือนี้เรนเดอร์บนเซิร์ฟเวอร์หรือไม่",
        answer:
          "ไม่ ประสบการณ์หลักเป็นแบบ local-first การพรีวิวและการส่งออกทำงานบนอุปกรณ์ของผู้ใช้ ทำให้หน้าเว็บทำงานเหมือนเครื่องมือจริงโดยไม่ต้องรอคิวเรนเดอร์ระยะไกล",
      },
      {
        question: "สไตล์ไทเมอร์แบบไหนอ่านง่ายที่สุดในวิดีโอ",
        answer:
          "โดยทั่วไปตัวเลขเรียบง่ายที่มีคอนทราสต์สูงจะอ่านง่ายที่สุด ตัวเลขแบบ monospace แสงเรืองเล็กน้อย และการวางไว้ที่มุมอย่างระมัดระวัง มักอ่านง่ายกว่าสไตล์ตกแต่งบนภาพที่ซับซ้อน",
      },
      {
        question: "ใช้กับ TikTok, YouTube และโปรแกรมอย่าง CapCut หรือ Premiere ได้ไหม",
        answer:
          "ได้ แต่เส้นทางการส่งมอบจะแตกต่างกัน งานวิดีโอสั้นและเวิร์กโฟลว์ตัดต่อมักได้ประโยชน์จากไฟล์โปร่งใสหรือ image sequence ส่วน WebM ในเครื่องเหมาะเมื่อคุณต้องการเพียงไฟล์เบาๆ",
      },
    ],
  },
} satisfies RootPageContent;

export default thRootPageContent;
