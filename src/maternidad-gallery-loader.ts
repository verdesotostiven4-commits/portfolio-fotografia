import { galleryBucket, hasSupabaseConfig, publicObjectUrl } from "./supabase-client";

type MediaType = "image" | "video";

interface GalleryMediaItem {
  type: MediaType;
  previewPath: string;
  originalPath: string;
  name: string;
  alt?: string;
  width?: number;
  height?: number;
  duration?: number;
  position?: string;
}

interface GalleryManifest {
  title?: string;
  subtitle?: string;
  location?: string;
  year?: string;
  photographer?: string;
  brand?: string;
  instagram?: string;
  zipPath?: string;
  coverIndex?: number;
  media?: GalleryMediaItem[];
}

declare global {
  interface Window {
    BYSTIVEN_MATERNIDAD?: Record<string, unknown>;
  }
}

const manifestPath = "maternidad-playa/manifest.json";

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    document.body.appendChild(script);
  });
}

function fallbackGallery(): Record<string, unknown> {
  return {
    slug: "maternidad-playa",
    title: "Maternidad en la playa",
    subtitle: "Una historia de amor que está por comenzar.",
    location: "Galápagos",
    year: "2026",
    photographer: "Stiven Verdesoto",
    brand: "byStiven",
    instagram: "https://www.instagram.com/bystiven/",
    zipUrl: "",
    coverIndex: 0,
    photos: [],
  };
}

async function fetchManifest(): Promise<GalleryManifest | null> {
  if (!hasSupabaseConfig()) return null;
  const manifestUrl = publicObjectUrl(manifestPath);
  const response = await fetch(`${manifestUrl}?v=${Date.now()}`, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No se pudo leer el manifiesto (${response.status}).`);
  return (await response.json()) as GalleryManifest;
}

function mapManifest(manifest: GalleryManifest | null): Record<string, unknown> {
  const fallback = fallbackGallery();
  if (!manifest) return fallback;

  const photos = (manifest.media || [])
    .filter((item) => item.previewPath && item.originalPath)
    .map((item) => ({
      type: item.type || "image",
      preview: publicObjectUrl(item.previewPath),
      original: publicObjectUrl(item.originalPath),
      downloadUrl: publicObjectUrl(item.originalPath, item.name),
      name: item.name,
      alt: item.alt || manifest.title || fallback.title,
      width: item.width || 0,
      height: item.height || 0,
      duration: item.duration || 0,
      position: item.position || "50% 50%",
    }));

  return {
    ...fallback,
    ...manifest,
    coverIndex: Number.isFinite(Number(manifest.coverIndex)) ? Number(manifest.coverIndex) : 0,
    zipUrl: manifest.zipPath ? publicObjectUrl(manifest.zipPath, "MATERNIDAD-COMPLETA.zip") : "",
    photos,
    bucket: galleryBucket,
  };
}

async function start(): Promise<void> {
  try {
    const manifest = await fetchManifest();
    window.BYSTIVEN_MATERNIDAD = mapManifest(manifest);
  } catch (error) {
    console.error("No se pudo cargar la galería desde Supabase", error);
    window.BYSTIVEN_MATERNIDAD = fallbackGallery();
    window.BYSTIVEN_MATERNIDAD.connectionError = true;
  }

  await loadScript("/maternidad-playa.js?v=4");
}

void start();
