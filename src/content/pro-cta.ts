import type { EnabledLocale } from "@/lib/i18n";

const enProCta = {
  headerUpgradeLabel: "Upgrade to Pro",
  proBadgeLabel: "Pro",
  exportCtaTitle: "Need longer timers or 60 fps?",
  exportCtaBody:
    "Pro gives you timers up to 60 minutes, 60 fps, and the 12 signature templates. One payment of $9.",
  exportCtaButton: "Get Pro for $9",
} as const;

export type ProCtaCopy = {
  [Key in keyof typeof enProCta]: string;
};

const proCtaByLocale: Record<EnabledLocale, ProCtaCopy> = {
  en: enProCta,
  es: {
    headerUpgradeLabel: "Pasar a Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "¿Necesitas timers más largos o 60 fps?",
    exportCtaBody:
      "Pro te da timers de hasta 60 minutos, 60 fps y las 12 plantillas signature. Un solo pago de $9.",
    exportCtaButton: "Consigue Pro por $9",
  },
  pt: {
    headerUpgradeLabel: "Obter Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Precisa de timers mais longos ou 60 fps?",
    exportCtaBody:
      "O Pro libera timers de até 60 minutos, 60 fps e os 12 modelos signature. Um pagamento único de $9.",
    exportCtaButton: "Garanta o Pro por $9",
  },
  ru: {
    headerUpgradeLabel: "Купить Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Нужны таймеры длиннее или 60 fps?",
    exportCtaBody:
      "Pro даёт таймеры до 60 минут, 60 fps и 12 фирменных шаблонов. Одна оплата $9.",
    exportCtaButton: "Купить Pro за $9",
  },
  fr: {
    headerUpgradeLabel: "Passer à Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Besoin de timers plus longs ou de 60 fps ?",
    exportCtaBody:
      "Pro donne des timers jusqu'à 60 minutes, du 60 fps et les 12 modèles signature. Un seul paiement de $9.",
    exportCtaButton: "Prenez Pro pour $9",
  },
  de: {
    headerUpgradeLabel: "Pro holen",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Brauchst du längere Timer oder 60 fps?",
    exportCtaBody:
      "Pro gibt dir Timer bis 60 Minuten, 60 fps und die 12 Signature-Vorlagen. Einmal $9 zahlen.",
    exportCtaButton: "Hol dir Pro für $9",
  },
  ko: {
    headerUpgradeLabel: "Pro 업그레이드",
    proBadgeLabel: "프로",
    exportCtaTitle: "더 긴 타이머나 60 fps가 필요하세요?",
    exportCtaBody:
      "Pro에서는 타이머를 최대 60분까지, 60 fps, 시그니처 템플릿 12개를 쓸 수 있어요. $9 한 번만 결제하면 됩니다.",
    exportCtaButton: "$9로 Pro 구매하기",
  },
  ja: {
    headerUpgradeLabel: "Proにアップグレード",
    proBadgeLabel: "Pro",
    exportCtaTitle: "もっと長いタイマーや60 fpsが必要ですか？",
    exportCtaBody:
      "Proなら最大60分のタイマー、60 fps、シグネチャーテンプレート12個が使えます。$9の一度きりの支払いです。",
    exportCtaButton: "$9でProを購入",
  },
  fi: {
    headerUpgradeLabel: "Hanki Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Tarvitsetko pidempiä ajastimia tai 60 fps:n?",
    exportCtaBody:
      "Pro antaa ajastimet 60 minuuttiin asti, 60 fps:n ja 12 signature-mallia. Yksi $9 maksu.",
    exportCtaButton: "Hanki Pro hintaan $9",
  },
  "zh-hans": {
    headerUpgradeLabel: "升级 Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "需要更长的计时器或 60 FPS？",
    exportCtaBody:
      "Pro 支持最长 60 分钟的计时器、60 FPS 和 12 款签名模板，一次付款 $9。",
    exportCtaButton: "$9 解锁 Pro",
  },
  "zh-hant": {
    headerUpgradeLabel: "升級 Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "需要更長的計時器或 60 FPS？",
    exportCtaBody:
      "Pro 支援最長 60 分鐘的計時器、60 FPS 和 12 款簽名範本，一次付款 $9。",
    exportCtaButton: "$9 解鎖 Pro",
  },
  ar: {
    headerUpgradeLabel: "احصل على Pro",
    proBadgeLabel: "برو",
    exportCtaTitle: "تحتاج مؤقتات أطول أو 60 fps؟",
    exportCtaBody:
      "يمنحك Pro مؤقتات تصل إلى 60 دقيقة و60 fps و12 قالبًا مميزًا. دفعة واحدة بقيمة $9.",
    exportCtaButton: "احصل على Pro مقابل $9",
  },
  th: {
    headerUpgradeLabel: "รับ Pro",
    proBadgeLabel: "โปร",
    exportCtaTitle: "ต้องการไทเมอร์ที่ยาวขึ้นหรือ 60 fps ไหม?",
    exportCtaBody:
      "Pro ให้ไทเมอร์ได้ถึง 60 นาที, 60 fps และเทมเพลตซิกเนเจอร์ 12 แบบ จ่ายครั้งเดียว $9",
    exportCtaButton: "รับ Pro ในราคา $9",
  },
  cs: {
    headerUpgradeLabel: "Přejít na Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Potřebujete delší timery nebo 60 fps?",
    exportCtaBody:
      "Pro vám dá timery až do 60 minut, 60 fps a 12 signature šablon. Jedna platba $9.",
    exportCtaButton: "Získat Pro za $9",
  },
  hi: {
    headerUpgradeLabel: "Pro लें",
    proBadgeLabel: "प्रो",
    exportCtaTitle: "लंबे टाइमर या 60 fps चाहिए?",
    exportCtaBody:
      "Pro में 60 मिनट तक के टाइमर, 60 fps और 12 सिग्नेचर टेम्पलेट मिलते हैं। एक बार $9 का भुगतान।",
    exportCtaButton: "$9 में Pro लें",
  },
  nl: {
    headerUpgradeLabel: "Pro halen",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Langere timers of 60 fps nodig?",
    exportCtaBody:
      "Pro geeft je timers tot 60 minuten, 60 fps en de 12 signature-sjablonen. Eén betaling van $9.",
    exportCtaButton: "Haal Pro voor $9",
  },
  sv: {
    headerUpgradeLabel: "Skaffa Pro",
    proBadgeLabel: "Pro",
    exportCtaTitle: "Behöver du längre timers eller 60 fps?",
    exportCtaBody:
      "Pro ger dig timers upp till 60 minuter, 60 fps och de 12 signaturmallarna. En betalning på $9.",
    exportCtaButton: "Skaffa Pro för $9",
  },
};

export function getProCtaCopy(locale: string): ProCtaCopy {
  return (proCtaByLocale as Record<string, ProCtaCopy>)[locale] ?? enProCta;
}
