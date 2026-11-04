import type { RootPageContent } from "@/content/root/types";

const ptRootPageContent = {
  metadata: {
    title: "Gerador de timer overlay com contagem regressiva para vídeos e lives",
    description:
      "Crie timers overlay limpos no navegador. Veja a prévia na hora e exporte sequência PNG com transparência ou WebM para edição de vídeo, lives e tutoriais.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Defina a duração, veja o quadro na prévia e depois exporte seu asset de timer.",
    intro:
      "Primeiro teste recomendado: `30s`, `PNG sequence`, `bottom-right`.",
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
        { anchorId: "tool", label: "Gerador" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formatos" },
      ],
      productDescription:
        "Uma página local-first para overlays de contagem regressiva, FAQ compacto e orientação de formatos de exportação.",
    },
  },
  generatorUi: {
    templateGallery: {
      title: "Biblioteca de modelos",
      description:
        "Comece com um layout testado. A duração e as opções de exportação são preservadas.",
      browseLabel: "Ver todos os 48",
      searchPlaceholder: "Buscar modelos ou usos",
      categoryLabels: {
        all: "Todos",
        editing: "Edição",
        streaming: "Streaming",
        social: "Social",
        events: "Eventos",
        fitness: "Fitness",
        cinematic: "Cinemático",
        minimal: "Minimalista",
      },
      selectedLabel: "Selecionado",
      editedLabel: "Editado",
      resultTemplate: "{count} modelos",
      noResults: "Nenhum modelo corresponde a este filtro.",
      closeLabel: "Fechar a biblioteca de modelos",
    },
    themePresetPicker: {
      title: "Preset de tema",
      description:
        "Escolha um visual inicial e ajuste os controles apenas quando necessário.",
      presetLabels: {
        cyber: "Cyber",
        minimal: "Minimal",
        mono: "Mono",
        neon: "Neon",
        glow: "Glow",
        scanline: "Scanline",
        classic: "Classic",
        retro: "Retro 80s",
        glass: "Glass",
        neumorphic: "Neumorphic",
      },
    },
    controlPanel: {
      title: "Controles",
      subtitle: "Pilha de entrada",
      timerSetupTitle: "Configuração do timer",
      durationLabel: "Duração (segundos)",
      displayFormatLabel: "Formato de exibição",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Preset de resolução",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Modo de fundo",
      styleTitle: "Estilo",
      fontFamilyLabel: "Família da fonte",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Âncora",
      anchorOptions: {
        "top-left": "Topo esquerdo",
        "top-center": "Topo centro",
        "top-right": "Topo direito",
        "center-left": "Centro esquerdo",
        center: "Centro",
        "center-right": "Centro direito",
        "bottom-left": "Base esquerda",
        "bottom-center": "Base centro",
        "bottom-right": "Base direita",
      },
      transparentOptionLabel: "Transparente",
      solidOptionLabel: "Sólido",
    audioTitle: "Audio",
    audioVariantLabel: "Audio cues",
    audioVariantOptions: {
      none: "None",
      tick: "Tick every second",
      beep: "Final beep only",
      "tick-and-beep": "Tick + final beep",
    },
    audioNote: "Audio is embedded in WebM (with alpha) exports. PNG sequence is silent.",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Vídeo VP8 transparente para OBS e Streamlabs. Adicione como fonte de mídia, já sem fundo.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Vídeo transparente mais compacto para OBS e fluxos compatíveis com VP9 alpha; o suporte de importação varia entre editores.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Qualidade",
      launchNoteTitle: "Nota de lançamento",
      launchNoteFallback:
        "A exportação continua local-first no MVP. Se um formato não for compatível no navegador atual, a interface direciona para PNG Sequence.",
      exportButtonIdle: "Exportar asset",
      exportButtonBusy: "Exportando...",
      exportStatusTitle: "Status da exportação",
      exportStatusIdle:
        "Inativo. Escolha um formato e inicie uma exportação local.",
      qualityOptions: {
        standard: "Padrão",
        high: "Alta",
      },
      advisoryMessages: {
        workerSupportError:
          "Este navegador não consegue iniciar um worker em segundo plano, então a exportação local de vídeo fica desativada. Use PNG Sequence em um navegador de desktop moderno.",
        webmUnavailableError:
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Esta exportação provavelmente vai exigir bastante memória e CPU. Considere 720p, 30 segundos ou PNG Sequence se o navegador começar a sofrer.",
        pngSequenceInfo:
          "PNG Sequence é o handoff local-first mais confiável para editores, especialmente quando a transparência importa.",
      vp9AlphaInfo:
        "WebM VP9 + alpha é um formato transparente compacto para OBS e fluxos em que o VP9 alpha já foi testado.",
      hevcAlphaInfo:
        "MOV HEVC + alpha é a opção direta recomendada para Final Cut Pro em um Mac compatível.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Exportação pronta: {fileName}",
        preparingWebm: "Preparando exportação local em WebM",
        preparingPngSequence: "Preparando exportação local em PNG Sequence",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "O worker de exportação não está disponível nesta sessão do navegador.",
        webmFailedUnexpectedly: "A exportação em WebM falhou inesperadamente.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "A exportação em PNG Sequence falhou inesperadamente.",
      },
      png: {
        prepareTitle: "Preparar sequência PNG",
        prepareIntro:
          "Você está exportando uma sequência PNG transparente. Confira o plano abaixo antes de escolher onde os quadros serão salvos.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} quadros · {width}×{height}",
        estimateTemplate:
          "Cerca de {size}, {parts} parte(s) ZIP e aproximadamente {time} de codificação. As estimativas são atualizadas conforme os quadros reais são gravados.",
        estimateUnknown:
          "Não havia quadros de amostra, então as estimativas de tamanho e tempo são desconhecidas. A exportação ainda pode continuar.",
        sampleProgress:
          "Renderizando quadros de amostra para estimar tamanho e tempo…",
        longJobTitle: "Esta exportação é longa",
        longJobBody:
          "Os quadros são gravados no disco parte por parte, então a sequência inteira nunca fica na memória. Cada parte ZIP precisa ser descompactada e unida antes de importar.",
        saveFolderButton: "Escolher pasta e iniciar",
        saveFolderHint:
          "O navegador pede acesso de gravação uma vez. Dentro dela é criada uma pasta de tarefa, e as partes concluídas ficam no disco.",
        opfsButton: "Gerar no navegador, baixar partes",
        opfsHint:
          "O navegador mantém arquivos temporários até você baixá-los e limpá-los. Reserve espaço para a cópia temporária, seus downloads e os quadros descompactados.",
        continueButton: "Continuar nesta aba",
        cancelPrepButton: "Cancelar preparação",
        adviceDesktopSafari:
          "Para exportar melhor, use o Chrome no computador. Você pode continuar, mas exportações PNG longas são verificadas principalmente no Chrome.",
        adviceMobile:
          "Para exportar melhor, faça no computador. Você pode continuar se este dispositivo passar na verificação de armazenamento.",
        capabilityMissing:
          "Esta exportação precisa de armazenamento local retomável e de uma única aba ativa, e este navegador ou perfil não oferece isso.",
        longStorageMissing:
          "Uma exportação longa precisa de uma pasta com permissão de gravação ou de um armazenamento do navegador que aceite gravações de verdade. Este navegador não oferece um destino seguro, então nenhum quadro foi gerado.",
        runTitle: "Exportação de sequência PNG",
        modeDirectory: "Pasta de salvamento",
        modeBrowserStorage: "Armazenamento do navegador",
        modeMemory: "Memória temporária",
        runFramesTemplate: "Quadros processados",
        runCommittedTemplate: "Quadros salvos com segurança",
        runPartTemplate: "Parte atual · partes salvas",
        runBytesTemplate: "Gravado",
        stoppingButton: "Parando…",
        cancelButton: "Cancelar exportação",
        cancelledMessage:
          "Exportação interrompida. As partes ZIP concluídas são mantidas; retome a partir da última parte salva.",
        resultTitle: "Exportação PNG concluída",
        directorySavedTemplate:
          "{frames} quadros salvos como {parts} parte(s) ZIP em {folder} ({size}).",
        opfsPartsTitle:
          "{parts} parte(s) ZIP, {size}. Baixe cada parte enquanto ela aparecer aqui.",
        partDownloadButton: "Baixar",
        partRangeTemplate: "quadros {first}–{last} · {size}",
        mergeInstructionsTitle: "Antes de importar",
        mergeInstructionsBody:
          "Descompacte todas as partes, mova os arquivos frame-*.png para uma única pasta e importe essa pasta como sequência de imagens nos fps escolhidos. Não importe cada parte como uma contagem separada. O primeiro ZIP inclui scripts de conversão que verificam quadros faltantes.",
        autoDownloadNote:
          "O download do navegador começou. Mantenha esta aba aberta até ele terminar.",
        openFolderHint:
          "O navegador não consegue abrir o gerenciador de arquivos; use a janela de pastas do sistema se precisar.",
        cleanupButton: "Limpar arquivos temporários",
        recoveryTitle: "Exportação PNG inacabada encontrada",
        recoveryBodyTemplate:
          "{frames} de {total} quadros estão salvos com segurança em {parts} parte(s). A parte inacabada será refeita.",
        restoreButton: "Retomar exportação",
        authorizeButton: "Autorizar e continuar",
        selectFolderButton: "Selecionar pasta de exportação",
        removeRecordButton: "Remover registro de recuperação",
        fontRequired:
          "Esta exportação usou uma fonte personalizada. Informe o mesmo arquivo de fonte para retomar.",
        fontButton: "Selecionar arquivo de fonte",
        downloadFailed:
          "O download não pôde começar. Os arquivos prontos continuam disponíveis acima; tente de novo.",
        errorTitle: "Problema na exportação PNG",
        errorMessages: {
          pngStorageUnavailable:
            "Este navegador bloqueou o armazenamento local necessário para exportar PNG. Use uma janela normal do Chrome no computador.",
          pngDirectoryPermissionDenied:
            "A gravação na pasta escolhida não foi autorizada. Escolha a pasta de novo e permita gravar; nenhuma exportação foi iniciada.",
          pngStorageFull:
            "Não há espaço livre suficiente para concluir esta parte PNG. Libere espaço e retome; as partes salvas são mantidas.",
          pngWriteFailed:
            "Falha ao salvar uma parte PNG. As partes salvas são mantidas; confira a pasta ou o armazenamento e retome.",
          pngZipValidationFailed:
            "Uma parte ZIP salva não passou na validação. Ela será refeita; as partes anteriores são mantidas.",
          pngFrameTooLarge:
            "Um quadro PNG ou os metadados ZIP necessários passam do limite por parte. Reduza a resolução ou use um estilo mais simples.",
          pngMemoryLimitExceeded:
            "Esta exportação precisa de mais memória temporária do que o caminho em memória limitado permite. Para uma exportação longa, use o Chrome no computador com uma pasta com gravação liberada.",
          pngResumeVersionMismatch:
            "A exportação salva foi feita com outras configurações, assets ou uma versão mais antiga do app. Não é possível juntá-la com segurança; inicie uma nova exportação e mantenha as partes existentes.",
          pngResumeFileMissing:
            "Uma parte ZIP salva está faltando ou mudou. A parte afetada precisa ser refeita; selecione a pasta da tarefa de novo e retome.",
          pngLocked:
            "Esta exportação está aberta em outra aba, ou este navegador não consegue bloquear a tarefa. Feche a outra aba e tente de novo.",
          pngCheckpointFailed:
            "Este navegador não consegue manter o checkpoint local de que as exportações PNG retomáveis precisam. Use o Chrome no computador ou exporte um trabalho curto que caiba na memória.",
          pngFailedUnexpectedly:
            "A exportação PNG parou inesperadamente. As partes salvas, se houver, são mantidas; retome ou inicie uma nova exportação.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Notas da ferramenta",
    heading:
      "Uma página de ferramenta, com apenas o contexto necessário para usar bem.",
    description:
      "O Time Overlay é um gerador local-first. Defina acima a duração, o estilo, a posição e o formato; consulte abaixo como preservar a transparência e o que testar antes de usar o arquivo em produção.",
    exportFormatsTitle: "Formatos de exportação",
    exportFormatsPngText:
      "PNG Sequence é a exportação local mais confiável quando você precisa de overlays transparentes ou assets amigáveis para editores.",
    exportFormatsWebmText:
      "WebM está disponível como caminho nativo do navegador quando o ambiente atual oferece suporte adequado.",
    workflowEyebrow: "Como funciona",
    workflowHeading: "Como funciona a exportação do overlay timer",
    workflowSteps: [
      {
        title: "Defina a duração da contagem e o layout",
        body:
          "Comece no gerador acima. Escolha a duração total, selecione um layout de relógio limpo e posicione o overlay onde ele continue legível sobre gameplay, vídeos de produto ou talking heads.",
      },
      {
        title: "Escolha um estilo de timer para a sua filmagem",
        body:
          "Ajuste tipografia, contraste, escala e posicionamento para que a contagem pareça intencional, e não apenas colada na imagem. Os melhores overlays costumam usar números fortes, espaçamento estável e folga suficiente em relação à borda do quadro.",
      },
      {
        title: "Exporte o formato que combina com seu editor",
        body:
          "Use PNG Sequence quando precisar do fluxo mais seguro para assets transparentes, ou escolha WebM quando um arquivo de vídeo local mais leve já for suficiente para o projeto em edição.",
      },
    ],
    usageEyebrow: "Como usar",
    usageHeading: "Como usar o Time Overlay",
    usageNotes: [
      "Abra o gerador, defina a duração do timer e visualize a contagem antes de exportar qualquer coisa.",
      "Use PNG Sequence para overlays transparentes no CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve ou em qualquer fluxo que prefira assets baseados em imagem.",
      "Use WebM quando quiser uma exportação rápida pelo navegador para mockups, cortes preliminares ou edições sociais leves.",
      "Mantenha o timer curto, com alto contraste e longe de legendas ou enquadramento de rosto para que continue legível no mobile.",
    ],
    usageCta: {
      beforeFirstLink: "Comece no ",
      firstLinkLabel: "gerador ao vivo",
      betweenLinks: "e use o ",
      secondLinkLabel: "guia de exportação",
      afterSecondLink:
        "abaixo quando estiver escolhendo entre quadros transparentes e saída de vídeo pelo navegador.",
    },
    aboutEyebrow: "Sobre",
    aboutHeading: "Sobre o Time Overlay",
    aboutPoints: [
      "Time Overlay é um gerador de timer overlay local-first feito para criadores que precisam de gráficos de contagem regressiva sem enviar o vídeo para um serviço remoto de renderização.",
      "O gerador reúne controles, orientações de exportação e notas de solução de problemas para que você crie o arquivo e saiba como levá-lo a outro aplicativo.",
      "Os guias separam suporte documentado de recomendações práticas, citam as fontes consultadas e mostram a data da última revisão para que a compatibilidade possa ser verificada novamente.",
    ],
    aboutCta: {
      beforeLink:
        "Se você só precisa resolver as objeções práticas primeiro, vá para o ",
      linkLabel: "FAQ do overlay timer",
      afterLink: ".",
    },
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
