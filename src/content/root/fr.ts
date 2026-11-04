import type { RootPageContent } from "@/content/root/types";

const frRootPageContent = {
  metadata: {
    title: "Générateur de compte à rebours en overlay pour vidéos et lives",
    description:
      "Créez des overlays de compte à rebours dans votre navigateur. Prévisualisez instantanément et exportez une séquence PNG transparente ou du WebM pour le montage.",
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
    templateGallery: {
      title: "Bibliothèque de modèles",
      description:
        "Partez d'une mise en page éprouvée. La durée et les choix d'export restent inchangés.",
      browseLabel: "Voir les 48 modèles",
      searchPlaceholder: "Rechercher un modèle ou un usage",
      categoryLabels: {
        all: "Tous",
        editing: "Montage",
        streaming: "Streaming",
        social: "Réseaux sociaux",
        events: "Événements",
        fitness: "Fitness",
        cinematic: "Cinéma",
        minimal: "Minimal",
      },
      selectedLabel: "Sélectionné",
      editedLabel: "Modifié",
      resultTemplate: "{count} modèles",
      noResults: "Aucun modèle ne correspond à ce filtre.",
      closeLabel: "Fermer la bibliothèque de modèles",
    },
    themePresetPicker: {
      title: "Préréglage de thème",
      description:
        "Choisissez un style de départ, puis ajustez les contrôles uniquement si nécessaire.",
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
        "landscape-2160": "3840x2160 / 16:9 (4K)",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "portrait-2160": "2160x3840 / 9:16 (4K)",
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
      webmLabel: "WebM (with alpha)",
      webmDescription:
        "Vidéo VP8 transparente pour OBS et Streamlabs. Ajoutez-la comme source média, sans arrière-plan à détourer.",
      vp9AlphaLabel: "WebM (VP9 + alpha)",
      vp9AlphaDescription:
        "Vidéo transparente plus compacte pour OBS et les flux VP9 alpha déjà vérifiés ; la prise en charge varie selon le logiciel de montage.",
      hevcAlphaLabel: "MOV (HEVC + alpha)",
      hevcAlphaDescription: "Apple-friendly transparent video. Best on Safari and macOS.",
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
          "WebM export is not available in this browser (Safari before 17 has limited support). PNG sequence is the recommended path here.",
        vp9AlphaUnavailableError: "WebM VP9 + alpha is not available in this browser. Try Chrome, Edge, or Firefox 130+ for transparent video export.",
        hevcAlphaUnavailableError: "MOV HEVC + alpha needs Safari 17.4+ on macOS. Use WebM VP9 + alpha on other platforms.",
        heavyExportWarning:
          "Cet export risque d'être lourd en mémoire et en CPU. Essayez 720p, 30 secondes ou PNG Sequence si votre navigateur commence à peiner.",
        pngSequenceInfo:
          "PNG Sequence reste le handoff local-first le plus fiable pour les monteurs, surtout quand la transparence compte.",
      vp9AlphaInfo:
        "WebM VP9 + alpha est un format transparent compact pour OBS et les flux VP9 alpha déjà vérifiés.",
      hevcAlphaInfo:
        "MOV HEVC + alpha est la sortie directe recommandée pour Final Cut Pro sur un Mac compatible.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Export prêt : {fileName}",
        preparingWebm: "Préparation de l'export local WebM",
        preparingPngSequence: "Préparation de l'export local PNG Sequence",
        preparingAlphaVideo: "Preparing transparent video export",
        exportWorkerUnavailable:
          "Le worker d'export n'est pas disponible dans cette session du navigateur.",
        webmFailedUnexpectedly: "L'export WebM a échoué de façon inattendue.",
        alphaVideoFailedUnexpectedly: "Transparent video export failed unexpectedly.",
        pngSequenceFailedUnexpectedly:
          "L'export PNG Sequence a échoué de façon inattendue.",
      },
      png: {
        prepareTitle: "Préparer la séquence PNG",
        prepareIntro:
          "Vous exportez une séquence PNG transparente. Vérifiez le plan ci-dessous avant de choisir où les images sont enregistrées.",
        prepareSummaryTemplate:
          "{duration} s · {fps} fps · {frames} images · {width}×{height}",
        estimateTemplate:
          "Environ {size} en {parts} partie(s) ZIP, et environ {time} pour l'export.",
        estimateUnknown:
          "Les estimations de taille et de durée s'afficheront pendant l'export.",
        sampleProgress:
          "Rendu d'images d'exemple pour estimer la taille et la durée…",
        longJobTitle: "Cet export est long",
        longJobBody:
          "Les images sont écrites sur le disque partie par partie : la séquence complète ne reste jamais en mémoire. Chaque partie ZIP doit être décompressée et fusionnée avant l'import.",
        saveFolderButton: "Choisir le dossier et démarrer",
        saveFolderHint:
          "Le navigateur demande l'accès en écriture une seule fois. Un dossier de tâche y est créé et les parties terminées restent sur le disque.",
        opfsButton: "Générer dans le navigateur, télécharger les parties",
        opfsHint:
          "Le navigateur conserve des fichiers temporaires jusqu'à leur téléchargement et leur nettoyage. Prévoyez de la place pour la copie temporaire, vos téléchargements et les images décompressées.",
        continueButton: "Continuer dans cet onglet",
        cancelPrepButton: "Annuler la préparation",
        adviceDesktopSafari:
          "Safari ne peut pas enregistrer un export de cette taille : son stockage intégré sera plein avant la fin. Pour un compte à rebours aussi long, utilisez Chrome ou Edge sur votre ordinateur.",
        adviceMobile:
          "Pour un compte à rebours aussi long, utilisez un ordinateur. Les téléphones et tablettes manquent souvent de stockage avant la fin de l'export.",
        capabilityMissing:
          "Ce navigateur ne peut pas enregistrer les fichiers d'export. Fermez les autres onglets de cette page et réessayez, ou utilisez Chrome sur votre ordinateur.",
        longStorageMissing:
          "Votre navigateur n'a pas pu créer d'espace pour enregistrer les images. Libérez du stockage ou utilisez Chrome sur un ordinateur, puis réessayez.",
        runTitle: "Export de séquence PNG",
        modeDirectory: "Dossier de sauvegarde",
        modeBrowserStorage: "Enregistré dans le navigateur",
        modeMemory: "Conservé en mémoire",
        runFramesTemplate: "Images traitées",
        runCommittedTemplate: "Images enregistrées",
        runPartTemplate: "Partie en cours · parties enregistrées",
        runBytesTemplate: "Écrit",
        stoppingButton: "Arrêt…",
        cancelButton: "Annuler l'export",
        cancelledMessage:
          "Export arrêté. Les parties ZIP terminées sont conservées ; reprenez à partir de la dernière partie enregistrée.",
        resultTitle: "Export PNG terminé",
        directorySavedTemplate:
          "{frames} images enregistrées en {parts} partie(s) ZIP dans {folder} ({size}).",
        opfsPartsTitle:
          "{parts} partie(s) ZIP, {size}. Téléchargez chaque partie tant qu'elle apparaît ici.",
        partDownloadButton: "Télécharger",
        partRangeTemplate: "images {first}–{last} · {size}",
        mergeInstructionsTitle: "Avant l'import",
        mergeInstructionsBody:
          "Décompressez toutes les parties, regroupez les fichiers frame-*.png dans un seul dossier, puis importez ce dossier comme séquence d'images à la cadence choisie. N'importez pas chaque partie comme un compte à rebours séparé. Le premier ZIP contient des scripts de conversion qui détectent les images manquantes.",
        autoDownloadNote:
          "Le téléchargement du navigateur a démarré. Gardez cet onglet ouvert jusqu'à la fin.",
        openFolderHint: "Ouvrez le dossier dans votre gestionnaire de fichiers.",
        cleanupButton: "Supprimer les fichiers temporaires",
        recoveryTitle: "Export PNG inachevé détecté",
        recoveryBodyTemplate:
          "{frames} images sur {total} sont bien enregistrées dans {parts} partie(s). La partie inachevée sera reprise.",
        restoreButton: "Reprendre l'export",
        authorizeButton: "Autoriser et continuer",
        selectFolderButton: "Sélectionner le dossier d'export",
        removeRecordButton: "Supprimer l'enregistrement de reprise",
        fontRequired:
          "Cet export a utilisé une police personnalisée. Fournissez le même fichier de police pour reprendre.",
        fontButton: "Sélectionner le fichier de police",
        downloadFailed:
          "Le téléchargement n'a pas pu démarrer. Les fichiers terminés restent disponibles ci-dessus ; réessayez.",
        errorTitle: "Problème d'export PNG",
        errorMessages: {
          pngStorageUnavailable:
            "Ce navigateur a bloqué le stockage local nécessaire aux exports PNG. Utilisez une fenêtre normale de Chrome sur ordinateur.",
          pngDirectoryPermissionDenied:
            "L'accès en écriture au dossier choisi n'a pas été accordé. Choisissez à nouveau le dossier et autorisez l'écriture ; aucun export n'a démarré.",
          pngStorageFull:
            "L'espace libre ne suffit pas pour terminer cette partie PNG. Libérez de la place, puis reprenez ; les parties enregistrées sont conservées.",
          pngWriteFailed:
            "L'enregistrement d'une partie PNG a échoué. Les parties enregistrées sont conservées ; vérifiez le dossier ou le stockage et reprenez.",
          pngZipValidationFailed:
            "Une partie ZIP enregistrée n'a pas passé la validation. Elle sera refaite ; les parties précédentes sont conservées.",
          pngFrameTooLarge:
            "Une seule image PNG dépasse la limite par partie. Réduisez la résolution ou utilisez un style plus simple.",
          pngMemoryLimitExceeded:
            "Cet export est trop volumineux pour se terminer dans ce navigateur. Utilisez Chrome sur votre ordinateur et choisissez « Dossier de sauvegarde » pour que les images s'écrivent directement sur le disque.",
          pngResumeVersionMismatch:
            "L'export enregistré a été créé avec d'autres réglages ou une version plus ancienne. Il ne peut pas être repris ; lancez un nouvel export et gardez les parties existantes.",
          pngResumeFileMissing:
            "Une partie ZIP enregistrée manque ou a changé. Cette partie sera refaite ; resélectionnez le dossier de tâche et reprenez.",
          pngLocked:
            "Cet export est ouvert dans un autre onglet. Fermez l'autre onglet et réessayez.",
          pngCheckpointFailed:
            "Ce navigateur ne peut pas enregistrer la progression pour reprendre plus tard. Utilisez Chrome sur votre ordinateur, ou exportez un compte à rebours plus court.",
          pngFailedUnexpectedly:
            "L'export PNG s'est arrêté de façon inattendue. Les parties enregistrées, s'il y en a, sont conservées ; reprenez ou lancez un nouvel export.",
        },
      },
    },
  },
  seoSection: {
    notesEyebrow: "Notes outil",
    heading:
      "Une seule page outil, avec juste le contexte nécessaire pour bien l'utiliser.",
    description:
      "Time Overlay est un générateur local-first. Réglez ci-dessus la durée, le style, la position et le format, puis consultez les explications sur la transparence et les vérifications à effectuer avant la production.",
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
      "Le générateur rassemble les réglages, les conseils d'export et les pistes de dépannage afin que vous puissiez créer l'élément puis le transférer correctement vers une autre application.",
      "Les guides distinguent la prise en charge documentée des recommandations pratiques, citent les sources consultées et affichent leur date de révision pour permettre une nouvelle vérification de la compatibilité.",
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
