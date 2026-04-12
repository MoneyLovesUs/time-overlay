import { howItWorksAnchors } from "@/components/site/home-links";

export const howItWorksProcessSteps = [
  {
    title: "Enter duration",
    summary:
      "Enter the duration that matches the actual segment, intro, break, or timed prompt.",
    detail:
      "Start with the real countdown length for the scene, segment, or stream break. A workshop opener, ad break, lesson checkpoint, and challenge timer all need different pacing.",
    notes: [
      "Use the actual start time you want on screen, not a placeholder.",
      "Match the timer length to the cut, cue, or talking point it supports.",
    ],
  },
  {
    title: "Choose style and format",
    summary:
      "Choose a style and output format that stays readable over footage and fits the edit.",
    detail:
      "Set the visual tone and output type together. Font weight, contrast, placement, aspect ratio, and whether the timer needs transparency all affect how cleanly it sits on footage.",
    notes: [
      "Pick a readable style that does not compete with subtitles or lower thirds.",
      "Choose the export format that fits the job: transparent overlay when you need compositing, standard video when the timer should be baked in.",
    ],
  },
  {
    title: "Download and import into your editor",
    summary:
      "Download the file and place it in your editor before you move into rendering or publishing.",
    detail:
      "Bring the finished file into the editing timeline, place it above the footage if it is an overlay, and make any timing or placement adjustments before the final export. Publishing to TikTok or YouTube happens after the edit is ready.",
    notes: [
      "Keep the overlay on its own track so it is easy to trim, duplicate, or swap.",
      "Check mobile-safe framing before final export for short-form layouts.",
    ],
  },
] as const;

export const editingWorkflows = [
  {
    id: howItWorksAnchors.apps.capcut,
    title: "CapCut",
    detail:
      "Import the overlay as its own asset, place it above the base footage, and trim it to the exact segment that needs the countdown. This is the fast path for short-form edits and repurposed clips.",
  },
  {
    id: howItWorksAnchors.apps.premierePro,
    title: "Premiere Pro",
    detail:
      "Drop the timer onto a higher video track, align the first frame with the spoken or visual cue, and keep it separate from captions and motion graphics so swaps stay easy later.",
  },
  {
    id: howItWorksAnchors.apps.finalCutPro,
    title: "Final Cut Pro",
    detail:
      "Treat the timer like a composited element. Keep it connected above the primary storyline, confirm safe-zone placement, and duplicate the setup when you need repeated countdown segments.",
  },
  {
    id: howItWorksAnchors.apps.tiktok,
    title: "TikTok",
    detail:
      "After the edit is finished, prioritize vertical framing, avoid subtitle collisions near the bottom third, and preview the countdown on a phone-sized frame before publishing. A clean 9:16 layout matters more than decorative styling.",
  },
  {
    id: howItWorksAnchors.apps.youtube,
    title: "YouTube",
    detail:
      "Once the timeline is locked, use the overlay for intros, breaks, tutorials, or live-event holding scenes. Check readability at desktop and mobile sizes before you export and publish the final video.",
  },
] as const;
