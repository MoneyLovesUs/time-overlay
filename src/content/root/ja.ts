import type { RootPageContent } from "@/content/root/types";

const jaRootPageContent = {
  metadata: {
    title: "PNGシーケンスとWebMを書き出せるオーバーレイタイマージェネレーター",
    description:
      "ブラウザ上でオーバーレイタイマーを作成し、ライブプレビューで確認して、PNGシーケンスまたはWebMを書き出せるローカルファーストの単一ツールページです。",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "長さを設定してフレームをプレビューし、タイマー素材を書き出しましょう。",
    intro: "最初の推奨設定: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "録画やライブ配信で見やすいカウントダウンを必要とするクリエイター向けのオーバーレイタイマーツールです。",
    header: {
      shellLabel: "パブリックシェル",
      toolLinkLabel: "ツール",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "システムレール",
      publicStatusLabel: "公開ステータス",
      identityTitle: "アイデンティティ",
      jumpTitle: "ジャンプ",
      productTitle: "プロダクト",
      jumpLinks: [
        { anchorId: "tool", label: "ジェネレーター" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "形式" },
      ],
      productDescription:
        "カウントダウンオーバーレイ、コンパクトなFAQ、書き出し形式のガイドを1ページにまとめたローカルファーストツールです。",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "テーマプリセット",
      description:
        "まずは見た目のプリセットを選び、必要なときだけコントロールを微調整してください。",
    },
    controlPanel: {
      title: "コントロール",
      subtitle: "入力スタック",
      timerSetupTitle: "タイマー設定",
      durationLabel: "長さ（秒）",
      displayFormatLabel: "表示フォーマット",
      canvasTitle: "キャンバス",
      resolutionPresetLabel: "解像度プリセット",
      backgroundModeLabel: "背景モード",
      styleTitle: "スタイル",
      fontFamilyLabel: "フォントファミリー",
      anchorLabel: "アンカー",
      transparentOptionLabel: "透明",
      solidOptionLabel: "単色",
    },
    previewPanel: {
      title: "プレビュー",
      subtitle: "ライブキャンバス",
      playButton: "プレビュー再生",
      pauseButton: "一時停止",
      resetButton: "リセット",
      safeAreaOnButton: "セーフエリア ON",
      safeAreaOffButton: "セーフエリア OFF",
      currentReadoutLabel: "現在の表示",
    },
    exportPanel: {
      title: "書き出し",
      subtitle: "デリバリーベイ",
      outputFormatTitle: "出力形式",
      pngSequenceLabel: "PNGシーケンス",
      pngSequenceDescription:
        "編集ソフト連携や透過素材の受け渡しで最も信頼性が高い形式です。",
      webmLabel: "WebM",
      webmDescription:
        "対応ブラウザで軽量なローカル動画を書き出すのに適しています。",
      fpsLabel: "FPS",
      qualityLabel: "品質",
      launchNoteTitle: "リリースノート",
      launchNoteFallback:
        "MVPでは書き出しはローカルファーストのままです。現在のブラウザで形式が未対応の場合、UIがPNGシーケンスへ案内します。",
      exportButtonIdle: "アセットを書き出す",
      exportButtonBusy: "書き出し中...",
      exportStatusTitle: "書き出しステータス",
      exportStatusIdle:
        "待機中です。形式を選んでローカル書き出しを開始してください。",
      standardQualityLabel: "標準",
      highQualityLabel: "高品質",
    },
  },
  seoSection: {
    notesEyebrow: "ツールノート",
    heading:
      "1つのツールページに、実運用で必要な最小限のコンテキストだけを載せました。",
    description:
      "Time Overlay はローカルファーストのオーバーレイタイマージェネレーターとして設計されています。上部のコントロールで長さ・スタイル・位置・書き出し形式を設定し、下部セクションでは SEO と実務フローに本当に必要な質問だけを確認できます。",
    exportFormatsTitle: "書き出し形式",
    exportFormatsPngText:
      "透過オーバーレイや編集しやすい素材が必要な場合、PNGシーケンスが最も安定したローカル書き出しです。",
    exportFormatsWebmText:
      "現在の環境で安定して対応している場合は、WebMをブラウザ標準の簡易ルートとして利用できます。",
    faqTitle: "FAQ",
    faqSubtitle: "オーバーレイタイマーの要点",
    faqItems: [
      {
        question: "透過付きのオーバーレイタイマーを書き出せますか？",
        answer:
          "はい。最も安全なローカルファーストの手段はPNGシーケンスです。圧縮動画ワークフローよりも、画像ベースの透過素材のほうが編集ソフトで安定して扱えるためです。ブラウザが対応していればWebMも使えますが、透過が重要な場合はPNGシーケンスがより確実です。",
      },
      {
        question: "最初に選ぶべき書き出し形式はどれですか？",
        answer:
          "実写への合成など、編集ソフトへの受け渡しを重視するならまずPNGシーケンスがおすすめです。より軽いローカル動画出力が必要で、ブラウザ対応が十分ならWebMを選んでください。",
      },
      {
        question: "このツールはサーバー側でレンダリングしますか？",
        answer:
          "いいえ。中心となる体験はローカルファーストです。プレビューと書き出しはユーザー端末で実行されるため、リモートレンダーキューを待たずに実際の制作ツールとして動作します。",
      },
      {
        question: "動画で最も読みやすいタイマースタイルは？",
        answer:
          "一般的には、コントラストの高いシンプルな数字が最も読みやすいです。等幅数字、控えめなグロー、丁寧なコーナー配置は、装飾的なスキンよりも複雑な映像上で判読性を保ちやすくなります。",
      },
      {
        question:
          "TikTok や YouTube、CapCut・Premiere のような編集ワークフローでも使えますか？",
        answer:
          "はい。ただし受け渡し経路は用途で変わります。ショート動画や編集ワークフローでは透過または画像シーケンスが有利なことが多く、軽量素材だけが必要な場合はローカルWebM出力が実用的です。",
      },
    ],
  },
} satisfies RootPageContent;

export default jaRootPageContent;
