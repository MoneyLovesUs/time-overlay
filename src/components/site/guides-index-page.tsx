import Link from "next/link";

import { JsonLd } from "@/components/site/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { SiteHeader } from "@/components/site/site-header";
import {
  getGuidePageContent,
  type GuideContentLocale,
  type GuideSlug,
} from "@/content/guides";
import type { RootPageContent } from "@/content/root/types";
import { buildLocalizedPath } from "@/lib/i18n";
import { publicationConfig } from "@/lib/publication";
import {
  GUIDE_SLUGS,
  secondaryContentLocales,
  siteConfig,
} from "@/lib/site";
import {
  buildFooterNavigation,
  buildPrimaryNavigation,
} from "@/lib/site-navigation";
import {
  buildBreadcrumbJsonLd,
  buildItemListJsonLd,
  buildWebPageJsonLd,
} from "@/lib/seo/jsonld";

type GuidesIndexPageProps = {
  chrome: RootPageContent;
  locale: GuideContentLocale;
};

const guideGroups: readonly {
  id: "stream" | "edit" | "master";
  slugs: readonly GuideSlug[];
}[] = [
  {
    id: "stream",
    slugs: ["add-countdown-to-obs", "transparent-overlay-for-twitch"],
  },
  {
    id: "edit",
    slugs: [
      "add-countdown-to-premiere",
      "add-countdown-to-davinci-resolve",
      "add-countdown-to-final-cut-pro",
    ],
  },
  { id: "master", slugs: ["png-to-prores"] },
];

export function GuidesIndexPage({ chrome, locale }: GuidesIndexPageProps) {
  const isChinese = locale === "zh-hans";
  const copy = isChinese
    ? {
        eyebrow: "实测工作流库",
        heading: "把透明计时器带进真实剪辑和直播流程",
        lead:
          "这些指南把 Time Overlay 自身能验证的导出行为，与外部软件官方支持的格式边界分开说明。每一页都列出复核日期、核验范围、常见故障和第一方来源。",
        updated: "指南库最后复核",
        methodology: "阅读方法",
        methodologyBody:
          "先按目标软件选择指南，再看推荐格式和核验范围。如果项目要求稳定交付，始终保留 PNG 序列，完成目标软件中的短片段合成测试后，再决定是否转换为单文件母版。",
        limits: "我们如何表达兼容性",
        limitsBody:
          "“官方文档支持”不等于“已在所有设备实机导入”。没有安装在当前核验设备上的编辑器会明确标注；软件版本、系统解码器和插件可能改变实际结果。",
        author: "内容负责人",
        groups: {
          stream: "直播与场景",
          edit: "剪辑软件",
          master: "母版与转换",
        },
        open: "打开指南",
        reviewed: "已复核",
      }
    : {
        eyebrow: "Field-tested workflow library",
        heading: "Move a transparent timer into a real edit or stream",
        lead:
          "These guides separate behavior Time Overlay can verify itself from the format support documented by an external editor. Every page publishes a review date, scope note, troubleshooting cases, and first-party references.",
        updated: "Guide library last reviewed",
        methodology: "How to use this library",
        methodologyBody:
          "Choose the guide for the target application, then read its recommended format and verification scope before exporting. For dependable delivery, retain the PNG sequence until a short composite has passed inside the exact editor, operating system, and project used for production.",
        limits: "How compatibility claims are written",
        limitsBody:
          "Official documentation support is not presented as a hands-on test across every machine. A guide identifies when the target editor was unavailable on the review device, and it treats plug-ins, system codecs, and major version changes as reasons to test again.",
        author: "Editorial owner",
        groups: {
          stream: "Streaming and scenes",
          edit: "Editing applications",
          master: "Mastering and conversion",
        },
        open: "Open guide",
        reviewed: "Reviewed",
      };

  const guides = GUIDE_SLUGS.map((slug) => ({
    slug,
    content: getGuidePageContent(locale, slug).guide,
  }));
  const pagePath = buildLocalizedPath("/guides", locale);
  const pageUrl = new URL(pagePath, siteConfig.url).toString();
  const headerNavItems = buildPrimaryNavigation(locale, chrome);
  const footerNavigation = buildFooterNavigation(locale, chrome);
  const itemListJsonLd = buildItemListJsonLd({
    name: copy.heading,
    description: copy.lead,
    items: guides.map(({ slug, content }) => ({
      name: content.title,
      description: content.description,
      url: new URL(
        buildLocalizedPath(`/guides/${slug}`, locale),
        siteConfig.url,
      ).toString(),
    })),
  });
  const pageJsonLd = buildWebPageJsonLd({
    name: copy.heading,
    description: copy.lead,
    url: pageUrl,
    locale,
    dateModified: "2026-08-28",
  });
  const breadcrumbJsonLd = buildBreadcrumbJsonLd([
    { name: siteConfig.name, url: new URL("/", siteConfig.url).toString() },
    { name: isChinese ? "指南" : "Guides", url: pageUrl },
  ]);

  return (
    <div>
      <JsonLd data={[pageJsonLd, itemListJsonLd, breadcrumbJsonLd]} />
      <SiteHeader
        locale={locale}
        navItems={headerNavItems}
        shellLabel={chrome.siteChrome.header.shellLabel}
        siteName={chrome.siteChrome.siteName}
        languagePickerLabel={chrome.siteChrome.header.languagePickerLabel}
        primaryNavAriaLabel={chrome.siteChrome.header.primaryNavAriaLabel}
        currentPath="/guides"
        localizedLocales={secondaryContentLocales}
      />

      <main className="bg-background text-foreground">
        <section className="border-b border-border/70 px-4 py-14 sm:px-6 sm:py-20">
          <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-end">
            <div className="max-w-4xl">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-tertiary">
                {copy.eyebrow}
              </p>
              <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl sm:leading-[1.08]">
                {copy.heading}
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-muted-foreground sm:text-lg">
                {copy.lead}
              </p>
            </div>
            <dl className="cyber-panel-muted cyber-chamfer px-5 py-4">
              <div>
                <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  {copy.author}
                </dt>
                <dd className="mt-2 text-sm text-foreground">
                  {publicationConfig.authorName}
                </dd>
              </div>
              <div className="mt-4 border-t border-border/60 pt-4">
                <dt className="font-mono text-[9px] uppercase tracking-[0.25em] text-muted-foreground">
                  {copy.updated}
                </dt>
                <dd className="mt-2 font-mono text-sm text-primary">
                  <time dateTime="2026-08-28">2026-08-28</time>
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="border-b border-border/70 px-4 py-12 sm:px-6">
          <div className="mx-auto grid w-full max-w-6xl gap-5 lg:grid-cols-2">
            <article className="cyber-panel-muted border-l-2 border-l-primary/65 px-5 py-5">
              <h2 className="text-xl font-semibold tracking-tight">
                {copy.methodology}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {copy.methodologyBody}
              </p>
            </article>
            <article className="cyber-panel-muted border-l-2 border-l-tertiary/65 px-5 py-5">
              <h2 className="text-xl font-semibold tracking-tight">
                {copy.limits}
              </h2>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                {copy.limitsBody}
              </p>
            </article>
          </div>
        </section>

        <div className="px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto grid w-full max-w-6xl gap-14">
            {guideGroups.map((group) => (
              <section key={group.id}>
                <div className="flex items-center gap-4 border-b border-border/70 pb-4">
                  <p className="font-mono text-[9px] uppercase tracking-[0.3em] text-tertiary">
                    {String(guideGroups.indexOf(group) + 1).padStart(2, "0")}
                  </p>
                  <h2 className="text-2xl font-semibold tracking-tight">
                    {copy.groups[group.id]}
                  </h2>
                </div>
                <div className="mt-5 grid gap-5 lg:grid-cols-3">
                  {group.slugs.map((slug) => {
                    const guide = getGuidePageContent(locale, slug).guide;
                    return (
                      <article
                        key={slug}
                        className="cyber-panel-muted cyber-chamfer flex h-full flex-col px-5 py-5"
                      >
                        <div className="flex items-center justify-between gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                          <span>{copy.reviewed}</span>
                          <time dateTime={guide.reviewedAt} className="text-primary">
                            {guide.reviewedAt}
                          </time>
                        </div>
                        <h3 className="mt-4 text-lg font-semibold leading-7 tracking-tight">
                          {guide.title}
                        </h3>
                        <p className="mt-3 flex-1 text-sm leading-7 text-muted-foreground">
                          {guide.description}
                        </p>
                        <Link
                          href={buildLocalizedPath(`/guides/${slug}`, locale)}
                          className="mt-6 inline-flex min-h-10 items-center justify-between border-t border-border/60 pt-4 font-mono text-[10px] uppercase tracking-[0.22em] text-tertiary transition-colors hover:text-primary"
                        >
                          <span>{copy.open}</span>
                          <span aria-hidden="true">→</span>
                        </Link>
                      </article>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </main>

      <SiteFooter
        navItems={footerNavigation.jumpItems}
        resourceItems={footerNavigation.resourceItems}
        trustItems={footerNavigation.trustItems}
        siteDescription={chrome.siteChrome.siteDescription}
        siteName={chrome.siteChrome.siteName}
        systemRailLabel={chrome.siteChrome.footer.systemRailLabel}
        publicStatusLabel={chrome.siteChrome.footer.publicStatusLabel}
        identityTitle={chrome.siteChrome.footer.identityTitle}
        jumpTitle={chrome.siteChrome.footer.jumpTitle}
        navAriaLabel={chrome.siteChrome.footer.navAriaLabel}
        productTitle={chrome.siteChrome.footer.productTitle}
        productDescription={chrome.siteChrome.footer.productDescription}
        resourceTitle={footerNavigation.resourceTitle}
        trustTitle={footerNavigation.trustTitle}
      />
    </div>
  );
}
