import type { RootPageContent } from "@/content/root/types";

const frRootPageContent = {
  metadata: {
    title: "Générateur de timer overlay avec export PNG Sequence et WebM",
    description:
      "Créez un timer overlay directement dans le navigateur, prévisualisez-le en direct et exportez en PNG Sequence ou WebM depuis une seule page local-first.",
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
    },
    controlPanel: {
      title: "Contrôles",
      subtitle: "Pile d'entrée",
      timerSetupTitle: "Configuration du timer",
      durationLabel: "Durée (secondes)",
      displayFormatLabel: "Format d'affichage",
      canvasTitle: "Canvas",
      resolutionPresetLabel: "Préréglage de résolution",
      backgroundModeLabel: "Mode d'arrière-plan",
      styleTitle: "Style",
      fontFamilyLabel: "Famille de police",
      anchorLabel: "Ancrage",
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
      qualityLabel: "Qualité",
      launchNoteTitle: "Note de lancement",
      launchNoteFallback:
        "L'export reste local-first dans ce MVP. Si un format n'est pas pris en charge par le navigateur, l'interface orientera vers PNG Sequence.",
      exportButtonIdle: "Exporter l'asset",
      exportButtonBusy: "Export en cours...",
      exportStatusTitle: "État de l'export",
      exportStatusIdle:
        "Inactif. Choisissez un format puis lancez un export local.",
      standardQualityLabel: "Standard",
      highQualityLabel: "Élevée",
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
