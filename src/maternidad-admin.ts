import * as tus from "tus-js-client";
import {
  galleryBucket,
  getProjectId,
  getSupabase,
  hasSupabaseConfig,
  publicObjectUrl,
  supabasePublishableKey,
} from "./supabase-client";

type MediaKind = "image" | "video";
type CoverFocus = "top" | "center" | "bottom";

interface PreparedPreview {
  blob: Blob;
  width: number;
  height: number;
  duration?: number;
}

interface ManifestMediaItem {
  type: MediaKind;
  previewPath: string;
  originalPath: string;
  name: string;
  alt: string;
  width: number;
  height: number;
  duration?: number;
  position: string;
}

interface GalleryManifest {
  version?: string;
  updatedAt?: string;
  title?: string;
  subtitle?: string;
  location?: string;
  year?: string;
  photographer?: string;
  brand?: string;
  instagram?: string;
  coverIndex?: number;
  media?: ManifestMediaItem[];
}

interface UploadProgress {
  label: string;
  percent: number;
}

const MAX_STANDARD_UPLOAD = 6 * 1024 * 1024;
const MANIFEST_PATH = "maternidad-playa/manifest.json";
const GALLERY_PATH = "/galerias/maternidad-playa";
const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];

let selectedFiles: File[] = [];
let selectedCoverFile: File | null = null;
let coverFocus: CoverFocus = "center";
let currentManifest: GalleryManifest | null = null;
let previewUrls = new Map<File, string>();
let publishing = false;

function element<T extends Element>(selector: string, parent: ParentNode = document): T {
  const found = parent.querySelector<T>(selector);
  if (!found) throw new Error(`No se encontró ${selector}`);
  return found;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  })[character] || character);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(bytes > 100 * 1024 * 1024 ? 0 : 1)} MB`;
}

function fileKind(file: File): MediaKind {
  return file.type.startsWith("video/") ? "video" : "image";
}

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop()?.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (fromName) return fromName === "jpeg" ? "jpg" : fromName;
  if (file.type === "video/mp4") return "mp4";
  if (file.type === "video/webm") return "webm";
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  return "jpg";
}

function professionalNames(files: File[]): Map<File, string> {
  let imageIndex = 0;
  let videoIndex = 0;
  const names = new Map<File, string>();

  files.forEach((file) => {
    const extension = extensionFor(file);
    if (fileKind(file) === "video") {
      videoIndex += 1;
      names.set(file, `MATERNIDAD-VIDEO-${String(videoIndex).padStart(3, "0")}.${extension}`);
    } else {
      imageIndex += 1;
      names.set(file, `MATERNIDAD-${String(imageIndex).padStart(3, "0")}.${extension}`);
    }
  });

  return names;
}

function focusPosition(value: CoverFocus): string {
  if (value === "top") return "50% 28%";
  if (value === "bottom") return "50% 72%";
  return "50% 50%";
}

function focusFromPosition(value = ""): CoverFocus {
  const match = value.match(/50%\s+(\d+)%/);
  const vertical = match ? Number(match[1]) : 50;
  if (vertical < 42) return "top";
  if (vertical > 58) return "bottom";
  return "center";
}

function installShell(): void {
  document.title = "Publicar maternidad · byStiven";
  document.documentElement.className = "maternity-admin-page";
  const root = document.getElementById("root");
  if (!root) return;

  const style = document.createElement("style");
  style.textContent = `
    :root{--a-bg:#f3f0ea;--a-card:#fff;--a-text:#191714;--a-muted:#716b64;--a-line:rgba(25,23,20,.11);--a-dark:#171512;--a-accent:#ad7c4c;--a-good:#236d48;--a-danger:#a13f3f}
    html.maternity-admin-page,html.maternity-admin-page body{margin:0;min-height:100%;background:var(--a-bg);color:var(--a-text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
    #root,#root *{box-sizing:border-box}.adminApp{min-height:100svh;padding:18px 14px 70px}.adminWrap{width:min(980px,100%);margin:0 auto}.adminTop{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:7px 2px 20px}.adminBrand{font-size:25px;font-weight:950;letter-spacing:-.065em}.adminBrand span{color:var(--a-accent)}
    .adminGhost,.adminButton{border:0;border-radius:15px;min-height:46px;padding:0 17px;font-weight:850;cursor:pointer}.adminGhost{border:1px solid var(--a-line);background:rgba(255,255,255,.7);color:var(--a-text)}.adminButton{background:var(--a-dark);color:#fff}.adminButton:disabled{opacity:.45;cursor:not-allowed}.adminButton.secondary{background:#eee9e2;color:var(--a-text)}
    .adminHero{padding:29px 23px;border-radius:29px;background:linear-gradient(145deg,#211b17,#0f0e0c);color:#fff;box-shadow:0 24px 70px rgba(35,28,22,.18)}.adminEyebrow{margin:0 0 10px;color:#d7a873;font-size:11px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.adminHero h1{max-width:13ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,10vw,58px);font-weight:400;line-height:.96;letter-spacing:-.045em}.adminHero p{max-width:58ch;margin:16px 0 0;color:rgba(255,255,255,.68);font-size:14px;line-height:1.65}
    .adminCard{margin-top:14px;padding:21px;border:1px solid var(--a-line);border-radius:25px;background:var(--a-card);box-shadow:0 15px 48px rgba(45,35,25,.055)}.adminCard h2{margin:0;font-size:18px}.adminCardLead{margin:8px 0 0;color:var(--a-muted);font-size:13px;line-height:1.55}.adminCard[hidden]{display:none}
    .adminForm{display:grid;gap:12px;margin-top:19px}.adminField{display:grid;gap:7px}.adminField label{font-size:12px;font-weight:850}.adminField input,.adminField select{width:100%;height:50px;border:1px solid var(--a-line);border-radius:14px;padding:0 14px;background:#fbfaf8;color:var(--a-text);font:inherit;outline:none}.adminField input:focus,.adminField select:focus{border-color:rgba(173,124,76,.65);box-shadow:0 0 0 4px rgba(173,124,76,.1)}
    .adminActions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.adminNotice{margin-top:14px;padding:13px 14px;border-radius:14px;background:#f4eee7;color:#695b4e;font-size:12px;line-height:1.55}.adminNotice.error{background:#f8eaea;color:var(--a-danger)}.adminNotice.good{background:#e9f4ee;color:var(--a-good)}
    .dropZone{position:relative;margin-top:18px;padding:34px 18px;border:1.5px dashed rgba(25,23,20,.22);border-radius:22px;background:#faf8f5;text-align:center;transition:.2s}.dropZone.isDrag{border-color:var(--a-accent);background:#f4ece3;transform:scale(.995)}.dropZone input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.dropIcon{width:57px;height:57px;margin:0 auto 14px;border-radius:18px;background:var(--a-dark);color:#fff;display:grid;place-items:center;font-size:25px}.dropZone strong{display:block;font-size:16px}.dropZone span{display:block;margin-top:7px;color:var(--a-muted);font-size:12px;line-height:1.5}
    .coverTitle{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:20px}.coverTitle strong{font-size:13px}.coverTitle span{color:var(--a-muted);font-size:11px}.coverGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:12px;max-height:420px;overflow:auto;padding:1px}.coverChoice{position:relative;aspect-ratio:4/5;border:2px solid transparent;border-radius:16px;overflow:hidden;padding:0;background:#e8e1d9;cursor:pointer}.coverChoice img{width:100%;height:100%;display:block;object-fit:cover}.coverChoice.isSelected{border-color:var(--a-accent);box-shadow:0 0 0 4px rgba(173,124,76,.12)}.coverBadge{position:absolute;left:8px;bottom:8px;padding:7px 9px;border-radius:999px;background:rgba(0,0,0,.62);color:#fff;font-size:9px;font-weight:900;backdrop-filter:blur(8px)}
    .fileList{display:grid;gap:9px;margin-top:15px}.fileRow{display:grid;grid-template-columns:58px minmax(0,1fr) auto;align-items:center;gap:11px;padding:10px;border:1px solid var(--a-line);border-radius:17px;background:#fff}.fileThumb{width:58px;height:58px;border-radius:14px;overflow:hidden;background:#eee8e1;display:grid;place-items:center;font-size:10px;font-weight:950}.fileThumb img{width:100%;height:100%;display:block;object-fit:cover}.fileInfo{min-width:0}.fileInfo strong,.fileInfo span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fileInfo strong{font-size:13px}.fileInfo span{margin-top:4px;color:var(--a-muted);font-size:10px}.fileControls{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:5px;max-width:160px}.fileMini{height:32px;border:1px solid var(--a-line);border-radius:10px;background:#f7f4ef;color:var(--a-text);padding:0 9px;font-size:10px;font-weight:850;cursor:pointer}.fileMini.cover{background:#171512;color:#fff;border-color:#171512}.fileMini.danger{color:var(--a-danger)}
    .publishBar{position:sticky;z-index:20;bottom:12px;margin-top:14px;padding:8px;border:1px solid rgba(255,255,255,.1);border-radius:21px;background:rgba(23,21,18,.94);backdrop-filter:blur(18px);box-shadow:0 18px 55px rgba(0,0,0,.22)}.publishBar button{width:100%;height:52px;border:0;border-radius:15px;background:#fff;color:#171512;font-weight:950;cursor:pointer}.publishBar button:disabled{opacity:.45;cursor:not-allowed}
    .progressBox{display:none;margin-top:15px;padding:16px;border-radius:18px;background:#171512;color:#fff}.progressBox.show{display:block}.progressTop{display:flex;justify-content:space-between;gap:12px;font-size:12px;font-weight:800}.progressTrack{height:7px;margin-top:11px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden}.progressFill{height:100%;width:0;background:#fff;border-radius:inherit;transition:width .2s}.progressDetail{margin-top:9px;color:rgba(255,255,255,.62);font-size:10px}
    .successCard{text-align:center;padding:36px 21px}.successMark{width:60px;height:60px;margin:0 auto;border-radius:20px;background:var(--a-good);color:#fff;display:grid;place-items:center;font-size:25px;font-weight:900}.successCard h2{margin:18px 0 8px;font-family:Georgia,serif;font-size:31px;font-weight:400}.successCard p{margin:0;color:var(--a-muted);line-height:1.6}.successLink{display:flex;align-items:center;justify-content:center;min-height:51px;margin-top:21px;border-radius:15px;background:var(--a-dark);color:#fff;text-decoration:none;font-weight:900}
    @media(min-width:720px){.adminApp{padding:30px 24px 90px}.adminHero{padding:48px}.adminGrid{display:grid;grid-template-columns:.78fr 1.22fr;gap:14px;align-items:start}.adminGrid .adminCard{margin-top:14px}.publishBar{position:static}.adminForm.two{grid-template-columns:1fr 1fr}.coverGrid{grid-template-columns:repeat(5,minmax(0,1fr))}}
  `;
  document.head.appendChild(style);
  root.innerHTML = '<main class="adminApp"><div class="adminWrap"><header class="adminTop"><div class="adminBrand"><span>by</span>Stiven</div><a class="adminGhost" href="' + GALLERY_PATH + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;text-decoration:none">Ver galería</a></header><div id="adminContent"></div></div></main>';
}

function renderMissingConfig(): void {
  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Conexión pendiente</p><h1>Primero conecta Supabase.</h1><p>El panel necesita la URL y la llave pública del proyecto para subir los archivos.</p></section>';
}

function renderLogin(message = ""): void {
  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Panel privado</p><h1>Publica una sesión sin tocar código.</h1><p>Inicia sesión para administrar esta entrega.</p></section><section class="adminCard"><h2>Iniciar sesión</h2><form class="adminForm" id="loginForm"><div class="adminField"><label for="loginEmail">Correo</label><input id="loginEmail" type="email" autocomplete="email" required></div><div class="adminField"><label for="loginPassword">Contraseña</label><input id="loginPassword" type="password" autocomplete="current-password" required></div><button class="adminButton" id="loginButton" type="submit">Entrar al panel</button></form><div id="loginMessage" class="adminNotice' + (message ? " error" : "") + '"' + (message ? "" : " hidden") + '>' + escapeHtml(message) + '</div></section>';

  element<HTMLFormElement>("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = element<HTMLButtonElement>("#loginButton");
    button.disabled = true;
    button.textContent = "Ingresando…";
    const { error } = await getSupabase().auth.signInWithPassword({
      email: element<HTMLInputElement>("#loginEmail").value.trim(),
      password: element<HTMLInputElement>("#loginPassword").value,
    });
    if (error) {
      renderLogin(error.message === "Invalid login credentials" ? "Correo o contraseña incorrectos." : error.message);
      return;
    }
    renderDashboard();
  });
}

function renderDashboard(): void {
  clearLocalPreviews();
  selectedFiles = [];
  selectedCoverFile = null;
  coverFocus = "center";
  publishing = false;

  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Entrega de maternidad</p><h1>Sube, elige la portada y publica.</h1><p>El sistema prepara la galería rápida, conserva los originales y te permite escoger exactamente qué imagen verá primero el cliente.</p></section><section class="adminCard" id="currentGalleryCard" hidden><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div><h2>Cambiar la portada actual</h2><p class="adminCardLead">No necesitas volver a subir las 31 fotos. Elige una miniatura y guarda.</p></div><span id="currentGalleryStatus" class="adminNotice" style="margin:0">Cargando…</span></div><div class="coverGrid" id="currentCoverGrid"></div><div class="adminForm two"><div class="adminField"><label for="currentCoverFocus">Recorte de portada</label><select id="currentCoverFocus"><option value="top">Mostrar más arriba</option><option value="center" selected>Centrar imagen</option><option value="bottom">Mostrar más abajo</option></select></div><div class="adminField" style="align-content:end"><button class="adminButton" id="saveCurrentCover" type="button">Guardar portada</button></div></div></section><div class="adminGrid"><section class="adminCard"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div><h2>Información</h2><p class="adminCardLead">Estos textos aparecerán en la entrega.</p></div><button class="adminGhost" id="signOut" type="button">Salir</button></div><div class="adminForm two"><div class="adminField"><label for="galleryTitle">Título</label><input id="galleryTitle" value="Maternidad en la playa"></div><div class="adminField"><label for="galleryLocation">Lugar</label><input id="galleryLocation" value="Galápagos"></div><div class="adminField"><label for="galleryYear">Año</label><input id="galleryYear" value="2026"></div><div class="adminField"><label for="gallerySubtitle">Frase</label><input id="gallerySubtitle" value="Una historia de amor que está por comenzar."></div></div><div class="adminNotice">La nueva portada usa un diseño editorial adaptable: vertical en celular y amplio en computadora, sin que tengas que preparar dos imágenes.</div></section><section class="adminCard"><h2>Publicar una versión nueva</h2><p class="adminCardLead">Selecciona todos los JPG y MP4. Después elige la portada entre las fotografías.</p><div class="dropZone" id="dropZone"><input id="mediaInput" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"><div class="dropIcon">＋</div><strong>Toca o arrastra los archivos</strong><span>El orden puede cambiarse antes de publicar. Los originales no se comprimen.</span></div><div class="fileList" id="fileList"></div><div id="newCoverOptions" hidden><div class="coverTitle"><strong>Portada de esta versión</strong><span>Selecciona cualquier fotografía</span></div><div class="adminField" style="margin-top:10px"><label for="newCoverFocus">Recorte de portada</label><select id="newCoverFocus"><option value="top">Mostrar más arriba</option><option value="center" selected>Centrar imagen</option><option value="bottom">Mostrar más abajo</option></select></div></div><div class="progressBox" id="progressBox"><div class="progressTop"><span id="progressLabel">Preparando…</span><span id="progressPercent">0%</span></div><div class="progressTrack"><div class="progressFill" id="progressFill"></div></div><div class="progressDetail" id="progressDetail"></div></div><div class="publishBar"><button id="publishButton" type="button" disabled>Selecciona archivos para publicar</button></div></section></div>';

  const input = element<HTMLInputElement>("#mediaInput");
  const dropZone = element<HTMLElement>("#dropZone");
  input.addEventListener("change", () => addFiles(Array.from(input.files || [])));
  ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("isDrag"); }));
  ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("isDrag"); }));
  dropZone.addEventListener("drop", (event) => addFiles(Array.from(event.dataTransfer?.files || [])));
  element<HTMLButtonElement>("#publishButton").addEventListener("click", () => void publishGallery());
  element<HTMLButtonElement>("#signOut").addEventListener("click", async () => { await getSupabase().auth.signOut(); renderLogin(); });
  element<HTMLSelectElement>("#newCoverFocus").addEventListener("change", (event) => { coverFocus = (event.target as HTMLSelectElement).value as CoverFocus; });
  element<HTMLButtonElement>("#saveCurrentCover").addEventListener("click", () => void saveCurrentCover());
  refreshFileList();
  void loadCurrentManifest();
}

async function loadCurrentManifest(): Promise<void> {
  const card = element<HTMLElement>("#currentGalleryCard");
  const status = element<HTMLElement>("#currentGalleryStatus");
  try {
    const { data, error } = await getSupabase().storage.from(galleryBucket).download(MANIFEST_PATH);
    if (error) {
      card.hidden = true;
      return;
    }
    currentManifest = JSON.parse(await data.text()) as GalleryManifest;
    const media = currentManifest.media || [];
    if (!media.length) {
      card.hidden = true;
      return;
    }

    card.hidden = false;
    status.textContent = `${media.length} archivos publicados`;
    status.className = "adminNotice good";
    setInputValue("#galleryTitle", currentManifest.title);
    setInputValue("#gallerySubtitle", currentManifest.subtitle);
    setInputValue("#galleryLocation", currentManifest.location);
    setInputValue("#galleryYear", currentManifest.year);
    renderCurrentCoverGrid();
  } catch (error) {
    console.warn("No se pudo leer la entrega actual", error);
    card.hidden = true;
  }
}

function setInputValue(selector: string, value?: string): void {
  if (!value) return;
  element<HTMLInputElement>(selector).value = value;
}

function renderCurrentCoverGrid(): void {
  if (!currentManifest?.media?.length) return;
  const grid = element<HTMLElement>("#currentCoverGrid");
  const media = currentManifest.media;
  const selected = Math.max(0, Math.min(media.length - 1, Number(currentManifest.coverIndex) || 0));
  currentManifest.coverIndex = selected;
  const selectedItem = media[selected];
  element<HTMLSelectElement>("#currentCoverFocus").value = focusFromPosition(selectedItem?.position);

  grid.innerHTML = media.map((item, index) => {
    if (item.type === "video") return "";
    const active = index === selected ? " isSelected" : "";
    return '<button class="coverChoice' + active + '" type="button" data-current-cover="' + index + '" aria-label="Usar fotografía ' + (index + 1) + ' como portada"><img loading="lazy" src="' + escapeHtml(publicObjectUrl(item.previewPath)) + '" alt=""><span class="coverBadge">' + (active ? "Portada" : String(index + 1).padStart(2, "0")) + '</span></button>';
  }).join("");

  grid.querySelectorAll<HTMLButtonElement>("[data-current-cover]").forEach((button) => {
    button.addEventListener("click", () => {
      if (!currentManifest) return;
      currentManifest.coverIndex = Number(button.dataset.currentCover);
      renderCurrentCoverGrid();
    });
  });
}

async function saveCurrentCover(): Promise<void> {
  if (!currentManifest?.media?.length) return;
  const button = element<HTMLButtonElement>("#saveCurrentCover");
  const status = element<HTMLElement>("#currentGalleryStatus");
  const index = Math.max(0, Math.min(currentManifest.media.length - 1, Number(currentManifest.coverIndex) || 0));
  const focus = element<HTMLSelectElement>("#currentCoverFocus").value as CoverFocus;
  currentManifest.coverIndex = index;
  currentManifest.updatedAt = new Date().toISOString();
  currentManifest.media[index].position = focusPosition(focus);
  button.disabled = true;
  button.textContent = "Guardando…";

  try {
    await uploadManifest(currentManifest);
    status.textContent = "Portada guardada";
    status.className = "adminNotice good";
    window.setTimeout(() => window.open(GALLERY_PATH, "_blank", "noopener"), 250);
  } catch (error) {
    status.textContent = error instanceof Error ? error.message : "No se pudo guardar";
    status.className = "adminNotice error";
  } finally {
    button.disabled = false;
    button.textContent = "Guardar portada";
  }
}

function addFiles(files: File[]): void {
  const valid = files.filter((file) => acceptedTypes.includes(file.type));
  const rejected = files.filter((file) => !acceptedTypes.includes(file.type));
  const known = new Set(selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
  valid.forEach((file) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (!known.has(key)) selectedFiles.push(file);
  });
  if (!selectedCoverFile || !selectedFiles.includes(selectedCoverFile)) {
    selectedCoverFile = selectedFiles.find((file) => fileKind(file) === "image") || null;
  }
  if (rejected.length) alert("Algunos archivos no se agregaron. Para video usa MP4 o WebM; para fotos usa JPG, PNG o WebP.");
  refreshFileList();
}

function localPreview(file: File): string {
  const known = previewUrls.get(file);
  if (known) return known;
  const url = URL.createObjectURL(file);
  previewUrls.set(file, url);
  return url;
}

function clearLocalPreviews(): void {
  previewUrls.forEach((url) => URL.revokeObjectURL(url));
  previewUrls.clear();
}

function moveFile(index: number, direction: number): void {
  const target = index + direction;
  if (target < 0 || target >= selectedFiles.length) return;
  const copy = selectedFiles[index];
  selectedFiles[index] = selectedFiles[target];
  selectedFiles[target] = copy;
  refreshFileList();
}

function removeFile(index: number): void {
  const removed = selectedFiles[index];
  selectedFiles.splice(index, 1);
  const url = previewUrls.get(removed);
  if (url) URL.revokeObjectURL(url);
  previewUrls.delete(removed);
  if (selectedCoverFile === removed) selectedCoverFile = selectedFiles.find((file) => fileKind(file) === "image") || null;
  refreshFileList();
}

function refreshFileList(): void {
  const list = element<HTMLElement>("#fileList");
  const button = element<HTMLButtonElement>("#publishButton");
  const coverOptions = element<HTMLElement>("#newCoverOptions");
  const names = professionalNames(selectedFiles);

  list.innerHTML = selectedFiles.map((file, index) => {
    const kind = fileKind(file);
    const isCover = selectedCoverFile === file;
    const thumbnail = kind === "image"
      ? '<img src="' + escapeHtml(localPreview(file)) + '" alt="">'
      : "VIDEO";
    return '<div class="fileRow" data-file-index="' + index + '"><div class="fileThumb">' + thumbnail + '</div><div class="fileInfo"><strong>' + escapeHtml(names.get(file)) + '</strong><span>' + escapeHtml(file.name) + ' · ' + formatBytes(file.size) + '</span></div><div class="fileControls">' + (kind === "image" ? '<button class="fileMini' + (isCover ? " cover" : "") + '" data-cover="' + index + '" type="button">' + (isCover ? "Portada ✓" : "Usar portada") + '</button>' : "") + '<button class="fileMini" data-up="' + index + '" type="button">↑</button><button class="fileMini" data-down="' + index + '" type="button">↓</button><button class="fileMini danger" data-remove="' + index + '" type="button">Quitar</button></div></div>';
  }).join("");

  list.querySelectorAll<HTMLButtonElement>("[data-cover]").forEach((item) => item.addEventListener("click", () => {
    selectedCoverFile = selectedFiles[Number(item.dataset.cover)] || null;
    refreshFileList();
  }));
  list.querySelectorAll<HTMLButtonElement>("[data-up]").forEach((item) => item.addEventListener("click", () => moveFile(Number(item.dataset.up), -1)));
  list.querySelectorAll<HTMLButtonElement>("[data-down]").forEach((item) => item.addEventListener("click", () => moveFile(Number(item.dataset.down), 1)));
  list.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach((item) => item.addEventListener("click", () => removeFile(Number(item.dataset.remove))));

  coverOptions.hidden = !selectedFiles.some((file) => fileKind(file) === "image");
  button.disabled = !selectedFiles.length || !selectedCoverFile || publishing;
  if (publishing) button.textContent = "Publicando…";
  else if (!selectedFiles.length) button.textContent = "Selecciona archivos para publicar";
  else if (!selectedCoverFile) button.textContent = "Selecciona una fotografía de portada";
  else button.textContent = `Publicar ${selectedFiles.length} archivo${selectedFiles.length === 1 ? "" : "s"}`;
}

function setProgress(progress: UploadProgress, detail = ""): void {
  const box = element<HTMLElement>("#progressBox");
  box.classList.add("show");
  const percent = Math.max(0, Math.min(100, Math.round(progress.percent)));
  element<HTMLElement>("#progressLabel").textContent = progress.label;
  element<HTMLElement>("#progressPercent").textContent = `${percent}%`;
  element<HTMLElement>("#progressFill").style.width = `${percent}%`;
  element<HTMLElement>("#progressDetail").textContent = detail;
}

async function publishGallery(): Promise<void> {
  if (!selectedFiles.length || !selectedCoverFile || publishing) return;
  publishing = true;
  coverFocus = element<HTMLSelectElement>("#newCoverFocus").value as CoverFocus;
  refreshFileList();

  try {
    const version = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
    const names = professionalNames(selectedFiles);
    const manifestItems: ManifestMediaItem[] = [];
    const total = selectedFiles.length;

    for (let index = 0; index < total; index += 1) {
      const file = selectedFiles[index];
      const kind = fileKind(file);
      const name = names.get(file) || `MATERNIDAD-${String(index + 1).padStart(3, "0")}.${extensionFor(file)}`;
      const stem = name.replace(/\.[^.]+$/, "");
      const originalPath = `maternidad-playa/${version}/originales/${name}`;
      const previewPath = `maternidad-playa/${version}/${kind === "video" ? "portadas" : "previews"}/${stem}.jpg`;
      const basePercent = (index / total) * 92;
      const itemWeight = 92 / total;

      setProgress({ label: `Preparando ${name}`, percent: basePercent }, `${index + 1} de ${total}`);
      const prepared = kind === "video" ? await createVideoPoster(file) : await createImagePreview(file);
      await uploadSmallFile(previewPath, prepared.blob, "image/jpeg");
      await uploadOriginal(originalPath, file, (filePercent) => {
        setProgress({ label: `Subiendo ${name}`, percent: basePercent + itemWeight * (filePercent / 100) }, `${index + 1} de ${total} · original intacto`);
      });

      manifestItems.push({
        type: kind,
        previewPath,
        originalPath,
        name,
        alt: kind === "video" ? "Video de la sesión de maternidad" : "Fotografía de la sesión de maternidad",
        width: prepared.width,
        height: prepared.height,
        duration: prepared.duration,
        position: file === selectedCoverFile ? focusPosition(coverFocus) : "50% 50%",
      });
    }

    setProgress({ label: "Publicando la galería", percent: 96 }, "Creando el enlace para el cliente");
    const coverIndex = Math.max(0, selectedFiles.indexOf(selectedCoverFile));
    const manifest: GalleryManifest = {
      version,
      updatedAt: new Date().toISOString(),
      title: element<HTMLInputElement>("#galleryTitle").value.trim() || "Maternidad en la playa",
      subtitle: element<HTMLInputElement>("#gallerySubtitle").value.trim() || "Una historia de amor que está por comenzar.",
      location: element<HTMLInputElement>("#galleryLocation").value.trim() || "Galápagos",
      year: element<HTMLInputElement>("#galleryYear").value.trim() || String(new Date().getFullYear()),
      photographer: "Stiven Verdesoto",
      brand: "byStiven",
      instagram: "https://www.instagram.com/bystiven/",
      coverIndex,
      media: manifestItems,
    };

    await uploadManifest(manifest);
    setProgress({ label: "Galería publicada", percent: 100 }, "Ya puedes enviar el enlace");
    renderSuccess(selectedFiles.length);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "No se pudo publicar la galería.";
    alert(`No se pudo publicar: ${message}\n\nRevisa el bucket, las políticas SQL y la conexión.`);
    publishing = false;
    refreshFileList();
  }
}

async function uploadManifest(manifest: GalleryManifest): Promise<void> {
  const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
  const { error } = await getSupabase().storage.from(galleryBucket).upload(MANIFEST_PATH, manifestBlob, {
    contentType: "application/json",
    cacheControl: "0",
    upsert: true,
  });
  if (error) throw error;
}

function renderSuccess(count: number): void {
  clearLocalPreviews();
  const host = element<HTMLElement>("#adminContent");
  const galleryUrl = `${window.location.origin}${GALLERY_PATH}`;
  host.innerHTML = '<section class="adminCard successCard"><div class="successMark">✓</div><h2>Entrega publicada.</h2><p>' + count + ' archivo' + (count === 1 ? "" : "s") + ' listo' + (count === 1 ? "" : "s") + '. La portada elegida y la nueva experiencia ya están activas.</p><a class="successLink" href="' + escapeHtml(galleryUrl) + '" target="_blank" rel="noreferrer">Abrir galería del cliente</a><div class="adminActions" style="justify-content:center"><button class="adminButton secondary" id="copyLink" type="button">Copiar enlace</button><button class="adminButton" id="newUpload" type="button">Volver al panel</button></div><div class="adminNotice good" id="successMessage">Enlace: ' + escapeHtml(galleryUrl) + '</div></section>';
  element<HTMLButtonElement>("#copyLink").addEventListener("click", async () => {
    await navigator.clipboard.writeText(galleryUrl);
    element<HTMLElement>("#successMessage").textContent = "Enlace copiado. Ya puedes enviarlo al cliente.";
  });
  element<HTMLButtonElement>("#newUpload").addEventListener("click", renderDashboard);
}

async function uploadSmallFile(path: string, body: Blob, contentType: string): Promise<void> {
  const { error } = await getSupabase().storage.from(galleryBucket).upload(path, body, {
    contentType,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
}

async function uploadOriginal(path: string, file: File, onProgress: (percent: number) => void): Promise<void> {
  if (file.size <= MAX_STANDARD_UPLOAD) {
    onProgress(10);
    const { error } = await getSupabase().storage.from(galleryBucket).upload(path, file, {
      contentType: file.type || "application/octet-stream",
      cacheControl: "31536000",
      upsert: false,
    });
    if (error) throw error;
    onProgress(100);
    return;
  }
  await uploadResumable(path, file, onProgress);
}

async function uploadResumable(path: string, file: File, onProgress: (percent: number) => void): Promise<void> {
  const projectId = getProjectId();
  if (!projectId) throw new Error("No se pudo identificar el proyecto de Supabase.");
  const { data, error } = await getSupabase().auth.getSession();
  if (error) throw error;
  const token = data.session?.access_token;
  if (!token) throw new Error("La sesión expiró. Vuelve a iniciar sesión.");

  await new Promise<void>((resolve, reject) => {
    const upload = new tus.Upload(file, {
      endpoint: `https://${projectId}.storage.supabase.co/storage/v1/upload/resumable`,
      retryDelays: [0, 3000, 5000, 10000, 20000],
      headers: {
        authorization: `Bearer ${token}`,
        apikey: supabasePublishableKey,
        "x-upsert": "false",
      },
      uploadDataDuringCreation: true,
      removeFingerprintOnSuccess: true,
      chunkSize: 6 * 1024 * 1024,
      metadata: {
        bucketName: galleryBucket,
        objectName: path,
        contentType: file.type || "application/octet-stream",
        cacheControl: "31536000",
      },
      onError: (uploadError: Error) => reject(uploadError),
      onProgress: (uploaded: number, total: number) => onProgress(total ? (uploaded / total) * 100 : 0),
      onSuccess: () => resolve(),
    });

    void upload.findPreviousUploads().then((previousUploads) => {
      if (previousUploads.length) upload.resumeFromPreviousUpload(previousUploads[0]);
      upload.start();
    }).catch(reject);
  });
}

async function createImagePreview(file: File): Promise<PreparedPreview> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  const maxSide = 2200;
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d", { alpha: false });
  if (!context) throw new Error("El navegador no pudo preparar la preview.");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  const blob = await canvasToBlob(canvas, 0.84);
  return { blob, width, height };
}

async function createVideoPoster(file: File): Promise<PreparedPreview> {
  const url = URL.createObjectURL(file);
  const video = document.createElement("video");
  video.preload = "metadata";
  video.muted = true;
  video.playsInline = true;
  video.src = url;

  try {
    await waitFor(video, "loadedmetadata", 15000);
    const duration = Number.isFinite(video.duration) ? video.duration : 0;
    if (duration > 0.2) {
      video.currentTime = Math.min(1, duration * 0.15);
      await waitFor(video, "seeked", 15000);
    }
    const sourceWidth = video.videoWidth || 1600;
    const sourceHeight = video.videoHeight || 900;
    const maxSide = 1800;
    const scale = Math.min(1, maxSide / Math.max(sourceWidth, sourceHeight));
    const width = Math.max(1, Math.round(sourceWidth * scale));
    const height = Math.max(1, Math.round(sourceHeight * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d", { alpha: false });
    if (!context) throw new Error("No se pudo crear la portada del video.");
    context.drawImage(video, 0, 0, width, height);
    const blob = await canvasToBlob(canvas, 0.84);
    return { blob, width, height, duration };
  } finally {
    video.removeAttribute("src");
    video.load();
    URL.revokeObjectURL(url);
  }
}

function waitFor(target: HTMLMediaElement, eventName: string, timeoutMs: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error("El navegador no pudo leer el video. Exporta el video como MP4 H.264."));
    }, timeoutMs);
    const onSuccess = () => { cleanup(); resolve(); };
    const onError = () => { cleanup(); reject(new Error("No se pudo procesar el video. Usa MP4 H.264.")); };
    const cleanup = () => {
      window.clearTimeout(timer);
      target.removeEventListener(eventName, onSuccess);
      target.removeEventListener("error", onError);
    };
    target.addEventListener(eventName, onSuccess, { once: true });
    target.addEventListener("error", onError, { once: true });
  });
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("No se pudo generar la preview.")), "image/jpeg", quality);
  });
}

async function start(): Promise<void> {
  installShell();
  if (!hasSupabaseConfig()) {
    renderMissingConfig();
    return;
  }
  const { data } = await getSupabase().auth.getSession();
  if (data.session) renderDashboard();
  else renderLogin();
}

void start();
