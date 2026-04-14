import type { RootPageContent } from "@/content/root/types";

const esRootPageContent = {
  metadata: {
    title: "Generador de temporizador overlay para exportar PNG Sequence y WebM",
    description:
      "Crea un temporizador overlay directamente en el navegador, previsualízalo en vivo y exporta recursos en PNG Sequence o WebM desde una sola página local-first.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Define la duración, previsualiza el fotograma y después exporta tu recurso de temporizador.",
    intro:
      "Primera prueba recomendada: `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Herramientas de temporizador overlay para creadores que necesitan cuentas regresivas limpias y legibles en grabaciones y directos.",
    header: {
      shellLabel: "Capa pública",
      toolLinkLabel: "Herramienta",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Riel del sistema",
      publicStatusLabel: "Estado público",
      identityTitle: "Identidad",
      jumpTitle: "Ir a",
      productTitle: "Producto",
      jumpLinks: [
        { anchorId: "tool", label: "Generador" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formatos" },
      ],
      productDescription:
        "Una sola página local-first para overlays de cuenta regresiva, FAQ compacta y guía de formatos de exportación.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Preajuste de tema",
      description:
        "Elige un aspecto inicial y luego ajusta los controles solo si hace falta.",
      presetLabels: {
        "minimal-neon": "Neón minimalista",
        "broadcast-alert": "Alerta broadcast",
        "calm-studio": "Estudio sereno",
      },
    },
    controlPanel: {
      title: "Controles",
      subtitle: "Pila de entrada",
      timerSetupTitle: "Configuración del temporizador",
      durationLabel: "Duración (segundos)",
      displayFormatLabel: "Formato de visualización",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Lienzo",
      resolutionPresetLabel: "Preajuste de resolución",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Modo de fondo",
      styleTitle: "Estilo",
      fontFamilyLabel: "Familia tipográfica",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Anclaje",
      anchorOptions: {
        "top-left": "Arriba izquierda",
        "top-center": "Arriba centro",
        "top-right": "Arriba derecha",
        "center-left": "Centro izquierda",
        center: "Centro",
        "center-right": "Centro derecha",
        "bottom-left": "Abajo izquierda",
        "bottom-center": "Abajo centro",
        "bottom-right": "Abajo derecha",
      },
      transparentOptionLabel: "Transparente",
      solidOptionLabel: "Sólido",
    },
    previewPanel: {
      title: "Vista previa",
      subtitle: "Lienzo en vivo",
      playButton: "Reproducir vista previa",
      pauseButton: "Pausar",
      resetButton: "Reiniciar",
      safeAreaOnButton: "Área segura activada",
      safeAreaOffButton: "Área segura desactivada",
      currentReadoutLabel: "Lectura actual",
    },
    exportPanel: {
      title: "Exportar",
      subtitle: "Zona de entrega",
      outputFormatTitle: "Formato de salida",
      pngSequenceLabel: "Secuencia PNG",
      pngSequenceDescription:
        "La opción más confiable para editores y entregas con transparencia.",
      webmLabel: "WebM",
      webmDescription:
        "Ideal para exportación local de video liviano en navegadores compatibles.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Calidad",
      launchNoteTitle: "Nota de lanzamiento",
      launchNoteFallback:
        "La exportación sigue siendo local-first en esta versión MVP. Si un formato no es compatible con el navegador, la interfaz guiará al usuario hacia PNG Sequence.",
      exportButtonIdle: "Exportar recurso",
      exportButtonBusy: "Exportando...",
      exportStatusTitle: "Estado de exportación",
      exportStatusIdle:
        "En espera. Elige un formato y comienza una exportación local.",
      qualityOptions: {
        standard: "Estándar",
        high: "Alta",
      },
      advisoryMessages: {
        workerSupportError:
          "Este navegador no puede iniciar un worker en segundo plano, así que la exportación local de video queda desactivada. Usa PNG Sequence en un navegador de escritorio moderno.",
        webmUnavailableError:
          "La exportación WebM no está disponible en este navegador. PNG Sequence sigue siendo la alternativa más segura.",
        heavyExportWarning:
          "Esta exportación probablemente exigirá bastante memoria y CPU. Considera 720p, 30 segundos o PNG Sequence si tu navegador empieza a resentirse.",
        pngSequenceInfo:
          "PNG Sequence es la entrega local-first más fiable para editores, especialmente cuando la transparencia importa.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Exportación lista: {fileName}",
        preparingWebm: "Preparando exportación local en WebM",
        preparingPngSequence: "Preparando exportación local en PNG Sequence",
        exportWorkerUnavailable:
          "El worker de exportación no está disponible en esta sesión del navegador.",
        webmFailedUnexpectedly: "La exportación WebM falló de forma inesperada.",
        pngSequenceFailedUnexpectedly:
          "La exportación de PNG Sequence falló de forma inesperada.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Notas de la herramienta",
    heading:
      "Una sola página de herramienta, con el contexto mínimo para usarla bien.",
    description:
      "Time Overlay está diseñado como un generador de temporizador overlay local-first. Usa los controles de arriba para configurar duración, estilo, posición y formato de exportación; esta sección inferior responde las preguntas clave para SEO y para decisiones reales de flujo de trabajo.",
    exportFormatsTitle: "Formatos de exportación",
    exportFormatsPngText:
      "PNG Sequence es la exportación local más confiable cuando necesitas overlays transparentes o recursos amigables con editores.",
    exportFormatsWebmText:
      "WebM está disponible como opción nativa del navegador cuando el entorno actual lo soporta correctamente.",
    workflowEyebrow: "Cómo funciona",
    workflowHeading: "Cómo funciona la exportación del overlay timer",
    workflowSteps: [
      {
        title: "Define la duración y el encuadre del contador",
        body:
          "Empieza en el generador de arriba. Elige la duración total, selecciona un diseño limpio del reloj y coloca el overlay donde siga siendo legible sobre gameplay, metraje de producto o vídeos talking-head.",
      },
      {
        title: "Elige un estilo de temporizador para tu metraje",
        body:
          "Ajusta tipografía, contraste, escala y posición para que la cuenta atrás se vea intencional y no simplemente pegada encima. Los mejores overlays suelen usar números contundentes, espaciado estable y suficiente aire respecto al borde del encuadre.",
      },
      {
        title: "Exporta el formato que encaje con tu editor",
        body:
          "Usa PNG Sequence cuando necesites el flujo más seguro para recursos transparentes, o elige WebM cuando un archivo de vídeo local más ligero sea suficiente para el proyecto que estás editando.",
      },
    ],
    usageEyebrow: "Cómo usarlo",
    usageHeading: "Cómo usar Time Overlay",
    usageNotes: [
      "Abre el generador, define la duración y revisa la cuenta regresiva antes de exportar nada.",
      "Usa PNG Sequence para overlays transparentes en CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve o cualquier flujo que prefiera recursos basados en imágenes.",
      "Usa WebM cuando necesites una exportación rápida desde el navegador para mockups, rough cuts o ediciones sociales ligeras.",
      "Mantén el temporizador corto, con alto contraste y lejos de subtítulos o encuadres faciales para que siga siendo legible en móvil.",
    ],
    usageCta: {
      beforeFirstLink: "Empieza en el ",
      firstLinkLabel: "generador en vivo",
      betweenLinks: "y usa la ",
      secondLinkLabel: "guía de exportación",
      afterSecondLink:
        "de abajo cuando estés eligiendo entre fotogramas transparentes y salida de vídeo desde el navegador.",
    },
    aboutEyebrow: "Acerca de",
    aboutHeading: "Acerca de Time Overlay",
    aboutPoints: [
      "Time Overlay es un generador de temporizador overlay local-first pensado para creadores que necesitan gráficos de cuenta regresiva sin subir su metraje a un servicio remoto de render.",
      "La página es intencionalmente compacta: una superficie de trabajo real, un bloque claro sobre formatos de exportación y una zona SEO que responde las preguntas de flujo de trabajo que la gente busca antes de confiar en una herramienta de temporizador.",
      "Eso hace que la homepage sirva tanto como utilidad de producción real como landing page rastreable para búsquedas como overlay timer, countdown timer overlay, transparent countdown overlay o timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink: "Si primero quieres resolver las dudas prácticas, ve al ",
      linkLabel: "FAQ del overlay timer",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Fundamentos del temporizador overlay",
    faqItems: [
      {
        question: "¿Puedo exportar un temporizador overlay con transparencia?",
        answer:
          "Sí. La ruta local-first más segura es PNG Sequence, porque los editores manejan mejor los recursos transparentes basados en imágenes que los flujos de video comprimido. WebM está disponible cuando el navegador lo soporta, pero PNG Sequence sigue siendo la entrega más fiable cuando la transparencia es crítica.",
      },
      {
        question: "¿Qué formato de exportación debo elegir primero?",
        answer:
          "Empieza con PNG Sequence si quieres la transferencia más estable a editores, especialmente para composición sobre metraje real. Elige WebM cuando necesites un video local más liviano y tu navegador ya lo soporte bien.",
      },
      {
        question: "¿Esta herramienta se renderiza en el servidor?",
        answer:
          "No. La experiencia principal es local-first. La vista previa y la exportación se ejecutan en la máquina del usuario para que la página se comporte como una herramienta real y no dependa de una cola de render remota.",
      },
      {
        question: "¿Qué estilo de temporizador se lee mejor en video?",
        answer:
          "Los números simples con alto contraste suelen funcionar mejor. Dígitos monoespaciados, brillo moderado y una buena colocación en las esquinas se leen mejor sobre escenas cargadas que los estilos decorativos.",
      },
      {
        question:
          "¿Sirve para TikTok, YouTube y editores como CapCut o Premiere?",
        answer:
          "Sí, pero cambia la ruta de entrega. Los flujos para redes cortas y editores suelen beneficiarse de exportaciones transparentes o en secuencia de imágenes, mientras que WebM local rápido funciona cuando solo necesitas un recurso liviano.",
      },
    ],
  },
} satisfies RootPageContent;

export default esRootPageContent;
