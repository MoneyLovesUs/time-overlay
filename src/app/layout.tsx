import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { defaultLocale, isEnabledLocale, type EnabledLocale } from "@/lib/i18n";
import {
  createRootPageMetadata,
  siteConfig,
  siteThemeColor,
} from "@/lib/site";

import "./globals.css";

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

export async function generateMetadata(): Promise<Metadata> {
  const localizedMetadata = await createRootPageMetadata(defaultLocale);

  return {
    metadataBase: new URL(siteConfig.url),
    ...localizedMetadata,
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
  };
}

export const viewport: Viewport = {
  themeColor: siteThemeColor,
  colorScheme: "dark",
};

function resolveActiveLocale(locale: string | undefined): EnabledLocale {
  if (!locale) {
    return defaultLocale;
  }

  return isEnabledLocale(locale) ? locale : defaultLocale;
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params?: Promise<{
    locale?: string;
  }>;
}>) {
  const resolvedParams = params ? await params : undefined;
  const activeLocale = resolveActiveLocale(resolvedParams?.locale);

  return (
    <html
      lang={activeLocale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col overflow-x-hidden bg-background text-foreground">
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
