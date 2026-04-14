import type { RootPageContent } from "@/content/root/types";

const ptRootPageContent = {
  metadata: {
    title: "Gerador de timer overlay para exportar PNG Sequence e WebM",
    description:
      "Crie um timer overlay direto no navegador, visualize ao vivo e exporte assets em PNG Sequence ou WebM em uma única página local-first.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Ferramentas de timer overlay para criadores que precisam de contagens regressivas limpas e legíveis em gravações e lives.",
    header: {
      shellLabel: "Shell público",
      toolLinkLabel: "Ferramenta",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Trilho do sistema",
      publicStatusLabel: "Status público",
      identityTitle: "Identidade",
      jumpTitle: "Ir para",
      productTitle: "Produto",
      jumpLinks: [
        { href: "/#tool", label: "Gerador" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Formatos" },
      ],
      productDescription:
        "Uma página local-first para overlays de contagem regressiva, FAQ compacto e orientação de formatos de exportação.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Preset de tema",
      description:
        "Escolha um visual inicial e ajuste os controles apenas quando necessário.",
    },
    controlPanel: {
      title: "Controles",
      subtitle: "Pilha de entrada",
      timerSetupTitle: "Configuração do timer",
      durationLabel: "Duração (segundos)",
      displayFormatLabel: "Formato de exibição",
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Preset de resolução",
      backgroundModeLabel: "Modo de fundo",
      styleTitle: "Estilo",
      fontFamilyLabel: "Família da fonte",
      anchorLabel: "Âncora",
      transparentOptionLabel: "Transparente",
      solidOptionLabel: "Sólido",
    },
    previewPanel: {
      title: "Pré-visualização",
      subtitle: "Canvas ao vivo",
      playButton: "Reproduzir prévia",
      pauseButton: "Pausar",
      resetButton: "Redefinir",
      safeAreaOnButton: "Área segura ligada",
      safeAreaOffButton: "Área segura desligada",
      currentReadoutLabel: "Leitura atual",
    },
    exportPanel: {
      title: "Exportar",
      subtitle: "Baia de entrega",
      outputFormatTitle: "Formato de saída",
      pngSequenceLabel: "Sequência PNG",
      pngSequenceDescription:
        "A opção mais confiável para editores e entrega com transparência.",
      webmLabel: "WebM",
      webmDescription:
        "Boa opção para exportação local de vídeo leve em navegadores compatíveis.",
      fpsLabel: "FPS",
      qualityLabel: "Qualidade",
      launchNoteTitle: "Nota de lançamento",
      launchNoteFallback:
        "A exportação continua local-first no MVP. Se um formato não for compatível no navegador atual, a interface direciona para PNG Sequence.",
      exportButtonIdle: "Exportar asset",
      exportButtonBusy: "Exportando...",
      exportStatusTitle: "Status da exportação",
      exportStatusIdle:
        "Inativo. Escolha um formato e inicie uma exportação local.",
      standardQualityLabel: "Padrão",
      highQualityLabel: "Alta",
    },
  },
  seoSection: {
    notesEyebrow: "Notas da ferramenta",
    heading:
      "Uma página de ferramenta, com apenas o contexto necessário para usar bem.",
    description:
      "O Time Overlay foi projetado como um gerador de timer overlay local-first. Use os controles acima para definir duração, estilo, posição e formato de exportação; mantenha esta seção inferior para as poucas perguntas que ainda importam para SEO e decisões reais de fluxo de trabalho.",
    exportFormatsTitle: "Formatos de exportação",
    exportFormatsPngText:
      "PNG Sequence é a exportação local mais confiável quando você precisa de overlays transparentes ou assets amigáveis para editores.",
    exportFormatsWebmText:
      "WebM está disponível como caminho nativo do navegador quando o ambiente atual oferece suporte adequado.",
    faqTitle: "FAQ",
    faqSubtitle: "Essenciais do timer overlay",
    faqItems: [
      {
        question: "Posso exportar um timer overlay com transparência?",
        answer:
          "Sim. O caminho local-first mais seguro é PNG Sequence, porque editores lidam melhor com assets transparentes baseados em imagem do que com fluxos de vídeo comprimido. WebM está disponível quando o navegador suporta, mas PNG Sequence continua sendo a entrega mais segura quando a transparência é prioridade.",
      },
      {
        question: "Qual formato devo escolher primeiro?",
        answer:
          "Comece com PNG Sequence se quiser a transferência mais confiável para editores, especialmente em composição sobre vídeo real. Escolha WebM quando precisar de um vídeo local mais leve e seu navegador já suportar bem.",
      },
      {
        question: "Essa ferramenta renderiza no servidor?",
        answer:
          "Não. A experiência principal é local-first. Pré-visualização e exportação rodam na máquina do usuário para que a página funcione como uma ferramenta real, sem depender de fila remota de renderização.",
      },
      {
        question: "Qual estilo de timer é mais legível em vídeo?",
        answer:
          "Números simples com alto contraste costumam vencer. Dígitos monoespaçados, brilho moderado e posicionamento cuidadoso no canto ficam mais legíveis em cenas carregadas do que estilos decorativos.",
      },
      {
        question:
          "Devo usar isso para TikTok, YouTube e editores como CapCut ou Premiere?",
        answer:
          "Sim, mas o caminho de entrega muda. Fluxos para vídeo curto e edição costumam se beneficiar de transparência ou sequência de imagens, enquanto exportação local em WebM funciona quando você só precisa de um asset leve.",
      },
    ],
  },
} satisfies RootPageContent;

export default ptRootPageContent;
