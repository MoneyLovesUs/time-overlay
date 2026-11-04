import type { RootPageContent } from "@/content/root/types";

const esRootPageContent = {
  metadata: {
    title: "Generador de temporizador overlay con cuenta regresiva para videos y directos",
    description:
      "Crea temporizadores overlay limpios en tu navegador. Previsualiza al instante y exporta secuencias PNG transparentes o WebM para edición de video y directos.",
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
    templateGallery: {
      title: "Biblioteca de plantillas",
      description:
        "Empieza con un diseño probado. La duración y las opciones de exportación se conservan.",
      browseLabel: "Ver las 48",
      searchPlaceholder: "Buscar plantillas o casos de uso",
      categoryLabels: {
        all: "Todo",
        editing: "Edición",
        streaming: "Streaming",
        social: "Social",
        events: "Eventos",
        fitness: "Fitness",
        cinematic: "Cinemático",
        minimal: "Minimalista",
      },
      selectedLabel: "Seleccionada",
      editedLabel: "Editada",
      resultTemplate: "{count} plantillas",
      noResults: "Ninguna plantilla coincide con este filtro.",
      closeLabel: "Cerrar la biblioteca de plantillas",
    },
    themePresetPicker: {
      title: "Preajuste de tema",
      description:
        "Elige un aspecto inicial y luego ajusta los controles solo si hace falta.",
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
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Vídeo VP8 transparente para OBS y Streamlabs. Añádalo como fuente multimedia con el fondo ya eliminado.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Vídeo transparente más compacto para OBS y flujos compatibles con VP9 alpha; el soporte de importación varía según el editor.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
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
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Esta exportación probablemente exigirá bastante memoria y CPU. Considera 720p, 30 segundos o PNG Sequence si tu navegador empieza a resentirse.",
        pngSequenceInfo:
          "PNG Sequence es la entrega local-first más fiable para editores, especialmente cuando la transparencia importa.",
      vp9AlphaInfo:
        "WebM VP9 + alpha es un formato transparente compacto para OBS y flujos donde VP9 alpha ya se haya verificado.",
      hevcAlphaInfo:
        "MOV HEVC + alpha es la opción directa recomendada para Final Cut Pro en un Mac compatible.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Exportación lista: {fileName}",
        preparingWebm: "Preparando exportación local en WebM",
        preparingPngSequence: "Preparando exportación local en PNG Sequence",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "El worker de exportación no está disponible en esta sesión del navegador.",
        webmFailedUnexpectedly: "La exportación WebM falló de forma inesperada.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "La exportación de PNG Sequence falló de forma inesperada.",
      },
      png: {
        prepareTitle: "Preparar secuencia PNG",
        prepareIntro:
          "Vas a exportar una secuencia PNG con transparencia. Revisa el plan de abajo antes de elegir dónde se guardan los fotogramas.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} fotogramas · {width}×{height}",
        estimateTemplate:
          "Unos {size} en {parts} parte(s) ZIP, aproximadamente {time} para exportar.",
        estimateUnknown:
          "Las estimaciones de tamaño y tiempo aparecerán mientras se ejecuta la exportación.",
        sampleProgress:
          "Renderizando fotogramas de muestra para estimar tamaño y tiempo…",
        longJobTitle: "Esta exportación es larga",
        longJobBody:
          "Los fotogramas se escriben en disco parte a parte, así que la secuencia completa nunca se guarda en memoria. Hay que descomprimir y unir todas las partes ZIP antes de importar.",
        saveFolderButton: "Elegir carpeta y empezar",
        saveFolderHint:
          "El navegador pide permiso de escritura una sola vez. Dentro se crea una carpeta de tarea y las partes terminadas se quedan en disco.",
        opfsButton: "Generar en el navegador y descargar partes",
        opfsHint:
          "El navegador guarda archivos temporales hasta que los descargues y los limpies. Deja sitio para la copia temporal, tus descargas y los fotogramas descomprimidos.",
        continueButton: "Continuar en esta pestaña",
        cancelPrepButton: "Cancelar preparación",
        adviceDesktopSafari:
          "Safari no puede guardar una exportación tan grande: su almacenamiento integrado se llenará antes de que termine. Usa Chrome o Edge en tu ordenador para un temporizador tan largo.",
        adviceMobile:
          "Para un temporizador tan largo, usa un ordenador. Los teléfonos y las tabletas suelen quedarse sin almacenamiento antes de que termine la exportación.",
        capabilityMissing:
          "Este navegador no puede guardar archivos de exportación. Cierra las demás pestañas de esta página y reintenta, o usa Chrome en tu ordenador.",
        longStorageMissing:
          "Tu navegador no pudo crear un lugar donde guardar los fotogramas. Libera almacenamiento o usa Chrome en un ordenador e inténtalo de nuevo.",
        runTitle: "Exportación de secuencia PNG",
        modeDirectory: "Carpeta de guardado",
        modeBrowserStorage: "Guardado en el navegador",
        modeMemory: "Conservado en memoria",
        runFramesTemplate: "Fotogramas procesados",
        runCommittedTemplate: "Fotogramas guardados",
        runPartTemplate: "Parte actual · partes guardadas",
        runBytesTemplate: "Escrito",
        stoppingButton: "Deteniendo…",
        cancelButton: "Cancelar exportación",
        cancelledMessage:
          "Exportación detenida. Las partes ZIP terminadas se conservan; reanuda desde la última parte guardada.",
        resultTitle: "Exportación PNG completada",
        directorySavedTemplate:
          "Se guardaron {frames} fotogramas en {parts} parte(s) ZIP dentro de {folder} ({size}).",
        opfsPartsTitle:
          "{parts} parte(s) ZIP, {size}. Descarga cada parte mientras aparezca en esta lista.",
        partDownloadButton: "Descargar",
        partRangeTemplate: "fotogramas {first}–{last} · {size}",
        mergeInstructionsTitle: "Antes de importar",
        mergeInstructionsBody:
          "Descomprime todas las partes, mueve los archivos frame-*.png a una sola carpeta y luego importa esa carpeta como secuencia de imágenes a los fps elegidos. No importes cada parte como una cuenta atrás separada. El primer ZIP incluye scripts de conversión que detectan fotogramas faltantes.",
        autoDownloadNote:
          "La descarga del navegador ya empezó. Mantén esta pestaña abierta hasta que termine.",
        openFolderHint: "Abre la carpeta en tu gestor de archivos.",
        cleanupButton: "Eliminar archivos temporales",
        recoveryTitle: "Se encontró una exportación PNG sin terminar",
        recoveryBodyTemplate:
          "{frames} de {total} fotogramas están guardados en {parts} parte(s). La parte sin terminar se repetirá.",
        restoreButton: "Reanudar exportación",
        authorizeButton: "Autorizar y continuar",
        selectFolderButton: "Seleccionar carpeta de exportación",
        removeRecordButton: "Eliminar registro de recuperación",
        fontRequired:
          "Esta exportación usó una fuente personalizada. Indica el mismo archivo de fuente para reanudar.",
        fontButton: "Seleccionar archivo de fuente",
        downloadFailed:
          "No se pudo iniciar la descarga. Los archivos terminados siguen disponibles arriba; inténtalo de nuevo.",
        errorTitle: "Problema con la exportación PNG",
        errorMessages: {
          pngStorageUnavailable:
            "Este navegador bloqueó el almacenamiento local necesario para exportar PNG. Usa una ventana normal de Chrome en un ordenador.",
          pngDirectoryPermissionDenied:
            "No se concedió permiso de escritura en la carpeta elegida. Vuelve a elegirla y permite la escritura; no se inició ninguna exportación.",
          pngStorageFull:
            "No hay espacio libre suficiente para terminar esta parte PNG. Libera espacio y reanuda; las partes guardadas se conservan.",
          pngWriteFailed:
            "Falló el guardado de una parte PNG. Las partes guardadas se conservan; revisa la carpeta o el almacenamiento y reanuda.",
          pngZipValidationFailed:
            "Una parte ZIP guardada no pasó la validación. Se repetirá; las partes anteriores se conservan.",
          pngFrameTooLarge:
            "Un solo fotograma PNG es más grande que el límite por parte. Reduce la resolución o usa un estilo más simple.",
          pngMemoryLimitExceeded:
            "Esta exportación es demasiado grande para terminar en este navegador. Usa Chrome en tu ordenador y elige «Carpeta de guardado» para que los fotogramas se escriban directamente en el disco.",
          pngResumeVersionMismatch:
            "La exportación guardada se creó con otros ajustes o una versión anterior. No se puede continuar; inicia una exportación nueva y conserva las partes existentes.",
          pngResumeFileMissing:
            "Falta una parte ZIP guardada o ha cambiado. Esa parte se repetirá; vuelve a seleccionar la carpeta de tarea y reanuda.",
          pngLocked:
            "Esta exportación está abierta en otra pestaña. Cierra la otra pestaña y vuelve a intentarlo.",
          pngCheckpointFailed:
            "Este navegador no puede guardar el progreso para reanudar más tarde. Usa Chrome en tu ordenador o exporta un temporizador más corto.",
          pngFailedUnexpectedly:
            "La exportación PNG se detuvo de forma inesperada. Las partes guardadas, si las hay, se conservan; reanuda o inicia una exportación nueva.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Notas de la herramienta",
    heading:
      "Una sola página de herramienta, con el contexto mínimo para usarla bien.",
    description:
      "Time Overlay es un generador local-first. Configure arriba la duración, el estilo, la posición y el formato; consulte abajo cómo conservar la transparencia y qué debe probar antes de usar el archivo en producción.",
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
      "El generador reúne los controles, las recomendaciones de exportación y las notas de solución de problemas para que pueda crear el recurso y entender cómo llevarlo a otra aplicación.",
      "Las guías separan el soporte documentado de las recomendaciones prácticas, citan las fuentes consultadas y muestran la fecha de la última revisión para que la compatibilidad pueda volver a comprobarse.",
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
        question: "¿Cómo agrego un temporizador overlay a un video?",
        answer:
          "Configura la duración y el estilo en el generador de arriba y luego exporta. Elige PNG Sequence para el temporizador overlay transparente más fiable, o WebM para un único archivo de video transparente, y colócalo en una capa sobre tu metraje en CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve u OBS.",
      },
      {
        question:
          "¿Puedo crear un temporizador overlay transparente para OBS o Twitch?",
        answer:
          "Sí. Exporte WebM con transparencia y añádalo como fuente multimedia en OBS o Streamlabs. El fondo ya está eliminado, así que no necesita un paso adicional de chroma. Twitch dejó de admitir Twitch Studio después del 30 de mayo de 2024.",
      },
      {
        question:
          "¿Cuál es la diferencia entre un temporizador overlay y un overlay de cuenta regresiva?",
        answer:
          "Normalmente son lo mismo: un temporizador overlay que cuenta hacia atrás desde una duración fija hasta cero sobre tu video. Esta herramienta crea un temporizador overlay con cuenta regresiva, así que define el total de segundos, elige un formato como MM:SS y expórtalo para tu editor.",
      },
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
