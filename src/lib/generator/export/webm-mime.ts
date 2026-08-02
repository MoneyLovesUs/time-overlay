export const ALPHA_WEBM_VIDEO_MIME_TYPES = [
  "video/webm;codecs=vp8",
  "video/webm",
] as const;

// When an audio track is present the codec declaration must describe it.
// Firefox rejects a VP8-only declaration when the stream also contains Opus.
export const ALPHA_WEBM_AUDIO_MIME_TYPES = [
  "video/webm;codecs=vp8,opus",
] as const;

export function getPreferredAlphaWebmMimeType(withAudio = false) {
  if (typeof MediaRecorder === "undefined") {
    return null;
  }

  const candidates = withAudio
    ? ALPHA_WEBM_AUDIO_MIME_TYPES
    : ALPHA_WEBM_VIDEO_MIME_TYPES;

  return (
    candidates.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) ??
    null
  );
}
