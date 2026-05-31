export type ClientDeviceType = "mobile" | "tablet" | "desktop";

export type ClientEnvironment = {
  browser: string;
  browserVersion: string;
  os: string;
  deviceType: ClientDeviceType;
};

const UNKNOWN_ENVIRONMENT: ClientEnvironment = {
  browser: "unknown",
  browserVersion: "unknown",
  os: "unknown",
  deviceType: "desktop",
};

function matchVersion(ua: string, pattern: RegExp): string {
  const match = ua.match(pattern);
  return match?.[1] ? match[1].split(".")[0] : "unknown";
}

function detectBrowser(ua: string): { browser: string; browserVersion: string } {
  // Order matters: Chromium forks (Edge, Opera, Samsung) all contain "Chrome",
  // and Chrome itself contains "Safari", so the most specific token wins first.
  if (/Edg\//.test(ua)) {
    return { browser: "edge", browserVersion: matchVersion(ua, /Edg\/([\d.]+)/) };
  }
  if (/OPR\/|Opera/.test(ua)) {
    return { browser: "opera", browserVersion: matchVersion(ua, /OPR\/([\d.]+)/) };
  }
  if (/SamsungBrowser/.test(ua)) {
    return {
      browser: "samsung",
      browserVersion: matchVersion(ua, /SamsungBrowser\/([\d.]+)/),
    };
  }
  if (/Firefox\/|FxiOS\//.test(ua)) {
    return {
      browser: "firefox",
      browserVersion: matchVersion(ua, /(?:Firefox|FxiOS)\/([\d.]+)/),
    };
  }
  if (/CriOS\//.test(ua)) {
    // Chrome on iOS is a Safari/WebKit shell, but report it as chrome-ios so we
    // can tell it apart from desktop Chrome when triaging export failures.
    return { browser: "chrome-ios", browserVersion: matchVersion(ua, /CriOS\/([\d.]+)/) };
  }
  if (/Chrome\//.test(ua)) {
    return { browser: "chrome", browserVersion: matchVersion(ua, /Chrome\/([\d.]+)/) };
  }
  if (/Safari\//.test(ua) && /Version\//.test(ua)) {
    return { browser: "safari", browserVersion: matchVersion(ua, /Version\/([\d.]+)/) };
  }
  return { browser: "unknown", browserVersion: "unknown" };
}

function detectOs(ua: string): string {
  if (/iPhone|iPad|iPod/.test(ua)) {
    return "ios";
  }
  if (/Android/.test(ua)) {
    return "android";
  }
  if (/Windows NT/.test(ua)) {
    return "windows";
  }
  if (/Mac OS X|Macintosh/.test(ua)) {
    return "macos";
  }
  if (/Linux/.test(ua)) {
    return "linux";
  }
  return "unknown";
}

function detectDeviceType(ua: string): ClientDeviceType {
  if (/iPad/.test(ua) || (/Android/.test(ua) && !/Mobile/.test(ua))) {
    return "tablet";
  }
  if (/Mobi|iPhone|iPod|Android/.test(ua)) {
    return "mobile";
  }
  return "desktop";
}

/**
 * Parse a raw user-agent string into a coarse browser / OS / device profile.
 * Pure and deterministic so it can be unit-tested without a DOM. The values are
 * intentionally low-cardinality buckets — this feeds export funnel analytics,
 * not fingerprinting.
 */
export function parseUserAgent(ua: string): ClientEnvironment {
  if (!ua) {
    return UNKNOWN_ENVIRONMENT;
  }

  const { browser, browserVersion } = detectBrowser(ua);

  return {
    browser,
    browserVersion,
    os: detectOs(ua),
    deviceType: detectDeviceType(ua),
  };
}

/**
 * Read the current browser environment. SSR-safe: returns a stable unknown
 * profile when there is no navigator (server render, worker, or test node).
 */
export function detectClientEnvironment(): ClientEnvironment {
  if (typeof navigator === "undefined" || typeof navigator.userAgent !== "string") {
    return UNKNOWN_ENVIRONMENT;
  }

  const parsed = parseUserAgent(navigator.userAgent);

  // navigator.userAgentData, when present, is the authoritative mobile signal
  // and survives UA-reduction better than string sniffing.
  const uaData = (navigator as Navigator & {
    userAgentData?: { mobile?: boolean };
  }).userAgentData;

  if (typeof uaData?.mobile === "boolean" && parsed.deviceType !== "tablet") {
    return { ...parsed, deviceType: uaData.mobile ? "mobile" : "desktop" };
  }

  return parsed;
}
