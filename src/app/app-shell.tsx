import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import {
  defaultLocale,
  getLocaleDirection,
  isEnabledLocale,
} from "@/lib/i18n";
import {
  createRootPageMetadata,
  siteConfig,
  siteThemeColor,
} from "@/lib/site";
import { buildWebApplicationJsonLd } from "@/lib/seo/jsonld";
import { JsonLd } from "@/components/site/json-ld";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const shellBackdropPlaneClass =
  "absolute inset-0 bg-[linear-gradient(180deg,#06070b_0%,#090a10_38%,#05060a_100%)]";
const shellBackdropAtmosphereClass =
  "absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.08),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(255,0,255,0.07),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(0,255,136,0.05),transparent_34%)]";
const shellGlowClasses = [
  "absolute left-[8%] top-[-9rem] h-[22rem] w-[22rem] rounded-full bg-primary/10 blur-3xl",
  "absolute right-[10%] top-[4.5rem] h-[18rem] w-[18rem] rounded-full bg-tertiary/10 blur-3xl",
  "absolute bottom-[-8rem] left-1/2 h-[20rem] w-[28rem] -translate-x-1/2 rounded-full bg-secondary/8 blur-3xl",
] as const;
const ahrefsAnalyticsDataKey = "NQce666pfXHzSj3WBXaUIQ";
const googleAnalyticsId = "G-1FB0KM19XV";
const googleAnalyticsBootstrapScript = `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${googleAnalyticsId}');
`;
const clarityProjectId = "wbgnxnkr0m";
const clarityBootstrapScript = `
  (function(c,l,a,r,i){
      function loadClarity(){
        if (loadClarity.loaded) return;
        loadClarity.loaded = true;
        var t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        var y=l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t,y);
      }
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      if ("requestIdleCallback" in c) {
        c.requestIdleCallback(loadClarity, { timeout: 4000 });
      } else {
        c.setTimeout(loadClarity, 2000);
      }
  })(window, document, "clarity", "script", "${clarityProjectId}");
`;

function resolveRootDefaultTitle(title: Metadata["title"]): string {
  if (!title) {
    return siteConfig.name;
  }

  if (typeof title === "string") {
    return title;
  }

  if ("absolute" in title && typeof title.absolute === "string") {
    return title.absolute;
  }

  if ("default" in title && typeof title.default === "string") {
    return title.default;
  }

  return siteConfig.name;
}

export async function generateDefaultLayoutMetadata(): Promise<Metadata> {
  const localizedMetadata = await createRootPageMetadata(defaultLocale);
  const rootDefaultTitle = resolveRootDefaultTitle(localizedMetadata.title);

  return {
    metadataBase: new URL(siteConfig.url),
    ...localizedMetadata,
    verification: {
      other: {
        _foundr: "a2e7581355636cb842aa09283f303628",
        "saashub-verification": "igknz9129ppt",
      },
    },
    title: {
      default: rootDefaultTitle,
      template: `%s | ${siteConfig.name}`,
    },
  };
}

export const siteViewport: Viewport = {
  themeColor: siteThemeColor,
  colorScheme: "dark",
};

type AppDocumentProps = Readonly<{
  children: React.ReactNode;
  lang: string;
}>;

export function AppDocument({ children, lang }: AppDocumentProps) {
  const dir = isEnabledLocale(lang) ? getLocaleDirection(lang) : "ltr";
  return (
    <html
      lang={lang}
      dir={dir}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          src="https://analytics.ahrefs.com/analytics.js"
          data-key={ahrefsAnalyticsDataKey}
          async
        />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: googleAnalyticsBootstrapScript }}
        />
        <JsonLd data={buildWebApplicationJsonLd()} />
      </head>
      <body
        suppressHydrationWarning
        className="relative flex min-h-full flex-col overflow-x-hidden bg-background text-foreground"
      >
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
          <div className={shellBackdropPlaneClass} />
          <div className={shellBackdropAtmosphereClass} />
          <div className="cyber-grid cyber-scanlines absolute inset-0 opacity-35" />
          {shellGlowClasses.map((className) => (
            <div key={className} className={className} />
          ))}
        </div>

        <div className="relative flex min-h-full flex-1 flex-col">{children}</div>
        <script
          id="microsoft-clarity"
          dangerouslySetInnerHTML={{ __html: clarityBootstrapScript }}
        />
      </body>
    </html>
  );
}
