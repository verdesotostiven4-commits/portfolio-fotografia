import { useMemo, useState } from "react";
import { clientGallery, eventPhotos, photographer, portfolioHighlights, services, type GalleryCategory, type GalleryPhoto } from "./data";
import "./styles.css";

const categoryLabels: Record<GalleryCategory | "todos", string> = {
  todos: "Todo",
  emocion: "Emoción",
  retrato: "Retratos",
  vals: "Vals",
  decoracion: "Decoración",
  detalle: "Detalles",
  editorial: "Editorial",
  momento: "Momentos",
};

function whatsappLink(message: string) {
  const cleaned = photographer.whatsappNumber.replace(/\D/g, "");
  return `https://wa.me/${cleaned}?text=${encodeURIComponent(message)}`;
}

function App() {
  const isClientGallery = window.location.pathname.includes(`/galerias/${clientGallery.slug}`);
  return isClientGallery ? <ClientGallery /> : <PortfolioHome />;
}

function Nav({ dark = false }: { dark?: boolean }) {
  return (
    <header className={`nav ${dark ? "navDark" : ""}`}>
      <a className="logo" href="/" aria-label="Ir al inicio"><span>by</span>Stiven</a>
      <nav>
        <a href="/#trabajo">Trabajo</a>
        <a href="/#servicios">Servicios</a>
        <a href="/#equipo">Equipo</a>
        <a href={`/galerias/${clientGallery.slug}`}>Galería privada</a>
      </nav>
    </header>
  );
}

function PortfolioHome() {
  return (
    <main>
      <section className="homeHero">
        <Nav />
        <div className="homeHeroBg" style={{ backgroundImage: `url(${clientGallery.cover})` }} />
        <div className="heroOverlay" />
        <div className="homeHeroContent">
          <p className="eyebrow">{photographer.location}</p>
          <h1>Fotografía con mirada editorial, emoción real y entrega profesional.</h1>
          <p>Soy {photographer.name}. Trabajo eventos, quinceaños, decoración y naturaleza con una estética limpia, elegante y lista para compartir con clientes.</p>
          <div className="heroActions">
            <a className="button primary" href={`/galerias/${clientGallery.slug}`}>Ver galería privada</a>
            <a className="button ghost" href={photographer.instagramUrl} target="_blank" rel="noreferrer">Instagram {photographer.handle}</a>
          </div>
        </div>
      </section>

      <section className="section introGrid" id="trabajo">
        <div>
          <p className="eyebrow">Portafolio</p>
          <h2>Una web para vender confianza antes de vender fotos.</h2>
        </div>
        <p className="lead">La experiencia está pensada para que el cliente vea una entrega cuidada: portada, historia, fotos seleccionadas, botón de contacto y descarga con PIN para previews.</p>
      </section>

      <section className="highlightGrid">
        {portfolioHighlights.map((item) => (
          <article className="highlightCard" key={item.title}>
            <SmartImage src={item.image} alt={item.title} />
            <div><h3>{item.title}</h3><p>{item.description}</p></div>
          </article>
        ))}
      </section>

      <section className="section split" id="servicios">
        <div><p className="eyebrow">Servicios</p><h2>Paquetes pensados para evento, decoración y entrega digital.</h2></div>
        <div className="serviceList">{services.map((service) => <span key={service}>{service}</span>)}</div>
      </section>

      <section className="section about" id="equipo">
        <div className="aboutPhoto"><SmartImage src={photographer.profilePhoto} alt={`${photographer.name}, fotógrafo`} /></div>
        <div>
          <p className="eyebrow">Detrás de cámara</p>
          <h2>{photographer.name}</h2>
          <p className="lead">{photographer.tagline}</p>
          <div className="gear">{photographer.gear.map((item) => <span key={item}>{item}</span>)}</div>
          <a className="button primary" href={whatsappLink("Hola Stiven, vi tu portafolio y quiero información sobre fotografía.")} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
        </div>
      </section>

      <section className="section privatePreview">
        <div><p className="eyebrow">Entrega privada</p><h2>Galería: {clientGallery.title}</h2><p>{clientGallery.intro}</p></div>
        <a className="button primary" href={`/galerias/${clientGallery.slug}`}>Abrir galería</a>
      </section>
    </main>
  );
}

function ClientGallery() {
  const [category, setCategory] = useState<GalleryCategory | "todos">("todos");
  const [selected, setSelected] = useState<GalleryPhoto | null>(null);
  const [pin, setPin] = useState("");
  const [pinUnlocked, setPinUnlocked] = useState(false);
  const [copied, setCopied] = useState(false);

  const filtered = useMemo(() => category === "todos" ? eventPhotos : eventPhotos.filter((photo) => photo.category === category), [category]);
  const categories = useMemo(() => ["todos", ...Array.from(new Set(eventPhotos.map((photo) => photo.category)))] as Array<GalleryCategory | "todos">, []);

  function verifyPin() { setPinUnlocked(pin.trim() === clientGallery.downloadPin); }
  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <main className="clientPage">
      <Nav dark />
      <section className="clientHero">
        <div className="clientHeroImage" style={{ backgroundImage: `url(${clientGallery.cover})` }} />
        <div className="clientHeroOverlay" />
        <div className="clientHeroContent">
          <p className="eyebrow">Galería privada · byStiven</p>
          <h1>{clientGallery.title}</h1>
          <p>{clientGallery.subtitle}</p>
          <div className="heroActions">
            <button className="button primary" onClick={() => document.getElementById("galeria")?.scrollIntoView({ behavior: "smooth" })}>Ver selección</button>
            <button className="button ghost light" onClick={copyLink}>{copied ? "Link copiado" : "Compartir link"}</button>
          </div>
        </div>
      </section>

      <section className="section clientIntro">
        <div><p className="eyebrow">Vista previa</p><h2>Primero emoción, luego elegancia y después detalles.</h2></div>
        <div className="clientPanel">
          <p>{clientGallery.note}</p>
          <a className="button primary" href={whatsappLink(`Hola Stiven, vimos la galería de ${clientGallery.title} y queremos información para adquirir las fotos.`)} target="_blank" rel="noreferrer">Consultar paquete completo</a>
        </div>
      </section>

      <section className="downloadBox section">
        <div><p className="eyebrow">Descarga con PIN</p><h2>Previews protegidas para revisión.</h2><p>Ingresa el PIN para activar botones de descarga en las fotos.</p></div>
        <div className="pinBox">
          <input value={pin} onChange={(event) => setPin(event.target.value)} placeholder="PIN de 4 números" inputMode="numeric" maxLength={4} />
          <button className="button primary" onClick={verifyPin}>Activar</button>
          {pin && !pinUnlocked && pin.length >= 4 && <small>PIN incorrecto o pendiente de entrega.</small>}
          {pinUnlocked && <small className="ok">PIN correcto. Descarga activada.</small>}
        </div>
      </section>

      <section className="section galleryTools" id="galeria">
        <div><p className="eyebrow">Galería</p><h2>{filtered.length} fotografías seleccionadas</h2></div>
        <div className="filters">
          {categories.map((cat) => <button className={category === cat ? "active" : ""} onClick={() => setCategory(cat)} key={cat}>{categoryLabels[cat]}</button>)}
        </div>
      </section>

      <section className="masonry">
        {filtered.map((photo) => (
          <article className={`photoCard ${photo.orientation}`} key={photo.code}>
            <button onClick={() => setSelected(photo)} aria-label={`Abrir ${photo.title}`}>
              <SmartImage src={photo.src} alt={photo.title} />
              <span className="watermark">byStiven · preview</span>
              <span className="photoInfo"><strong>{photo.code}</strong>{photo.title}</span>
            </button>
            {pinUnlocked && <a className="downloadPhoto" href={photo.src} download={`${photo.code}-${slugify(photo.title)}.webp`}>Descargar preview</a>}
          </article>
        ))}
      </section>

      <section className="section finalCta">
        <p className="eyebrow">Siguiente paso</p>
        <h2>¿Desean la galería completa en alta calidad?</h2>
        <p>Puedo preparar una entrega final con fotos optimizadas, carpeta de descarga y selección lista para imprimir o compartir.</p>
        <a className="button primary" href={whatsappLink(`Hola Stiven, queremos adquirir la galería completa de ${clientGallery.title}.`)} target="_blank" rel="noreferrer">Comprar / coordinar entrega</a>
      </section>

      {selected && <Lightbox photo={selected} onClose={() => setSelected(null)} pinUnlocked={pinUnlocked} />}
    </main>
  );
}

function Lightbox({ photo, onClose, pinUnlocked }: { photo: GalleryPhoto; onClose: () => void; pinUnlocked: boolean }) {
  return (
    <div className="lightbox" onClick={onClose}>
      <button className="close" aria-label="Cerrar">×</button>
      <div className="lightboxInner" onClick={(event) => event.stopPropagation()}>
        <SmartImage src={photo.src} alt={photo.title} loading="eager" />
        <div className="lightboxCaption">
          <div><strong>{photo.code}</strong><p>{photo.title}</p></div>
          {pinUnlocked && <a className="button primary" href={photo.src} download={`${photo.code}-${slugify(photo.title)}.webp`}>Descargar</a>}
        </div>
      </div>
    </div>
  );
}

function slugify(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function fallbackSvg(label: string, subtitle = "preview pendiente") {
  const safeLabel = encodeURIComponent(label);
  const safeSubtitle = encodeURIComponent(subtitle);
  return `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 1600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop stop-color='%23090909'/><stop offset='.45' stop-color='%23201918'/><stop offset='1' stop-color='%23d9a441'/></linearGradient></defs><rect width='1200' height='1600' fill='url(%23g)'/><circle cx='980' cy='240' r='220' fill='%23f2b8c9' opacity='.22'/><circle cx='180' cy='1380' r='260' fill='%239c72ff' opacity='.16'/><text x='80' y='1260' fill='%23f4db9d' font-family='Arial' font-size='58' font-weight='700'>${safeLabel}</text><text x='80' y='1340' fill='white' opacity='.72' font-family='Arial' font-size='32'>${safeSubtitle}</text><text x='80' y='1435' fill='white' opacity='.38' font-family='Arial' font-size='26'>byStiven · colocar enlace real en src/data.ts</text></svg>`;
}

function SmartImage({ src, alt, className, loading = "lazy" }: { src: string; alt: string; className?: string; loading?: "lazy" | "eager" }) {
  return <img src={src} alt={alt} className={className} loading={loading} onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackSvg(alt); }} />;
}

export default App;
