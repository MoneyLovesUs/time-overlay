"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";

import {
  createRenderFrameState,
  measureRenderTextBox,
  renderStyledFrame,
} from "@/lib/generator/render-frame";
import {
  DEFAULT_GENERATOR_TEMPLATE_ID,
  isProTemplateId,
} from "@/lib/generator/templates";
import { formatCountdownTime } from "@/lib/generator/time";
import type { GeneratorSettings } from "@/lib/generator/types";
import {
  computeLiveFrame,
  liveFrameKey,
  type LiveFrame,
} from "@/lib/live/live-timer-clock";
import {
  generatorSettingsFromLiveConfig,
  parseLiveTimerParams,
} from "@/lib/live/live-timer-config";

const SAFE_AREA_INSET = 32;

const CHECKERBOARD_BACKGROUND =
  "repeating-conic-gradient(#2a2a35 0% 25%, #1a1a22 0% 50%) 50% / 32px 32px";

function paint(
  context: CanvasRenderingContext2D,
  baseSettings: GeneratorSettings,
  frame: LiveFrame,
) {
  if (frame.kind === "hidden") {
    context.clearRect(0, 0, baseSettings.canvas.width, baseSettings.canvas.height);
    return;
  }

  const settings: GeneratorSettings =
    frame.kind === "digits"
      ? {
          ...baseSettings,
          timer: {
            ...baseSettings.timer,
            durationSeconds: frame.seconds,
            displayFormat: frame.displayFormat,
          },
        }
      : baseSettings;
  const textOverride = frame.kind === "message" ? frame.text : undefined;
  const text =
    frame.kind === "digits"
      ? formatCountdownTime(frame.seconds, frame.displayFormat)
      : frame.text;
  const textBox = measureRenderTextBox(context, text, settings.textStyle);
  const state = createRenderFrameState({
    settings,
    elapsedSeconds: 0,
    textBox,
    safeAreaInset: SAFE_AREA_INSET,
    textOverride,
  });

  renderStyledFrame(context, state, settings.themePresetId, settings.templateId);
}

export function LiveTimerOverlay() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) {
      return;
    }

    const parsed = parseLiveTimerParams(
      new URLSearchParams(window.location.search),
    );
    const config = parsed.config;
    const requestedTemplateId = config.templateId;

    if (parsed.preview) {
      canvas.style.background = CHECKERBOARD_BACKGROUND;
    }
    let debugElement: HTMLDivElement | null = null;
    if (parsed.debug) {
      debugElement = document.createElement("div");
      Object.assign(debugElement.style, {
        position: "fixed",
        left: "0",
        top: "0",
        zIndex: "10",
        maxWidth: "60vw",
        padding: "4px 8px",
        background: "rgba(0, 0, 0, 0.72)",
        color: "#ffffff",
        fontFamily: "ui-monospace, monospace",
        fontSize: "11px",
        lineHeight: "1.4",
        whiteSpace: "pre-wrap",
      });
      if (parsed.warnings.length === 0) {
        debugElement.textContent = "ok";
      } else {
        debugElement.replaceChildren(
          ...parsed.warnings.map((warning) => {
            const line = document.createElement("div");
            line.textContent = warning;
            return line;
          }),
        );
      }
      document.body.appendChild(debugElement);
    }

    let settings = generatorSettingsFromLiveConfig(config);
    let lastKey: string | null = null;
    let cancelled = false;

    const applyCanvasSize = () => {
      canvas.width = settings.canvas.width;
      canvas.height = settings.canvas.height;
    };
    applyCanvasSize();

    const startedAt = performance.now();
    let rafId = 0;

    const tick = () => {
      if (cancelled) {
        return;
      }
      const frame = computeLiveFrame(
        config,
        settings.timer.displayFormat,
        {
          nowEpochMs: Date.now(),
          elapsedMs: performance.now() - startedAt,
        },
      );
      const key = `${liveFrameKey(frame)}|${settings.templateId}|${settings.canvas.width}x${settings.canvas.height}`;
      if (key !== lastKey) {
        lastKey = key;
        paint(context, settings, frame);
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const controller = new AbortController();
    let reported = false;
    const reportLoaded = () => {
      if (cancelled || reported) {
        return;
      }
      reported = true;
      posthog.capture("live_overlay_loaded", {
        mode: config.mode,
        templateId: settings.templateId,
        requestedTemplateId,
        endBehavior: config.endBehavior,
        resolution: settings.canvas.resolutionPresetId,
        hasLicense: config.licenseToken !== null,
        warningsCount: parsed.warnings.length,
        preview: parsed.preview,
      });
    };

    const fallBackToDefaultTemplate = () => {
      settings = generatorSettingsFromLiveConfig({
        ...config,
        templateId: DEFAULT_GENERATOR_TEMPLATE_ID,
      });
      applyCanvasSize();
      lastKey = null;
    };

    if (isProTemplateId(config.templateId)) {
      if (config.licenseToken === null) {
        fallBackToDefaultTemplate();
        reportLoaded();
      } else {
        void fetch("/api/pro/validate", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ token: config.licenseToken }),
          signal: controller.signal,
        })
          .then(async (response) => {
            if (!response.ok) {
              return;
            }
            const payload = (await response.json().catch(() => null)) as
              | { valid?: boolean }
              | null;
            if (payload?.valid === false) {
              fallBackToDefaultTemplate();
            }
          })
          .catch(() => undefined)
          .finally(() => {
            reportLoaded();
          });
      }
    } else {
      reportLoaded();
    }

    return () => {
      cancelled = true;
      controller.abort();
      cancelAnimationFrame(rafId);
      debugElement?.remove();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100vw",
        height: "100vh",
        objectFit: "contain",
        background: "transparent",
      }}
    />
  );
}
