import type { EnabledLocale } from "@/lib/i18n";

/**
 * Copy for the two Pro gates added in the 4K / alpha-video release: the paywall
 * headlines and benefit lines that only make sense with those entitlements, and
 * the light notice shown when a free session falls back from them.
 *
 * These live here rather than in each root locale file because `generatorUi.pro`
 * is optional and only en + zh-hans fill it; keeping the gate copy locale-keyed
 * guarantees every enabled locale has it instead of falling back to English.
 */
const enProGate = {
  titleResolution: "Export in 4K",
  titleFormat: "Export transparent video as one file",
  benefitResolution: "4K resolution (2160p and up)",
  benefitFormat: "Transparent VP9 or HEVC video in one file",
  fallbackResolution: "4K needs Pro. This export uses 1080p instead.",
  fallbackFormat:
    "One-file transparent video needs Pro. This export uses a PNG sequence instead.",
} as const;

export type ProGateCopy = {
  [Key in keyof typeof enProGate]: string;
};

const proGateByLocale: Record<EnabledLocale, ProGateCopy> = {
  en: enProGate,
  es: {
    titleResolution: "Exportar en 4K",
    titleFormat: "Exportar vídeo transparente en un solo archivo",
    benefitResolution: "Resolución 4K (2160p o más)",
    benefitFormat: "Vídeo VP9 o HEVC transparente en un solo archivo",
    fallbackResolution: "El 4K requiere Pro. Esta exportación usa 1080p.",
    fallbackFormat:
      "El vídeo transparente de un solo archivo requiere Pro. Esta exportación usa una secuencia PNG.",
  },
  pt: {
    titleResolution: "Exportar em 4K",
    titleFormat: "Exportar vídeo transparente em um único arquivo",
    benefitResolution: "Resolução 4K (2160p ou mais)",
    benefitFormat: "Vídeo VP9 ou HEVC transparente em um único arquivo",
    fallbackResolution: "4K exige Pro. Esta exportação usa 1080p.",
    fallbackFormat:
      "Vídeo transparente em um único arquivo exige Pro. Esta exportação usa uma sequência PNG.",
  },
  ru: {
    titleResolution: "Экспорт в 4K",
    titleFormat: "Прозрачное видео одним файлом",
    benefitResolution: "Разрешение 4K (2160p и выше)",
    benefitFormat: "Прозрачное видео VP9 или HEVC одним файлом",
    fallbackResolution: "Для 4K нужен Pro. Этот экспорт пойдёт в 1080p.",
    fallbackFormat:
      "Прозрачное видео одним файлом требует Pro. Этот экспорт пойдёт PNG-последовательностью.",
  },
  fr: {
    titleResolution: "Exporter en 4K",
    titleFormat: "Exporter une vidéo transparente en un seul fichier",
    benefitResolution: "Résolution 4K (2160p et plus)",
    benefitFormat: "Vidéo VP9 ou HEVC transparente en un seul fichier",
    fallbackResolution: "La 4K demande Pro. Cet export se fera en 1080p.",
    fallbackFormat:
      "La vidéo transparente en un seul fichier demande Pro. Cet export utilisera une séquence PNG.",
  },
  de: {
    titleResolution: "In 4K exportieren",
    titleFormat: "Transparentes Video als eine Datei exportieren",
    benefitResolution: "4K-Auflösung (2160p und höher)",
    benefitFormat: "Transparentes VP9- oder HEVC-Video als eine Datei",
    fallbackResolution: "4K braucht Pro. Dieser Export läuft in 1080p.",
    fallbackFormat:
      "Transparentes Video als eine Datei braucht Pro. Dieser Export nutzt eine PNG-Sequenz.",
  },
  ko: {
    titleResolution: "4K로 내보내기",
    titleFormat: "투명 영상을 단일 파일로 내보내기",
    benefitResolution: "4K 해상도 (2160p 이상)",
    benefitFormat: "단일 파일 투명 VP9 또는 HEVC 영상",
    fallbackResolution: "4K는 Pro가 필요합니다. 이번에는 1080p로 내보냅니다.",
    fallbackFormat:
      "단일 파일 투명 영상은 Pro가 필요합니다. 이번에는 PNG 시퀀스로 내보냅니다.",
  },
  ja: {
    titleResolution: "4Kで書き出し",
    titleFormat: "透過動画を1ファイルで書き出し",
    benefitResolution: "4K解像度（2160p以上）",
    benefitFormat: "透過VP9またはHEVC動画を1ファイルで",
    fallbackResolution: "4KにはProが必要です。今回は1080pで書き出します。",
    fallbackFormat:
      "1ファイルの透過動画にはProが必要です。今回はPNGシーケンスで書き出します。",
  },
  fi: {
    titleResolution: "Vie 4K:na",
    titleFormat: "Vie läpinäkyvä video yhtenä tiedostona",
    benefitResolution: "4K-tarkkuus (2160p ja yli)",
    benefitFormat: "Läpinäkyvä VP9- tai HEVC-video yhtenä tiedostona",
    fallbackResolution: "4K vaatii Pron. Tämä vienti tehdään 1080p:nä.",
    fallbackFormat:
      "Läpinäkyvä video yhtenä tiedostona vaatii Pron. Tämä vienti tehdään PNG-sarjana.",
  },
  "zh-hans": {
    titleResolution: "导出 4K 分辨率",
    titleFormat: "导出单文件透明视频",
    benefitResolution: "4K 分辨率（2160p 及以上）",
    benefitFormat: "单文件透明 VP9 或 HEVC 视频",
    fallbackResolution: "4K 需要 Pro。这次导出会用 1080p。",
    fallbackFormat: "单文件透明视频需要 Pro。这次导出会用 PNG 序列。",
  },
  "zh-hant": {
    titleResolution: "匯出 4K 解析度",
    titleFormat: "匯出單一檔案透明影片",
    benefitResolution: "4K 解析度（2160p 以上）",
    benefitFormat: "單一檔案透明 VP9 或 HEVC 影片",
    fallbackResolution: "4K 需要 Pro。這次匯出會用 1080p。",
    fallbackFormat: "單一檔案透明影片需要 Pro。這次匯出會用 PNG 序列。",
  },
  ar: {
    titleResolution: "التصدير بدقة 4K",
    titleFormat: "تصدير فيديو شفاف كملف واحد",
    benefitResolution: "دقة 4K (2160p وأعلى)",
    benefitFormat: "فيديو شفاف بصيغة VP9 أو HEVC في ملف واحد",
    fallbackResolution: "دقة 4K تتطلب Pro. سيتم التصدير بدقة 1080p.",
    fallbackFormat:
      "الفيديو الشفاف كملف واحد يتطلب Pro. سيتم التصدير كتسلسل PNG.",
  },
  th: {
    titleResolution: "ส่งออกที่ 4K",
    titleFormat: "ส่งออกวิดีโอโปร่งใสเป็นไฟล์เดียว",
    benefitResolution: "ความละเอียด 4K (2160p ขึ้นไป)",
    benefitFormat: "วิดีโอโปร่งใส VP9 หรือ HEVC ในไฟล์เดียว",
    fallbackResolution: "4K ต้องใช้ Pro การส่งออกครั้งนี้จะใช้ 1080p",
    fallbackFormat:
      "วิดีโอโปร่งใสไฟล์เดียวต้องใช้ Pro การส่งออกครั้งนี้จะใช้ชุดภาพ PNG",
  },
  cs: {
    titleResolution: "Export ve 4K",
    titleFormat: "Export průhledného videa jako jeden soubor",
    benefitResolution: "Rozlišení 4K (2160p a více)",
    benefitFormat: "Průhledné VP9 nebo HEVC video v jednom souboru",
    fallbackResolution: "4K vyžaduje Pro. Tento export proběhne v 1080p.",
    fallbackFormat:
      "Průhledné video v jednom souboru vyžaduje Pro. Tento export použije sekvenci PNG.",
  },
  hi: {
    titleResolution: "4K में एक्सपोर्ट करें",
    titleFormat: "पारदर्शी वीडियो एक फ़ाइल में एक्सपोर्ट करें",
    benefitResolution: "4K रेज़ोल्यूशन (2160p और ऊपर)",
    benefitFormat: "एक फ़ाइल में पारदर्शी VP9 या HEVC वीडियो",
    fallbackResolution: "4K के लिए Pro चाहिए। यह एक्सपोर्ट 1080p में होगा।",
    fallbackFormat:
      "एक फ़ाइल में पारदर्शी वीडियो के लिए Pro चाहिए। यह एक्सपोर्ट PNG सीक्वेंस में होगा।",
  },
  nl: {
    titleResolution: "Exporteren in 4K",
    titleFormat: "Transparante video als één bestand exporteren",
    benefitResolution: "4K-resolutie (2160p en hoger)",
    benefitFormat: "Transparante VP9- of HEVC-video als één bestand",
    fallbackResolution: "4K vereist Pro. Deze export gaat in 1080p.",
    fallbackFormat:
      "Transparante video als één bestand vereist Pro. Deze export gebruikt een PNG-reeks.",
  },
  sv: {
    titleResolution: "Exportera i 4K",
    titleFormat: "Exportera transparent video som en fil",
    benefitResolution: "4K-upplösning (2160p och högre)",
    benefitFormat: "Transparent VP9- eller HEVC-video i en fil",
    fallbackResolution: "4K kräver Pro. Den här exporten blir i 1080p.",
    fallbackFormat:
      "Transparent video i en fil kräver Pro. Den här exporten använder en PNG-sekvens.",
  },
};

export function getProGateCopy(locale: string): ProGateCopy {
  return (proGateByLocale as Record<string, ProGateCopy>)[locale] ?? enProGate;
}
