import { Zip, ZipPassThrough } from "fflate";
import { hasSupabaseConfig, publicObjectUrl } from "./supabase-client";

type MediaType = "image" | "video";
type MediaFit = "cover" | "contain";

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
  fit?: MediaFit;
  size?: number;
}

interface GalleryManifest {
  title?: string;
  subtitle?: string;
  location?: string;
  year?: string;
  photographer?: string;
  brand?: string;
  coverIndex?: number;
  media?: GalleryMediaItem[];
}

interface GalleryItem extends GalleryMediaItem {
  preview: string;
  original: string;
  downloadUrl: string;
  alt: string;
  position: string;
  fit: MediaFit;
  width: number;
  height: number;
  duration: number;
}

interface GalleryData {
  title: string;
  subtitle: string;
  location: string;
  year: string;
  photographer: string;
  brand: string;
  coverIndex: number;
  items: GalleryItem[];
}

const MANIFEST_PATH = "maternidad-playa/manifest.json";
const FALLBACK: GalleryData = {
  title: "Maternidad en la playa",
  subtitle: "Una historia de amor que está por comenzar.",
  location: "Galápagos",
  year: "2026",
  photographer: "Stiven Verdesoto",
  brand: "byStiven",
  coverIndex: 0,
  items: [],
};

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;",
  })[character] || character);
}

function icon(name: string): string {
  const icons: Record<string, string> = {
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 16V3m0 0 4.5 4.5M12 3 7.5 7.5"/><path d="M5 12v7h14v-7"/></svg>',
    down: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v14m0 0 6-6m-6 6-6-6"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18"/></svg>',
    left: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 5-7 7 7 7"/></svg>',
    right: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 20h14"/></svg>',
    volume: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 10v4h4l5 4V6L9 10H5Z"/><path d="M17 9c1 .8 1.5 1.8 1.5 3S18 14.2 17 15"/></svg>',
  };
  return icons[name] || "";
}

function formatDuration(seconds: number): string {
  const total = Math.max(0, Math.round(seconds || 0));
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
}

function setMeta(): void {
  document.documentElement.className = "client-gallery-page";
  const viewport = document.querySelector<HTMLMetaElement>('meta[name="viewport"]');
  if (viewport) viewport.content = "width=device-width,initial-scale=1,viewport-fit=cover";
  const theme = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (theme) theme.content = "#f6f2ed";
  let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
  if (!robots) {
    robots = document.createElement("meta");
    robots.name = "robots";
    document.head.appendChild(robots);
  }
  robots.content = "noindex, nofollow, noarchive";
}

async function fetchManifest(): Promise<GalleryManifest | null> {
  if (!hasSupabaseConfig()) return null;
  const response = await fetch(`${publicObjectUrl(MANIFEST_PATH)}?v=${Date.now()}`, { cache: "no-store", headers: { Accept: "application/json" } });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(`No se pudo abrir la entrega (${response.status}).`);
  return (await response.json()) as GalleryManifest;
}

function mapManifest(manifest: GalleryManifest | null): GalleryData {
  if (!manifest) return FALLBACK;
  const items = (manifest.media || []).filter((item) => item.previewPath && item.originalPath).map<GalleryItem>((item, index) => ({
    ...item,
    type: item.type === "video" ? "video" : "image",
    preview: publicObjectUrl(item.previewPath),
    original: publicObjectUrl(item.originalPath),
    downloadUrl: publicObjectUrl(item.originalPath, item.name || `MATERNIDAD-${index + 1}.jpg`),
    name: item.name || `MATERNIDAD-${String(index + 1).padStart(3, "0")}.jpg`,
    alt: item.alt || manifest.title || FALLBACK.title,
    width: Number(item.width) || 0,
    height: Number(item.height) || 0,
    duration: Number(item.duration) || 0,
    position: item.position || "50% 50%",
    fit: item.fit === "contain" ? "contain" : "cover",
  }));
  return {
    title: manifest.title || FALLBACK.title,
    subtitle: manifest.subtitle || FALLBACK.subtitle,
    location: manifest.location || FALLBACK.location,
    year: manifest.year || FALLBACK.year,
    photographer: manifest.photographer || FALLBACK.photographer,
    brand: manifest.brand || FALLBACK.brand,
    coverIndex: Math.max(0, Math.min(items.length - 1, Number(manifest.coverIndex) || 0)),
    items,
  };
}

function installStyles(): void {
  const style = document.createElement("style");
  style.textContent = `
    :root{--g-bg:#f6f2ed;--g-ink:#171512;--g-muted:#777068;--g-line:rgba(23,21,18,.1);--g-accent:#ad7b4c;--g-dark:#11100e;--g-safe-top:max(12px,env(safe-area-inset-top));--g-safe-bottom:max(14px,env(safe-area-inset-bottom))}
    html.client-gallery-page,html.client-gallery-page body{width:100%;min-height:100%;margin:0;background:var(--g-bg);color:var(--g-ink);overflow-x:hidden;overflow-y:auto;scroll-behavior:smooth;touch-action:pan-y;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}html.client-gallery-page body.isLocked{overflow:hidden;touch-action:none}#root,#root *{box-sizing:border-box}button,a{-webkit-tap-highlight-color:transparent}
    .gApp{min-height:100svh}.gHeader{position:fixed;z-index:80;inset:0 0 auto;display:flex;align-items:center;justify-content:space-between;padding:var(--g-safe-top) 18px 11px;color:#fff;border-bottom:1px solid transparent;transition:.25s;pointer-events:none}.gHeader.scrolled{background:rgba(246,242,237,.9);color:var(--g-ink);border-color:var(--g-line);box-shadow:0 10px 34px rgba(35,28,21,.06);backdrop-filter:blur(22px)}.gBrand,.gShare{pointer-events:auto}.gBrand{color:inherit;text-decoration:none;font-size:23px;font-weight:950;letter-spacing:-.065em}.gBrand span{color:#dfa66f}.gHeader.scrolled .gBrand span{color:var(--g-accent)}.gShare{width:44px;height:44px;border:1px solid rgba(255,255,255,.24);border-radius:50%;background:rgba(0,0,0,.15);color:#fff;display:grid;place-items:center;cursor:pointer;backdrop-filter:blur(14px)}.gShare svg{width:19px;height:19px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}.gHeader.scrolled .gShare{background:#fff;border-color:var(--g-line);color:var(--g-ink)}
    .gHero{padding:8px 8px 0}.gHeroCard{position:relative;height:min(72svh,690px);min-height:520px;overflow:hidden;border-radius:30px;background:#8e7661;box-shadow:0 22px 70px rgba(43,33,24,.16)}.gHeroImage{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.gHeroShade{position:absolute;inset:0;background:linear-gradient(180deg,rgba(0,0,0,.16),transparent 39%,rgba(0,0,0,.12) 60%,rgba(0,0,0,.84))}.gHeroContent{position:absolute;z-index:2;left:24px;right:24px;bottom:25px;color:#fff}.gHeroMeta{margin:0 0 12px;color:rgba(255,255,255,.7);font-size:11px;font-weight:850;letter-spacing:.15em;text-transform:uppercase}.gHero h1{max-width:12ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(42px,11.5vw,66px);font-weight:400;line-height:.94;letter-spacing:-.05em}.gHeroText{max-width:34ch;margin:13px 0 0;color:rgba(255,255,255,.8);font-size:14px;line-height:1.55}.gHeroLink{display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:20px;padding-top:16px;border-top:1px solid rgba(255,255,255,.2);color:#fff;text-decoration:none}.gHeroLink strong{font-size:13px}.gHeroLink small{display:block;margin-top:3px;color:rgba(255,255,255,.58);font-size:10px}.gHeroIcon{width:42px;height:42px;flex:0 0 auto;border-radius:50%;background:#fff;color:#171512;display:grid;place-items:center}.gHeroIcon svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:1.9}
    .gSummary{display:flex;gap:17px;overflow-x:auto;padding:20px 18px 23px;border-bottom:1px solid var(--g-line);scrollbar-width:none}.gSummaryItem{flex:0 0 auto;color:var(--g-muted);font-size:12px}.gSummaryItem strong{color:var(--g-ink);font-weight:850}.gSummaryItem:before{content:"";display:inline-block;width:4px;height:4px;margin:0 8px 2px 0;border-radius:50%;background:var(--g-accent)}
    .gHighlights{overflow:hidden;padding:38px 0 10px}.gSectionLabel{margin:0 18px 15px;color:var(--g-accent);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.gMarquee{display:flex;width:max-content;gap:10px;animation:gMarquee 42s linear infinite}.gHighlight{position:relative;width:132px;height:178px;flex:0 0 auto;padding:0;border:0;border-radius:18px;overflow:hidden;background:#ddd4ca;cursor:pointer}.gHighlight.landscape{width:220px}.gHighlight img{width:100%;height:100%;display:block;object-fit:cover}@keyframes gMarquee{to{transform:translateX(calc(-50% - 5px))}}
    .gGallerySection{scroll-margin-top:68px}.gGalleryHead{display:flex;align-items:end;justify-content:space-between;gap:14px;padding:44px 18px 18px}.gGalleryHead p{margin:0 0 7px;color:var(--g-accent);font-size:10px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.gGalleryHead h2{margin:0;font-family:Georgia,"Times New Roman",serif;font-size:37px;font-weight:400;line-height:1;letter-spacing:-.04em}.gDownloadAll{min-height:42px;padding:0 14px;border:1px solid var(--g-line);border-radius:999px;background:#fff;color:var(--g-ink);font-size:11px;font-weight:850;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;cursor:pointer}.gDownloadAll svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.9}
    .gGrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:dense;gap:8px;padding:0 8px 40px}.gCard{position:relative;min-width:0;aspect-ratio:4/5;border:0;border-radius:15px;overflow:hidden;padding:0;background:#ded6cc;cursor:zoom-in}.gCard.wide{grid-column:1/-1;aspect-ratio:4/3}.gCard.landscape{aspect-ratio:4/3}.gCard.contain{background:#e8e1d8}.gCard img{width:100%;height:100%;display:block;object-fit:cover;opacity:0;transform:scale(1.018);transition:opacity .35s,transform .55s}.gCard.contain img{object-fit:contain}.gCard.loaded img{opacity:1;transform:scale(1)}
    .gVideoCard{grid-column:1/-1;position:relative;aspect-ratio:16/10;overflow:hidden;border-radius:24px;background:#090909;cursor:pointer}.gVideoCard video{width:100%;height:100%;display:block;object-fit:cover}.gVideoShade{position:absolute;inset:0;background:linear-gradient(180deg,transparent 45%,rgba(0,0,0,.6));pointer-events:none}.gVideoCaption{position:absolute;z-index:2;left:18px;right:18px;bottom:17px;display:flex;align-items:end;justify-content:space-between;gap:12px;color:#fff}.gVideoCaption p{margin:0 0 5px;color:rgba(255,255,255,.67);font-size:10px;font-weight:850;letter-spacing:.13em;text-transform:uppercase}.gVideoCaption strong{font-family:Georgia,serif;font-size:25px;font-weight:400}.gSound{height:41px;padding:0 13px;border:1px solid rgba(255,255,255,.2);border-radius:999px;background:rgba(0,0,0,.35);color:#fff;display:inline-flex;align-items:center;gap:7px;font-size:10px;font-weight:850;backdrop-filter:blur(12px);cursor:pointer}.gSound svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:1.8}
    .gFooter{padding:58px 24px calc(38px + env(safe-area-inset-bottom));text-align:center;border-top:1px solid var(--g-line)}.gFooterBrand{font-size:26px;font-weight:950;letter-spacing:-.065em}.gFooterBrand span{color:var(--g-accent)}.gFooter p{max-width:34ch;margin:11px auto 0;color:var(--g-muted);font-size:12px;line-height:1.65}
    .gViewer{position:fixed;z-index:220;inset:0;display:flex;flex-direction:column;background:#050505;color:#fff}.gViewer[hidden]{display:none}.gViewerTop{height:max(64px,calc(48px + env(safe-area-inset-top)));padding:max(10px,env(safe-area-inset-top)) 12px 8px;display:grid;grid-template-columns:1fr auto 1fr;align-items:center;gap:10px}.gViewerTop>div:last-child{display:flex;justify-content:flex-end}.gViewerButton,.gViewerNav{height:42px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(255,255,255,.08);color:#fff;display:inline-flex;align-items:center;justify-content:center;gap:7px;font-weight:850;cursor:pointer}.gViewerButton{padding:0 14px}.gViewerButton svg,.gViewerNav svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9}.gViewerCount{color:rgba(255,255,255,.66);font-size:11px;font-weight:850}.gStage{position:relative;flex:1;min-height:0;display:grid;place-items:center}.gStage img,.gStage video{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain}.gStage video{width:100%;height:100%}.gLoader{position:absolute;width:28px;height:28px;border:2px solid rgba(255,255,255,.18);border-top-color:#fff;border-radius:50%;animation:gSpin .75s linear infinite}@keyframes gSpin{to{transform:rotate(360deg)}}.gViewerBottom{padding:8px 12px var(--g-safe-bottom)}.gControls{display:grid;grid-template-columns:44px 1fr 44px;gap:8px}.gViewerNav{width:44px}.gViewerDownload{height:48px;border:0;border-radius:15px;background:#fff;color:#171512;display:flex;align-items:center;justify-content:center;gap:8px;font-weight:900;cursor:pointer}.gViewerDownload svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.9}.gFilmstrip{display:flex;gap:7px;overflow-x:auto;margin-top:8px;scrollbar-width:none}.gThumb{width:46px;height:58px;flex:0 0 auto;padding:0;border:2px solid transparent;border-radius:9px;overflow:hidden;background:#222;opacity:.48;cursor:pointer}.gThumb.active{border-color:#fff;opacity:1}.gThumb img{width:100%;height:100%;display:block;object-fit:cover}
    .gProgress{position:fixed;z-index:300;inset:0;display:grid;place-items:center;padding:22px;background:rgba(0,0,0,.72);backdrop-filter:blur(12px)}.gProgress[hidden]{display:none}.gProgressCard{width:min(390px,100%);padding:26px;border-radius:26px;background:#fff;color:var(--g-ink);text-align:center}.gProgressIcon{width:53px;height:53px;margin:auto;border-radius:18px;background:var(--g-dark);color:#fff;display:grid;place-items:center}.gProgressIcon svg{width:21px;height:21px;fill:none;stroke:currentColor;stroke-width:1.9}.gProgress h3{margin:18px 0 7px;font-family:Georgia,serif;font-size:29px;font-weight:400}.gProgress p{margin:0;color:var(--g-muted);font-size:13px}.gProgressTrack{height:7px;margin-top:18px;border-radius:999px;background:#eee8e1;overflow:hidden}.gProgressFill{height:100%;width:0;background:var(--g-dark);transition:width .2s}.gToast{position:fixed;z-index:330;left:50%;bottom:28px;transform:translate(-50%,18px);opacity:0;padding:11px 15px;border-radius:999px;background:#171512;color:#fff;font-size:11px;font-weight:850;transition:.2s;pointer-events:none}.gToast.show{opacity:1;transform:translate(-50%,0)}
    @media(min-width:760px){.gHeader{padding-left:5vw;padding-right:5vw}.gHero{padding:14px 3vw 0}.gHeroCard{height:min(78vh,790px)}.gHeroContent{left:5vw;bottom:52px}.gHighlight{width:175px;height:225px}.gHighlight.landscape{width:300px}.gGalleryHead{padding:70px 5vw 24px}.gGrid{grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;padding:0 4vw 70px}.gCard.wide{grid-column:span 2;grid-row:span 2;aspect-ratio:auto}.gVideoCard{grid-column:1/-1;aspect-ratio:21/9}.gViewerBottom{max-width:760px;width:100%;margin:auto}.gStage{padding:10px 4vw}}
    @media(prefers-reduced-motion:reduce){.gMarquee{animation:none}.gCard img{transition:none}}
  `;
  document.head.appendChild(style);
}

function buildDisplayOrder(items: GalleryItem[]): number[] {
  const images: number[] = [];
  const videos: number[] = [];
  items.forEach((item, index) => (item.type === "video" ? videos : images).push(index));
  if (!videos.length) return images;
  const midpoint = Math.ceil(images.length / 2);
  return [...images.slice(0, midpoint), videos[0], ...images.slice(midpoint), ...videos.slice(1)];
}

function renderCard(item: GalleryItem, index: number, displayIndex: number): string {
  if (item.type === "video") return `<article class="gVideoCard" data-video-card="${index}"><video muted loop playsinline preload="none" poster="${escapeHtml(item.preview)}" data-inline-video="${index}"></video><div class="gVideoShade"></div><div class="gVideoCaption"><div><p>Nuestra película</p><strong>${formatDuration(item.duration)}</strong></div><button class="gSound" type="button" data-sound="${index}">${icon("volume")}<span>Activar sonido</span></button></div></article>`;
  const landscape = item.width > item.height;
  const wide = displayIndex === 0 || displayIndex % 8 === 0 || (landscape && displayIndex % 5 === 0);
  return `<button class="gCard ${landscape ? "landscape" : ""} ${wide ? "wide" : ""} ${item.fit === "contain" ? "contain" : ""}" type="button" data-open="${index}"><img loading="${displayIndex < 5 ? "eager" : "lazy"}" decoding="async" src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.alt)}" style="object-position:${escapeHtml(item.position)}"></button>`;
}

function renderGallery(data: GalleryData): void {
  const root = document.getElementById("root");
  if (!root) return;
  const cover = data.items[data.coverIndex] || data.items.find((item) => item.type === "image");
  const imageCount = data.items.filter((item) => item.type === "image").length;
  const videoCount = data.items.filter((item) => item.type === "video").length;
  const highlights = data.items.map((item, index) => ({ item, index })).filter(({ item }) => item.type === "image").slice(0, 10);
  const highlightLoop = [...highlights, ...highlights];
  const order = buildDisplayOrder(data.items);
  root.innerHTML = `<main class="gApp" id="galleryApp"><header class="gHeader" id="galleryHeader"><a class="gBrand" href="#inicio"><span>by</span>Stiven</a><button class="gShare" id="shareTop" type="button">${icon("share")}</button></header><section class="gHero" id="inicio"><div class="gHeroCard">${cover ? `<img class="gHeroImage" src="${escapeHtml(cover.preview)}" alt="${escapeHtml(data.title)}" fetchpriority="high" style="object-position:${escapeHtml(cover.position)}">` : ""}<div class="gHeroShade"></div><div class="gHeroContent"><p class="gHeroMeta">${escapeHtml(data.location)} · ${escapeHtml(data.year)}</p><h1>${escapeHtml(data.title)}</h1><p class="gHeroText">${escapeHtml(data.subtitle)}</p><a class="gHeroLink" href="#fotografias"><span><strong>Descubrir la sesión</strong><small>${imageCount} fotografías${videoCount ? ` · ${videoCount} video${videoCount > 1 ? "s" : ""}` : ""}</small></span><span class="gHeroIcon">${icon("down")}</span></a></div></div></section><div class="gSummary"><span class="gSummaryItem"><strong>${imageCount}</strong> fotografías</span>${videoCount ? `<span class="gSummaryItem"><strong>${videoCount}</strong> video${videoCount > 1 ? "s" : ""}</span>` : ""}<span class="gSummaryItem">Descargas disponibles</span></div>${highlights.length > 3 ? `<section class="gHighlights"><p class="gSectionLabel">Momentos destacados</p><div class="gMarquee">${highlightLoop.map(({ item, index }) => `<button class="gHighlight ${item.width > item.height ? "landscape" : ""}" type="button" data-open="${index}"><img loading="lazy" src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.alt)}" style="object-position:${escapeHtml(item.position)}"></button>`).join("")}</div></section>` : ""}<section class="gGallerySection" id="fotografias"><div class="gGalleryHead"><div><p>La sesión</p><h2>Sus recuerdos</h2></div>${data.items.length ? `<button class="gDownloadAll" id="downloadAll" type="button">${icon("download")}<span>Descargar sesión</span></button>` : ""}</div><div class="gGrid">${order.map((index, displayIndex) => renderCard(data.items[index], index, displayIndex)).join("")}</div></section><footer class="gFooter"><div class="gFooterBrand"><span>by</span>Stiven</div><p>Fotografía por ${escapeHtml(data.photographer)}. Preparado con cuidado para conservar esta historia.</p></footer><div class="gViewer" id="viewer" hidden><div class="gViewerTop"><div><button class="gViewerButton" id="closeViewer" type="button">${icon("close")}<span>Cerrar</span></button></div><span class="gViewerCount" id="viewerCount"></span><div><button class="gViewerButton" id="viewerShare" type="button">${icon("share")}</button></div></div><div class="gStage" id="viewerStage"><div class="gLoader" id="viewerLoader"></div><img id="viewerImage" alt="" hidden><video id="viewerVideo" controls playsinline preload="metadata" hidden></video></div><div class="gViewerBottom"><div class="gControls"><button class="gViewerNav" id="prevMedia" type="button">${icon("left")}</button><button class="gViewerDownload" id="downloadCurrent" type="button">${icon("download")}<span>Descargar</span></button><button class="gViewerNav" id="nextMedia" type="button">${icon("right")}</button></div><div class="gFilmstrip" id="filmstrip">${data.items.map((item, index) => `<button class="gThumb" type="button" data-thumb="${index}"><img loading="lazy" src="${escapeHtml(item.preview)}" alt=""></button>`).join("")}</div></div></div><div class="gProgress" id="downloadProgress" hidden><div class="gProgressCard"><div class="gProgressIcon">${icon("download")}</div><h3>Preparando la sesión</h3><p id="downloadProgressText">Reuniendo los archivos…</p><div class="gProgressTrack"><div class="gProgressFill" id="downloadProgressFill"></div></div></div></div><div class="gToast" id="toast"></div></main>`;
  bindGallery(data);
}

function bindGallery(data: GalleryData): void {
  const app = document.getElementById("galleryApp") as HTMLElement;
  const header = document.getElementById("galleryHeader") as HTMLElement;
  const viewer = document.getElementById("viewer") as HTMLElement;
  const image = document.getElementById("viewerImage") as HTMLImageElement;
  const video = document.getElementById("viewerVideo") as HTMLVideoElement;
  const loader = document.getElementById("viewerLoader") as HTMLElement;
  const count = document.getElementById("viewerCount") as HTMLElement;
  const filmstrip = document.getElementById("filmstrip") as HTMLElement;
  let current = 0, savedScroll = 0, startX = 0, startY = 0;
  const updateHeader = () => header.classList.toggle("scrolled", window.scrollY > 38);
  updateHeader(); window.addEventListener("scroll", updateHeader, { passive: true });
  app.querySelectorAll<HTMLImageElement>(".gCard img").forEach((photo) => { const reveal = () => photo.parentElement?.classList.add("loaded"); if (photo.complete) reveal(); else photo.addEventListener("load", reveal, { once: true }); });
  const lock = () => { savedScroll = window.scrollY; document.body.classList.add("isLocked"); document.body.style.position = "fixed"; document.body.style.top = `-${savedScroll}px`; document.body.style.left = "0"; document.body.style.right = "0"; };
  const unlock = () => { document.body.classList.remove("isLocked"); document.body.style.position = ""; document.body.style.top = ""; document.body.style.left = ""; document.body.style.right = ""; window.scrollTo(0, savedScroll); };
  const updateFilmstrip = () => { filmstrip.querySelectorAll<HTMLElement>("[data-thumb]").forEach((thumb) => thumb.classList.toggle("active", Number(thumb.dataset.thumb) === current)); filmstrip.querySelector<HTMLElement>(`[data-thumb="${current}"]`)?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); };
  const updateViewer = (index: number) => {
    current = (index + data.items.length) % data.items.length;
    const item = data.items[current]; count.textContent = `${String(current + 1).padStart(2, "0")} / ${String(data.items.length).padStart(2, "0")}`; loader.hidden = false; image.hidden = true; image.removeAttribute("src"); video.pause(); video.hidden = true; video.removeAttribute("src"); video.removeAttribute("poster");
    if (item.type === "video") { video.poster = item.preview; video.src = item.original; video.hidden = false; video.muted = false; video.onloadedmetadata = () => { loader.hidden = true; void video.play().catch(() => undefined); }; video.onerror = () => { loader.hidden = true; }; video.load(); }
    else { const temp = new Image(); temp.onload = () => { image.src = item.preview; image.alt = item.alt; image.hidden = false; loader.hidden = true; }; temp.onerror = () => { image.src = item.preview; image.hidden = false; loader.hidden = true; }; temp.src = item.preview; }
    updateFilmstrip();
  };
  const openViewer = (index: number) => { if (!data.items.length) return; viewer.hidden = false; lock(); updateViewer(index); };
  const closeViewer = () => { viewer.hidden = true; image.removeAttribute("src"); video.pause(); video.removeAttribute("src"); video.load(); unlock(); };
  const share = async () => { try { if (navigator.share) await navigator.share({ title: data.title, text: data.subtitle, url: location.href }); else { await navigator.clipboard.writeText(location.href); toast("Enlace copiado"); } } catch { /* cancel */ } };
  const downloadItem = async (item: GalleryItem) => { try { const response = await fetch(item.original); if (!response.ok) throw new Error(); triggerDownload(URL.createObjectURL(await response.blob()), item.name, true); } catch { triggerDownload(item.downloadUrl, item.name, false); } };
  app.addEventListener("click", (event) => { const open = (event.target as HTMLElement).closest<HTMLElement>("[data-open]"); if (open) openViewer(Number(open.dataset.open)); });
  document.getElementById("shareTop")?.addEventListener("click", share); document.getElementById("viewerShare")?.addEventListener("click", share); document.getElementById("closeViewer")?.addEventListener("click", closeViewer); document.getElementById("prevMedia")?.addEventListener("click", () => updateViewer(current - 1)); document.getElementById("nextMedia")?.addEventListener("click", () => updateViewer(current + 1)); document.getElementById("downloadCurrent")?.addEventListener("click", () => void downloadItem(data.items[current])); document.getElementById("downloadAll")?.addEventListener("click", () => void downloadAll(data.items));
  filmstrip.addEventListener("click", (event) => { const thumb = (event.target as HTMLElement).closest<HTMLElement>("[data-thumb]"); if (thumb) updateViewer(Number(thumb.dataset.thumb)); });
  const stage = document.getElementById("viewerStage") as HTMLElement; stage.addEventListener("touchstart", (event) => { startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, { passive: true }); stage.addEventListener("touchend", (event) => { const dx = event.changedTouches[0].clientX - startX, dy = event.changedTouches[0].clientY - startY; if (Math.abs(dx) > 52 && Math.abs(dx) > Math.abs(dy) * 1.2) updateViewer(current + (dx < 0 ? 1 : -1)); }, { passive: true });
  setupInlineVideos(data, openViewer);
}

function setupInlineVideos(data: GalleryData, openViewer: (index: number) => void): void {
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { const video = entry.target as HTMLVideoElement; const item = data.items[Number(video.dataset.inlineVideo)]; if (!item) return; if (entry.isIntersecting && entry.intersectionRatio > .45) { if (!video.src) { video.src = item.original; video.load(); } void video.play().catch(() => undefined); } else video.pause(); }), { threshold: [0, .45, .75] });
  document.querySelectorAll<HTMLVideoElement>("[data-inline-video]").forEach((video) => observer.observe(video));
  document.querySelectorAll<HTMLButtonElement>("[data-sound]").forEach((button) => button.addEventListener("click", (event) => { event.stopPropagation(); const index = Number(button.dataset.sound); const video = document.querySelector<HTMLVideoElement>(`[data-inline-video="${index}"]`); if (!video) return; video.muted = !video.muted; button.querySelector("span")!.textContent = video.muted ? "Activar sonido" : "Silenciar"; if (!video.src) video.src = data.items[index].original; void video.play().catch(() => undefined); }));
  document.querySelectorAll<HTMLElement>("[data-video-card]").forEach((card) => card.addEventListener("click", (event) => { if ((event.target as HTMLElement).closest("[data-sound]")) return; openViewer(Number(card.dataset.videoCard)); }));
}

async function downloadAll(items: GalleryItem[]): Promise<void> {
  if (!items.length) return;
  const overlay = document.getElementById("downloadProgress") as HTMLElement, text = document.getElementById("downloadProgressText") as HTMLElement, fill = document.getElementById("downloadProgressFill") as HTMLElement;
  overlay.hidden = false;
  const chunks: Uint8Array[] = [];
  let resolveZip!: () => void, rejectZip!: (error: Error) => void;
  const completed = new Promise<void>((resolve, reject) => { resolveZip = resolve; rejectZip = reject; });
  const zip = new Zip((error, data, final) => { if (error) { rejectZip(error); return; } chunks.push(data); if (final) resolveZip(); });
  try {
    for (let index = 0; index < items.length; index += 1) {
      const item = items[index]; text.textContent = `Preparando ${index + 1} de ${items.length}`; fill.style.width = `${Math.round(index / items.length * 92)}%`;
      const response = await fetch(item.original); if (!response.ok) throw new Error();
      const file = new ZipPassThrough(item.name); zip.add(file);
      if (response.body) { const reader = response.body.getReader(); while (true) { const part = await reader.read(); if (part.done) break; file.push(part.value, false); } file.push(new Uint8Array(0), true); }
      else file.push(new Uint8Array(await response.arrayBuffer()), true);
    }
    zip.end(); await completed; fill.style.width = "100%"; triggerDownload(URL.createObjectURL(new Blob(chunks, { type: "application/zip" })), "MATERNIDAD-COMPLETA.zip", true);
  } catch { toast("No se pudo preparar la sesión completa"); }
  finally { setTimeout(() => { overlay.hidden = true; fill.style.width = "0"; }, 600); }
}

function triggerDownload(url: string, name: string, revoke: boolean): void { const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.target = "_blank"; anchor.rel = "noopener"; document.body.appendChild(anchor); anchor.click(); anchor.remove(); if (revoke) setTimeout(() => URL.revokeObjectURL(url), 2000); }
function toast(message: string): void { const element = document.getElementById("toast"); if (!element) return; element.textContent = message; element.classList.add("show"); setTimeout(() => element.classList.remove("show"), 2200); }

async function start(): Promise<void> {
  setMeta(); installStyles();
  try { const data = mapManifest(await fetchManifest()); document.title = `${data.title} · ${data.brand}`; renderGallery(data); }
  catch { renderGallery(FALLBACK); }
}

void start();
