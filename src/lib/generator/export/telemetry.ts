import type { AnalyticsEventPayload } from "@/lib/analytics/events";
import type { GeneratorSettings } from "@/lib/generator/types";

export type ExportFunnelContext = Record<string, string | number | boolean>;

type ExportFunnelTelemetryInput = {
  settings: GeneratorSettings;
  environment: ExportFunnelContext;
  template: ExportFunnelContext;
};

/**
 * Build the parameter set shared by every export funnel event. export_started
 * and export_unsupported must report identical job dimensions so PostHog can
 * compare the blocked cohort against the exported one without guessing which
 * fields each event carried.
 */
export function buildExportFunnelTelemetry({
  settings,
  environment,
  template,
}: ExportFunnelTelemetryInput): AnalyticsEventPayload {
  const totalFrames = Math.max(
    1,
    Math.round(settings.timer.durationSeconds * settings.export.fps),
  );

  return {
    format: settings.export.format,
    fps: settings.export.fps,
    durationSeconds: settings.timer.durationSeconds,
    resolution: settings.canvas.resolutionPresetId,
    width: settings.canvas.width,
    height: settings.canvas.height,
    pixelFrames: settings.canvas.width * settings.canvas.height * totalFrames,
    quality: settings.export.quality,
    audioVariant: settings.audio.variant,
    ...template,
    ...environment,
  };
}
