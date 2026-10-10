"use client";

import { useEffect } from "react";

// Adsterra Social Bar unit for timeoverlay.co. The unit id is a public
// client-side identifier, same as the Ahrefs/GA ids in app-shell.tsx.
// NOTE: the Adsterra native banner unit was removed — its loader hijacked
// the whole page to an anti-bot captcha for flagged visitors, which is a
// "sneaky redirect" SEO risk.
const socialBarScriptUrl =
  "https://bauval.org/14/ca6b1a286e59a5d1c4fa8bb7d5161c1b";

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
    const script = document.createElement("script");
    script.async = true;
    script.dataset.cfasync = "false";
    script.src = socialBarScriptUrl;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return null;
}
