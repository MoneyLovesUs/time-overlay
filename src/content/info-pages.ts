import type { EnabledLocale } from "@/lib/i18n";
import { publicationConfig } from "@/lib/publication";

export const INFO_PAGE_KEYS = ["about", "privacy", "contact", "terms"] as const;
export type InfoPageKey = (typeof INFO_PAGE_KEYS)[number];
export type InfoPageLocale = "en" | "zh-hans";

export type InfoPageLink = {
  label: string;
  href: string;
  description?: string;
};

export type InfoPageSection = {
  heading: string;
  paragraphs?: readonly string[];
  bullets?: readonly string[];
  links?: readonly InfoPageLink[];
};

export type InfoPageContent = {
  metadata: {
    title: string;
    description: string;
  };
  eyebrow: string;
  heading: string;
  lead: string;
  updatedLabel: string;
  updatedAt: string;
  sections: readonly InfoPageSection[];
};

const UPDATED_AT = "2026-08-28";

function displayEmail(): string {
  return publicationConfig.contactEmail || "[public contact email pending]";
}

function displayJurisdiction(locale: InfoPageLocale): string {
  if (publicationConfig.jurisdiction) {
    return publicationConfig.jurisdiction;
  }
  return locale === "zh-hans" ? "[适用地区待确认]" : "[jurisdiction pending]";
}

function buildEnglishPages(): Record<InfoPageKey, InfoPageContent> {
  const operator = publicationConfig.operatorName;
  const author = publicationConfig.authorName;
  const email = displayEmail();
  const jurisdiction = displayJurisdiction("en");

  return {
    about: {
      metadata: {
        title: "About Time Overlay",
        description:
          "Learn who operates Time Overlay, why the transparent countdown generator is local-first, and how its technical guides are reviewed.",
      },
      eyebrow: "Publication record",
      heading: "A small, focused tool for transparent countdown graphics",
      lead:
        "Time Overlay is built and published by " +
        operator +
        ". It gives video editors and streamers a practical way to design, preview, and export countdown overlays without uploading their footage or project files to a rendering service.",
      updatedLabel: "Last reviewed",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "What the product does",
          paragraphs: [
            "The generator renders timer frames in the browser. A creator can choose a duration, canvas size, placement, typography, visual preset, and output format, then preview the result before downloading it. PNG sequences are the reliability-first output; supported browsers can also produce transparent video formats for single-file workflows.",
            "The template library is organized around real editing, livestreaming, social, event, fitness, cinematic, and minimal use cases. Templates are starting points rather than locked designs: the controls remain available and the export stays on the creator's device.",
          ],
        },
        {
          heading: "Why local-first matters",
          paragraphs: [
            "A timer graphic does not require access to the underlying video. Time Overlay therefore keeps preview and export work in the browser instead of asking creators to upload footage. This reduces unnecessary transfer, shortens the path from idea to asset, and makes the privacy boundary easier to understand.",
            "Local processing still depends on the browser, device memory, codec support, and requested duration. The product calls out heavy exports and recommends a PNG fallback when a transparent video encoder is unavailable or unreliable.",
          ],
        },
        {
          heading: "How the guides are reviewed",
          paragraphs: [
            "The editorial owner is " +
              author +
              ". Each guide separates what Time Overlay itself produces from what an external editor officially supports. Product behavior is checked against the current generator and automated export tests; editor and streaming compatibility is cross-checked against first-party documentation from OBS, Adobe, Blackmagic Design, Apple, or FFmpeg.",
            "When an editor has not been tested directly on the current device, the guide says so rather than presenting a documentation check as a hands-on import test. Material corrections change the visible review date and are reflected in the guide source list.",
          ],
        },
        {
          heading: "Business and editorial transparency",
          paragraphs: [
            "The core generator is available without an account. Time Overlay displays clearly labelled advertising and may test paid export conveniences in the future, but commercial placement does not change compatibility verdicts or guide recommendations.",
            "Questions, corrections, and accessibility reports can be sent to " +
              email +
              ". Please do not send private footage, account credentials, or files that contain personal information unless support explicitly asks for a safe diagnostic sample.",
          ],
        },
      ],
    },
    privacy: {
      metadata: {
        title: "Privacy Policy",
        description:
          "Read how Time Overlay handles local timer exports, analytics data, cookies, advertising technologies, retention, and privacy requests.",
      },
      eyebrow: "Trust record",
      heading: "Privacy policy",
      lead:
        "This policy explains what information Time Overlay processes, what stays on your device, which analytics providers may receive usage data, and how to contact " +
        operator +
        " about a privacy request.",
      updatedLabel: "Effective and last updated",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "Scope and operator",
          paragraphs: [
            "This policy applies to timeoverlay.co and its localized pages, generator, guides, comparison pages, and related public web routes. The site is operated by " +
              operator +
              ". The public privacy contact is " +
              email +
              ".",
          ],
        },
        {
          heading: "What stays on your device",
          paragraphs: [
            "Timer preview and export are designed to run locally in your browser. Time Overlay does not require you to upload the video that will sit underneath the timer, and the generated PNG or video asset is assembled for download on your device.",
            "Browser limitations can cause an export to fail or fall back to another format. Diagnostic events may describe the requested format, duration, resolution, browser capability, progress, or error category, but the exported frames and your underlying footage are not included in those analytics events.",
          ],
        },
        {
          heading: "Information collected automatically",
          bullets: [
            "Page and referral information, including the page visited, approximate acquisition source, and navigation timing.",
            "Device and browser information such as browser family, operating system, viewport, language, and general capability signals.",
            "Product interaction events such as opening the template library, selecting a template, starting an export, completion, cancellation, unsupported output, or a categorized failure.",
            "Approximate location derived by an analytics provider from network information. Time Overlay does not ask for precise GPS location.",
            "Diagnostic and performance information needed to understand page speed, rendering failures, and export reliability.",
          ],
        },
        {
          heading: "Analytics providers",
          paragraphs: [
            "Time Overlay currently integrates Google Analytics, PostHog, Microsoft Clarity, and Ahrefs Web Analytics. These services may use cookies, local storage, or similar identifiers and may process technical usage data under their own terms. PostHog is also used for product events and may autocapture page interactions; Clarity helps identify usability friction through aggregated interaction diagnostics.",
            "Analytics is used to measure whether the generator works, which formats need better fallbacks, how content is discovered, and whether navigation is understandable. It is not used to inspect the contents of a generated overlay file or underlying video footage.",
          ],
          links: [
            { label: "Google Privacy Policy", href: "https://policies.google.com/privacy" },
            { label: "PostHog Privacy", href: "https://posthog.com/privacy" },
            { label: "Microsoft Privacy Statement", href: "https://privacy.microsoft.com/privacystatement" },
            { label: "Ahrefs Privacy Policy", href: "https://ahrefs.com/privacy-policy" },
          ],
        },
        {
          heading: "Advertising and Google cookies",
          paragraphs: [
            "Time Overlay uses Google AdSense. Third-party vendors including Google may use cookies to serve ads based on a visitor's prior visits to this or other websites. Google's advertising cookies allow Google and its partners to personalize advertising where consent and applicable law permit.",
            "Visitors can manage personalized advertising through Google's Ads Settings. Other advertising vendors may provide their own opt-out controls. Where Google requires a certified consent management platform, Time Overlay will present that choice before requesting personalized ads. Advertising is not currently necessary to use the generator.",
          ],
          links: [
            { label: "Google Ads Settings", href: "https://adssettings.google.com/" },
            { label: "How Google uses data on partner sites", href: "https://policies.google.com/technologies/partner-sites" },
            { label: "Industry opt-out choices", href: "https://www.aboutads.info/choices/" },
          ],
        },
        {
          heading: "Payments",
          paragraphs: [
            "Time Overlay sells optional paid products through Stripe. Payment card details are entered and processed on Stripe's own checkout; Time Overlay does not store card numbers or other payment credentials on its servers.",
            "To verify a purchase or restore it later, Time Overlay asks Stripe about the checkout session using the session reference from your checkout link or the email address used at checkout. That lookup happens at Stripe; Time Overlay does not build a customer database from it.",
          ],
        },
        {
          heading: "Cookies and browser controls",
          paragraphs: [
            "Essential browser storage may retain interface or export preferences needed for the tool to behave consistently. Analytics providers may set additional identifiers. You can clear site data, block cookies, use browser privacy controls, or use provider opt-out tools; blocking storage can reduce measurement and may reset preferences.",
          ],
        },
        {
          heading: "Legal basis, retention, and transfers",
          paragraphs: [
            "Depending on location, processing may rely on consent, legitimate interests in operating and improving the service, or compliance with legal obligations. Third-party providers determine parts of their own retention schedules. Time Overlay keeps product-level reporting only as long as it remains useful for reliability, security, trend comparison, or legal obligations, then deletes or aggregates it where practical.",
            "Providers may process data in countries other than your own. Their contractual safeguards and privacy terms govern those transfers. Time Overlay does not sell generator files or the contents of user projects.",
          ],
        },
        {
          heading: "Your choices and requests",
          paragraphs: [
            "Depending on applicable law, you may request access, correction, deletion, restriction, portability, or objection regarding personal data controlled by " +
              operator +
              ". Send the request to " +
              email +
              " and describe the browser, approximate date, and relevant page without attaching private media. Reasonable identity verification may be required before a request is fulfilled.",
          ],
        },
        {
          heading: "Children, security, and policy changes",
          paragraphs: [
            "Time Overlay is a general creative utility and is not directed to children under the minimum digital-consent age in their location. Reasonable technical and organizational safeguards are used, but no internet service can guarantee absolute security.",
            "Material policy changes will update the date on this page. Continued use after an update means the revised policy applies to subsequent use, subject to any additional consent required by law.",
          ],
        },
      ],
    },
    contact: {
      metadata: {
        title: "Contact Time Overlay",
        description:
          "Contact the Time Overlay operator for product support, corrections, privacy requests, accessibility feedback, and business enquiries.",
      },
      eyebrow: "Support channel",
      heading: "Contact Time Overlay",
      lead:
        "Use the public address below for generator support, documentation corrections, privacy requests, accessibility issues, or a responsible business enquiry.",
      updatedLabel: "Contact details reviewed",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "Public contact",
          paragraphs: [
            "Email: " + email,
            "Operator: " + operator,
            "A concise report with the page URL, browser version, operating system, requested duration, resolution, and export format is usually enough to begin diagnosing a generator problem.",
          ],
        },
        {
          heading: "What to include",
          bullets: [
            "The exact page URL and what you expected to happen.",
            "Browser and operating-system versions.",
            "For export issues: duration, resolution, frame rate, output format, and any visible error message.",
            "For a guide correction: the claim, the first-party source that contradicts it, and the date you checked it.",
            "For accessibility feedback: the input method or assistive technology and the blocked task.",
          ],
        },
        {
          heading: "Please do not send",
          paragraphs: [
            "Do not email passwords, one-time codes, payment details, private keys, confidential client footage, or a full project archive. Reproduce an issue with a short non-sensitive sample when possible. Time Overlay does not need the video underneath your timer to diagnose most export problems.",
          ],
        },
        {
          heading: "Response expectations",
          paragraphs: [
            "Messages are reviewed on a best-effort basis. Security, privacy, broken-export, and factual-correction reports are prioritized. A response time is not guaranteed, and the free service does not currently include an individual support service-level agreement.",
          ],
        },
      ],
    },
    terms: {
      metadata: {
        title: "Terms of Use",
        description:
          "Read the Time Overlay terms covering acceptable use, generated assets, third-party services, disclaimers, liability, and governing law.",
      },
      eyebrow: "Service terms",
      heading: "Terms of use",
      lead:
        "These terms govern use of timeoverlay.co, its local browser generator, downloadable outputs, templates, documentation, and related public pages operated by " +
        operator +
        ".",
      updatedLabel: "Effective and last updated",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "Acceptance and eligibility",
          paragraphs: [
            "By using Time Overlay, you agree to these terms and the privacy policy. If you do not agree, do not use the service. You must be able to enter into a binding agreement in your location or use the service with the permission of a parent, guardian, or authorized organization.",
          ],
        },
        {
          heading: "The service",
          paragraphs: [
            "Time Overlay provides an in-browser interface for previewing and exporting timer graphics. Features, formats, templates, browser support, and availability may change. Exports depend on local browser APIs, device resources, codecs, and third-party editing software; a successful preview does not guarantee every external editor will import every format.",
            "The service may impose practical limits or recommend a fallback to protect device stability. Maintenance, security work, provider failures, or technical constraints can interrupt availability without advance notice.",
          ],
        },
        {
          heading: "Generated output and permitted use",
          paragraphs: [
            "Subject to these terms, you may use timer assets generated by Time Overlay in personal and commercial video, streaming, presentation, event, and client projects. This permission covers the rendered output, not ownership of the Time Overlay software, brand, source code, site design, or documentation.",
            "You are responsible for rights in any material you combine with an output and for checking the requirements of platforms, clients, broadcasters, and editing tools. Do not imply endorsement by Time Overlay or use the Time Overlay name or marks as your own product identity.",
          ],
        },
        {
          heading: "Acceptable use",
          bullets: [
            "Do not use the service to violate law, intellectual-property rights, privacy, or another person's contractual rights.",
            "Do not attempt to disrupt the service, bypass technical limits, distribute malware, probe private systems, or interfere with other visitors.",
            "Do not copy or republish substantial parts of the site or guides as a competing service without permission.",
            "Do not use automated traffic, misleading ad interactions, or other activity intended to manipulate analytics or advertising systems.",
          ],
        },
        {
          heading: "Third-party services and documentation",
          paragraphs: [
            "Guides may link to OBS, Adobe, Blackmagic Design, Apple, FFmpeg, Google, analytics providers, and other third parties. Their products, policies, and documentation are controlled by them. A link or compatibility note is not an endorsement, partnership, or warranty.",
            "Software support changes over time. Verify critical delivery requirements in the target editor and retain the original PNG sequence until the final composite has been checked.",
          ],
        },
        {
          heading: "Advertising and future paid features",
          paragraphs: [
            "The service may display clearly identified advertising or offer optional paid features in the future. Advertising does not purchase a favorable guide verdict. Any paid offer will identify its price, included capability, and applicable refund or cancellation terms before purchase.",
          ],
        },
        {
          heading: "Time Overlay Pro one-time purchase",
          paragraphs: [
            "Time Overlay Pro is a single one-time payment of $9 (USD). It is not a subscription and it does not renew.",
            "The purchase unlocks Pro in the browser where the purchase was verified: a longer per-export duration cap, 60 fps, and the signature template pack. The unlock is stored locally in that browser.",
            "A purchase can be restored in another browser with the email address used at checkout, so keep that email address accessible.",
            "If Pro does not work as described, contact " +
              email +
              " within 14 days of purchase for a full refund, no questions asked.",
          ],
        },
        {
          heading: "No warranty",
          paragraphs: [
            "Time Overlay is provided on an 'as is' and 'as available' basis to the extent permitted by law. " +
              operator +
              " does not promise uninterrupted operation, error-free output, compatibility with every browser or editor, or fitness for a particular production or delivery requirement. Always preview the exported asset in the final target workflow and keep source material and backups.",
          ],
        },
        {
          heading: "Limitation of liability",
          paragraphs: [
            "To the maximum extent permitted by law, " +
              operator +
              " is not liable for indirect, incidental, special, consequential, or punitive losses, or for lost revenue, data, opportunity, production time, or client work arising from use or inability to use the service. Rights that cannot legally be excluded remain unaffected.",
          ],
        },
        {
          heading: "Governing law, changes, and contact",
          paragraphs: [
            "These terms are governed by the laws applicable in " +
              jurisdiction +
              ", without overriding mandatory consumer protections that apply where you live. If a provision is unenforceable, the remaining terms continue in effect.",
            "Material updates change the date shown above. Questions about these terms can be sent to " +
              email +
              ".",
          ],
        },
      ],
    },
  };
}

function buildChinesePages(): Record<InfoPageKey, InfoPageContent> {
  const operator = publicationConfig.operatorName;
  const author = publicationConfig.authorName;
  const email = displayEmail();
  const jurisdiction = displayJurisdiction("zh-hans");

  return {
    about: {
      metadata: {
        title: "关于 Time Overlay",
        description: "了解 Time Overlay 的运营者、本地优先设计，以及技术指南的核验方式。",
      },
      eyebrow: "发布信息",
      heading: "一个专注于透明倒计时素材的小工具",
      lead: `Time Overlay 由 ${operator} 构建和发布，帮助剪辑师与直播创作者设计、预览并导出倒计时叠加素材，无需上传底层视频或项目文件。`,
      updatedLabel: "最后核验",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "产品做什么",
          paragraphs: [
            "生成器在浏览器中渲染计时器帧。你可以设置时长、画布、位置、字体、模板和输出格式，在下载前预览结果。PNG 序列是可靠性优先的输出；浏览器支持时，也可以生成单文件透明视频。",
            "模板按剪辑、直播、社交、活动、健身、电影感和极简场景组织。模板只是起点，所有控制项仍可调整，导出过程留在用户设备上。",
          ],
        },
        {
          heading: "为什么坚持本地优先",
          paragraphs: [
            "制作计时器图形并不需要读取它下方的视频。Time Overlay 因此把预览和导出放在浏览器本地完成，减少不必要的素材传输，也让隐私边界更容易理解。",
            "本地处理仍受浏览器、设备内存、编码支持和导出时长影响。遇到高负载或透明视频编码不可用时，产品会明确建议改用 PNG 序列。",
          ],
        },
        {
          heading: "指南如何核验",
          paragraphs: [
            `内容负责人是 ${author}。指南会区分 Time Overlay 自身可验证的输出行为与外部剪辑软件的官方支持范围。产品行为通过当前生成器和自动化导出测试核验；编辑器兼容性则优先引用 OBS、Adobe、Blackmagic Design、Apple 或 FFmpeg 的第一方资料。`,
            "如果当前设备没有直接完成某个编辑器导入测试，文章会明确说明，避免把文档核对包装成实机测试。重要修订会更新页面日期和来源。",
          ],
        },
        {
          heading: "联系与商业透明",
          paragraphs: [
            `核心生成器无需账号。Time Overlay 会展示清晰标注的广告，并可能在未来测试付费导出便利功能，但商业合作不会改变兼容性结论。问题、纠错和无障碍反馈可以发送到 ${email}。请不要发送密码、验证码或包含私人信息的完整项目素材。`,
          ],
        },
      ],
    },
    privacy: {
      metadata: {
        title: "隐私政策",
        description: "了解 Time Overlay 如何处理本地导出、分析数据、Cookie、广告技术和隐私请求。",
      },
      eyebrow: "信任信息",
      heading: "隐私政策",
      lead: `本政策说明 Time Overlay 会处理哪些信息、哪些内容留在设备上、分析服务可能收到什么数据，以及如何就隐私问题联系 ${operator}。`,
      updatedLabel: "生效及最后更新",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "适用范围与运营者",
          paragraphs: [
            `本政策适用于 timeoverlay.co、其本地化页面、生成器、指南、对比页及相关公开路由。网站由 ${operator} 运营，公开隐私联系邮箱为 ${email}。`,
          ],
        },
        {
          heading: "留在设备上的内容",
          paragraphs: [
            "计时器预览和导出设计为在浏览器本地运行。网站不要求上传位于计时器下方的视频，生成的 PNG 或透明视频也在本地组装并下载。",
            "诊断事件可能记录导出格式、时长、分辨率、浏览器能力、进度或错误类别，但不会包含导出的画面帧或你的底层视频。",
          ],
        },
        {
          heading: "自动收集的信息",
          bullets: [
            "访问页面、来源、导航与加载时间。",
            "浏览器、操作系统、视口、语言和一般能力信息。",
            "模板选择、开始导出、完成、取消、不支持或分类失败等产品事件。",
            "由分析提供商根据网络信息推断的大致地区，不包括精确 GPS。",
            "用于排查性能、渲染和导出可靠性的技术诊断。",
          ],
        },
        {
          heading: "分析服务",
          paragraphs: [
            "Time Overlay 当前接入 Google Analytics、PostHog、Microsoft Clarity 和 Ahrefs Web Analytics。这些服务可能使用 Cookie、本地存储或类似标识符，并根据各自政策处理技术使用数据。PostHog 用于产品事件和页面交互分析；Clarity 用于发现聚合的可用性问题。",
            "这些数据用于判断生成器是否工作、哪些格式需要降级方案、用户如何发现内容以及导航是否清楚，不用于查看导出文件或底层视频内容。",
          ],
          links: [
            { label: "Google 隐私政策", href: "https://policies.google.com/privacy" },
            { label: "PostHog 隐私政策", href: "https://posthog.com/privacy" },
            { label: "Microsoft 隐私声明", href: "https://privacy.microsoft.com/privacystatement" },
            { label: "Ahrefs 隐私政策", href: "https://ahrefs.com/privacy-policy" },
          ],
        },
        {
          heading: "广告与 Google Cookie",
          paragraphs: [
            "Time Overlay 使用 Google AdSense。包括 Google 在内的第三方供应商可能根据访客此前访问本网站或其他网站的情况使用 Cookie 投放广告。只有在用户同意且适用法律允许时，Google 及其合作伙伴才会用于个性化广告。",
            "访客可以通过 Google 广告设置管理个性化广告。在 Google 要求认证同意管理平台的地区，Time Overlay 会在请求个性化广告前提供相应选择。使用生成器本身不以接受广告个性化为条件。",
          ],
          links: [
            { label: "Google 广告设置", href: "https://adssettings.google.com/" },
            { label: "Google 如何使用合作伙伴网站数据", href: "https://policies.google.com/technologies/partner-sites" },
            { label: "行业退出选项", href: "https://www.aboutads.info/choices/" },
          ],
        },
        {
          heading: "支付",
          paragraphs: [
            "Time Overlay 的可选付费项目通过 Stripe 销售。银行卡信息在 Stripe 自己的结账页面输入和处理；Time Overlay 的服务器不存储银行卡号或其他支付凭据。",
            "验证或找回购买时，Time Overlay 使用结账链接中的会话引用或付款邮箱向 Stripe 查询对应的 checkout 会话；查询发生在 Stripe 侧，Time Overlay 不会据此建立用户资料库。",
          ],
        },
        {
          heading: "Cookie、依据、保存与跨境处理",
          paragraphs: [
            "必要的浏览器存储可能保存界面或导出偏好；分析服务可能设置额外标识符。你可以清理网站数据、阻止 Cookie 或使用服务商提供的退出工具，但这可能重置偏好并减少统计。",
            "视所在地区不同，处理依据可能包括同意、运营和改进服务的合法利益或履行法律义务。第三方决定其部分保存周期，数据也可能在其他国家处理。Time Overlay 不出售生成器文件或用户项目内容。",
          ],
        },
        {
          heading: "你的权利与请求",
          paragraphs: [
            `在适用法律允许的范围内，你可以向 ${operator} 请求访问、更正、删除、限制、迁移或反对相关个人数据。请通过 ${email} 联系，并提供浏览器、日期范围和相关页面，不要附带私人素材。处理请求前可能需要合理验证身份。`,
          ],
        },
        {
          heading: "未成年人、安全和政策更新",
          paragraphs: [
            "Time Overlay 是通用创作工具，不面向低于所在地区数字同意年龄的儿童。网站采用合理的技术和组织措施，但任何互联网服务都无法保证绝对安全。重大政策变化会更新本页日期，并在法律要求时重新征求同意。",
          ],
        },
      ],
    },
    contact: {
      metadata: {
        title: "联系 Time Overlay",
        description: "就产品支持、内容纠错、隐私请求、无障碍反馈或商务问题联系 Time Overlay。",
      },
      eyebrow: "支持渠道",
      heading: "联系 Time Overlay",
      lead: "可通过下方公开邮箱提交生成器问题、文档纠错、隐私请求、无障碍问题或负责任的商务咨询。",
      updatedLabel: "联系信息核验",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "公开联系方式",
          paragraphs: [
            `邮箱：${email}`,
            `运营者：${operator}`,
            "报告生成器问题时，通常只需提供页面 URL、浏览器和系统版本、时长、分辨率、导出格式及错误信息。",
          ],
        },
        {
          heading: "建议包含",
          bullets: [
            "准确页面 URL、预期结果和实际结果。",
            "浏览器和操作系统版本。",
            "导出问题的时长、分辨率、帧率、格式和错误信息。",
            "指南纠错所对应的第一方来源和核验日期。",
            "无障碍问题涉及的输入方式、辅助技术和受阻任务。",
          ],
        },
        {
          heading: "请勿发送",
          paragraphs: [
            "请勿发送密码、验证码、支付资料、私钥、机密客户素材或完整项目包。尽量使用短小且不敏感的样例复现问题。多数导出故障不需要提供计时器下方的视频。",
          ],
        },
        {
          heading: "回复说明",
          paragraphs: [
            "消息按尽力原则处理，安全、隐私、导出中断和事实纠错会优先。免费服务目前不提供个人支持 SLA，也不保证固定回复时间。",
          ],
        },
      ],
    },
    terms: {
      metadata: {
        title: "使用条款",
        description: "阅读 Time Overlay 关于可接受使用、生成素材、第三方服务、免责声明和适用法律的条款。",
      },
      eyebrow: "服务条款",
      heading: "使用条款",
      lead: `本条款适用于由 ${operator} 运营的 timeoverlay.co、本地浏览器生成器、下载输出、模板、指南及相关公开页面。`,
      updatedLabel: "生效及最后更新",
      updatedAt: UPDATED_AT,
      sections: [
        {
          heading: "接受条款与服务范围",
          paragraphs: [
            "使用 Time Overlay 即表示你同意本条款和隐私政策。生成器用于预览和导出计时器图形，功能、格式、模板和可用性可能调整。输出依赖浏览器 API、设备资源、编码和第三方软件，预览成功不代表所有编辑器都能导入所有格式。",
          ],
        },
        {
          heading: "生成输出与许可使用",
          paragraphs: [
            "在遵守本条款的前提下，你可以把 Time Overlay 生成的计时器素材用于个人或商业视频、直播、演示、活动和客户项目。该许可只覆盖渲染输出，不转让 Time Overlay 软件、品牌、源代码、网站设计或文档的所有权。",
            "你需要确保与输出组合的其他素材具有合法权利，并自行核对平台、客户、播出方和剪辑工具要求。不得暗示 Time Overlay 为你的作品背书，也不得把 Time Overlay 品牌冒充为自己的产品。",
          ],
        },
        {
          heading: "可接受使用",
          bullets: [
            "不得用于违法、侵犯知识产权、隐私或合同权利的活动。",
            "不得破坏服务、绕过技术限制、传播恶意软件或干扰其他访客。",
            "未经许可不得大量复制或重新发布网站和指南以构成竞争服务。",
            "不得使用自动流量或误导性广告互动操纵分析和广告系统。",
          ],
        },
        {
          heading: "第三方服务与兼容性",
          paragraphs: [
            "指南可能链接 OBS、Adobe、Blackmagic Design、Apple、FFmpeg、Google 和分析服务。第三方自行控制其产品、政策和文档；链接或兼容说明不代表合作或担保。软件支持会变化，重要交付应在目标编辑器中验证，并保留原始 PNG 序列。",
          ],
        },
        {
          heading: "广告与未来付费功能",
          paragraphs: [
            "未来可能展示清晰标注的广告或提供可选付费功能。广告不能购买有利的兼容性结论；任何付费项目会在购买前说明价格、包含能力以及适用的退款或取消条件。",
          ],
        },
        {
          heading: "Time Overlay Pro 一次性买断",
          paragraphs: [
            "Time Overlay Pro 是 9 美元的一次性付款，不是订阅，不会自动续费。",
            "购买后在完成验证的浏览器中解锁 Pro：单次导出时长上限提升、60fps，以及 signature 模板包。解锁状态保存在该浏览器本地。",
            "可以在其他浏览器中凭付款时使用的邮箱找回 Pro，请保存好付款邮箱。",
            "如果 Pro 无法按说明使用，可在购买后 14 天内无理由全额退款，联系邮箱：" +
              email +
              "。",
          ],
        },
        {
          heading: "免责声明与责任限制",
          paragraphs: [
            `在法律允许的范围内，Time Overlay 按“现状”和“可用”提供。${operator} 不保证持续可用、完全无错、兼容所有浏览器或编辑器，也不保证适合某个具体制作交付。请始终在最终工作流中预览并保留备份。`,
            `在法律允许的最大范围内，${operator} 不对间接、附带、特殊、后果性或惩罚性损失，以及收入、数据、机会、制作时间或客户工作的损失负责。法律不得排除的权利不受影响。`,
          ],
        },
        {
          heading: "适用法律、更新与联系",
          paragraphs: [
            `本条款适用 ${jurisdiction} 的相关法律，但不排除用户所在地强制适用的消费者保护。条款重大更新会修改页面日期。如有问题，请联系 ${email}。`,
          ],
        },
      ],
    },
  };
}

export function isInfoPageLocale(locale: EnabledLocale): locale is InfoPageLocale {
  return locale === "en" || locale === "zh-hans";
}

export function getInfoPageContent(
  locale: InfoPageLocale,
  page: InfoPageKey,
): InfoPageContent {
  return locale === "zh-hans" ? buildChinesePages()[page] : buildEnglishPages()[page];
}
