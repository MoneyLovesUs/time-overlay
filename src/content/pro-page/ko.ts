import type { ProPageContent } from "./types";

const koProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro - 60분 타이머, 60 fps, 시그니처 템플릿 $9",
    description:
      "한 번만 결제하는 $9, 구독 없음. Pro는 5분 제한을 60분으로 늘리고 60 fps와 시그니처 템플릿 12개, OBS 라이브 링크의 Pro 템플릿을 더합니다.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "한 번 결제하고 Pro 타이머 도구를 계속 쓰세요",
  lead:
    "무료 생성기는 5분짜리 빠른 타이머에 맞춰져 있어요. Pro는 결과물이 제대로 보여야 하는 작업을 위한 것입니다. 한 시간짜리 스트림, 부드러운 60 fps 움직임, OBS와 Premiere, DaVinci에 넣을 시그니처 템플릿까지요.",
  priceNote: "$9 한 번 · 평생 사용 · 구독 없음",
  compareTitle: "Pro에 포함된 것",
  compareColumns: {
    feature: "기능",
    free: "무료",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "타이머 길이",
      free: "최대 5분",
      pro: "최대 60분",
    },
    {
      feature: "프레임 레이트",
      free: "24 또는 30 fps",
      pro: "최대 60 fps",
    },
    {
      feature: "템플릿",
      free: "템플릿 48개",
      pro: "템플릿 48개 + 시그니처 12개",
    },
    {
      feature: "OBS 라이브 링크",
      free: "무료 템플릿",
      pro: "무료 + 시그니처 템플릿",
    },
    {
      feature: "향후 Pro 템플릿",
      free: "포함되지 않음",
      pro: "포함됨",
    },
  ],
  audienceTitle: "Pro를 사는 사람들",
  audienceItems: [
    {
      title: "스트리머",
      body:
        "OBS용 시작 카운트다운을 5분이 아니라 프리쇼 내내 띄울 수 있어요.",
    },
    {
      title: "비디오 편집자",
      body:
        "시그니처 템플릿 12개로 작업해서 카운트다운이 나머지 편집과 어울리게 하고, 컷에 필요할 때 60 fps로 내보내세요.",
    },
    {
      title: "발표와 이벤트",
      body:
        "큰 화면에서도 잘 읽히는 긴 세션 시계와 발표자 타이머예요.",
    },
  ],
  faqTitle: "질문",
  faqItems: [
    {
      question: "구독인가요?",
      answer:
        "아니요. $9를 한 번 결제하면 갱신되지 않아요. 나중에 추가되는 Pro 템플릿도 추가 비용 없이 포함됩니다.",
    },
    {
      question: "브라우저를 바꾸거나 새 노트북을 샀어요. 다시 결제해야 하나요?",
      answer:
        "아니요. 결제에 사용한 이메일로 복원 기능을 쓰면 그 브라우저에서 Pro가 다시 열려요.",
    },
    {
      question: "환불받을 수 있나요?",
      answer:
        "네. Pro가 설명대로 작동하지 않으면 구매 후 7일 안에 연락해 주세요. 전액 환불해 드려요.",
    },
    {
      question: "어떻게 결제하나요?",
      answer:
        "Stripe Checkout으로 결제해요. 카드 정보는 Stripe가 처리하고, 여기에 표시된 가격에는 지역 할인이 이미 반영되어 있어요.",
    },
  ],
  buyButton: "$9로 Pro 구매하기",
  buyNote: "Stripe 보안 결제 · 7일 전액 환불",
  restoreHint: "이미 Pro를 구매하셨나요? 구매에 사용한 이메일로 복원하세요.",
  footerLinkLabel: "생성기로 돌아가기",
};

export default koProPageContent;
