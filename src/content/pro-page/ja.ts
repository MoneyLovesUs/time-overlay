import type { ProPageContent } from "./types";

const jaProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - 60分タイマー、60 fps、シグネチャーテンプレートが$9",
    description:
      "$9の一度きりの支払いで、サブスクリプションはありません。Proは5分の上限を60分に延ばし、60 fps、シグネチャーテンプレート12個、OBSライブリンク用のProテンプレートを追加します。",
  },
  eyebrow: "Time Overlay Pro",
  heading: "一度支払えば、Proのタイマーツールをずっと使えます",
  lead:
    "無料のジェネレーターは5分までの手早いタイマー向けです。Proは見た目をきちんと仕上げたい仕事のためのものです。1時間の配信、なめらかな60 fpsの動き、OBSやPremiere、DaVinciで使えるシグネチャーテンプレートなどに使えます。",
  priceNote: "$9を一度だけ · 永久に利用可能 · サブスクリプションなし",
  compareTitle: "Proに含まれるもの",
  compareColumns: {
    feature: "機能",
    free: "無料",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "タイマーの長さ",
      free: "最大5分",
      pro: "最大60分",
    },
    {
      feature: "フレームレート",
      free: "24または30 fps",
      pro: "最大60 fps",
    },
    {
      feature: "テンプレート",
      free: "48個",
      pro: "48個 + シグネチャー12個",
    },
    {
      feature: "OBS用ライブリンク",
      free: "無料テンプレート",
      pro: "無料 + シグネチャーテンプレート",
    },
    {
      feature: "今後のProテンプレート",
      free: "含まれません",
      pro: "含まれます",
    },
  ],
  audienceTitle: "Proを買う人",
  audienceItems: [
    {
      title: "ストリーマー",
      body:
        "OBS用の開始カウントダウンを5分ではなく、プレショーの間ずっと流せます。",
    },
    {
      title: "動画編集者",
      body:
        "シグネチャーテンプレート12個で、カウントダウンを編集のほかの部分に合わせられます。カットに必要なときは60 fpsで書き出せます。",
    },
    {
      title: "講演やイベント",
      body:
        "大きなスクリーンでも読みやすい、長いセッション用の時計とスピーカータイマーです。",
    },
  ],
  faqTitle: "よくある質問",
  faqItems: [
    {
      question: "サブスクリプションですか？",
      answer:
        "いいえ。$9を一度支払うだけで、自動更新はありません。後から追加されるProテンプレートも追加費用なしで使えます。",
    },
    {
      question: "ブラウザを変えたり、新しいノートPCを買いました。また払う必要がありますか？",
      answer:
        "いいえ。支払いに使ったメールアドレスで復元を実行すれば、そのブラウザでProが再び使えるようになります。",
    },
    {
      question: "返金してもらえますか？",
      answer:
        "はい。Proが説明どおりに動かない場合、購入から7日以内にご連絡ください。全額返金します。",
    },
    {
      question: "どうやって支払いますか？",
      answer:
        "Stripe Checkoutで支払います。カード情報はStripeが処理し、ここに表示される価格には地域割引がすでに反映されています。",
    },
  ],
  buyButton: "$9でProを購入",
  buyNote: "Stripeによる安全な決済 · 7日以内の全額返金",
  restoreHint: "すでにProを購入済みですか？購入時のメールアドレスで復元してください。",
  footerLinkLabel: "ジェネレーターに戻る",
};

export default jaProPageContent;
