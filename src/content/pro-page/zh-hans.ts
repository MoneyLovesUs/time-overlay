import type { ProPageContent } from "./types";

const zhHansProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro：60 分钟计时器、60 FPS、签名模板，一次 $9",
    description:
      "一次付款 $9，不用订阅。Pro 把 5 分钟上限提到 60 分钟，加入 60 FPS，还有 12 款签名模板和 OBS 直播链接里的 Pro 模板。",
  },
  eyebrow: "Time Overlay Pro",
  heading: "付一次钱，Pro 计时器工具长期可用",
  lead:
    "免费生成器能搞定 5 分钟以内的快速计时器。Pro 面向那些要拿得出手的活：一小时的直播、60 FPS 的流畅画面，还有给 OBS、Premiere 和 DaVinci 用的签名模板。",
  priceNote: "$9 一次付款 · 终身使用 · 不用订阅",
  compareTitle: "Pro 包含什么",
  compareColumns: {
    feature: "功能",
    free: "免费",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "计时器时长",
      free: "最长 5 分钟",
      pro: "最长 60 分钟",
    },
    {
      feature: "帧率",
      free: "24 或 30 FPS",
      pro: "最高 60 FPS",
    },
    {
      feature: "模板",
      free: "48 款模板",
      pro: "48 款 + 12 款签名模板",
    },
    {
      feature: "OBS 直播链接",
      free: "免费模板",
      pro: "免费 + 签名模板",
    },
    {
      feature: "后续新增 Pro 模板",
      free: "不包含",
      pro: "包含",
    },
  ],
  audienceTitle: "谁适合买 Pro",
  audienceItems: [
    {
      title: "主播",
      body:
        "给 OBS 用的开播倒计时，能撑完整个预热环节，而不是只有五分钟。",
    },
    {
      title: "剪辑师",
      body:
        "用 12 款签名模板，让倒计时和你其余剪辑的部分搭得上，需要的时候按 60 FPS 导出。",
    },
    {
      title: "演讲和活动",
      body:
        "长时间的分段计时和讲者计时，投到大屏幕上依然读得清。",
    },
  ],
  faqTitle: "常见问题",
  faqItems: [
    {
      question: "这是订阅吗？",
      answer:
        "不是。付一次 $9 就解锁，不会自动续费。之后新增的 Pro 模板也不用再付钱。",
    },
    {
      question: "我换了浏览器或者换了新电脑，还要再付一次吗？",
      answer:
        "不用。用付款时的邮箱走找回购买，Pro 会在那个浏览器里重新解锁。",
    },
    {
      question: "能退款吗？",
      answer:
        "可以。如果 Pro 用起来和描述的不一样，付款后 7 天内联系我们，全额退款。",
    },
    {
      question: "怎么付款？",
      answer:
        "通过 Stripe Checkout。卡信息由 Stripe 处理，这里显示的价格已经包含地区折扣。",
    },
  ],
  buyButton: "$9 解锁 Pro",
  buyNote: "Stripe 安全支付 · 7 天内全额退款",
  restoreHint: "已经买过 Pro？用付款邮箱找回。",
  footerLinkLabel: "回到生成器",
};

export default zhHansProPageContent;
