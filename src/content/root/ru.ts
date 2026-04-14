import type { RootPageContent } from "@/content/root/types";

const ruRootPageContent = {
  metadata: {
    title: "Генератор таймера-оверлея с экспортом PNG Sequence и WebM",
    description:
      "Создавайте таймер-оверлей прямо в браузере, смотрите предпросмотр вживую и экспортируйте PNG Sequence или WebM на одной local-first странице.",
  },
  siteChrome: {
    siteName: "Time Overlay",
    siteDescription:
      "Инструменты таймера-оверлея для авторов, которым нужны чистые и читаемые обратные отсчеты в роликах и стримах.",
    header: {
      shellLabel: "Публичная оболочка",
      toolLinkLabel: "Инструмент",
      faqLinkLabel: "FAQ",
    },
    footer: {
      systemRailLabel: "Системная линия",
      publicStatusLabel: "Публичный статус",
      identityTitle: "Идентичность",
      jumpTitle: "Переходы",
      productTitle: "Продукт",
      jumpLinks: [
        { href: "/#tool", label: "Генератор" },
        { href: "/#faq", label: "FAQ" },
        { href: "/#export-formats", label: "Форматы" },
      ],
      productDescription:
        "Одна local-first страница инструмента для оверлеев с таймером, компактного FAQ и рекомендаций по форматам экспорта.",
    },
  },
  generatorUi: {
    themePresetPicker: {
      title: "Пресет темы",
      description:
        "Выберите стартовый стиль, а затем при необходимости подстройте параметры.",
    },
    controlPanel: {
      title: "Управление",
      subtitle: "Входные настройки",
      timerSetupTitle: "Настройка таймера",
      durationLabel: "Длительность (секунды)",
      displayFormatLabel: "Формат отображения",
      canvasTitle: "Холст",
      resolutionPresetLabel: "Пресет разрешения",
      backgroundModeLabel: "Режим фона",
      styleTitle: "Стиль",
      fontFamilyLabel: "Семейство шрифта",
      anchorLabel: "Якорь",
      transparentOptionLabel: "Прозрачный",
      solidOptionLabel: "Сплошной",
    },
    previewPanel: {
      title: "Предпросмотр",
      subtitle: "Живой холст",
      playButton: "Запустить предпросмотр",
      pauseButton: "Пауза",
      resetButton: "Сброс",
      safeAreaOnButton: "Безопасная зона включена",
      safeAreaOffButton: "Безопасная зона выключена",
      currentReadoutLabel: "Текущее значение",
    },
    exportPanel: {
      title: "Экспорт",
      subtitle: "Зона выдачи",
      outputFormatTitle: "Формат вывода",
      pngSequenceLabel: "PNG Sequence",
      pngSequenceDescription:
        "Самый надежный вариант для редакторов и передачи с прозрачностью.",
      webmLabel: "WebM",
      webmDescription:
        "Подходит для легкого локального видеоэкспорта в поддерживаемых браузерах.",
      fpsLabel: "FPS",
      qualityLabel: "Качество",
      launchNoteTitle: "Примечание",
      launchNoteFallback:
        "В MVP экспорт остается local-first. Если формат не поддерживается текущим браузером, интерфейс подскажет перейти на PNG Sequence.",
      exportButtonIdle: "Экспортировать файл",
      exportButtonBusy: "Идет экспорт...",
      exportStatusTitle: "Статус экспорта",
      exportStatusIdle:
        "Ожидание. Выберите формат и запустите локальный экспорт.",
      standardQualityLabel: "Стандарт",
      highQualityLabel: "Высокое",
    },
  },
  seoSection: {
    notesEyebrow: "Заметки по инструменту",
    heading:
      "Одна страница инструмента и только минимальный контекст для уверенной работы.",
    description:
      "Time Overlay создан как local-first генератор таймера-оверлея. Настройте длительность, стиль, позицию и формат экспорта в блоке выше, а нижний раздел оставлен для ключевых вопросов, важных для SEO и реальных рабочих сценариев.",
    exportFormatsTitle: "Форматы экспорта",
    exportFormatsPngText:
      "PNG Sequence — самый надежный локальный экспорт, когда нужны прозрачные оверлеи и удобная передача в монтаж.",
    exportFormatsWebmText:
      "WebM доступен как нативный браузерный вариант, если текущее окружение поддерживает его стабильно.",
    faqTitle: "FAQ",
    faqSubtitle: "Главное об overlay-таймере",
    faqItems: [
      {
        question: "Можно ли экспортировать таймер-оверлей с прозрачностью?",
        answer:
          "Да. Самый безопасный local-first путь — PNG Sequence, потому что монтажные программы надежнее работают с прозрачными изображениями, чем со сжатыми видеопотоками. WebM тоже доступен при поддержке браузера, но при критичной прозрачности PNG Sequence остается лучшей передачей.",
      },
      {
        question: "Какой формат экспорта выбрать первым?",
        answer:
          "Начните с PNG Sequence, если нужна максимально предсказуемая передача в редакторы, особенно для композитинга поверх реального видео. WebM выбирайте, когда нужен более легкий локальный видеофайл и браузер уже поддерживает этот путь.",
      },
      {
        question: "Инструмент рендерится на сервере?",
        answer:
          "Нет. Основной опыт local-first: предпросмотр и экспорт выполняются на устройстве пользователя, чтобы страница работала как реальный инструмент, а не зависела от удаленной очереди рендера.",
      },
      {
        question: "Какой стиль таймера лучше читается в видео?",
        answer:
          "Обычно выигрывают простые цифры с высоким контрастом. Моноширинные символы, умеренное свечение и аккуратное размещение в углу читаются лучше на сложном фоне, чем декоративные варианты.",
      },
      {
        question:
          "Подходит ли это для TikTok, YouTube и редакторов вроде CapCut или Premiere?",
        answer:
          "Да, но путь передачи зависит от задачи. Для коротких роликов и монтажа чаще полезны прозрачные или покадровые экспорты, а быстрый локальный WebM уместен, когда нужен легкий файл без сложного композитинга.",
      },
    ],
  },
} satisfies RootPageContent;

export default ruRootPageContent;
