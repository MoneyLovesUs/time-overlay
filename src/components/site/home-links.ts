export const qaAnchors = {
  groups: {
    basics: "overlay-timer-basics",
    customization: "overlay-timer-customization",
    exportAndEditing: "overlay-timer-export-questions",
    tiktokYouTube: "overlay-timer-tiktok-youtube",
  },
  questions: {
    exportQuestions: "overlay-timer-export-questions",
    transparentExports: "transparent-overlay-timer-exports",
    bestStyles: "best-overlay-timer-styles-for-video",
    placementGuide: "overlay-timer-placement-guide",
    liveToolStatus: "is-the-overlay-timer-generator-live",
  },
} as const;

export const howItWorksAnchors = {
  workflow: "overlay-timer-generator-workflow",
  editingWorkflows: "editing-overlay-in-video-apps",
  apps: {
    capcut: "capcut-overlay-timer-workflow",
    premierePro: "premiere-pro-overlay-timer-workflow",
    finalCutPro: "final-cut-pro-overlay-timer-workflow",
    tiktok: "tiktok-overlay-timer-publishing-workflow",
    youtube: "youtube-overlay-timer-publishing-workflow",
  },
} as const;

export const homeLinks = {
  howItWorksWorkflow: `/how-it-works#${howItWorksAnchors.workflow}`,
  qaExportQuestions: `/qa#${qaAnchors.questions.exportQuestions}`,
  qaTransparentExports: `/qa#${qaAnchors.questions.transparentExports}`,
  qaBestStyles: `/qa#${qaAnchors.questions.bestStyles}`,
  qaPlacementGuide: `/qa#${qaAnchors.questions.placementGuide}`,
  qaLiveToolStatus: `/qa#${qaAnchors.questions.liveToolStatus}`,
} as const;
