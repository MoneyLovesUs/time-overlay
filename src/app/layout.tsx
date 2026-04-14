import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";

import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import { defaultLocale, getDictionary } from "@/lib/i18n";
import { getLocalizedNavItems, siteConfig } from "@/lib/site";

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
  (function(c,l,a,r,i,t,y){
      c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
      t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
      y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
  })(window, document, "clarity", "script", "${clarityProjectId}");
`;

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: "/",
    siteName: siteConfig.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const dictionary = await getDictionary(defaultLocale);
  const navItems = getLocalizedNavItems(defaultLocale, dictionary);

  return (
    <html
      lang={defaultLocale}
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

        <div className="relative flex min-h-full flex-1 flex-col">
          <SiteHeader
            locale={defaultLocale}
            navItems={navItems}
            shellLabel={dictionary.header.shellLabel}
            siteName={siteConfig.name}
          />
          <div className="relative z-10 flex-1">{children}</div>
          <SiteFooter
            navItems={navItems}
            siteDescription={dictionary.site.description}
            siteName={siteConfig.name}
            systemRailLabel={dictionary.footer.systemRail}
            publicStatusLabel={dictionary.footer.publicStatus}
            identityTitle={dictionary.footer.identityTitle}
            exploreTitle={dictionary.footer.exploreTitle}
            legalTitle={dictionary.footer.legalTitle}
            legalNotice={dictionary.footer.legalNotice}
          />
        </div>
        <Script
          id="microsoft-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: clarityBootstrapScript }}
        />
      </body>
    </html>
  );
}
