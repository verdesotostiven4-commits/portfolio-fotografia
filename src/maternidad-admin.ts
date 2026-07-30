import * as tus from "tus-js-client";
import { galleryBucket, getProjectId, getSupabase, hasSupabaseConfig, supabasePublishableKey } from "./supabase-client";

type MediaKind = "image" | "video";

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

interface UploadProgress {
  label: string;
  percent: number;
}

const MAX_STANDARD_UPLOAD = 6 * 1024 * 1024;
const MANIFEST_PATH = "maternidad-playa/manifest.json";
const GALLERY_PATH = "/galerias/maternidad-playa";
const acceptedTypes = ["image/jpeg", "image/png", "image/webp", "video/mp4", "video/webm"];

let selectedFiles: File[] = [];
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

function installShell(): void {
  document.title = "Publicar maternidad · byStiven";
  document.documentElement.className = "maternity-admin-page";
  const root = document.getElementById("root");
  if (!root) return;

  const style = document.createElement("style");
  style.textContent = `
    :root{--a-bg:#f2efe9;--a-card:#fff;--a-text:#191714;--a-muted:#716b64;--a-line:rgba(25,23,20,.11);--a-dark:#171512;--a-accent:#ad7c4c;--a-good:#236d48;--a-danger:#a13f3f}
    html.maternity-admin-page,html.maternity-admin-page body{margin:0;min-height:100%;background:var(--a-bg);color:var(--a-text);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
    #root,#root *{box-sizing:border-box}.adminApp{min-height:100svh;padding:18px 14px 70px}.adminWrap{width:min(920px,100%);margin:0 auto}.adminTop{display:flex;align-items:center;justify-content:space-between;gap:14px;padding:7px 2px 20px}.adminBrand{font-size:25px;font-weight:950;letter-spacing:-.065em}.adminBrand span{color:var(--a-accent)}
    .adminGhost,.adminButton{border:0;border-radius:15px;min-height:46px;padding:0 17px;font-weight:850;cursor:pointer}.adminGhost{border:1px solid var(--a-line);background:rgba(255,255,255,.65);color:var(--a-text)}.adminButton{background:var(--a-dark);color:#fff}.adminButton:disabled{opacity:.45;cursor:not-allowed}.adminButton.secondary{background:#eee9e2;color:var(--a-text)}
    .adminHero{padding:28px 22px;border-radius:29px;background:linear-gradient(145deg,#1f1a16,#0f0e0c);color:#fff;box-shadow:0 24px 70px rgba(35,28,22,.19)}.adminEyebrow{margin:0 0 10px;color:#d7a873;font-size:11px;font-weight:900;letter-spacing:.17em;text-transform:uppercase}.adminHero h1{max-width:13ch;margin:0;font-family:Georgia,"Times New Roman",serif;font-size:clamp(38px,10vw,58px);font-weight:400;line-height:.96;letter-spacing:-.045em}.adminHero p{max-width:55ch;margin:16px 0 0;color:rgba(255,255,255,.68);font-size:14px;line-height:1.65}
    .adminCard{margin-top:14px;padding:21px;border:1px solid var(--a-line);border-radius:25px;background:var(--a-card);box-shadow:0 15px 48px rgba(45,35,25,.06)}.adminCard h2{margin:0;font-size:18px}.adminCardLead{margin:8px 0 0;color:var(--a-muted);font-size:13px;line-height:1.55}
    .adminForm{display:grid;gap:12px;margin-top:19px}.adminField{display:grid;gap:7px}.adminField label{font-size:12px;font-weight:850}.adminField input{width:100%;height:50px;border:1px solid var(--a-line);border-radius:14px;padding:0 14px;background:#fbfaf8;color:var(--a-text);font:inherit;outline:none}.adminField input:focus{border-color:rgba(173,124,76,.65);box-shadow:0 0 0 4px rgba(173,124,76,.1)}
    .adminActions{display:flex;flex-wrap:wrap;gap:9px;margin-top:18px}.adminNotice{margin-top:14px;padding:13px 14px;border-radius:14px;background:#f4eee7;color:#695b4e;font-size:12px;line-height:1.55}.adminNotice.error{background:#f8eaea;color:var(--a-danger)}.adminNotice.good{background:#e9f4ee;color:var(--a-good)}
    .dropZone{position:relative;margin-top:18px;padding:34px 18px;border:1.5px dashed rgba(25,23,20,.22);border-radius:22px;background:#faf8f5;text-align:center;transition:.2s}.dropZone.isDrag{border-color:var(--a-accent);background:#f4ece3;transform:scale(.995)}.dropZone input{position:absolute;inset:0;width:100%;height:100%;opacity:0;cursor:pointer}.dropIcon{width:57px;height:57px;margin:0 auto 14px;border-radius:18px;background:var(--a-dark);color:#fff;display:grid;place-items:center;font-size:25px}.dropZone strong{display:block;font-size:16px}.dropZone span{display:block;margin-top:7px;color:var(--a-muted);font-size:12px;line-height:1.5}
    .fileList{display:grid;gap:8px;margin-top:15px}.fileRow{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;padding:11px;border:1px solid var(--a-line);border-radius:16px;background:#fff}.fileType{width:42px;height:42px;border-radius:13px;background:#eee8e1;display:grid;place-items:center;font-size:11px;font-weight:950}.fileInfo{min-width:0}.fileInfo strong,.fileInfo span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.fileInfo strong{font-size:13px}.fileInfo span{margin-top:4px;color:var(--a-muted);font-size:10px}.fileSize{color:var(--a-muted);font-size:11px;font-weight:750}
    .publishBar{position:sticky;z-index:20;bottom:12px;margin-top:14px;padding:8px;border:1px solid rgba(255,255,255,.1);border-radius:21px;background:rgba(23,21,18,.94);backdrop-filter:blur(18px);box-shadow:0 18px 55px rgba(0,0,0,.22)}.publishBar button{width:100%;height:52px;border:0;border-radius:15px;background:#fff;color:#171512;font-weight:950;cursor:pointer}.publishBar button:disabled{opacity:.45;cursor:not-allowed}
    .progressBox{display:none;margin-top:15px;padding:16px;border-radius:18px;background:#171512;color:#fff}.progressBox.show{display:block}.progressTop{display:flex;justify-content:space-between;gap:12px;font-size:12px;font-weight:800}.progressTrack{height:7px;margin-top:11px;border-radius:999px;background:rgba(255,255,255,.12);overflow:hidden}.progressFill{height:100%;width:0;background:#fff;border-radius:inherit;transition:width .2s}.progressDetail{margin-top:9px;color:rgba(255,255,255,.62);font-size:10px}
    .successCard{text-align:center;padding:36px 21px}.successMark{width:60px;height:60px;margin:0 auto;border-radius:20px;background:var(--a-good);color:#fff;display:grid;place-items:center;font-size:25px;font-weight:900}.successCard h2{margin:18px 0 8px;font-family:Georgia,serif;font-size:31px;font-weight:400}.successCard p{margin:0;color:var(--a-muted);line-height:1.6}.successLink{display:flex;align-items:center;justify-content:center;min-height:51px;margin-top:21px;border-radius:15px;background:var(--a-dark);color:#fff;text-decoration:none;font-weight:900}
    @media(min-width:720px){.adminApp{padding:30px 24px 90px}.adminHero{padding:48px}.adminGrid{display:grid;grid-template-columns:.8fr 1.2fr;gap:14px;align-items:start}.adminGrid .adminCard{margin-top:14px}.publishBar{position:static}.adminForm.two{grid-template-columns:1fr 1fr}}
  `;
  document.head.appendChild(style);
  root.innerHTML = '<main class="adminApp"><div class="adminWrap"><header class="adminTop"><div class="adminBrand"><span>by</span>Stiven</div><a class="adminGhost" href="' + GALLERY_PATH + '" target="_blank" rel="noreferrer" style="display:flex;align-items:center;text-decoration:none">Ver galería</a></header><div id="adminContent"></div></div></main>';
}

function renderMissingConfig(): void {
  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Conexión pendiente</p><h1>Primero conecta Supabase.</h1><p>El panel ya está construido, pero necesita la URL y la llave pública del proyecto para subir los archivos.</p></section><section class="adminCard"><h2>Variables necesarias en Vercel</h2><p class="adminCardLead">Agrégalas en Settings → Environment Variables y vuelve a desplegar.</p><div class="adminNotice"><strong>VITE_SUPABASE_URL</strong><br>https://TU-PROYECTO.supabase.co<br><br><strong>VITE_SUPABASE_PUBLISHABLE_KEY</strong><br>Tu llave pública publishable o anon<br><br><strong>VITE_SUPABASE_GALLERY_BUCKET</strong><br>client-galleries</div><div class="adminNotice error">Nunca coloques la service_role key en Vercel ni en el navegador.</div></section>';
}

function renderLogin(message = ""): void {
  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Panel privado</p><h1>Publica una sesión sin tocar código.</h1><p>Inicia sesión con el usuario que crearás en Supabase Authentication.</p></section><section class="adminCard"><h2>Iniciar sesión</h2><form class="adminForm" id="loginForm"><div class="adminField"><label for="loginEmail">Correo</label><input id="loginEmail" type="email" autocomplete="email" required></div><div class="adminField"><label for="loginPassword">Contraseña</label><input id="loginPassword" type="password" autocomplete="current-password" required></div><button class="adminButton" id="loginButton" type="submit">Entrar al panel</button></form><div id="loginMessage" class="adminNotice' + (message ? " error" : "") + '"' + (message ? "" : " hidden") + '>' + escapeHtml(message) + '</div></section>';

  element<HTMLFormElement>("#loginForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    const button = element<HTMLButtonElement>("#loginButton");
    const email = element<HTMLInputElement>("#loginEmail").value.trim();
    const password = element<HTMLInputElement>("#loginPassword").value;
    button.disabled = true;
    button.textContent = "Ingresando…";
    const { error } = await getSupabase().auth.signInWithPassword({ email, password });
    if (error) {
      renderLogin(error.message === "Invalid login credentials" ? "Correo o contraseña incorrectos." : error.message);
      return;
    }
    renderDashboard();
  });
}

function renderDashboard(): void {
  selectedFiles = [];
  const host = element<HTMLElement>("#adminContent");
  host.innerHTML = '<section class="adminHero"><p class="adminEyebrow">Entrega de maternidad</p><h1>Sube, publica y comparte.</h1><p>Tú seleccionas los JPG y MP4. El sistema crea las previews, cambia los nombres y conserva cada original sin modificar.</p></section><div class="adminGrid"><section class="adminCard"><div style="display:flex;align-items:center;justify-content:space-between;gap:12px"><div><h2>Información</h2><p class="adminCardLead">Puedes cambiar estos textos antes de publicar.</p></div><button class="adminGhost" id="signOut" type="button">Salir</button></div><div class="adminForm two"><div class="adminField"><label for="galleryTitle">Título</label><input id="galleryTitle" value="Maternidad en la playa"></div><div class="adminField"><label for="galleryLocation">Lugar</label><input id="galleryLocation" value="Galápagos"></div><div class="adminField"><label for="galleryYear">Año</label><input id="galleryYear" value="2026"></div><div class="adminField"><label for="gallerySubtitle">Frase</label><input id="gallerySubtitle" value="Una historia de amor que está por comenzar."></div></div><div class="adminNotice">Para video usa <strong>MP4 H.264</strong>. La página cargará únicamente su portada y el video empezará a cargar cuando el cliente lo abra.</div></section><section class="adminCard"><h2>Fotografías y videos</h2><p class="adminCardLead">El orden de selección será el orden de la galería. La primera fotografía funcionará como portada.</p><div class="dropZone" id="dropZone"><input id="mediaInput" type="file" multiple accept="image/jpeg,image/png,image/webp,video/mp4,video/webm"><div class="dropIcon">＋</div><strong>Toca o arrastra los archivos</strong><span>JPG, PNG, WebP, MP4 o WebM. Los originales no se comprimen.</span></div><div class="fileList" id="fileList"></div><div class="progressBox" id="progressBox"><div class="progressTop"><span id="progressLabel">Preparando…</span><span id="progressPercent">0%</span></div><div class="progressTrack"><div class="progressFill" id="progressFill"></div></div><div class="progressDetail" id="progressDetail"></div></div><div class="publishBar"><button id="publishButton" type="button" disabled>Selecciona archivos para publicar</button></div></section></div>';

  const input = element<HTMLInputElement>("#mediaInput");
  const dropZone = element<HTMLElement>("#dropZone");
  input.addEventListener("change", () => addFiles(Array.from(input.files || [])));
  ["dragenter", "dragover"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.add("isDrag"); }));
  ["dragleave", "drop"].forEach((name) => dropZone.addEventListener(name, (event) => { event.preventDefault(); dropZone.classList.remove("isDrag"); }));
  dropZone.addEventListener("drop", (event) => addFiles(Array.from(event.dataTransfer?.files || [])));
  element<HTMLButtonElement>("#publishButton").addEventListener("click", () => void publishGallery());
  element<HTMLButtonElement>("#signOut").addEventListener("click", async () => { await getSupabase().auth.signOut(); renderLogin(); });
  refreshFileList();
}

function addFiles(files: File[]): void {
  const valid = files.filter((file) => acceptedTypes.includes(file.type));
  const rejected = files.filter((file) => !acceptedTypes.includes(file.type));
  const known = new Set(selectedFiles.map((file) => `${file.name}-${file.size}-${file.lastModified}`));
  valid.forEach((file) => {
    const key = `${file.name}-${file.size}-${file.lastModified}`;
    if (!known.has(key)) selectedFiles.push(file);
  });
  if (rejected.length) alert("Algunos archivos no se agregaron. Para video usa MP4 o WebM; para fotos usa JPG, PNG o WebP.");
  refreshFileList();
}

function refreshFileList(): void {
  const list = element<HTMLElement>("#fileList");
  const button = element<HTMLButtonElement>("#publishButton");
  const names = professionalNames(selectedFiles);

  list.innerHTML = selectedFiles.map((file) => {
    const kind = fileKind(file);
    return '<div class="fileRow"><div class="fileType">' + (kind === "video" ? "VIDEO" : "FOTO") + '</div><div class="fileInfo"><strong>' + escapeHtml(names.get(file)) + '</strong><span>' + escapeHtml(file.name) + '</span></div><div class="fileSize">' + formatBytes(file.size) + '</div></div>';
  }).join("");

  button.disabled = !selectedFiles.length || publishing;
  button.textContent = selectedFiles.length ? `Publicar ${selectedFiles.length} archivo${selectedFiles.length === 1 ? "" : "s"}` : "Selecciona archivos para publicar";
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
  if (!selectedFiles.length || publishing) return;
  publishing = true;
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
        position: "50% 50%",
      });
    }

    setProgress({ label: "Publicando la galería", percent: 96 }, "Creando el enlace para el cliente");
    const manifest = {
      version,
      updatedAt: new Date().toISOString(),
      title: element<HTMLInputElement>("#galleryTitle").value.trim() || "Maternidad en la playa",
      subtitle: element<HTMLInputElement>("#gallerySubtitle").value.trim() || "Una historia de amor que está por comenzar.",
      location: element<HTMLInputElement>("#galleryLocation").value.trim() || "Galápagos",
      year: element<HTMLInputElement>("#galleryYear").value.trim() || String(new Date().getFullYear()),
      photographer: "Stiven Verdesoto",
      brand: "byStiven",
      instagram: "https://www.instagram.com/bystiven/",
      media: manifestItems,
    };

    const manifestBlob = new Blob([JSON.stringify(manifest, null, 2)], { type: "application/json" });
    const { error } = await getSupabase().storage.from(galleryBucket).upload(MANIFEST_PATH, manifestBlob, {
      contentType: "application/json",
      cacheControl: "0",
      upsert: true,
    });
    if (error) throw error;

    setProgress({ label: "Galería publicada", percent: 100 }, "Ya puedes enviar el enlace");
    renderSuccess(selectedFiles.length);
  } catch (error) {
    console.error(error);
    const message = error instanceof Error ? error.message : "No se pudo publicar la galería.";
    alert(`No se pudo publicar: ${message}\n\nRevisa el bucket, las políticas SQL y las variables de Vercel.`);
    publishing = false;
    refreshFileList();
  }
}

function renderSuccess(count: number): void {
  const host = element<HTMLElement>("#adminContent");
  const galleryUrl = `${window.location.origin}${GALLERY_PATH}`;
  host.innerHTML = '<section class="adminCard successCard"><div class="successMark">✓</div><h2>Entrega publicada.</h2><p>' + count + ' archivo' + (count === 1 ? "" : "s") + ' listo' + (count === 1 ? "" : "s") + '. Las previews cargarán rápido y las descargas conservarán los originales.</p><a class="successLink" href="' + escapeHtml(galleryUrl) + '" target="_blank" rel="noreferrer">Abrir galería del cliente</a><div class="adminActions" style="justify-content:center"><button class="adminButton secondary" id="copyLink" type="button">Copiar enlace</button><button class="adminButton" id="newUpload" type="button">Publicar otra versión</button></div><div class="adminNotice good" id="successMessage">Enlace: ' + escapeHtml(galleryUrl) + '</div></section>';
  element<HTMLButtonElement>("#copyLink").addEventListener("click", async () => {
    await navigator.clipboard.writeText(galleryUrl);
    element<HTMLElement>("#successMessage").textContent = "Enlace copiado. Ya puedes enviarlo al cliente.";
  });
  element<HTMLButtonElement>("#newUpload").addEventListener("click", () => { publishing = false; renderDashboard(); });
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
      onError: (uploadError) => reject(uploadError),
      onProgress: (uploaded, total) => onProgress(total ? (uploaded / total) * 100 : 0),
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
