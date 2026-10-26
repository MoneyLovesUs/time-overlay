import type { RootPageContent } from "@/content/root/types";
import {
  buildLocalizedPath,
  type EnabledLocale,
} from "@/lib/i18n";
import { secondaryContentLocales } from "@/lib/site";

export type NavigationItem = {
  href: string;
  label: string;
};

type NavigationLabels = {
  presenterTimer: string;
  guides: string;
  formats: string;
  about: string;
  contact: string;
  privacy: string;
  terms: string;
  exploreTitle: string;
  legalTitle: string;
};

const navigationLabels: Record<"en" | "zh-hans", NavigationLabels> = {
  en: {
    presenterTimer: "Presenter timer",
    guides: "Guides",
    formats: "Formats",
    about: "About",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    exploreTitle: "Explore",
    legalTitle: "Trust",
  },
  "zh-hans": {
    presenterTimer: "演讲者计时器",
    guides: "指南",
    formats: "格式",
    about: "关于",
    contact: "联系",
    privacy: "隐私",
    terms: "条款",
    exploreTitle: "浏览",
    legalTitle: "信任",
  },
};

function hasSecondaryContent(locale: EnabledLocale): boolean {
  return (secondaryContentLocales as readonly EnabledLocale[]).includes(locale);
}

export function getNavigationLabels(locale: EnabledLocale): NavigationLabels {
  return locale === "zh-hans" ? navigationLabels["zh-hans"] : navigationLabels.en;
}

export function buildSecondaryContentPath(
  path: string,
  locale: EnabledLocale,
): string {
  return hasSecondaryContent(locale)
    ? buildLocalizedPath(path, locale)
    : buildLocalizedPath(path, "en");
}

export function buildPrimaryNavigation(
  locale: EnabledLocale,
  content: RootPageContent,
): NavigationItem[] {
  const labels = getNavigationLabels(locale);

  return [
    {
      href: buildLocalizedPath("/#tool", locale),
      label: content.siteChrome.header.toolLinkLabel,
    },
    {
      href: buildSecondaryContentPath("/guides", locale),
      label: labels.guides,
    },
    {
      href: buildSecondaryContentPath(
        "/compare/transparent-overlay-formats",
        locale,
      ),
      label: labels.formats,
    },
    {
      href: buildLocalizedPath("/#faq", locale),
      label: content.siteChrome.header.faqLinkLabel,
    },
  ];
}

export function buildFooterNavigation(
  locale: EnabledLocale,
  content: RootPageContent,
): {
  jumpItems: NavigationItem[];
  resourceItems: NavigationItem[];
  trustItems: NavigationItem[];
  resourceTitle: string;
  trustTitle: string;
} {
  const labels = getNavigationLabels(locale);
  const jumpItems = content.siteChrome.footer.jumpLinks.map((item) => ({
    href: buildLocalizedPath(`/#${item.anchorId}`, locale),
    label: item.label,
  }));

  return {
    jumpItems,
    resourceItems: [
      {
        href: buildSecondaryContentPath("/guides", locale),
        label: labels.guides,
      },
      {
        href: buildSecondaryContentPath(
          "/compare/transparent-overlay-formats",
          locale,
        ),
        label: labels.formats,
      },
      {
        href: buildSecondaryContentPath("/about", locale),
        label: labels.about,
      },
      {
        // English-only page, linked from every locale.
        href: buildLocalizedPath("/presenter-timer", "en"),
        label: labels.presenterTimer,
      },
    ],
    trustItems: [
      {
        href: buildSecondaryContentPath("/privacy", locale),
        label: labels.privacy,
      },
      {
        href: buildSecondaryContentPath("/terms", locale),
        label: labels.terms,
      },
      {
        href: buildSecondaryContentPath("/contact", locale),
        label: labels.contact,
      },
    ],
    resourceTitle: labels.exploreTitle,
    trustTitle: labels.legalTitle,
  };
}
