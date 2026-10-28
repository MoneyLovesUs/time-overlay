import type { ProPageContent } from "./types";

const esProPageContent: ProPageContent = {
  metadata: {
    title: "Time Overlay Pro: temporizadores de 60 minutos, 60 fps y plantillas signature por $9",
    description:
      "Un solo pago de $9, sin suscripción. Pro sube el límite de 5 minutos a 60 minutos, añade 60 fps e incluye las 12 plantillas signature y las plantillas Pro en los enlaces en vivo para OBS.",
  },
  eyebrow: "Time Overlay Pro",
  heading: "Paga una vez y quédate con las herramientas pro para siempre",
  lead:
    "El generador gratis cubre temporizadores rápidos de 5 minutos. Pro es para los trabajos que quieres que se vean bien: directos de una hora, movimiento fluido a 60 fps y las plantillas signature para OBS, Premiere y DaVinci.",
  priceNote: "$9 una vez · acceso de por vida · sin suscripción",
  compareTitle: "Qué incluye Pro",
  compareColumns: {
    feature: "Función",
    free: "Gratis",
    pro: "Pro",
  },
  comparisonRows: [
    {
      feature: "Duración del temporizador",
      free: "Hasta 5 minutos",
      pro: "Hasta 60 minutos",
    },
    {
      feature: "Fotogramas por segundo",
      free: "24 o 30 fps",
      pro: "Hasta 60 fps",
    },
    {
      feature: "Plantillas",
      free: "48 plantillas",
      pro: "48 plantillas + 12 signature",
    },
    {
      feature: "Enlace en vivo para OBS",
      free: "Plantillas gratis",
      pro: "Gratis + plantillas signature",
    },
    {
      feature: "Futuras plantillas Pro",
      free: "No incluidas",
      pro: "Incluidas",
    },
  ],
  audienceTitle: "Quién compra Pro",
  audienceItems: [
    {
      title: "Streamers",
      body:
        "Una cuenta regresiva de \"empezamos pronto\" para OBS que dura todo el pre-show en vez de cinco minutos.",
    },
    {
      title: "Editores de vídeo",
      body:
        "Trabaja con las 12 plantillas signature para que la cuenta regresiva combine con el resto de tu montaje, y exporta a 60 fps cuando el corte lo pida.",
    },
    {
      title: "Charlas y eventos",
      body:
        "Relojes de sesión largos y temporizadores de ponente que se siguen leyendo en una pantalla grande.",
    },
  ],
  faqTitle: "Preguntas",
  faqItems: [
    {
      question: "¿Es una suscripción?",
      answer:
        "No. Pagas $9 una vez y el desbloqueo no se renueva. Las plantillas Pro que se añadan después están incluidas sin coste extra.",
    },
    {
      question: "Cambié de navegador o tengo un portátil nuevo. ¿Pago otra vez?",
      answer:
        "No. Usa la opción de restaurar con el email con el que pagaste y Pro se desbloquea otra vez en ese navegador.",
    },
    {
      question: "¿Puedo pedir un reembolso?",
      answer:
        "Sí. Si Pro no funciona como se describe, escríbenos dentro de los 7 días siguientes a la compra y te devolvemos el importe completo.",
    },
    {
      question: "¿Cómo pago?",
      answer:
        "Con Stripe Checkout. Los datos de la tarjeta los gestiona Stripe; el precio que ves aquí ya incluye cualquier descuento regional.",
    },
  ],
  buyButton: "Consigue Pro por $9",
  buyNote: "Pago seguro con Stripe · reembolso completo en 7 días",
  restoreHint: "¿Ya compraste Pro? Restáuralo con el email de tu compra.",
  footerLinkLabel: "Volver al generador",
};

export default esProPageContent;
