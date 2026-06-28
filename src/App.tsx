import { useMemo, useState } from "react";
import { clientGallery, eventPhotos, photographer, services, type GalleryCategory, type GalleryPhoto } from "./data";
import "./styles.css";

const categoryLabels: Record<GalleryCategory | "todos", string> = { todos: "Todo", emocion: "Emoción", retrato: "Retratos", vals: "Vals", decoracion: "Decoración", detalle: "Detalles", editorial: "Editorial", momento: "Momentos" };
const wa = (message: string) => `https://wa.me/${photographer.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
const img = (seed: string, w = 1200, h = 1600) => `https://picsum.photos/seed/bystiven-${seed}/${w}/${h}`;

const mockWorks = [
  { title: "Boda editorial", type: "Wedding Story", image: img("wedding", 1200, 1700), shape: "workTall" },
  { title: "Retrato creativo", type: "Portrait Session", image: img("portrait", 1200, 1500), shape: "" },
  { title: "Decoración de evento", type: "Event Details", image: img("decor", 1700, 1100), shape: "workWide" },
  { title: "Vida salvaje", type: "Wildlife", image: img("wildlife", 1200, 1500), shape: "" },
  { title: "Aventura Galápagos", type: "Travel Story", image: img("travel", 1200, 1700), shape: "workTall" },
  { title: "Graduación", type: "Milestone", image: img("graduation", 1200, 1500), shape: "" },
  { title: "Ambiente nocturno", type: "Event Mood", image: img("night-event", 1200, 1500), shape: "" },
  { title: "Producto & marca", type: "Commercial", image: img("brand", 1700, 1100), shape: "workWide" },
];

const collections = [
  { label: "01", title: "Quinceaños", text: "Retratos, entrada, vals, familia, detalles y una entrega privada pensada para vender emoción.", image: img("quince", 1400, 1200) },
  { label: "02", title: "Bodas", text: "Cobertura elegante, natural y narrativa desde preparación hasta fiesta.", image: img("bride", 1400, 1200) },
  { label: "03", title: "Naturaleza", text: "Fauna, paisaje y aventura con mirada documental para Galápagos.", image: img("nature", 1400, 1200) },
  { label: "04", title: "Retrato", text: "Sesiones personales, creativas y urbanas con dirección de pose y luz.", image: img("studio", 1400, 1200) },
];

function isPrivateGalleryPath() {
  const path = decodeURIComponent(window.location.pathname).toLowerCase();
  return path.includes(`/galerias/${clientGallery.slug}`) || path.includes("/alausi15") || path.includes("/alausí15");
}

export default function App() {
  return isPrivateGalleryPath() ? <ClientGallery /> : <PortfolioHome />;
}

function InstagramIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.1" /></svg>;
}

function Nav({ dark = false }: { dark?: boolean }) {
  return <header className={`nav ${dark ? "navDark" : ""}`}><a className="logo" href="/"><span>by</span>Stiven</a><nav><a href="/#trabajo">Trabajo</a><a href="/#galeria">Galería</a><a href="/#servicios">Servicios</a><a href="/#equipo">Equipo</a><a href="/#contacto">Contacto</a></nav></header>;
}

function PortfolioHome() {
  const reel = mockWorks.slice(0, 6);
  return (
    <main>
      <section className="homeHero"><Nav /><div className="homeHeroBg" style={{ backgroundImage: `url(${photographer.heroBackground})` }} /><div className="heroOverlay" /><div className="heroSubjectWrap"><img className="heroSubject" src={photographer.heroSubject} alt="" /></div><div className="homeHeroContent"><p className="eyebrow">{photographer.location}</p><h1>Fotografía cinematográfica, elegante y real.</h1><p>Soy {photographer.name}. Creo imágenes para eventos, decoración, retratos y naturaleza con una estética premium y una entrega profesional.</p><div className="heroActions"><a className="button primary" href="#trabajo">Explorar portafolio</a><a className="button ghost instagramButton" href={photographer.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram byStiven"><InstagramIcon /><span>{photographer.handle}</span></a></div></div></section>
      <section className="section introGrid" id="trabajo"><div><p className="eyebrow">Portafolio</p><h2>Una marca visual limpia, elegante y lista para vender confianza.</h2></div><p className="lead">Vista maqueta completa del portafolio: cuando tengas tus fotos finales, reemplazamos estas imágenes de muestra por tus mejores bodas, quinceaños, retratos, naturaleza y decoración.</p></section>
      <section className="mockRibbon"><div className="mockRibbonTrack">{[...reel, ...reel].map((work, index) => <figure key={`${work.title}-${index}`}><img src={work.image} alt={work.title} /><figcaption>{work.type}</figcaption></figure>)}</div></section>
      <section className="section collectionPanels" id="galeria"><div className="sectionHeader"><p className="eyebrow">Especialidades</p><h2>Un portafolio completo, separado por intención.</h2><p>Así se vería la web terminada con categorías reales. Después solo cambiamos estas imágenes por tus fotos finales.</p></div><div className="collectionGrid">{collections.map((item) => <article className="collectionCard" key={item.title}><img src={item.image} alt={item.title} /><div><span>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></div></article>)}</div></section>
      <section className="portfolioShowcase"><div className="sectionHeader showcaseHeader"><p className="eyebrow">Obras seleccionadas</p><h2>Mockup editorial de cómo se vería lleno.</h2></div><div className="portfolioGrid">{mockWorks.map((work) => <article className={`workCard ${work.shape}`} key={work.title}><img src={work.image} alt={work.title} /><div><span>{work.type}</span><h3>{work.title}</h3></div></article>)}</div></section>
      <section className="section split" id="servicios"><div><p className="eyebrow">Servicios</p><h2>Fotografía para eventos, marcas, retratos y naturaleza.</h2></div><div className="serviceList">{services.map((s) => <span key={s}>{s}</span>)}</div></section>
      <section className="section process"><article><span>01</span><h3>Dirección</h3><p>Ordeno la historia para que el cliente vea primero impacto, emoción y calidad.</p></article><article><span>02</span><h3>Edición</h3><p>Color, luz y contraste con estética natural, elegante y comercial.</p></article><article><span>03</span><h3>Entrega</h3><p>Galerías limpias, privadas y listas para revisar, compartir o comprar.</p></article></section>
      <section className="section testimonials"><div className="sectionHeader"><p className="eyebrow">Experiencia</p><h2>La entrega también tiene que sentirse profesional.</h2></div><div className="testimonialsGrid"><article className="quoteCard"><p>“La galería parece una experiencia, no solo una carpeta de fotos.”</p><span>Cliente de evento</span></article><article className="quoteCard"><p>“Las fotos de decoración ayudan a mostrar la marca con más presencia.”</p><span>Proveedor</span></article><article className="quoteCard"><p>“Todo se ve ordenado, elegante y fácil de compartir.”</p><span>Sesión privada</span></article></div></section>
      <section className="section about" id="equipo"><div className="aboutPhoto"><img src={photographer.portraitPhoto} alt={`${photographer.name}, fotógrafo`} /></div><div><p className="eyebrow">Detrás de cámara</p><h2>{photographer.name}</h2><p className="lead">{photographer.tagline}</p><div className="gear">{photographer.gear.map((g) => <span key={g}>{g}</span>)}</div><div className="heroActions"><a className="button primary" href={wa("Hola Stiven, vi tu portafolio y quiero información sobre fotografía.")} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a><a className="button ghost instagramButton" href={photographer.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram byStiven"><InstagramIcon /><span>{photographer.handle}</span></a></div></div></section>
      <section className="section finalPublicCta" id="contacto"><p className="eyebrow">Reservas</p><h2>¿Listo para convertir tu historia en una galería premium?</h2><p>Eventos, retratos, decoración y naturaleza con una entrega digital que se siente lista para vender.</p><a className="button primary" href={wa("Hola Stiven, vi tu portafolio y quiero reservar una sesión o evento.")} target="_blank" rel="noreferrer">Hablar por WhatsApp</a></section>
    </main>
  );
}

function ClientGallery() {
  const [category, setCategory] = useState<GalleryCategory | "todos">("todos");
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);
  const filtered = useMemo(() => category === "todos" ? eventPhotos : eventPhotos.filter((photo) => photo.category === category), [category]);
  const categories = useMemo(() => ["todos", ...Array.from(new Set(eventPhotos.map((photo) => photo.category)))] as Array<GalleryCategory | "todos">, []);
  async function copyLink() { await navigator.clipboard.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800); }
  return (
    <main className="clientPage"><header className="clientNav"><a className="logo" href="/"><span>by</span>Stiven</a><button onClick={copyLink}>{copied ? "Link copiado" : "Compartir"}</button></header><section className="clientHero"><div className="clientHeroImage" style={{ backgroundImage: `url(${clientGallery.cover})` }} /><div className="clientHeroOverlay" /><div className="clientHeroContent"><p className="eyebrow">Entrega privada · byStiven</p><h1>{clientGallery.title}</h1><p>{clientGallery.subtitle}</p><div className="heroActions"><button className="button primary" onClick={() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })}>Ver las 24 fotos</button><a className="button ghost light" href="/">Ver portafolio</a></div></div></section><section className="section clientIntro"><div><p className="eyebrow">Vista previa para cliente</p><h2>Una selección privada para revisar, emocionarse y elegir la entrega final.</h2></div><div className="clientPanel"><p>{clientGallery.note}</p><a className="button primary" href={wa(`Hola Stiven, vimos la galería de ${clientGallery.title} y queremos información para adquirir las fotos.`)} target="_blank" rel="noreferrer">Consultar paquete completo</a></div></section><section className="clientStory"><div><span>01</span><h3>Momentos</h3><p>Sonrisas, vals y retratos seleccionados para iniciar con emoción.</p></div><div><span>02</span><h3>Detalles</h3><p>Decoración, pastel, entrada, mesa y ambiente del evento.</p></div><div><span>03</span><h3>Entrega</h3><p>Al confirmar, se prepara la galería final en alta calidad.</p></div></section><section className="downloadBox section"><div><p className="eyebrow">Descarga con PIN</p><h2>Previews protegidas para revisión.</h2><p>Ingresa el PIN para activar botones de descarga en las fotos.</p></div><div className="pinBox"><input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN de 4 números" inputMode="numeric" maxLength={4} /><button className="button primary" onClick={() => setUnlocked(pin.trim() === clientGallery.downloadPin)}>Activar</button>{pin && !unlocked && pin.length >= 4 && <small>PIN incorrecto o pendiente de entrega.</small>}{unlocked && <small className="ok">PIN correcto. Descarga activada.</small>}</div></section><section className="section galleryTools" id="galeria"><div><p className="eyebrow">Galería privada</p><h2>{filtered.length} fotografías seleccionadas</h2></div><div className="filters">{categories.map((cat) => <button className={category === cat ? "active" : ""} onClick={() => setCategory(cat)} key={cat}>{categoryLabels[cat]}</button>)}</div></section><section className="masonry">{filtered.map((photo) => <article className={`photoCard ${photo.orientation}`} key={photo.code}><button onClick={() => setSelected(photo)} aria-label={`Abrir ${photo.title}`}><img src={photo.src} alt={photo.title} /><span className="watermark">byStiven · preview</span><span className="photoInfo"><strong>{photo.code}</strong>{photo.title}</span></button>{unlocked && <a className="downloadPhoto" href={photo.src} download={`${photo.code}-${slugify(photo.title)}.webp`}>Descargar preview</a>}</article>)}</section><section className="section finalCta"><p className="eyebrow">Siguiente paso</p><h2>¿Desean la galería completa en alta calidad?</h2><p>Puedo preparar una entrega final con fotos optimizadas, carpeta de descarga y selección lista para imprimir o compartir.</p><div className="heroActions"><a className="button primary" href={wa(`Hola Stiven, queremos adquirir la galería completa de ${clientGallery.title}.`)} target="_blank" rel="noreferrer">Comprar / coordinar entrega</a><a className="button ghost" href="/">Conocer al fotógrafo</a></div></section>{selected && <Lightbox photo={selected} onClose={() => setSelected(null)} unlocked={unlocked} />}</main>
  );
}

function Lightbox({ photo, onClose, unlocked }: { photo: GalleryPhoto; onClose: () => void; unlocked: boolean }) {
  return <div className="lightbox" onClick={onClose}><button className="close" aria-label="Cerrar">×</button><div className="lightboxInner" onClick={(event) => event.stopPropagation()}><img src={photo.src} alt={photo.title} /><div className="lightboxCaption"><div><strong>{photo.code}</strong><p>{photo.title}</p></div>{unlocked && <a className="button primary" href={photo.src} download={`${photo.code}-${slugify(photo.title)}.webp`}>Descargar</a>}</div></div></div>;
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}
