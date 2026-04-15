import type { RootPageContent } from "@/content/root/types";

const ruRootPageContent = {
  metadata: {
    title: "Таймер-оверлей для видео, стримов и туториалов",
    description:
      "Создавайте таймер-оверлей прямо в браузере для видео, прямых эфиров и туториалов - с быстрым предпросмотром и понятным workflow для авторов контента.",
  },
  generatorHero: {
    eyebrow: "Time Overlay",
    heading:
      "Задайте длительность, проверьте кадр в предпросмотре и экспортируйте готовый таймер.",
    intro:
      "Рекомендуемый первый запуск: `30s`, `PNG sequence`, `bottom-right`.",
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
        { anchorId: "tool", label: "Генератор" },
        { anchorId: "faq", label: "FAQ" },
        { anchorId: "export-formats", label: "Форматы" },
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
      presetLabels: {
        "minimal-neon": "Минимал неон",
        "broadcast-alert": "Эфирная тревога",
        "calm-studio": "Спокойная студия",
      },
    },
    controlPanel: {
      title: "Управление",
      subtitle: "Входные настройки",
      timerSetupTitle: "Настройка таймера",
      durationLabel: "Длительность (секунды)",
      displayFormatLabel: "Формат отображения",
      displayFormatOptions: {
        ss: "SS",
        "mm:ss": "MM:SS",
        "hh:mm:ss": "HH:MM:SS",
      },
      canvasTitle: "Холст",
      resolutionPresetLabel: "Пресет разрешения",
      resolutionPresetOptions: {
        "landscape-720": "1280x720 / 16:9",
        "landscape-1080": "1920x1080 / 16:9",
        "portrait-720": "720x1280 / 9:16",
        "portrait-1080": "1080x1920 / 9:16",
        "square-1080": "1080x1080 / 1:1",
      },
      backgroundModeLabel: "Режим фона",
      styleTitle: "Стиль",
      fontFamilyLabel: "Семейство шрифта",
      fontFamilyOptions: {
        "geist-mono": "Geist Mono",
        "geist-sans": "Geist Sans",
      },
      anchorLabel: "Якорь",
      anchorOptions: {
        "top-left": "Верх слева",
        "top-center": "Верх по центру",
        "top-right": "Верх справа",
        "center-left": "Центр слева",
        center: "Центр",
        "center-right": "Центр справа",
        "bottom-left": "Низ слева",
        "bottom-center": "Низ по центру",
        "bottom-right": "Низ справа",
      },
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
      fpsOptions: {
        24: "24 FPS",
        30: "30 FPS",
      },
      qualityLabel: "Качество",
      launchNoteTitle: "Примечание",
      launchNoteFallback:
        "В MVP экспорт остается local-first. Если формат не поддерживается текущим браузером, интерфейс подскажет перейти на PNG Sequence.",
      exportButtonIdle: "Экспортировать файл",
      exportButtonBusy: "Идет экспорт...",
      exportStatusTitle: "Статус экспорта",
      exportStatusIdle:
        "Ожидание. Выберите формат и запустите локальный экспорт.",
      qualityOptions: {
        standard: "Стандарт",
        high: "Высокое",
      },
      advisoryMessages: {
        workerSupportError:
          "Этот браузер не может запустить фоновый worker, поэтому локальный видеоэкспорт отключен. Используйте PNG Sequence в современном настольном браузере.",
        webmUnavailableError:
          "Экспорт в WebM недоступен в этом браузере. PNG Sequence остается самым безопасным резервным вариантом.",
        heavyExportWarning:
          "Этот экспорт, вероятно, будет сильно нагружать память и CPU. Попробуйте 720p, 30 секунд или PNG Sequence, если браузер начинает тормозить.",
        pngSequenceInfo:
          "PNG Sequence — самый надежный local-first формат передачи в редакторы, особенно когда важна прозрачность.",
      },
      runtimeMessages: {
        exportReadyTemplate: "Экспорт готов: {fileName}",
        preparingWebm: "Подготовка локального экспорта WebM",
        preparingPngSequence: "Подготовка локального экспорта PNG Sequence",
        exportWorkerUnavailable:
          "Worker экспорта недоступен в этой сессии браузера.",
        webmFailedUnexpectedly: "Экспорт WebM неожиданно завершился ошибкой.",
        pngSequenceFailedUnexpectedly:
          "Экспорт PNG Sequence неожиданно завершился ошибкой.",
      },
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
    workflowEyebrow: "Как это работает",
    workflowHeading: "Как работает экспорт overlay-таймера",
    workflowSteps: [
      {
        title: "Задайте длительность и расположение таймера",
        body:
          "Начните с генератора выше. Выберите общую длительность, аккуратный макет часов и место, где оверлей останется читаемым поверх геймплея, продукта или talking-head видео.",
      },
      {
        title: "Подберите стиль таймера под ваш материал",
        body:
          "Настройте типографику, контраст, масштаб и позицию так, чтобы отсчет выглядел осознанной частью кадра, а не случайной наклейкой. Лучшие overlay-таймеры обычно используют крупные цифры, стабильный ритм и достаточный отступ от края.",
      },
      {
        title: "Экспортируйте формат, подходящий вашему редактору",
        body:
          "Используйте PNG Sequence, когда нужен самый безопасный прозрачный ассет, или WebM, если для вашего монтажа достаточно более легкого локального видеофайла.",
      },
    ],
    usageEyebrow: "Как использовать",
    usageHeading: "Как пользоваться Time Overlay",
    usageNotes: [
      "Откройте генератор, задайте длину таймера и посмотрите превью отсчета до любого экспорта.",
      "Используйте PNG Sequence для прозрачных оверлеев в CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve и любых сценариях монтажа, где удобнее работать с изображениями.",
      "Используйте WebM, когда нужен быстрый браузерный экспорт для мокапов, черновых монтажей или легких социальных роликов.",
      "Держите таймер коротким, контрастным и вдали от субтитров или лицевого кадрирования, чтобы он оставался читаемым на мобильных экранах.",
    ],
    usageCta: {
      beforeFirstLink: "Начните с ",
      firstLinkLabel: "живого генератора",
      betweenLinks: "и используйте ",
      secondLinkLabel: "гайд по экспорту",
      afterSecondLink:
        "ниже, когда выбираете между прозрачными кадрами и браузерным видеовыводом.",
    },
    aboutEyebrow: "О проекте",
    aboutHeading: "О Time Overlay",
    aboutPoints: [
      "Time Overlay — это local-first генератор overlay-таймера для авторов, которым нужны графические таймеры без загрузки видео в удаленный сервис рендера.",
      "Страница намеренно компактна: одна рабочая поверхность инструмента, один понятный блок про форматы экспорта и одна SEO-зона, отвечающая на рабочие вопросы, которые люди ищут перед тем как довериться таймерному инструменту.",
      "Это делает главную страницу одновременно практичной производственной утилитой и индексируемой посадочной страницей для запросов вроде overlay timer, countdown timer overlay, transparent countdown overlay и timer overlay for video editing.",
    ],
    aboutCta: {
      beforeLink:
        "Если вам сначала нужно закрыть практические возражения, перейдите в ",
      linkLabel: "FAQ по overlay-таймеру",
      afterLink: ".",
    },
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
