import { Sparkles, X } from "lucide-react";

import { Button } from "@/components/ui/button";

export type PaywallTriggerCode =
  | "format-vp9-alpha"
  | "format-hevc-alpha"
  | "resolution-4k"
  | "duration-over-60s"
  | "preset-locked"
  | null;

type PaywallModalProps = {
  trigger: PaywallTriggerCode;
  onClose: () => void;
  onActivateLicense: (licenseKey: string) => Promise<boolean>;
  onCheckoutStart?: () => void;
};

const CHECKOUT_URL =
  process.env.NEXT_PUBLIC_LEMONSQUEEZY_CHECKOUT_URL ??
  "https://timeoverlay.lemonsqueezy.com/buy";

const TRIGGER_HEADLINES: Record<Exclude<PaywallTriggerCode, null>, string> = {
  "format-vp9-alpha": "Unlock WebM (VP9 + alpha) export",
  "format-hevc-alpha": "Unlock MOV (HEVC + alpha) export",
  "resolution-4k": "Unlock 4K resolution",
  "duration-over-60s": "Unlock durations up to 5 minutes",
  "preset-locked": "Unlock all Pro style presets",
};

export function PaywallModal({
  trigger,
  onClose,
  onActivateLicense,
  onCheckoutStart,
}: PaywallModalProps) {
  if (trigger === null) {
    return null;
  }

  const handleBuy = () => {
    onCheckoutStart?.();
    if (typeof window !== "undefined") {
      window.open(CHECKOUT_URL, "_blank", "noopener,noreferrer");
    }
  };

  const handleActivate = async () => {
    if (typeof window === "undefined") {
      return;
    }
    const input = window.prompt("Paste your license key");
    if (!input) {
      return;
    }
    const ok = await onActivateLicense(input.trim());
    if (ok) {
      onClose();
    } else {
      window.alert(
        "We could not validate that license key. Double-check the key from your Lemon Squeezy email and try again.",
      );
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/75 px-4 backdrop-blur"
    >
      <div className="cyber-panel cyber-chamfer relative w-full max-w-md overflow-hidden bg-background/95 px-6 py-6 text-sm text-foreground">
        <button
          onClick={onClose}
          type="button"
          aria-label="Close"
          className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
        >
          <X className="size-4" />
        </button>

        <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.28em] text-secondary">
          <Sparkles className="size-3" />
          Time Overlay Pro
        </p>
        <h2 className="mt-3 text-lg font-semibold tracking-tight">
          {TRIGGER_HEADLINES[trigger]}
        </h2>
        <p className="mt-3 leading-6 text-muted-foreground">
          One-time purchase. Unlocks transparent video exports (VP9 + alpha, HEVC + alpha),
          4K resolution, durations up to 5 minutes, all Pro style presets, custom colors,
          font upload, audio cues, and the ProRes conversion bundle.
        </p>

        <ul className="mt-4 grid gap-2 text-sm text-foreground">
          <li>WebM VP9 alpha for Premiere, DaVinci, CapCut</li>
          <li>MOV HEVC alpha for Final Cut Pro</li>
          <li>4K canvases and 300 second durations</li>
          <li>10 style presets, custom fonts, audio cues</li>
          <li>ProRes 4444 DIY ffmpeg bundle</li>
        </ul>

        <div className="mt-6 flex flex-col gap-3">
          <Button onClick={handleBuy} className="h-11 w-full justify-center">
            Buy Pro for $9
          </Button>
          <button
            type="button"
            onClick={handleActivate}
            className="text-center text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
          >
            I already have a license key
          </button>
        </div>
      </div>
    </div>
  );
}
