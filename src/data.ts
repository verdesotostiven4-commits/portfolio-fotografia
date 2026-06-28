export type GalleryCategory =
  | "emocion"
  | "retrato"
  | "vals"
  | "decoracion"
  | "detalle"
  | "editorial"
  | "momento";

export type GalleryPhoto = {
  code: string;
  title: string;
  category: GalleryCategory;
  src: string;
  orientation: "vertical" | "horizontal" | "square";
  priority: number;
};

export const photographer = {
  name: "Stiven Verdesoto",
  brand: "byStiven",
  handle: "@bystiven",
  location: "Galápagos · Ecuador",
  instagramUrl: "https://www.instagram.com/bystiven/",
  whatsappNumber: "593000000000",
  tagline: "Fotografía de eventos, quinceaños, decoración, naturaleza y vida salvaje.",
  gear: ["Sony A7C", "100-400mm F4/5.6", "24mm F1.4"],
  profilePhoto: "/images/brand/stiven-verdesoto.webp",
};

export const clientGallery = {
  slug: "samantha-guadalupe-15",
  title: "Samantha Guadalupe",
  subtitle: "Quinceaños · 13 Junio 2026",
  downloadPin: "1328",
  cover: "/images/sg15/sg15-03.webp",
  intro:
    "Una selección cuidada de momentos naturales, retratos, vals y detalles de decoración capturados durante la celebración.",
  note:
    "Estas imágenes son una vista previa optimizada para web. La entrega final puede prepararse en alta calidad después de confirmar el paquete.",
};

export const eventPhotos: GalleryPhoto[] = [
  { code: "SG15-03", title: "Risas con amigas y bengalas", category: "emocion", src: "/images/sg15/sg15-03.webp", orientation: "vertical", priority: 1 },
  { code: "SG15-07", title: "Vals con mirada dulce", category: "vals", src: "/images/sg15/sg15-07.webp", orientation: "vertical", priority: 2 },
  { code: "SG15-12", title: "Vals entre humo y globos", category: "vals", src: "/images/sg15/sg15-12.webp", orientation: "vertical", priority: 3 },
  { code: "SG15-09", title: "Reina en escenario", category: "editorial", src: "/images/sg15/sg15-09.webp", orientation: "vertical", priority: 4 },
  { code: "SG15-10", title: "Retrato con acompañante", category: "retrato", src: "/images/sg15/sg15-10.webp", orientation: "vertical", priority: 5 },
  { code: "SG15-04", title: "Retrato en mesa dulce", category: "retrato", src: "/images/sg15/sg15-04.webp", orientation: "horizontal", priority: 6 },
  { code: "SG15-21", title: "Mesa familiar al atardecer", category: "decoracion", src: "/images/sg15/sg15-21.webp", orientation: "horizontal", priority: 7 },
  { code: "SG15-11", title: "Bienvenida del evento", category: "decoracion", src: "/images/sg15/sg15-11.webp", orientation: "square", priority: 8 },
  { code: "SG15-24", title: "Decoración principal", category: "decoracion", src: "/images/sg15/sg15-24.webp", orientation: "horizontal", priority: 9 },
  { code: "SG15-14", title: "Espejo con nombre y fecha", category: "detalle", src: "/images/sg15/sg15-14.webp", orientation: "vertical", priority: 10 },
  { code: "SG15-17", title: "Pastel de quinceaños", category: "detalle", src: "/images/sg15/sg15-17.webp", orientation: "vertical", priority: 11 },
  { code: "SG15-18", title: "Detalle del pastel", category: "detalle", src: "/images/sg15/sg15-18.webp", orientation: "square", priority: 12 },
  { code: "SG15-15", title: "Copa decorada", category: "detalle", src: "/images/sg15/sg15-15.webp", orientation: "vertical", priority: 13 },
  { code: "SG15-16", title: "Trono vacío del evento", category: "decoracion", src: "/images/sg15/sg15-16.webp", orientation: "square", priority: 14 },
  { code: "SG15-22", title: "Letras Samy al atardecer", category: "decoracion", src: "/images/sg15/sg15-22.webp", orientation: "horizontal", priority: 15 },
  { code: "SG15-23", title: "Lugar y pétalos", category: "decoracion", src: "/images/sg15/sg15-23.webp", orientation: "vertical", priority: 16 },
  { code: "SG15-08", title: "Retrato exterior natural", category: "retrato", src: "/images/sg15/sg15-08.webp", orientation: "vertical", priority: 17 },
  { code: "SG15-05", title: "Retrato lateral en jardín", category: "retrato", src: "/images/sg15/sg15-05.webp", orientation: "vertical", priority: 18 },
  { code: "SG15-20", title: "Retrato serio en jardín", category: "retrato", src: "/images/sg15/sg15-20.webp", orientation: "vertical", priority: 19 },
  { code: "SG15-06", title: "Discurso con micrófono", category: "momento", src: "/images/sg15/sg15-06.webp", orientation: "vertical", priority: 20 },
  { code: "SG15-01", title: "Entrada en el camino", category: "momento", src: "/images/sg15/sg15-01.webp", orientation: "vertical", priority: 21 },
  { code: "SG15-02", title: "Vals detalle de manos", category: "vals", src: "/images/sg15/sg15-02.webp", orientation: "horizontal", priority: 22 },
  { code: "SG15-13", title: "Reina en trono dorado", category: "editorial", src: "/images/sg15/sg15-13.webp", orientation: "vertical", priority: 23 },
  { code: "SG15-19", title: "Vals mirada baja", category: "vals", src: "/images/sg15/sg15-19.webp", orientation: "vertical", priority: 24 }
];

export const portfolioHighlights = [
  {
    title: "Quinceaños & eventos",
    description: "Historias con emoción real: retratos, entrada, vals, brindis, detalles y decoración.",
    image: "/images/sg15/sg15-03.webp",
  },
  {
    title: "Decoración profesional",
    description: "Fotografías limpias para salones, mesas, entradas, pasteles y marcas de eventos.",
    image: "/images/sg15/sg15-24.webp",
  },
  {
    title: "Naturaleza & vida salvaje",
    description: "Una mirada documental y artística de Galápagos, fauna, paisaje y aventura.",
    image: "/images/brand/stiven-verdesoto.webp",
  },
];

export const services = [
  "Cobertura de eventos y quinceaños",
  "Fotografía de decoración para proveedores",
  "Galerías privadas para clientes",
  "Selección y edición profesional",
  "Retratos editoriales",
  "Fotografía de naturaleza y vida salvaje",
];
