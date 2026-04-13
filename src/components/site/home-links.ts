import { buildLocalizedPath, defaultLocale, type AppLocale } from "@/lib/i18n";

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

export function createHomeLinks(locale: AppLocale = defaultLocale) {
  return {
    howItWorksWorkflow: `${buildLocalizedPath("/how-it-works", locale)}#${howItWorksAnchors.workflow}`,
    qaExportQuestions: `${buildLocalizedPath("/qa", locale)}#${qaAnchors.questions.exportQuestions}`,
    qaTransparentExports: `${buildLocalizedPath("/qa", locale)}#${qaAnchors.questions.transparentExports}`,
    qaBestStyles: `${buildLocalizedPath("/qa", locale)}#${qaAnchors.questions.bestStyles}`,
    qaPlacementGuide: `${buildLocalizedPath("/qa", locale)}#${qaAnchors.questions.placementGuide}`,
    qaLiveToolStatus: `${buildLocalizedPath("/qa", locale)}#${qaAnchors.questions.liveToolStatus}`,
  } as const;
}

export const homeLinks = createHomeLinks();
