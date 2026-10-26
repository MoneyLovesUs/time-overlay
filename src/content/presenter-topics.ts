import { PRESENTER_TIMER_PATH } from "@/content/presenter-timer";
import {
  PRESENTER_TOPIC_SLUGS,
  PRESENTER_TOPICS_REVIEWED_AT,
  type PresenterTopicSlug,
} from "@/lib/presenter-topic-slugs";
import type { WaitlistUseCase } from "@/lib/waitlist";

export { PRESENTER_TOPIC_SLUGS, type PresenterTopicSlug } from "@/lib/presenter-topic-slugs";

/**
 * Search-intent pages under /presenter-timer/<slug>. Each one answers a single
 * question honestly ("can the built-in timer be private?") before pitching the
 * desktop waitlist. Platform claims are checked against the official help pages
 * listed in `sources`; re-check them on every `reviewedAt` bump.
 */
export type PresenterTopic = {
  slug: PresenterTopicSlug;
  metadata: { title: string; description: string };
  breadcrumbLabel: string;
  heading: string;
  lead: string;
  diagramSlideTitle: string;
  answer: { heading: string; body: string };
  native: {
    heading: string;
    intro: string;
    rows: readonly { option: string; visibility: string; limit: string }[];
  };
  workarounds: { heading: string; items: readonly { title: string; body: string }[] };
  desktop: { heading: string; paragraphs: readonly string[] };
  faqTitle: string;
  faqItems: readonly { question: string; answer: string }[];
  sources: readonly { label: string; publisher: string; href: string }[];
  relatedSlugs: readonly PresenterTopicSlug[];
  defaultUseCase: WaitlistUseCase;
  reviewedAt: string;
};

const REVIEWED_AT = PRESENTER_TOPICS_REVIEWED_AT;

const sharedSources = {
  teamsTimer: {
    label: "Add a timer to Teams meetings",
    publisher: "Microsoft Support",
    href: "https://support.microsoft.com/en-us/topic/add-a-timer-to-teams-meetings-9fa0f500-25be-4b08-9eb9-625846e916d2",
  },
  teamsQa: {
    label: "Presenters timer on Teams (Q&A, Dec 2024)",
    publisher: "Microsoft Q&A",
    href: "https://learn.microsoft.com/en-us/answers/questions/4428861/presenters-timer-on-teams",
  },
  zoomTimers: {
    label: "Using meeting timers",
    publisher: "Zoom Support",
    href: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0064952",
  },
  zoomTimerApp: {
    label: "Using the Timer app",
    publisher: "Zoom Support",
    href: "https://support.zoom.com/hc/en/article?id=zm_kb&sysparm_article=KB0068677",
  },
  meetTimer: {
    label: "Set a timer in Google Meet",
    publisher: "Google Meet Help",
    href: "https://support.google.com/meet/answer/16380429",
  },
  pptPresenterView: {
    label: "Start the presentation and see your notes in Presenter view",
    publisher: "Microsoft Support",
    href: "https://support.microsoft.com/en-us/office/start-the-presentation-and-see-your-notes-in-presenter-view-4de90e28-487e-435c-9401-eb49a3801257",
  },
  keynoteWindow: {
    label: "Present on your Mac",
    publisher: "Keynote User Guide",
    href: "https://support.apple.com/guide/keynote/present-on-your-mac-tan72233051/mac",
  },
  slidesPresent: {
    label: "Present slides",
    publisher: "Google Docs Editors Help",
    href: "https://support.google.com/docs/answer/1696787",
  },
  windowsAffinity: {
    label: "SetWindowDisplayAffinity function",
    publisher: "Microsoft Learn",
    href: "https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-setwindowdisplayaffinity",
  },
} as const;

const desktopParagraphs = [
  "Time Overlay Desktop is a small floating countdown we are building for Windows and Mac. It is designed to stay on top of your slideshow on your own display and to ask the operating system to leave its window out of screen capture, so the people on the call should see your slides and not the clock.",
  "Capture exclusion is an operating-system feature, not a guarantee. Microsoft says this about the Windows API it relies on, and results vary by meeting app and capture mode. The beta includes a share-preview check, and we will publish what we find in each meeting app before launch.",
] as const;

const topics: Record<PresenterTopicSlug, PresenterTopic> = {
  "microsoft-teams": {
    slug: "microsoft-teams",
    metadata: {
      title: "Teams Presenter Timer Only You Can See",
      description:
        "Teams has a built-in meeting timer, but every presenter can see it and it does not work in webinars or town halls. Here are your options for a private one.",
    },
    breadcrumbLabel: "Microsoft Teams",
    heading: "A presenter timer in Microsoft Teams that only you can see",
    lead:
      "Teams added a meeting timer, but it is shared with everyone who has presenter rights. If you want a countdown that is yours alone while you share your screen, Teams does not do that on its own.",
    diagramSlideTitle: "Quarterly review",
    answer: {
      heading: "Short answer",
      body:
        "No. The Teams meeting timer is visible to all meeting participants with presenter capabilities, not just to you, and Microsoft says it isn't supported for Teams calls, webinars or town halls. For a timer only you see, use PowerPoint Presenter view while sharing just the slideshow window, or a desktop timer that is hidden from screen capture.",
    },
    native: {
      heading: "What Teams gives you",
      intro: "Checked against Microsoft's support pages on the review date below.",
      rows: [
        {
          option: "Teams meeting timer (More > Timer)",
          visibility: "Every participant with presenter capabilities",
          limit: "Up to 100 minutes. Not supported in Teams calls, webinars or town halls.",
        },
        {
          option: "PowerPoint Presenter view",
          visibility: "Only you, if you share the slideshow window instead of your whole screen",
          limit: "Its timer counts up, not down. Sharing your entire screen exposes the notes.",
        },
      ],
    },
    workarounds: {
      heading: "Workarounds people use today",
      items: [
        {
          title: "Share one window, keep Presenter view to yourself",
          body:
            "In Teams, share the PowerPoint slideshow window rather than your screen. Presenter view, with its elapsed-time clock, stays on your side. This breaks as soon as you need to switch to a demo or another app.",
        },
        {
          title: "Start the Teams timer and accept that co-presenters see it",
          body:
            "Fine for internal meetings where everyone presenting should keep time. Not useful in webinars or town halls, where it is not supported.",
        },
        {
          title: "A phone or kitchen timer",
          body:
            "Works anywhere, but it pulls your eyes off the camera and away from your slides.",
        },
      ],
    },
    desktop: {
      heading: "A private countdown for Teams",
      paragraphs: desktopParagraphs,
    },
    faqTitle: "Teams timer questions",
    faqItems: [
      {
        question: "Can attendees see the Teams meeting timer?",
        answer:
          "Microsoft's support page says the timer is visible to all meeting participants with presenter capabilities. It is not a private, presenter-only timer.",
      },
      {
        question: "Does the Teams timer work in webinars and town halls?",
        answer:
          "No. Microsoft says the timer isn't supported for Teams calls, webinars or town halls.",
      },
      {
        question: "How do I see my notes and time without attendees seeing them?",
        answer:
          "Share only the PowerPoint slideshow window in Teams and keep Presenter view on your own screen. Its clock counts elapsed time. For a countdown that floats over anything you share, a capture-excluded desktop timer is the other option.",
      },
      {
        question: "Will Time Overlay Desktop work with Teams?",
        answer:
          "Teams is one of the apps we are testing. Because screen-capture behaviour varies by app version and capture mode, the beta includes a share-preview check and we will publish our results.",
      },
    ],
    sources: [
      sharedSources.teamsTimer,
      sharedSources.teamsQa,
      sharedSources.pptPresenterView,
      sharedSources.windowsAffinity,
    ],
    relatedSlugs: ["presenter-view-screen-share", "zoom"],
    defaultUseCase: "single-screen-slides",
    reviewedAt: REVIEWED_AT,
  },
  zoom: {
    slug: "zoom",
    metadata: {
      title: "Zoom Timer Only You Can See: Built-in Options",
      description:
        "Zoom's meeting timer and Timer app can both be private. Here is what each one counts, where it shows while you share, and when you need something else.",
    },
    breadcrumbLabel: "Zoom",
    heading: "A Zoom timer only you can see",
    lead:
      "Good news first: Zoom already has private timers. This page explains what they count, where they show while you share your screen, and the cases they don't cover.",
    diagramSlideTitle: "Webinar: product update",
    answer: {
      heading: "Short answer",
      body:
        "Yes. Zoom's meeting timers are only visible to you, and the Zoom Timer app can run a countdown for just you or for everyone. The built-in Time Remaining timer counts down to the meeting's scheduled end, not to the end of your own slot, and it needs a scheduled meeting.",
    },
    native: {
      heading: "What Zoom gives you",
      intro: "Checked against Zoom's support pages on the review date below.",
      rows: [
        {
          option: "Meeting Duration timer",
          visibility: "Only you",
          limit: "Shows time elapsed since you joined. Turn on Show meeting timer in settings.",
        },
        {
          option: "Time Remaining timer",
          visibility: "Only you",
          limit:
            "Counts down to the scheduled end of the whole meeting. Not available for instant meetings or your Personal Meeting Room.",
        },
        {
          option: "Zoom Timer app",
          visibility: "Just you, or everyone with Show timer to all",
          limit: "A custom countdown in the corner of your video tile. Runs only inside Zoom.",
        },
      ],
    },
    workarounds: {
      heading: "When the built-in timers are enough",
      items: [
        {
          title: "You only present in Zoom",
          body:
            "Install the Timer app and keep Show timer to all switched off. Zoom says the meeting timers also appear below the screen share controls while you share.",
        },
        {
          title: "You need your own slot, not the meeting's end",
          body:
            "If you speak for 10 minutes inside a 60-minute webinar, Time Remaining won't help. Use the Timer app or a separate countdown.",
        },
        {
          title: "You present in more than one app",
          body:
            "Zoom's options stop at Zoom. If the same talk runs in Teams or Google Meet next week, you will be setting up a different timer each time.",
        },
      ],
    },
    desktop: {
      heading: "One countdown for Zoom, Teams and Meet (in testing)",
      paragraphs: desktopParagraphs,
    },
    faqTitle: "Zoom timer questions",
    faqItems: [
      {
        question: "Can other participants see my Zoom meeting timer?",
        answer: "No. Zoom's support page says the meeting timers are only visible to you.",
      },
      {
        question: "Why doesn't Zoom show Time Remaining in my meeting?",
        answer:
          "Time Remaining is based on the meeting's scheduled duration, so it is not available in instant meetings or your Personal Meeting Room.",
      },
      {
        question: "Where does the Zoom timer appear while I share my screen?",
        answer:
          "Zoom says the timers appear below the screen share controls once you start sharing. They show elapsed time or the meeting's remaining time, not a countdown for your own segment.",
      },
      {
        question: "Do I need Time Overlay Desktop if I only use Zoom?",
        answer:
          "Probably not. Zoom's Timer app with Show timer to all switched off covers most private-countdown needs. A desktop timer helps if you also present in other apps or want a larger timer above full-screen slides.",
      },
    ],
    sources: [sharedSources.zoomTimers, sharedSources.zoomTimerApp, sharedSources.windowsAffinity],
    relatedSlugs: ["microsoft-teams", "google-meet"],
    defaultUseCase: "webinar-speaker",
    reviewedAt: REVIEWED_AT,
  },
  "google-meet": {
    slug: "google-meet",
    metadata: {
      title: "Google Meet Timer Only You Can See: Your Options",
      description:
        "Google Meet's built-in timer shows to every participant. If you want a countdown only you can see while you present, here are the options.",
    },
    breadcrumbLabel: "Google Meet",
    heading: "A Google Meet timer only you can see",
    lead:
      "Google Meet now has a built-in timer, but it is built for the whole room. There is no private mode for the person presenting.",
    diagramSlideTitle: "Lesson 4: review",
    answer: {
      heading: "Short answer",
      body:
        "No. Google says the Meet timer is visible to everyone, and once it starts, all participants on any device can see it. Only hosts and co-hosts can start it, on the web. For a private countdown you need something outside Meet.",
    },
    native: {
      heading: "What Google Meet gives you",
      intro: "Checked against Google's Meet Help Center on the review date below.",
      rows: [
        {
          option: "Meet timer (Meeting tools > Timer)",
          visibility: "Everyone in the meeting",
          limit: "Hosts and co-hosts start and control it, on the web only.",
        },
        {
          option: "Google Slides Presenter view",
          visibility: "Only you, if you share the slides tab or window",
          limit: "Google says you can't use Presenter view and Full screen at the same time with one monitor.",
        },
      ],
    },
    workarounds: {
      heading: "Workarounds people use today",
      items: [
        {
          title: "Use the Meet timer anyway",
          body:
            "Good for classes and workshops where everyone should see the time. Not good if you don't want the audience watching the clock.",
        },
        {
          title: "Present a tab, keep a timer in another window",
          body:
            "Share only the Slides tab and put a timer elsewhere on your screen. It breaks when you need to share your whole screen for a demo.",
        },
        {
          title: "A phone timer",
          body: "Works, but your eyes leave the camera every time you check it.",
        },
      ],
    },
    desktop: {
      heading: "A private countdown for Google Meet",
      paragraphs: desktopParagraphs,
    },
    faqTitle: "Google Meet timer questions",
    faqItems: [
      {
        question: "Can participants see the Google Meet timer?",
        answer:
          "Yes. Google says the timer is visible to everyone and that all participants on any device can find it once it's started.",
      },
      {
        question: "Who can start a timer in Google Meet?",
        answer: "Hosts and co-hosts, and only from Meet on the web.",
      },
      {
        question: "Can I use Google Slides Presenter view on one screen?",
        answer:
          "Google says you can't use Presenter view and Full screen at the same time with one monitor. Many presenters share only the slides tab and keep Presenter view in a separate window.",
      },
    ],
    sources: [sharedSources.meetTimer, sharedSources.slidesPresent, sharedSources.windowsAffinity],
    relatedSlugs: ["presenter-view-screen-share", "zoom"],
    defaultUseCase: "teaching",
    reviewedAt: REVIEWED_AT,
  },
  "presenter-view-screen-share": {
    slug: "presenter-view-screen-share",
    metadata: {
      title: "Presenter View While Screen Sharing on One Screen",
      description:
        "How to keep your notes and timer to yourself while you share slides in Zoom, Teams or Meet on a single laptop, and where each method breaks.",
    },
    breadcrumbLabel: "Presenter view",
    heading: "Use Presenter view while screen sharing on one screen",
    lead:
      "Presenter view was made for a laptop plus a projector. On a video call with one screen, the trick is to share the slideshow window, not your whole screen. Here is how that works in each app, and where it stops working.",
    diagramSlideTitle: "Launch plan",
    answer: {
      heading: "Short answer",
      body:
        "Share the slideshow window instead of your entire screen. PowerPoint can open Presenter view on a single monitor, and Keynote's Play > In Window puts the slideshow and presenter display in separate windows. Google Slides can't use Presenter view and Full screen together on one monitor. None of them gives you a countdown that survives sharing your whole screen.",
    },
    native: {
      heading: "What each slide app gives you",
      intro: "Checked against Microsoft, Apple and Google help pages on the review date below.",
      rows: [
        {
          option: "PowerPoint Presenter view",
          visibility: "Only you, when you share the slideshow window",
          limit: "Works on one monitor from Slide Show view. Its timer counts elapsed time.",
        },
        {
          option: "Keynote Play > In Window",
          visibility: "Only you, unless you enable Show presenter display in other applications",
          limit: "Mac only. Share the slideshow window in the call.",
        },
        {
          option: "Google Slides Presenter view",
          visibility: "Only you, when you share just the slides tab",
          limit: "Can't be combined with Full screen on one monitor.",
        },
      ],
    },
    workarounds: {
      heading: "Where window sharing breaks",
      items: [
        {
          title: "Switching to a live demo",
          body:
            "The moment you need to show another app, you either re-share or share your whole screen, and then your notes and clock are on camera.",
        },
        {
          title: "Time is counted up, not down",
          body:
            "Slide-app timers show how long you have been talking. Doing the subtraction mid-sentence is how talks run long.",
        },
        {
          title: "Different setup in every app",
          body:
            "Zoom, Teams and Meet each name window sharing differently, and Google Slides behaves differently again.",
        },
      ],
    },
    desktop: {
      heading: "Built to stay private when you share your whole screen",
      paragraphs: desktopParagraphs,
    },
    faqTitle: "Presenter view questions",
    faqItems: [
      {
        question: "Can people see my PowerPoint Presenter view when I share my screen?",
        answer:
          "If you share your entire screen and Presenter view is on it, yes. Share only the slideshow window to keep Presenter view to yourself.",
      },
      {
        question: "Can I use PowerPoint Presenter view with one monitor?",
        answer:
          "Yes. Microsoft says you can open it on a single monitor from Slide Show view with the Show Presenter View option on the control bar.",
      },
      {
        question: "How do I see Keynote presenter notes during a video call?",
        answer:
          "Choose Play > In Window. Apple says this shows the slideshow and the presenter display in separate windows. Share only the slideshow window in your call.",
      },
      {
        question: "Why can't I use Google Slides Presenter view in full screen?",
        answer:
          "Google says you can't use Presenter view and Full screen at the same time with one monitor.",
      },
    ],
    sources: [
      sharedSources.pptPresenterView,
      sharedSources.keynoteWindow,
      sharedSources.slidesPresent,
      sharedSources.windowsAffinity,
    ],
    relatedSlugs: ["microsoft-teams", "google-meet"],
    defaultUseCase: "single-screen-slides",
    reviewedAt: REVIEWED_AT,
  },
};

export function isPresenterTopicSlug(value: string): value is PresenterTopicSlug {
  return (PRESENTER_TOPIC_SLUGS as readonly string[]).includes(value);
}

export function getPresenterTopic(slug: PresenterTopicSlug): PresenterTopic {
  return topics[slug];
}

export function buildPresenterTopicPath(slug: PresenterTopicSlug): string {
  return `${PRESENTER_TIMER_PATH}/${slug}`;
}
