"use client";

import { useEffect, useRef } from "react";

// Adsterra ad units for timeoverlay.co. The unit ids are public client-side
// identifiers, same as the Ahrefs/GA ids in app-shell.tsx.
const socialBarScriptUrl =
  "https://bauval.org/14/ca6b1a286e59a5d1c4fa8bb7d5161c1b";
const nativeBannerScriptUrl =
  "https://bauval.org/21/f268f197147267552b1b5abe4d09c8d1";
const nativeBannerContainerId =
  "container-f268f197147267552b1b5abe4d09c8d1";

function createAdsterraScript(src: string): HTMLScriptElement {
  const script = document.createElement("script");
  script.async = true;
  script.dataset.cfasync = "false";
  script.src = src;
  return script;
}

/**
 * Adsterra Social Bar (in-page push) — a floating format, mounted once in the
 * shared app shell instead of inside page content. DOM-injected so the CSP
 * `strict-dynamic` directive trusts it without an explicit nonce.
 */
export function AdsterraSocialBar() {
  useEffect(() => {
    if (document.querySelector(`script[src="${socialBarScriptUrl}"]`)) {
      return;
    }
    const script = createAdsterraScript(socialBarScriptUrl);
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return null;
}

/**
 * Adsterra native banner unit. The loader fills the fixed container id after
 * it executes; a fresh script element is created per mount so client-side
 * navigations to a page with this unit still get the ad served.
 */
export function AdsterraNativeBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    const script = createAdsterraScript(nativeBannerScriptUrl);
    container.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return (
    <section aria-label="Advertisement" className="px-6 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div
          ref={containerRef}
          id={nativeBannerContainerId}
          className="min-h-[120px]"
        />
      </div>
    </section>
  );
}
