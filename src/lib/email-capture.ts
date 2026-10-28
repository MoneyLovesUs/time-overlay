/**
 * Remembers that this browser already joined the updates list, so the
 * export-complete form does not ask twice. Storage can throw (Safari private
 * mode, embedded webviews, full quota), and the form still has to work then —
 * a failed read just means "not captured yet", a failed write means it asks
 * again next time.
 */
export const EMAIL_CAPTURE_STORAGE_KEY = "timeoverlay.email_capture.v1";

export function hasCapturedEmail(): boolean {
  try {
    return window.localStorage.getItem(EMAIL_CAPTURE_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function rememberCapturedEmail(): void {
  try {
    window.localStorage.setItem(EMAIL_CAPTURE_STORAGE_KEY, "1");
  } catch {
    // Private mode or a blocked storage partition: keep the form working.
  }
}

// The form reads this through useSyncExternalStore so the server snapshot is a
// stable `false` and a hydration render never sees storage the server could not.
// Another tab joining the list also hides the form here.
export function subscribeEmailCapture(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  return () => window.removeEventListener("storage", listener);
}

export function getEmailCaptureSnapshot(): boolean {
  return hasCapturedEmail();
}

export function getEmailCaptureServerSnapshot(): boolean {
  return false;
}
