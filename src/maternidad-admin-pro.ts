import { galleryBucket, getSupabase, publicObjectUrl } from "./supabase-client";

type Kind = "image" | "video";
type Fit = "cover" | "contain";
interface Item { type: Kind; previewPath: string; originalPath: string; name: string; alt?: string; width?: number; height?: number; duration?: number; position?: string; fit?: Fit; size?: number; }
interface Manifest { updatedAt?: string; coverIndex?: number; media?: Item[]; [key: string]: unknown; }

const PATH = "maternidad-playa/manifest.json";
let data: Manifest | null = null;
let editing = -1;

const $ = <T extends Element>(selector: string): T => {
  const found = document.querySelector<T>(selector);
  if (!found) throw new Error(`No se encontró ${selector}`);
  return found;
};
const safe = (value: unknown) => String(value ?? "").replace(/[&<>"']/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[c] || c));
const readPosition = (value?: string) => { const match = String(value || "50% 50%").match(/([\d.]+)%\s+([\d.]+)%/); return { x: match ? Number(match[1]) : 50, y: match ? Number(match[2]) : 50 }; };

function install(): void {
  if (document.getElementById("galleryEditorPro")) return;
  const style = document.createElement("style");
  style.textContent = `
    .geOpen{min-height:42px;padding:0 14px;border:0;border-radius:13px;background:#171512;color:#fff;font-weight:850}.ge{position:fixed;z-index:800;inset:0;overflow:auto;background:#f3efe9;color:#191714;font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.ge[hidden],.geCrop[hidden]{display:none}.ge *{box-sizing:border-box}.geTop{position:sticky;z-index:3;top:0;display:flex;align-items:center;justify-content:space-between;padding:max(12px,env(safe-area-inset-top)) 13px 11px;background:rgba(243,239,233,.92);border-bottom:1px solid rgba(25,23,20,.1);backdrop-filter:blur(18px)}.geBrand{font-size:21px;font-weight:950;letter-spacing:-.055em}.geBrand span{color:#ad7c4c}.geTop div:last-child{display:flex;gap:7px}.geTop button{height:42px;padding:0 13px;border:0;border-radius:12px;font-weight:850}.geClose{background:#e8e2db}.geSave{background:#171512;color:#fff}.geWrap{width:min(1050px,100%);margin:auto;padding:14px 12px 75px}.geHero{padding:24px 20px;border-radius:24px;background:#171512;color:#fff}.geHero small{color:#d7a873;font-weight:900;letter-spacing:.15em;text-transform:uppercase}.geHero h2{margin:9px 0 0;font:400 34px/1 Georgia,serif}.geHero p{margin:11px 0 0;color:rgba(255,255,255,.65);font-size:12px;line-height:1.55}.geCard{margin-top:13px;padding:17px;border:1px solid rgba(25,23,20,.1);border-radius:22px;background:#fff}.geHead{display:flex;align-items:flex-start;justify-content:space-between;gap:12px}.geHead h3{margin:0;font-size:17px}.geHead p,.geCard>p{margin:7px 0 0;color:#716b64;font-size:12px;line-height:1.5}.geStatus{padding:8px 10px;border-radius:999px;background:#eee9e2;font-size:10px;font-weight:850}.geGrid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:16px}.geItem{position:relative;aspect-ratio:4/5;border:2px solid transparent;border-radius:15px;overflow:hidden;background:#e4ddd4}.geItem.cover{border-color:#171512}.geItem.contain img{object-fit:contain}.geItem img{width:100%;height:100%;display:block;object-fit:cover}.geVideo{display:grid;place-items:center;background:#171512;color:#fff}.geBadge{position:absolute;left:6px;top:6px;padding:5px 7px;border-radius:999px;background:rgba(0,0,0,.6);color:#fff;font-size:8px;font-weight:900}.geTools{position:absolute;left:5px;right:5px;bottom:5px;display:grid;grid-template-columns:1fr 1fr;gap:4px}.geTools button{height:29px;border:0;border-radius:8px;background:rgba(255,255,255,.94);font-size:8px;font-weight:900}.geTools .danger{color:#a13f3f}.geUpload{position:relative;margin-top:15px;padding:25px 14px;border:1.5px dashed rgba(25,23,20,.22);border-radius:18px;background:#faf8f5;text-align:center}.geUpload input{position:absolute;inset:0;width:100%;height:100%;opacity:0}.geUpload strong{display:block}.geUpload span{display:block;margin-top:6px;color:#716b64;font-size:11px}.geProgress{display:none;margin-top:12px;padding:13px;border-radius:15px;background:#171512;color:#fff}.geProgress.show{display:block}.geBar{height:6px;margin-top:9px;border-radius:999px;background:rgba(255,255,255,.15);overflow:hidden}.geFill{height:100%;width:0;background:#fff}.geCrop{position:fixed;z-index:850;inset:0;display:grid;place-items:end center;padding:13px;background:rgba(0,0,0,.66);backdrop-filter:blur(10px)}.geCropCard{width:min(500px,100%);padding:17px 17px calc(18px + env(safe-area-inset-bottom));border-radius:27px 27px 19px 19px;background:#fff}.geCrop h3{margin:0;font:400 29px Georgia,serif}.geCrop p{color:#716b64;font-size:12px}.geFrame{aspect-ratio:4/5;margin-top:15px;border-radius:18px;overflow:hidden;background:#e5ded5}.geFrame img{width:100%;height:100%;object-fit:cover}.geField{margin-top:13px}.geField label{display:flex;justify-content:space-between;margin-bottom:6px;font-size:11px;font-weight:850}.geField input,.geField select{width:100%}.geField select{height:45px;border:1px solid rgba(25,23,20,.12);border-radius:12px;padding:0 10px}.geCropActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:16px}.geCropActions button{height:47px;border:0;border-radius:13px;font-weight:900}.geCancel{background:#eee9e2}.geApply{background:#171512;color:#fff}.geToast{position:fixed;z-index:900;left:50%;bottom:23px;transform:translate(-50%,15px);opacity:0;padding:10px 14px;border-radius:999px;background:#171512;color:#fff;font-size:11px;font-weight:850;transition:.2s}.geToast.show{opacity:1;transform:translate(-50%,0)}
    @media(min-width:760px){.geGrid{grid-template-columns:repeat(6,minmax(0,1fr))}.geWrap{padding:24px 24px 90px}.geCrop{place-items:center}.geCropCard{border-radius:27px}}
  `;
  document.head.appendChild(style);
  const shell = document.createElement("section");
  shell.id = "galleryEditorPro";
  shell.className = "ge";
  shell.hidden = true;
  shell.innerHTML = `<header class="geTop"><div class="geBrand"><span>by</span>Stiven · Editor</div><div><button class="geClose" id="geClose">Cerrar</button><button class="geSave" id="geSave">Guardar</button></div></header><div class="geWrap"><section class="geHero"><small>Presentación del cliente</small><h2>Portada y encuadres.</h2><p>Mueve cada preview hasta que rostros y detalles queden bien visibles. Las descargas originales no se modifican.</p></section><section class="geCard"><div class="geHead"><div><h3>Galería publicada</h3><p>Selecciona portada, ajusta el recorte o cambia el orden.</p></div><span class="geStatus" id="geStatus">Cargando…</span></div><div class="geGrid" id="geGrid"></div></section><section class="geCard"><h3>Agregar video</h3><p>Se añadirá a la entrega actual y aparecerá automáticamente en la mitad de la galería.</p><div class="geUpload"><input id="geVideo" type="file" accept="video/mp4,video/webm"><strong>Seleccionar video</strong><span>MP4 H.264 recomendado</span></div><div class="geProgress" id="geProgress"><div id="geProgressText">Preparando…</div><div class="geBar"><div class="geFill" id="geFill"></div></div></div></section></div><div class="geCrop" id="geCrop" hidden><div class="geCropCard"><h3>Ajustar encuadre</h3><p>Usa los controles hasta que la imagen quede como deseas.</p><div class="geFrame"><img id="geImage" alt="Vista previa"></div><div class="geField"><label><span>Izquierda / derecha</span><span id="geXText">50%</span></label><input id="geX" type="range" min="0" max="100" value="50"></div><div class="geField"><label><span>Arriba / abajo</span><span id="geYText">50%</span></label><input id="geY" type="range" min="0" max="100" value="50"></div><div class="geField"><label>Forma de mostrar</label><select id="geFit"><option value="cover">Llenar el espacio</option><option value="contain">Mostrar fotografía completa</option></select></div><div class="geCropActions"><button class="geCancel" id="geCancel">Cancelar</button><button class="geApply" id="geApply">Aplicar</button></div></div></div><div class="geToast" id="geToast"></div>`;
  document.body.appendChild(shell);
  $("#geClose").addEventListener("click", closeEditor);
  $("#geSave").addEventListener("click", () => void save());
  $("#geVideo").addEventListener("change", (event) => { const file = (event.target as HTMLInputElement).files?.[0]; if (file) void addVideo(file); });
}

function inject(): void {
  const logout = document.getElementById("signOut");
  if (!logout || document.getElementById("geOpen")) return;
  const button = document.createElement("button");
  button.id = "geOpen"; button.className = "geOpen"; button.type = "button"; button.textContent = "Editar galería";
  button.onclick = () => void openEditor();
  logout.parentElement?.insertBefore(button, logout);
}

async function fetchManifest(): Promise<Manifest> {
  const { data: blob, error } = await getSupabase().storage.from(galleryBucket).download(PATH);
  if (error) throw error;
  const result = JSON.parse(await blob.text()) as Manifest;
  result.media = result.media || [];
  result.coverIndex = Math.max(0, Math.min(result.media.length - 1, Number(result.coverIndex) || 0));
  return result;
}

async function openEditor(): Promise<void> {
  $("#galleryEditorPro").removeAttribute("hidden"); document.body.style.overflow = "hidden";
  try { data = await fetchManifest(); render(); setStatus(`${data.media?.length || 0} archivos`); }
  catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo cargar"); }
}
function closeEditor(): void { $("#galleryEditorPro").setAttribute("hidden", ""); document.body.style.overflow = ""; }
function setStatus(text: string): void { $("#geStatus").textContent = text; }

function render(): void {
  const grid = $("#geGrid");
  const items = data?.media || [];
  const cover = Number(data?.coverIndex) || 0;
  grid.innerHTML = items.map((item, index) => item.type === "video"
    ? `<div class="geItem geVideo"><strong>VIDEO</strong><span class="geBadge">${String(index + 1).padStart(2,"0")}</span><div class="geTools"><button data-up="${index}">↑</button><button data-down="${index}">↓</button><button class="danger" data-remove="${index}">Quitar</button></div></div>`
    : `<div class="geItem${index === cover ? " cover" : ""}${item.fit === "contain" ? " contain" : ""}"><img loading="lazy" src="${safe(publicObjectUrl(item.previewPath))}" alt="" style="object-position:${safe(item.position || "50% 50%")} "><span class="geBadge">${index === cover ? "Portada" : String(index + 1).padStart(2,"0")}</span><div class="geTools"><button data-cover="${index}">${index === cover ? "Portada ✓" : "Portada"}</button><button data-adjust="${index}">Ajustar</button><button data-up="${index}">↑</button><button data-down="${index}">↓</button><button class="danger" data-remove="${index}">Quitar</button></div></div>`).join("");
  grid.querySelectorAll<HTMLElement>("[data-cover]").forEach((button) => button.onclick = () => { if (data) data.coverIndex = Number(button.dataset.cover); render(); });
  grid.querySelectorAll<HTMLElement>("[data-adjust]").forEach((button) => button.onclick = () => crop(Number(button.dataset.adjust)));
  grid.querySelectorAll<HTMLElement>("[data-up]").forEach((button) => button.onclick = () => move(Number(button.dataset.up), -1));
  grid.querySelectorAll<HTMLElement>("[data-down]").forEach((button) => button.onclick = () => move(Number(button.dataset.down), 1));
  grid.querySelectorAll<HTMLElement>("[data-remove]").forEach((button) => button.onclick = () => remove(Number(button.dataset.remove)));
}

function move(index: number, direction: number): void {
  if (!data?.media) return;
  const target = index + direction;
  if (target < 0 || target >= data.media.length) return;
  const cover = data.media[Number(data.coverIndex) || 0];
  [data.media[index], data.media[target]] = [data.media[target], data.media[index]];
  data.coverIndex = Math.max(0, data.media.indexOf(cover)); render();
}
function remove(index: number): void {
  if (!data?.media || !confirm("¿Quitar este archivo de la galería?")) return;
  const cover = data.media[Number(data.coverIndex) || 0];
  data.media.splice(index, 1); data.coverIndex = cover ? data.media.indexOf(cover) : 0;
  if ((data.coverIndex || 0) < 0) data.coverIndex = Math.max(0, data.media.findIndex((item) => item.type === "image")); render();
}

function crop(index: number): void {
  const item = data?.media?.[index]; if (!item || item.type !== "image") return;
  editing = index;
  const current = readPosition(item.position), image = $("#geImage") as HTMLImageElement, x = $("#geX") as HTMLInputElement, y = $("#geY") as HTMLInputElement, fit = $("#geFit") as HTMLSelectElement;
  image.src = publicObjectUrl(item.previewPath); x.value = String(current.x); y.value = String(current.y); fit.value = item.fit === "contain" ? "contain" : "cover";
  const update = () => { image.style.objectPosition = `${x.value}% ${y.value}%`; image.style.objectFit = fit.value; $("#geXText").textContent = `${x.value}%`; $("#geYText").textContent = `${y.value}%`; };
  x.oninput = update; y.oninput = update; fit.onchange = update; update(); $("#geCrop").removeAttribute("hidden");
  ($("#geCancel") as HTMLButtonElement).onclick = () => $("#geCrop").setAttribute("hidden", "");
  ($("#geApply") as HTMLButtonElement).onclick = () => { const target = data?.media?.[editing]; if (target) { target.position = `${x.value}% ${y.value}%`; target.fit = fit.value as Fit; } $("#geCrop").setAttribute("hidden", ""); render(); };
}

async function save(): Promise<void> {
  if (!data) return;
  const button = $("#geSave") as HTMLButtonElement; button.disabled = true; button.textContent = "Guardando…";
  data.updatedAt = new Date().toISOString();
  try { const body = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const { error } = await getSupabase().storage.from(galleryBucket).upload(PATH, body, { contentType: "application/json", cacheControl: "0", upsert: true }); if (error) throw error; toast("Cambios guardados"); setStatus("Actualizada"); }
  catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo guardar"); }
  finally { button.disabled = false; button.textContent = "Guardar"; }
}

function progress(text: string, percent: number): void { $("#geProgress").classList.add("show"); $("#geProgressText").textContent = text; ($("#geFill") as HTMLElement).style.width = `${percent}%`; }
async function addVideo(file: File): Promise<void> {
  if (!file.type.startsWith("video/")) return;
  try {
    if (!data) data = await fetchManifest();
    progress("Preparando portada…", 5); const poster = await posterFor(file);
    const count = (data.media || []).filter((item) => item.type === "video").length + 1, ext = file.name.split(".").pop()?.toLowerCase() || "mp4", name = `MATERNIDAD-VIDEO-${String(count).padStart(3,"0")}.${ext}`, version = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2,7)}`;
    const originalPath = `maternidad-playa/${version}/originales/${name}`, previewPath = `maternidad-playa/${version}/portadas/${name.replace(/\.[^.]+$/,"")}.jpg`;
    progress("Subiendo portada…", 15); let result = await getSupabase().storage.from(galleryBucket).upload(previewPath, poster.blob, { contentType:"image/jpeg", cacheControl:"31536000", upsert:false }); if (result.error) throw result.error;
    progress("Subiendo video…", 35); result = await getSupabase().storage.from(galleryBucket).upload(originalPath, file, { contentType:file.type, cacheControl:"31536000", upsert:false }); if (result.error) throw result.error;
    data.media = data.media || []; data.media.push({ type:"video", previewPath, originalPath, name, alt:"Video de la sesión", width:poster.width, height:poster.height, duration:poster.duration, position:"50% 50%", fit:"cover", size:file.size });
    progress("Publicando…", 85); await save(); render(); progress("Video publicado", 100); toast("Video agregado");
  } catch (error) { setStatus(error instanceof Error ? error.message : "No se pudo subir el video"); toast("No se pudo agregar el video"); }
}

async function posterFor(file: File): Promise<{blob:Blob;width:number;height:number;duration:number}> {
  const url = URL.createObjectURL(file), video = document.createElement("video"); video.preload="metadata"; video.muted=true; video.playsInline=true; video.src=url;
  const wait = (event:string) => new Promise<void>((resolve,reject) => { const timer=setTimeout(()=>reject(new Error("No se pudo leer el video")),20000); video.addEventListener(event,()=>{clearTimeout(timer);resolve();},{once:true}); video.addEventListener("error",()=>{clearTimeout(timer);reject(new Error("Video incompatible"));},{once:true}); });
  try { await wait("loadedmetadata"); const duration=Number.isFinite(video.duration)?video.duration:0; if(duration>.2){video.currentTime=Math.min(1,duration*.15);await wait("seeked");} const sw=video.videoWidth||1600,sh=video.videoHeight||900,scale=Math.min(1,1800/Math.max(sw,sh)),width=Math.round(sw*scale),height=Math.round(sh*scale),canvas=document.createElement("canvas");canvas.width=width;canvas.height=height;const context=canvas.getContext("2d",{alpha:false});if(!context)throw new Error("No se pudo crear la portada");context.drawImage(video,0,0,width,height);const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob((value)=>value?resolve(value):reject(new Error("No se pudo crear la portada")),"image/jpeg",.84));return{blob,width,height,duration}; }
  finally { video.removeAttribute("src");video.load();URL.revokeObjectURL(url); }
}
function toast(message:string):void{const item=$("#geToast");item.textContent=message;item.classList.add("show");setTimeout(()=>item.classList.remove("show"),2100);}

function start(): void { install(); const observer = new MutationObserver(inject); observer.observe(document.body,{childList:true,subtree:true}); inject(); }
start();
