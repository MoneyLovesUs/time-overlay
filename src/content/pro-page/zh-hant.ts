import type { ProPageContent } from "./types";

const zhHantProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro：4K 計時器、60 FPS，最長可匯出 60 分鐘，只要 $9",
    description:
      "一次付款 $9，不需訂閱。Pro 把 5 分鐘上限提高到 60 分鐘，加入 60 FPS、4K 匯出、單一檔案透明影片，以及 12 款簽名範本。",
  },
  eyebrow: "Time Overlay Pro",
  heading: "付一次，Pro 計時器工具長期可用",
  lead:
    "免費產生器可以處理 1080p、5 分鐘以內的快速計時器。Pro 是給比較講究的案子：一小時的直播、4K 剪輯、60 FPS 的流暢畫面，還有給 OBS 或 Premiere 用的單一檔案透明疊加。",
  priceNote: "$9 一次付款 · 終身使用 · 不需訂閱",
  compareTitle: "Pro 包含什麼",
  compareColumns: {
    feature: "功能",
    free: "免費",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "計時器長度",
      free: "最長 5 分鐘",
      pro: "最長 60 分鐘",
    },
    {
      feature: "影格率",
      free: "24 或 30 FPS",
      pro: "最高 60 FPS",
    },
    {
      feature: "解析度",
      free: "720p、1080p、方形",
      pro: "免費尺寸 + 4K（2160p）",
    },
    {
      feature: "透明影片",
      free: "PNG 序列",
      pro: "PNG 序列 + 單一檔案 VP9/HEVC",
    },
    {
      feature: "範本",
      free: "48 款範本",
      pro: "48 款 + 12 款簽名範本",
    },
    {
      feature: "OBS 直播連結",
      free: "免費範本",
      pro: "免費 + 簽名範本",
    },
    {
      feature: "後續新增的 Pro 範本",
      free: "不包含",
      pro: "包含",
    },
  ],
  audienceTitle: "誰適合買 Pro",
  audienceItems: [
    {
      title: "實況主",
      body:
        "給 OBS 用的開播倒數，可以撐完整個暖場時段，而不是只有五分鐘。",
    },
    {
      title: "剪輯師",
      body:
        "把透明疊加直接拖進 Premiere 或 DaVinci，解析度跟你時間軸一致，不用再壓回 1080p。",
    },
    {
      title: "演講與活動",
      body:
        "長時間的分段計時與講者計時，投到大螢幕上依然讀得清楚。",
    },
  ],
  faqTitle: "常見問題",
  faqItems: [
    {
      question: "這是訂閱嗎？",
      answer:
        "不是。付一次 $9 就解鎖，不會自動續訂。之後新增的 Pro 範本也不用再付錢。",
    },
    {
      question: "我換了瀏覽器或換了新電腦，要再付一次嗎？",
      answer:
        "不用。用付款時的電子郵件走「找回購買」，Pro 會在那個瀏覽器重新解鎖。",
    },
    {
      question: "可以退款嗎？",
      answer:
        "可以。如果 Pro 用起來和說明不符，付款後 7 天內聯絡我們，全額退款。",
    },
    {
      question: "怎麼付款？",
      answer:
        "透過 Stripe Checkout。卡片資訊由 Stripe 處理，這裡顯示的價格已經包含地區折扣。",
    },
  ],
  buyButton: "$9 解鎖 Pro",
  buyNote: "Stripe 安全付款 · 7 天內全額退款",
  restoreHint: "已經買過 Pro？用付款電子郵件找回。",
  footerLinkLabel: "回到產生器",
};

export default zhHantProPageContent;
