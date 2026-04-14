import type { RootPageContent } from "@/content/root/types";

const esRootPageContent = {
  metadata: {
    title: "Generador de temporizador overlay para exportar PNG Sequence y WebM",
    description:
      "Crea un temporizador overlay directamente en el navegador, previsualízalo en vivo y exporta recursos en PNG Sequence o WebM desde una sola página local-first.",
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
        { href: "/#tool", label: "Generador" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Formatos" },
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
    },
    controlPanel: {
      title: "Controles",
      subtitle: "Pila de entrada",
      timerSetupTitle: "Configuración del temporizador",
      durationLabel: "Duración (segundos)",
      displayFormatLabel: "Formato de visualización",
      canvasTitle: "Lienzo",
      resolutionPresetLabel: "Preajuste de resolución",
      backgroundModeLabel: "Modo de fondo",
      styleTitle: "Estilo",
      fontFamilyLabel: "Familia tipográfica",
      anchorLabel: "Anclaje",
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
      qualityLabel: "Calidad",
      launchNoteTitle: "Nota de lanzamiento",
      launchNoteFallback:
        "La exportación sigue siendo local-first en esta versión MVP. Si un formato no es compatible con el navegador, la interfaz guiará al usuario hacia PNG Sequence.",
      exportButtonIdle: "Exportar recurso",
      exportButtonBusy: "Exportando...",
      exportStatusTitle: "Estado de exportación",
      exportStatusIdle:
        "En espera. Elige un formato y comienza una exportación local.",
      standardQualityLabel: "Estándar",
      highQualityLabel: "Alta",
    },
    preview: {
      playButton: "Reproducir vista previa",
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
