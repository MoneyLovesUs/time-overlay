import type { GUIDE_SLUGS } from "@/lib/site";

export type GuideSlug = (typeof GUIDE_SLUGS)[number];

export type GuideStep = {
  title: string;
  body: string;
};

export type GuideContent = {
  title: string;
  description: string;
  intro: string;
  recommendedFormat: string;
  steps: readonly GuideStep[];
  closer: string;
};

export const GUIDES: Record<GuideSlug, GuideContent> = {
  "add-countdown-to-obs": {
    title: "Add a Time Overlay countdown to OBS Studio",
    description:
      "Drop a transparent Time Overlay countdown into your OBS scene as a Browser Source or Media Source with looping playback.",
    intro:
      "OBS Studio composites transparent media well. Two reliable paths exist: WebM with alpha as a Media Source for streaming overlays, or a PNG sequence routed through an Image Slideshow Source for tight loops. Both preserve transparency from Time Overlay to the OBS canvas.",
    recommendedFormat:
      "WebM (with alpha) for quick streaming overlays. PNG sequence when you want frame-accurate loops or maximum quality.",
    steps: [
      {
        title: "Configure the timer",
        body:
          "Open the Time Overlay generator, pick a duration that matches your scene break, choose a placement that does not clash with your webcam, and set the canvas to the resolution OBS is recording at.",
      },
      {
        title: "Export WebM with alpha",
        body:
          "Choose 'WebM (with alpha)' from the export panel. The output is a VP8-encoded WebM with a transparent background. OBS reads it directly as a Media Source.",
      },
      {
        title: "Add to your OBS scene",
        body:
          "In OBS, add a Media Source, browse to the downloaded .webm, and enable 'Loop'. Resize the source so the timer reads at the right size on your canvas without covering your camera.",
      },
      {
        title: "Test with a local recording",
        body:
          "Hit Start Recording in OBS for 10 seconds. Open the recording in VLC or a video editor and confirm the background remains transparent over your base scene.",
      },
    ],
    closer:
      "On older OBS builds (pre 28.x) where WebM Media Source playback is inconsistent, export a PNG sequence instead and load it through an Image Slideshow Source. The transparency outcome is the same; the CPU profile shifts toward image decoding.",
  },
  "add-countdown-to-premiere": {
    title: "Add a transparent Time Overlay countdown in Adobe Premiere Pro",
    description:
      "Import a Time Overlay PNG sequence or WebM (with alpha) onto a Premiere timeline as a transparent overlay above your base footage.",
    intro:
      "Premiere Pro handles transparent overlays cleanly. The most reliable workflow is a PNG sequence imported as an image sequence — quality is lossless and the alpha channel is unambiguous. WebM (with alpha) is the quick path when you want a single file and do not need master-grade compression.",
    recommendedFormat:
      "PNG sequence for master-grade quality. WebM (with alpha) for fast iteration.",
    steps: [
      {
        title: "Generate the overlay",
        body:
          "In Time Overlay, set the duration to match your edit beat, pick a style preset that fits your project tone, and pick your export format based on the quality you need.",
      },
      {
        title: "Import into Premiere",
        body:
          "For PNG sequence: File → Import → select the first frame, tick 'Image Sequence', click Import. For WebM: drag the .webm directly into your project bin.",
      },
      {
        title: "Place above the base footage",
        body:
          "Drop the clip on V2 or higher above your main footage on V1. The countdown composites with the alpha intact and you can scale or reposition with Motion controls.",
      },
      {
        title: "Adjust scale and position",
        body:
          "Use the Effect Controls panel to scale and position the overlay. Apply a small drop shadow if the timer needs more separation from busy backgrounds.",
      },
    ],
    closer:
      "If the WebM playback feels CPU-heavy on a long timeline, transcode the PNG sequence to ProRes 4444 with the bundled `convert-to-prores` script and use that master clip instead. ProRes is the most editor-friendly alpha codec on Premiere.",
  },
  "add-countdown-to-davinci-resolve": {
    title: "Add a transparent Time Overlay countdown in DaVinci Resolve",
    description:
      "Import a Time Overlay PNG sequence or WebM (with alpha) onto a DaVinci Resolve timeline with full transparency.",
    intro:
      "DaVinci Resolve (Free and Studio) imports both PNG sequences and VP8-alpha WebM as transparent footage. PNG sequence is the safe master-grade path; WebM is the quick path when you want a single asset to drop in.",
    recommendedFormat:
      "PNG sequence for clean alpha and grading flexibility. WebM (with alpha) for rapid iteration.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "Set up the Time Overlay generator with your duration, preset, and resolution. Pick PNG sequence or WebM based on whether you want lossless frames or a single file.",
      },
      {
        title: "Import into Resolve Media Pool",
        body:
          "For PNG sequence: File → Import Media → select the first frame and let Resolve detect the sequence. For WebM: drag the .webm into the Media Pool.",
      },
      {
        title: "Drop onto the timeline above base footage",
        body:
          "Stack the overlay on Video 2 above your Video 1 base clip. The alpha channel composites without further setup. Resolve respects the transparency through Color and Deliver pages.",
      },
      {
        title: "Trim and align",
        body:
          "Use the Edit page to position the countdown so the final frame lands on the cut you want. Resolve's snap-to-edit features make this fast.",
      },
    ],
    closer:
      "When you need to grade the overlay independently from the base footage, place it on its own video track and use Local Versions in Color page. The PNG sequence path preserves the cleanest alpha edge under aggressive grading.",
  },
  "add-countdown-to-final-cut-pro": {
    title: "Add a transparent Time Overlay countdown in Final Cut Pro",
    description:
      "Drop a Time Overlay PNG sequence into a Final Cut Pro project as a transparent overlay above your primary storyline.",
    intro:
      "Final Cut Pro handles PNG image sequences as native alpha media. WebM playback inside Final Cut has historically been inconsistent on macOS, so the recommended path on the Mac side is PNG sequence — quality is master-grade and alpha is unambiguous.",
    recommendedFormat:
      "PNG sequence is the dependable path on macOS.",
    steps: [
      {
        title: "Export the overlay",
        body:
          "In Time Overlay, pick a duration that aligns to your edit beat and a style preset that fits your project. Export 'PNG Sequence' from the export panel.",
      },
      {
        title: "Import into Final Cut Pro",
        body:
          "File → Import → Media → select the first frame and let Final Cut auto-detect the image sequence. The overlay arrives as a single clip with the transparency preserved.",
      },
      {
        title: "Stack above the primary storyline",
        body:
          "Drop the overlay on a connected layer above your base footage. The countdown shows transparent over the shot below with no further setup.",
      },
      {
        title: "Resize and align",
        body:
          "Use the Transform controls to scale and reposition. Final Cut respects alpha across Color and Compressor delivery, so you can encode for delivery without losing transparency.",
      },
    ],
    closer:
      "If you want a true ProRes 4444 master with alpha, unzip the Time Overlay PNG sequence export and run the bundled `convert-to-prores.sh` script. Final Cut imports ProRes 4444 natively as transparent media.",
  },
  "png-to-prores": {
    title: "Convert Time Overlay PNG sequence to ProRes 4444 with alpha",
    description:
      "Use a one-line ffmpeg command to convert the Time Overlay PNG sequence into Apple ProRes 4444 with the alpha channel intact.",
    intro:
      "ProRes 4444 keeps your alpha and color quality in a single file editors prefer. The Time Overlay PNG sequence export already ships with a conversion script that does this for you on macOS, Linux, and Windows.",
    recommendedFormat: "PNG sequence export, then convert with ffmpeg.",
    steps: [
      {
        title: "Install ffmpeg",
        body:
          "macOS: `brew install ffmpeg`. Windows: download from ffmpeg.org and add the bin folder to PATH. Linux: `sudo apt install ffmpeg` or your package manager equivalent.",
      },
      {
        title: "Download the Time Overlay PNG sequence",
        body:
          "Export 'PNG Sequence' from the Time Overlay generator. The downloaded zip includes the frames plus `convert-to-prores.sh`, `convert-to-prores.bat`, and a README.",
      },
      {
        title: "Run the bundled script",
        body:
          "Unzip the archive. On macOS or Linux, run `./convert-to-prores.sh` from a terminal. On Windows, double-click `convert-to-prores.bat`. The script writes `output.mov` next to the frames.",
      },
      {
        title: "Manual one-liner if you prefer",
        body:
          "Run `ffmpeg -framerate 30 -i frame-%04d.png -c:v prores_ks -profile:v 4444 -pix_fmt yuva444p10le output.mov` from inside the frames folder.",
      },
    ],
    closer:
      "ProRes 4444 alpha is large but lossless. Use it as a master, then transcode for delivery if file size matters. Premiere, DaVinci, and Final Cut all import this file as transparent media without further setup.",
  },
  "transparent-overlay-for-twitch": {
    title: "Add a transparent Time Overlay countdown for a Twitch stream",
    description:
      "Use Time Overlay to create a transparent countdown for OBS, Streamlabs, or Twitch Studio that does not block your scene.",
    intro:
      "Twitch overlays need to read on top of busy gameplay or webcam scenes. A WebM (with alpha) export from Time Overlay drops straight into your streaming software as a transparent Media Source. PNG sequence is the alternate path when you want frame-perfect loops or maximum visual quality.",
    recommendedFormat:
      "WebM (with alpha) for streaming software. PNG sequence when quality matters more than file size.",
    steps: [
      {
        title: "Pick a duration that matches the scene transition",
        body:
          "BRB scenes usually want 60 to 180 seconds. Pre-stream countdowns can run 5 to 10 minutes. Test with the default 30s, then dial in the exact length for your routine.",
      },
      {
        title: "Export WebM with alpha",
        body:
          "Choose a style preset that fits your stream aesthetic, then export 'WebM (with alpha)' from the export panel.",
      },
      {
        title: "Add to OBS, Streamlabs, or Twitch Studio",
        body:
          "Add a Media Source. Point it at the downloaded WebM. Enable Loop if the countdown should restart. Resize the source so the timer is readable but does not block your face cam.",
      },
      {
        title: "Test with a local recording before going live",
        body:
          "Start a local OBS recording for 30 seconds. Confirm the alpha is preserved and the readability holds at your stream bitrate. Adjust opacity or position as needed.",
      },
    ],
    closer:
      "If your streaming software lags on WebM playback, fall back to PNG sequence routed through an Image Slideshow Source. The transparency is identical and the CPU load shifts to image decoding, which most systems handle more predictably under live load.",
  },
};
