export type RootFaqItem = {
  question: string;
  answer: string;
};

export type RootPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  generatorHero: {
    eyebrow: string;
    heading: string;
    intro: string;
  };
  siteChrome: {
    siteName: string;
    siteDescription: string;
    header: {
      shellLabel: string;
      toolLinkLabel: string;
      faqLinkLabel: string;
    };
    footer: {
      systemRailLabel: string;
      publicStatusLabel: string;
      identityTitle: string;
      jumpTitle: string;
      productTitle: string;
      jumpLinks: readonly {
        anchorId: string;
        label: string;
      }[];
      productDescription: string;
    };
  };
  generatorUi: {
    themePresetPicker: {
      title: string;
      description: string;
    };
    controlPanel: {
      title: string;
      subtitle: string;
      timerSetupTitle: string;
      durationLabel: string;
      displayFormatLabel: string;
      canvasTitle: string;
      resolutionPresetLabel: string;
      backgroundModeLabel: string;
      styleTitle: string;
      fontFamilyLabel: string;
      anchorLabel: string;
      transparentOptionLabel: string;
      solidOptionLabel: string;
    };
    previewPanel: {
      title: string;
      subtitle: string;
      playButton: string;
      pauseButton: string;
      resetButton: string;
      safeAreaOnButton: string;
      safeAreaOffButton: string;
      currentReadoutLabel: string;
    };
    exportPanel: {
      title: string;
      subtitle: string;
      outputFormatTitle: string;
      pngSequenceLabel: string;
      pngSequenceDescription: string;
      webmLabel: string;
      webmDescription: string;
      fpsLabel: string;
      qualityLabel: string;
      launchNoteTitle: string;
      launchNoteFallback: string;
      exportButtonIdle: string;
      exportButtonBusy: string;
      exportStatusTitle: string;
      exportStatusIdle: string;
      standardQualityLabel: string;
      highQualityLabel: string;
    };
  };
  seoSection: {
    notesEyebrow: string;
    heading: string;
    description: string;
    exportFormatsTitle: string;
    exportFormatsPngText: string;
    exportFormatsWebmText: string;
    faqTitle: string;
    faqSubtitle: string;
    faqItems: readonly RootFaqItem[];
  };
};
