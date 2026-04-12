import { qaAnchors } from "@/components/site/home-links";

export type QaQuestion = {
  question: string;
  answer: readonly string[];
  id?: string;
  kicker?: string;
};

export type QaGroup = {
  id: string;
  eyebrow: string;
  title: string;
  intro: string;
  questions: readonly QaQuestion[];
};

export const qaGroupLinks = [
  { id: qaAnchors.groups.basics, label: "Basics" },
  { id: qaAnchors.groups.customization, label: "Customization" },
  { id: qaAnchors.groups.exportAndEditing, label: "Export and editing" },
  {
    id: qaAnchors.groups.tiktokYouTube,
    label: "TikTok and YouTube use cases",
  },
] as const;

export const qaGroups: readonly QaGroup[] = [
  {
    id: qaAnchors.groups.basics,
    eyebrow: "Basics",
    title: "Start with the job the timer needs to do on screen.",
    intro:
      "Most creator mistakes happen before the export step. Decide whether the timer is there to pace the viewer, pace the host, or pace the editor, then make the visual choices around that job.",
    questions: [
      {
        question: "What is an overlay timer, really?",
        kicker: "Use it when time needs to be visible without becoming the whole scene.",
        answer: [
          "An overlay timer is a countdown or running clock designed to sit on top of footage, a live layout, or a screen recording. It gives the viewer a sense of pace without forcing a full-screen timer scene or a separate app window.",
          "Creators usually use one for webinar segments, workout intervals, study sessions, breaks, challenge videos, and tutorial chapters where timing matters. The best overlay timers stay readable in motion and do not fight the subject, subtitles, or the action in frame.",
        ],
      },
      {
        question: "Should I treat the timer as part of the final edit or as a removable layer?",
        kicker: "Choose this before you commit to styling or export settings.",
        answer: [
          "Use a removable layer when you want flexibility later. That is the safer path for templates, client edits, multi-language versions, and any workflow where the timer may move or disappear between cuts.",
          "Bake the timer into the final video only when you are certain it belongs in every exported version. That works well for simple social clips, fixed-format tutorials, or countdown moments that are supposed to feel locked into the scene.",
        ],
      },
      {
        id: qaAnchors.questions.liveToolStatus,
        question: "Is the overlay timer generator live right now?",
        kicker: "Answer the availability question before you plan your workflow around it.",
        answer: [
          "Not as a public live generator at the moment. If you need a timer asset today, plan the workflow around the output you need: a transparent overlay for later compositing or a baked-in timer for direct video export.",
          "The practical next step is to lock the timer style, placement, and export format first so you can build or source the asset in the editor you already use. That avoids choosing a timer look that only works in a mockup but not in the actual edit.",
        ],
      },
    ],
  },
  {
    id: qaAnchors.groups.customization,
    eyebrow: "Customization",
    title: "Style for readability first, then add personality.",
    intro:
      "A timer is only useful if the audience can read it at a glance. The strongest custom styles usually look restrained up close and even better once they are compressed, resized, or placed over moving footage.",
    questions: [
      {
        id: qaAnchors.questions.bestStyles,
        question: "What countdown style reads best on video?",
        kicker: "Simple numerals usually beat decorative timer skins.",
        answer: [
          "Monospaced or steady-width numerals, moderate weight, and strong contrast are the safest choices. They hold shape better during compression and keep the countdown from visually jittering when digits change.",
          "Small accents go further than large effects. A single brand color, a thin stroke, or a restrained glow can help the timer stand off the footage, but heavy bevels, oversized shadows, and novelty fonts often reduce legibility once the edit gets busy.",
        ],
      },
      {
        id: qaAnchors.questions.placementGuide,
        question: "Where should the timer sit in the frame?",
        kicker: "Placement depends on what already owns the viewer’s attention.",
        answer: [
          "Corners are usually safest because they preserve the subject and the center action. Top-right or bottom-right often work well when the presenter, captions, or product demo already occupy the left side, but there is no universal winner.",
          "Check three collisions before you lock placement: subtitles, face framing, and UI overlays from the platform itself. If any of those overlap, move the timer or shrink it before export rather than hoping the audience will ignore the clash.",
        ],
      },
      {
        question: "How much branding should I add to the timer?",
        kicker: "Brand cues should support recognition, not become the main event.",
        answer: [
          "A timer can carry brand color, a corner motif, or a subtle label without becoming a mini title card. The more often it appears in your content, the more valuable it is to keep the styling calm and repeatable.",
          "If the timer is present for long stretches, let the footage carry the emotion and let the timer behave like a reliable utility element. Save louder brand treatments for intros, chapter cards, and CTAs where attention is supposed to spike.",
        ],
      },
      {
        question: "Which duration and time format should I choose?",
        kicker: "Pick the format that matches the decision the viewer needs to make.",
        answer: [
          "Use `MM:SS` for most short-form and segment-based content because it is instantly recognizable and compact. Longer sessions usually benefit from `HH:MM:SS` only when the full duration matters to the viewer.",
          "If the timer is there to create urgency, larger numerals and fewer extra labels tend to work better. If it is there to provide structure during instruction, add just enough context so the audience knows whether they are seeing time remaining, elapsed time, or the next segment change.",
        ],
      },
    ],
  },
  {
    id: qaAnchors.groups.exportAndEditing,
    eyebrow: "Export and editing",
    title: "Choose the export path that matches the editor, not just the file menu.",
    intro:
      "Transparent overlays and baked-in timers solve different problems. The format should be chosen after you know which editor or platform has to accept the file cleanly.",
    questions: [
      {
        question: "Which file format should I export for a timer overlay?",
        kicker: "The right answer depends on whether you need alpha transparency.",
        answer: [
          "For a timer that is meant to stay fully editable, transparent formats are the priority. Alpha-capable exports such as certain MOV workflows, WebM alpha workflows, or image sequences keep the background removable so the timer can sit over footage later.",
          "For a timer that is already meant to be fused into the final picture, standard delivery video is simpler. MP4 is a practical choice when the timer belongs in the render and there is no need to separate it from the background after export.",
        ],
      },
      {
        id: qaAnchors.questions.transparentExports,
        question: "Can an overlay timer export with transparency?",
        kicker: "Yes, but only if the export format and the editing app both respect alpha.",
        answer: [
          "Transparency is not just an export checkbox. The timer asset needs an alpha-capable format, and the editor that receives it needs to interpret that alpha channel correctly. If either side fails, the timer arrives with a solid background or with unexpected edges.",
          "For creator workflows, the safest habit is to test a five-second sample before committing to a full render. If that sample imports cleanly on top of real footage, you can proceed with confidence. If not, switch formats early instead of rebuilding the timeline later.",
        ],
      },
      {
        question: "How should I use a timer overlay in CapCut?",
        kicker: "Keep the workflow simple and validate with a short import test.",
        answer: [
          "Bring the timer in as an overlay asset, place it above the footage, and confirm that the background behaves the way you expect before you style the rest of the sequence. CapCut workflows can differ by platform and version, so a quick import test is worth more than assumptions.",
          "If transparency is inconsistent in your setup, use a more universally accepted handoff such as an image sequence or a format you have already confirmed in that exact environment. The goal is to protect editing speed, not to force a specific codec when the app fights it.",
        ],
      },
      {
        question: "What changes when I move into Premiere Pro or Final Cut Pro?",
        kicker: "These workflows reward cleaner source assets and safer frame planning.",
        answer: [
          "Professional editors are better environments for fine positioning, compositing, and versioned exports, so it makes sense to hand them cleaner timer assets and keep the timer on its own track. That gives you room to reposition, trim, or disable it for alternate cuts without rebuilding the base edit.",
          "The practical rule is to keep naming, resolution, and duration explicit. A timer asset named for orientation and run length is easier to drop into a timeline than a generic export you need to inspect every time.",
        ],
      },
    ],
  },
  {
    id: qaAnchors.groups.tiktokYouTube,
    eyebrow: "TikTok and YouTube use cases",
    title: "Platform context changes how the timer should behave.",
    intro:
      "A timer for short-form vertical video is doing a different job than a timer in a long tutorial or a livestream. The closer the timer matches platform behavior, the less it feels like an interruption.",
    questions: [
      {
        question: "What works best for TikTok, Reels, and Shorts?",
        kicker: "Keep it bold, brief, and clear inside a crowded mobile frame.",
        answer: [
          "Vertical video has less safe space, more platform UI, and faster attention decay, so timers should stay compact and high contrast. Use them for challenge prompts, part transitions, recipe steps, timed hooks, and visible countdowns that push viewers toward the next beat.",
          "Avoid placing the timer where captions, engagement controls, or on-screen text already live. A smaller timer that survives the mobile interface is better than a dramatic one that competes with the whole point of the clip.",
        ],
      },
      {
        question: "What works best for YouTube tutorials, streams, and long-form videos?",
        kicker: "Long-form timers should support structure, not dominate the frame.",
        answer: [
          "For tutorials and presentations, viewers mainly need reassurance about pacing. A corner timer can help signal section length, practice windows, work sessions, or scheduled breaks without turning the video into a stopwatch.",
          "For livestreams, the timer should fit the broader scene design. If chat, alerts, lower thirds, and camera framing already occupy the edges, simplify the timer treatment and prioritize consistency over visual flair.",
        ],
      },
      {
        question: "Can I reuse one timer design across horizontal and vertical video?",
        kicker: "Reuse the visual language, not the exact placement preset.",
        answer: [
          "A strong timer system can absolutely travel across formats, but the safe-zone math changes. Keep the typography, color logic, and overall look consistent, then adjust placement and scale for each aspect ratio.",
          "The easiest way to stay efficient is to treat 16:9 and 9:16 as sibling layouts. That preserves brand recognition while avoiding the common mistake of pasting a landscape overlay into a vertical frame and hoping it still reads.",
        ],
      },
    ],
  },
] as const;
