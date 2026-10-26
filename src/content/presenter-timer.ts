import type {
  WaitlistPlatform,
  WaitlistPrice,
  WaitlistUseCase,
} from "@/lib/waitlist";

export const PRESENTER_TIMER_PATH = "/presenter-timer";

export const presenterTimerContent = {
  metadata: {
    title: "Presenter Timer Hidden From Screen Share (Windows & Mac)",
    description:
      "A floating presenter timer only you can see. It stays on your screen while you share in Zoom, Teams or Google Meet, but not in what the audience sees.",
  },
  eyebrow: "Time Overlay Desktop · Early access",
  heading: "A presenter timer only you can see, even while you share your screen",
  lead:
    "Time Overlay Desktop puts a small, always-on-top countdown on your own display and leaves it out of the screen share. Your audience sees your slides. You see how much time is left.",
  heroCta: "Join the waitlist",
  heroNote: "Windows and macOS · in development · no spam, one email when the beta opens",
  diagram: {
    yourScreenLabel: "Your screen",
    theirScreenLabel: "What they see",
    slideTitle: "Q3 roadmap",
    timer: "04:12",
  },
  problem: {
    heading: "Share your slides on one laptop and the clock disappears",
    paragraphs: [
      "Presenter view needs a second monitor. Once the slideshow is shared full screen on a single laptop, the elapsed time and the notes are gone. The meeting app's own timer hides behind the share toolbar, a phone timer pulls your eyes off the camera, and any timer window you can see ends up in the recording.",
      "Time Overlay Desktop keeps the countdown on your display but asks the operating system to leave its window out of screen capture, so it never reaches the shared picture.",
    ],
  },
  steps: {
    heading: "How it will work",
    items: [
      {
        title: "Set your time",
        body: "Pick a countdown, a count-up, or an agenda with several segments. Choose where the timer floats and how large it is.",
      },
      {
        title: "Share as usual",
        body: "Share your full screen or a window in Zoom, Teams, Google Meet, Webex or anything else. The timer stays above your slideshow on your side only.",
      },
      {
        title: "Stay on time",
        body: "Color cues turn green, amber and red as you approach the end, with an optional gentle flash when time is up. No sound reaches the call.",
      },
    ],
  },
  audiences: {
    heading: "Who it is for",
    items: [
      "Presenters giving a talk from a single laptop, without presenter view.",
      "Webinar and online-conference speakers who must finish inside a fixed slot.",
      "Coaches, consultants and therapists running fixed-length sessions on video calls.",
      "Teachers and trainers pacing a live online class.",
      "Sales and product teams keeping demos and discovery calls on schedule.",
    ],
  },
  features: {
    heading: "Planned for early access",
    items: [
      "Floating, always-on-top timer that sits above full-screen slideshows.",
      "Countdown, count-up, time of day, and multi-segment agendas.",
      "Green, amber and red thresholds you set yourself.",
      "Global hotkeys to start, pause, add a minute or hide the timer.",
      "Click-through mode so the timer never blocks your slides.",
      "A share-preview check that shows exactly what the audience receives before you go live.",
    ],
  },
  compatibility: {
    heading: "Platforms and honest limits",
    paragraphs: [
      "The beta targets Windows 10 (version 2004) and later, Windows 11, and current macOS releases. We are testing capture exclusion against Zoom, Microsoft Teams, Google Meet, Webex, OBS and the built-in screen recorders on both platforms.",
      "Hiding a window from capture is an operating-system feature, not a guarantee. Some capture paths, certain graphics drivers, and of course a camera pointed at your screen can still record it. That is why the app includes a share-preview check, and why we will publish the results of our compatibility tests.",
    ],
  },
  faqTitle: "Presenter timer questions",
  topicsHeading: "Private timers in Zoom, Teams, Meet and slide apps",
  faqItems: [
    {
      question: "Is Time Overlay Desktop available now?",
      answer:
        "Not yet. It is in development for Windows and macOS. Join the waitlist and we will send one email when the beta opens.",
    },
    {
      question: "Will the audience really not see the timer?",
      answer:
        "The timer window asks the operating system to exclude it from screen capture, so standard screen sharing in Zoom, Teams and Google Meet should not include it. Because some capture setups behave differently, the app shows a share preview so you can confirm before presenting.",
    },
    {
      question: "Does it work over PowerPoint, Keynote and Google Slides?",
      answer:
        "Yes, that is the main use case. The timer is designed to float above full-screen slideshows, including PowerPoint, Keynote and Google Slides in a browser.",
    },
    {
      question: "Can I use it in an interview or exam?",
      answer:
        "Time Overlay Desktop is built for people presenting their own work. Do not use it to break the rules of an interview, exam or any meeting you take part in.",
    },
    {
      question: "How much will it cost?",
      answer:
        "Pricing is not final. The waitlist asks what you would pay, and waitlist members will hear about launch pricing first.",
    },
    {
      question: "How is this different from the Time Overlay web generator?",
      answer:
        "The web generator creates transparent timer video files for editing and streaming. Time Overlay Desktop is a live timer for presenting. The web generator and Time Overlay Pro are unchanged.",
    },
  ],
  form: {
    heading: "Join the early-access waitlist",
    lead: "Tell us how you present. It shapes what we build first.",
    emailLabel: "Email",
    emailPlaceholder: "you@example.com",
    platformLabel: "Which computer do you present from?",
    platformOptions: [
      { value: "windows", label: "Windows" },
      { value: "mac", label: "Mac" },
      { value: "both", label: "Both" },
    ] satisfies readonly { value: WaitlistPlatform; label: string }[],
    useCaseLabel: "What would you use it for?",
    useCaseOptions: [
      { value: "single-screen-slides", label: "Presenting slides from one screen" },
      { value: "webinar-speaker", label: "Speaking at webinars or online events" },
      { value: "client-sessions", label: "Timed client or coaching sessions" },
      { value: "teaching", label: "Teaching or training online" },
      { value: "sales-demos", label: "Sales calls and product demos" },
      { value: "other", label: "Something else" },
    ] satisfies readonly { value: WaitlistUseCase; label: string }[],
    priceLabel: "What would you pay once for a lifetime license?",
    priceOptions: [
      { value: "0", label: "Only if free" },
      { value: "9", label: "$9" },
      { value: "19", label: "$19" },
      { value: "29", label: "$29" },
      { value: "49+", label: "$49+" },
    ] satisfies readonly { value: WaitlistPrice; label: string }[],
    submitLabel: "Join the waitlist",
    submittingLabel: "Joining…",
    successHeading: "You are on the list.",
    successBody: "We will email you once when the Time Overlay Desktop beta opens.",
    errorEmail: "Enter a valid email address.",
    errorGeneric: "Something went wrong. Please try again in a moment.",
    privacyNote: "We use your email only for Time Overlay Desktop updates. See the",
    privacyLinkLabel: "privacy policy",
  },
  updatedAt: "2026-10-26",
} as const;

export type PresenterTimerContent = typeof presenterTimerContent;
