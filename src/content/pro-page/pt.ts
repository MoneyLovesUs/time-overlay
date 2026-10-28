import type { ProPageContent } from "./types";

const ptProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro: timers de 60 minutos, 60 fps e modelos signature por $9",
    description:
      "Um pagamento único de $9, sem assinatura. O Pro sobe o limite de 5 minutos para 60 minutos, adiciona 60 fps e inclui os 12 modelos signature e os modelos Pro nos links ao vivo para OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Pague uma vez e fique com as ferramentas pro para sempre",
  lead:
    "O gerador grátis cobre timers rápidos de 5 minutos. O Pro é para os trabalhos que você quer que fiquem bonitos: lives de uma hora, movimento suave a 60 fps e os modelos signature para OBS, Premiere e DaVinci.",
  priceNote: "$9 uma vez · acesso vitalício · sem assinatura",
  compareTitle: "O que você recebe com o Pro",
  compareColumns: {
    feature: "Recurso",
    free: "Grátis",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Duração do timer",
      free: "Até 5 minutos",
      pro: "Até 60 minutos",
    },
    {
      feature: "Taxa de quadros",
      free: "24 ou 30 fps",
      pro: "Até 60 fps",
    },
    {
      feature: "Modelos",
      free: "48 modelos",
      pro: "48 modelos + 12 signature",
    },
    {
      feature: "Link ao vivo para OBS",
      free: "Modelos grátis",
      pro: "Grátis + modelos signature",
    },
    {
      feature: "Futuros modelos Pro",
      free: "Não incluídos",
      pro: "Incluídos",
    },
  ],
  audienceTitle: "Quem compra o Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "Uma contagem regressiva de \"começamos em breve\" para OBS que roda o pré-show inteiro em vez de cinco minutos.",
    },
    {
      title: "Editores de vídeo",
      body:
        "Trabalhe com os 12 modelos signature para a contagem regressiva combinar com o resto da sua edição, e exporte a 60 fps quando o corte pedir.",
    },
    {
      title: "Palestras e eventos",
      body:
        "Relógios de sessão longos e timers de palestrante que continuam legíveis em uma tela grande.",
    },
  ],
  faqTitle: "Perguntas",
  faqItems: [
    {
      question: "Isso é uma assinatura?",
      answer:
        "Não. Você paga $9 uma vez e o desbloqueio não renova. Modelos Pro adicionados depois entram sem custo extra.",
    },
    {
      question: "Troquei de navegador ou peguei um notebook novo. Preciso pagar de novo?",
      answer:
        "Não. Use a opção de restaurar com o email que você usou no pagamento e o Pro é desbloqueado de novo naquele navegador.",
    },
    {
      question: "Posso pedir reembolso?",
      answer:
        "Sim. Se o Pro não funcionar como descrito, fale com a gente em até 7 dias após a compra para receber o valor de volta.",
    },
    {
      question: "Como eu pago?",
      answer:
        "Pelo Stripe Checkout. Os dados do cartão ficam com o Stripe; o preço mostrado aqui já inclui qualquer desconto regional.",
    },
  ],
  buyButton: "Garanta o Pro por $9",
  buyNote: "Pagamento seguro via Stripe · reembolso total em 7 dias",
  restoreHint: "Já comprou o Pro? Restaure com o email da sua compra.",
  footerLinkLabel: "Voltar ao gerador",
};

export default ptProPageContent;
