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
    themePresetPicker: {
      title: "ธีมพรีเซ็ต",
      description: "เลือกสไตล์เริ่มต้น แล้วค่อยปรับค่าควบคุมเมื่อจำเป็น",
      presetLabels: {
        "minimal-neon": "นีออนมินิมอล",
        "broadcast-alert": "แจ้งเตือนออกอากาศ",
        "calm-studio": "สตูดิโอสงบ",
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
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
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
      webmLabel: "WebM",
      webmDescription: "เหมาะสำหรับการส่งออกวิดีโอแบบเบาจากเครื่องบนเบราว์เซอร์ที่รองรับ",
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
          "ไม่สามารถส่งออก WebM ในเบราว์เซอร์นี้ได้ PNG Sequence ยังเป็นทางเลือกที่ปลอดภัยที่สุด",
        heavyExportWarning:
          "การส่งออกนี้อาจใช้หน่วยความจำและ CPU สูง ลองใช้ 720p, 30 วินาที หรือ PNG Sequence หากเบราว์เซอร์เริ่มช้า",
        pngSequenceInfo:
          "PNG Sequence คือวิธี local-first ที่เชื่อถือได้ที่สุดสำหรับส่งต่อให้โปรแกรมตัดต่อ โดยเฉพาะเมื่อความโปร่งใสมีความสำคัญ",
      },
      runtimeMessages: {
        exportReadyTemplate: "ส่งออกพร้อมแล้ว: {fileName}",
        preparingWebm: "กำลังเตรียมการส่งออก WebM ในเครื่อง",
        preparingPngSequence: "กำลังเตรียมการส่งออก PNG Sequence ในเครื่อง",
        exportWorkerUnavailable: "ไม่สามารถใช้ export worker ในเซสชันเบราว์เซอร์นี้ได้",
        webmFailedUnexpectedly: "การส่งออก WebM ล้มเหลวอย่างไม่คาดคิด",
        pngSequenceFailedUnexpectedly: "การส่งออก PNG Sequence ล้มเหลวอย่างไม่คาดคิด",
      },
    },
  },
  seoSection: {
    notesEyebrow: "หมายเหตุเครื่องมือ",
    heading: "หน้าเครื่องมือเดียว พร้อมบริบทเท่าที่จำเป็นสำหรับการใช้งานจริง",
    description:
      "Time Overlay ถูกออกแบบให้เป็น overlay timer generator แบบ local-first ใช้ตัวควบคุมด้านบนเพื่อตั้งระยะเวลา สไตล์ ตำแหน่ง และรูปแบบการส่งออก แล้วใช้ส่วนล่างเพื่อดูคำถามที่ยังสำคัญต่อ SEO และการทำงานจริง",
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
      "หน้านี้ถูกตั้งใจให้อยู่ในรูปแบบกะทัดรัด: พื้นที่เครื่องมือจริงหนึ่งส่วน บล็อกอธิบายรูปแบบการส่งออกหนึ่งส่วน และพื้นที่ SEO ที่ตอบคำถามด้านเวิร์กโฟลว์ก่อนที่ผู้ใช้จะเชื่อถือเครื่องมือไทเมอร์",
      "นั่นทำให้หน้าแรกทำหน้าที่ได้ทั้งเป็นเครื่องมือการผลิตจริง และเป็น landing page ที่ถูกเก็บดัชนีสำหรับคำค้นอย่าง overlay timer, countdown timer overlay, transparent countdown overlay และ timer overlay for video editing",
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
