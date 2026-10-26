const enLiveLinkCopy = {
  liveLinkButton: "OBS live link",
  liveLinkBadge: "New",
  title: "Live timer for OBS",
  subtitle:
    "Paste this link into an OBS Browser Source. The timer runs live, so there is no video file to export.",
  modeLabel: "Mode",
  modeCountdown: "Countdown",
  modeUntil: "Count down to a time",
  modeCountup: "Count up",
  minutesLabel: "min",
  secondsLabel: "sec",
  untilLabel: "Ends at",
  timeZoneLabel: "Your time zone: {zone}",
  countupHint: "Counts up from 00:00 when the source loads.",
  endLabel: "When it ends",
  endHold: "Stay at 00:00",
  endHide: "Hide the timer",
  endMessage: "Show a message",
  endLoop: "Restart",
  messagePlaceholder: "LIVE NOW",
  linkLabel: "Your link",
  copy: "Copy",
  copied: "Copied",
  copyFallback: "Press Ctrl+C (⌘C on Mac) to copy the selected link.",
  styleNote:
    "Template, color, size and position are saved in the link. Glow, stroke and custom fonts use the template defaults.",
  obsLabel: "In OBS",
  obsStep1: "Sources → + → Browser",
  obsStep2: "Paste the link into URL",
  obsStep3: "Width {w} · Height {h}",
  obsStep4:
    'Tick "Refresh browser when scene becomes active" to restart the timer each time the scene is shown.',
  preview: "Preview in a new tab",
  errorDuration: "Set a duration between 1 second and 99:59:59.",
  errorUntilPast: "Pick a time in the future.",
  errorUntilTooFar: "Pick a time within the next 99 hours.",
  proLockedTitle: "{template} is a Pro template",
  proLockedBody:
    "Live links can use Pro templates with Time Overlay Pro. All free templates work in live links at no cost.",
  proLockedCta: "Unlock Pro",
  close: "Close",
} as const;

const zhHansLiveLinkCopy: LiveLinkCopy = {
  liveLinkButton: "OBS 直播链接",
  liveLinkBadge: "新",
  title: "OBS 实时计时器",
  subtitle:
    "把这个链接粘贴到 OBS 的浏览器源。计时器会实时运行，不需要导出视频文件。",
  modeLabel: "模式",
  modeCountdown: "倒计时",
  modeUntil: "倒计时到某个时刻",
  modeCountup: "正计时",
  minutesLabel: "分",
  secondsLabel: "秒",
  untilLabel: "结束时间",
  timeZoneLabel: "你的时区：{zone}",
  countupHint: "来源加载后从 00:00 开始正计时。",
  endLabel: "结束时",
  endHold: "停在 00:00",
  endHide: "隐藏计时器",
  endMessage: "显示一句文字",
  endLoop: "重新开始",
  messagePlaceholder: "LIVE NOW",
  linkLabel: "你的链接",
  copy: "复制",
  copied: "已复制",
  copyFallback: "链接已选中，按 Ctrl+C（Mac 上按 ⌘C）复制。",
  styleNote:
    "链接会保存模板、颜色、大小和位置。发光、描边和自定义字体使用模板默认值。",
  obsLabel: "在 OBS 中",
  obsStep1: "来源 → + → 浏览器",
  obsStep2: "把链接粘贴到 URL",
  obsStep3: "宽度 {w} · 高度 {h}",
  obsStep4:
    "勾选「场景激活时刷新浏览器」，每次切到该场景时计时器会重新开始。",
  preview: "在新标签页预览",
  errorDuration: "请设置 1 秒到 99:59:59 之间的时长。",
  errorUntilPast: "请选择一个未来的时间。",
  errorUntilTooFar: "请选择 99 小时以内的时间。",
  proLockedTitle: "{template} 是 Pro 模板",
  proLockedBody:
    "开通 Time Overlay Pro 后，直播链接可以使用 Pro 模板。所有免费模板都可以免费用于直播链接。",
  proLockedCta: "解锁 Pro",
  close: "关闭",
};

export type LiveLinkCopy = {
  [Key in keyof typeof enLiveLinkCopy]: string;
};

export function getLiveLinkCopy(locale: string): LiveLinkCopy {
  return locale === "zh-hans" ? zhHansLiveLinkCopy : enLiveLinkCopy;
}
