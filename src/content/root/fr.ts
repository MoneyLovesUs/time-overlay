import type { RootPageContent } from "@/content/root/types";

const frRootPageContent = {
  metadata: {
    title: "Timer overlay pour vidéos, streams et tutoriels",
    description:
      "Créez un timer overlay dans le navigateur pour vos vidéos, streams en direct et tutoriels, avec prévisualisation rapide et workflow clair pour créateurs.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Définissez la durée, prévisualisez l'image, puis exportez votre asset de timer.",
    intro:
      "Premier essai recommandé : `30s`, `PNG sequence`, `bottom-right`.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Des outils de timer overlay pour les créateurs qui ont besoin d'un compte à rebours lisible et propre en enregistrement et en live.",
    header: {
      shellLabel: "Shell public",
      toolLinkLabel: "Outil",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Rail système",
      publicStatusLabel: "Statut public",
      identityTitle: "Identité",
      jumpTitle: "Accès rapide",
      productTitle: "Produit",
      jumpLinks: [
        { anchorId: "tool", label: "Générateur" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Formats" },
      ],
      productDescription:
        "Une seule page d'outil local-first pour les overlays de compte à rebours, une FAQ compacte et un guide des formats d'export.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Préréglage de thème",
      description:
        "Choisissez un style de départ, puis ajustez les contrôles uniquement si nécessaire.",
      presetLabels: {
        "minimal-neon": "Néon minimal",
        "broadcast-alert": "Alerte broadcast",
        "calm-studio": "Studio calme",
      },
    },
    controlPanel: {
      title: "Contrôles",
      subtitle: "Pile d'entrée",
      timerSetupTitle: "Configuration du timer",
      durationLabel: "Durée (secondes)",
      displayFormatLabel: "Format d'affichage",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Préréglage de résolution",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Mode d'arrière-plan",
      styleTitle: "Style",
      fontFamilyLabel: "Famille de police",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Ancrage",
      anchorOptions: {
        "top-left": "Haut gauche",
        "top-center": "Haut centre",
        "top-right": "Haut droite",
        "center-left": "Centre gauche",
        center: "Centre",
        "center-right": "Centre droite",
        "bottom-left": "Bas gauche",
        "bottom-center": "Bas centre",
        "bottom-right": "Bas droite",
      },
      transparentOptionLabel: "Transparent",
      solidOptionLabel: "Uni",
    },
    previewPanel: {
      title: "Aperçu",
      subtitle: "Canvas en direct",
      playButton: "Lancer l'aperçu",
      pauseButton: "Pause",
      resetButton: "Réinitialiser",
      safeAreaOnButton: "Zone sûre activée",
      safeAreaOffButton: "Zone sûre désactivée",
      currentReadoutLabel: "Affichage actuel",
    },
    exportPanel: {
      title: "Export",
      subtitle: "Zone de livraison",
      outputFormatTitle: "Format de sortie",
      pngSequenceLabel: "Séquence PNG",
      pngSequenceDescription:
        "Le choix le plus fiable pour les éditeurs et les exports transparents.",
      webmLabel: "WebM",
      webmDescription:
        "Pratique pour un export vidéo local léger sur les navigateurs compatibles.",
      fpsLabel: "FPS",
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Qualité",
      launchNoteTitle: "Note de lancement",
      launchNoteFallback:
        "L'export reste local-first dans ce MVP. Si un format n'est pas pris en charge par le navigateur, l'interface orientera vers PNG Sequence.",
      exportButtonIdle: "Exporter l'asset",
      exportButtonBusy: "Export en cours...",
      exportStatusTitle: "État de l'export",
      exportStatusIdle:
        "Inactif. Choisissez un format puis lancez un export local.",
      qualityOptions: {
        standard: "Standard",
        high: "Élevée",
      },
      advisoryMessages: {
        workerSupportError:
          "Ce navigateur ne peut pas lancer un worker en arrière-plan, donc l'export vidéo local est désactivé. Utilisez PNG Sequence dans un navigateur de bureau moderne.",
        webmUnavailableError:
          "L'export WebM n'est pas disponible dans ce navigateur. PNG Sequence reste la solution de repli la plus sûre.",
        heavyExportWarning:
          "Cet export risque d'être lourd en mémoire et en CPU. Essayez 720p, 30 secondes ou PNG Sequence si votre navigateur commence à peiner.",
        pngSequenceInfo:
          "PNG Sequence reste le handoff local-first le plus fiable pour les monteurs, surtout quand la transparence compte.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export prêt : {fileName}",
        preparingWebm: "Préparation de l'export local WebM",
        preparingPngSequence: "Préparation de l'export local PNG Sequence",
        exportWorkerUnavailable:
          "Le worker d'export n'est pas disponible dans cette session du navigateur.",
        webmFailedUnexpectedly: "L'export WebM a échoué de façon inattendue.",
        pngSequenceFailedUnexpectedly:
          "L'export PNG Sequence a échoué de façon inattendue.",
      },
    },
  },
  seoSection: {
    notesEyebrow: "Notes outil",
    heading:
      "Une seule page outil, avec juste le contexte nécessaire pour bien l'utiliser.",
    description:
      "Time Overlay est conçu comme un générateur de timer overlay local-first. Utilisez les contrôles ci-dessus pour régler durée, style, position et format d'export, puis gardez cette section basse pour les quelques questions utiles au SEO et aux vrais choix de workflow.",
    exportFormatsTitle: "Formats d'export",
    exportFormatsPngText:
      "La séquence PNG est l'export local le plus fiable quand vous avez besoin d'overlays transparents ou d'assets adaptés au montage.",
    exportFormatsWebmText:
      "WebM est disponible comme option native navigateur lorsque l'environnement actuel le prend correctement en charge.",
    workflowEyebrow: "Fonctionnement",
    workflowHeading: "Comment fonctionne l'export d'un overlay timer",
    workflowSteps: [
      {
        title: "Définir la durée et la mise en page du compte à rebours",
        body:
          "Commencez dans le générateur ci-dessus. Choisissez la durée totale, un affichage d'horloge propre, puis placez l'overlay là où il restera lisible sur du gameplay, une démo produit ou une vidéo face caméra.",
      },
      {
        title: "Choisir un style de timer adapté à votre image",
        body:
          "Ajustez typographie, contraste, échelle et position pour que le compte à rebours semble vraiment intégré à l'image. Les meilleurs overlays utilisent en général des chiffres marqués, un espacement stable et assez de marge par rapport au bord du cadre.",
      },
      {
        title: "Exporter le format adapté à votre monteur",
        body:
          "Choisissez PNG Sequence lorsque vous avez besoin du flux le plus sûr pour des assets transparents, ou WebM lorsqu'un fichier vidéo local plus léger suffit pour votre montage.",
      },
    ],
    usageEyebrow: "Utilisation",
    usageHeading: "Comment utiliser Time Overlay",
    usageNotes: [
      "Ouvrez le générateur, réglez la durée du timer et vérifiez le compte à rebours avant tout export.",
      "Utilisez PNG Sequence pour des overlays transparents dans CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve ou tout flux qui préfère des assets image.",
      "Utilisez WebM lorsque vous voulez un export navigateur rapide pour des maquettes, des rough cuts ou des montages sociaux légers.",
      "Gardez le timer court, contrasté et à l'écart des sous-titres ou du cadrage du visage afin qu'il reste lisible sur mobile.",
    ],
    usageCta: {
      beforeFirstLink: "Commencez dans le ",
      firstLinkLabel: "générateur en direct",
      betweenLinks: "et utilisez le ",
      secondLinkLabel: "guide d'export",
      afterSecondLink:
        "ci-dessous lorsque vous hésitez entre des images transparentes et une sortie vidéo navigateur.",
    },
    aboutEyebrow: "À propos",
    aboutHeading: "À propos de Time Overlay",
    aboutPoints: [
      "Time Overlay est un générateur d'overlay timer local-first conçu pour les créateurs qui ont besoin de comptes à rebours graphiques sans envoyer leurs vidéos vers un service de rendu distant.",
      "La page reste volontairement compacte : une vraie surface d'outil, un bloc clair sur les formats d'export et une zone SEO qui répond aux questions de workflow que les gens cherchent avant de faire confiance à un outil de timer.",
      "La homepage sert ainsi à la fois d'utilitaire de production réel et de landing page indexable pour des requêtes comme overlay timer, countdown timer overlay, transparent countdown overlay ou timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "Si vous voulez d'abord traiter les objections pratiques, allez au ",
      linkLabel: "FAQ overlay timer",
      afterLink: ".",
    },
    faqTitle: "FAQ",
    faqSubtitle: "Essentiels du timer overlay",
    faqItems: [
      {
        question: "Puis-je exporter un timer overlay avec transparence ?",
        answer:
          "Oui. Le chemin local-first le plus sûr est la séquence PNG, car les éditeurs gèrent plus fiablement les assets transparents basés image que les workflows vidéo compressés. WebM est disponible si le navigateur le supporte, mais la séquence PNG reste la meilleure option quand la transparence est prioritaire.",
      },
      {
        question: "Quel format d'export choisir en premier ?",
        answer:
          "Commencez par la séquence PNG pour un transfert plus fiable vers les logiciels de montage, surtout pour le compositing sur de vraies images. Choisissez WebM si vous voulez un export vidéo local plus léger et que votre navigateur le supporte déjà correctement.",
      },
      {
        question: "Cet outil est-il rendu côté serveur ?",
        answer:
          "Non. L'expérience centrale est local-first. L'aperçu et l'export se font sur la machine de l'utilisateur, pour que la page agisse comme un vrai outil sans attendre une file de rendu distante.",
      },
      {
        question: "Quel style de timer est le plus lisible en vidéo ?",
        answer:
          "Des chiffres simples avec un contraste fort gagnent généralement. Des chiffres monospace, une lueur modérée et un placement soigné dans les coins restent plus lisibles sur des images chargées que des styles décoratifs.",
      },
      {
        question:
          "Puis-je l'utiliser pour TikTok, YouTube et des éditeurs comme CapCut ou Premiere ?",
        answer:
          "Oui, mais le flux de livraison varie. Les workflows short-form et montage profitent souvent d'exports transparents ou en séquence d'images, tandis qu'un export local WebM rapide convient quand un asset léger suffit.",
      },
    ],
  },
} satisfies RootPageContent;

export default frRootPageContent;
