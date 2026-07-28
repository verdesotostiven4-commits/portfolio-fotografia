import { useEffect, useMemo, useState, type MouseEvent } from "react";
import {
  clientGalleries,
  photographer,
  portfolioWorks,
  seaLionArt,
  specialties,
  type ClientGallery,
  type GalleryCategory,
  type GalleryPhoto,
} from "./data";

const categoryLabels: Record<GalleryCategory | "todos", string> = {
  todos: "Todas",
  emocion: "Emoción",
  retrato: "Retratos",
  vals: "Vals",
  decoracion: "Decoración",
  detalle: "Detalles",
  editorial: "Editorial",
  momento: "Momentos",
};

function whatsapp(message: string) {
  return `https://wa.me/${photographer.whatsappNumber}?text=${encodeURIComponent(message)}`;
}

function galleryFromPath(): ClientGallery | undefined {
  const segments = decodeURIComponent(window.location.pathname)
    .toLowerCase()
    .split("/")
    .filter(Boolean);
  const slug = segments[segments.length - 1] ?? "";
  return clientGalleries.find(
    (gallery) => gallery.slug === slug || gallery.aliases?.includes(slug),
  );
}

function isGalleryRoute() {
  return decodeURIComponent(window.location.pathname).toLowerCase().includes("/galerias/") ||
    /alausi15|alausí15/i.test(decodeURIComponent(window.location.pathname));
}

export default function App() {
  if (isGalleryRoute()) {
    const gallery = galleryFromPath();
    return gallery ? <ClientGalleryPage gallery={gallery} /> : <GalleryNotFound />;
  }
  return <PortfolioHome />;
}

function Brand({ dark = false }: { dark?: boolean }) {
  return (
    <a className={`brand ${dark ? "brandDark" : ""}`} href="/" aria-label="Inicio byStiven">
      <span>by</span>Stiven
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const close = () => setOpen(false);
    window.addEventListener("hashchange", close);
    return () => window.removeEventListener("hashchange", close);
  }, []);

  return (
    <header className="siteHeader">
      <Brand />
      <button
        className="menuButton"
        type="button"
        aria-expanded={open}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setOpen((value) => !value)}
      >
        <span />
        <span />
      </button>
      <nav className={open ? "siteNav open" : "siteNav"} aria-label="Navegación principal">
        <a href="#trabajo">Trabajo</a>
        <a href="#especialidades">Servicios</a>
        <a href="#proceso">Proceso</a>
        <a href="#equipo">Sobre mí</a>
        <a className="navCta" href="#contacto">Reservar</a>
      </nav>
    </header>
  );
}

function PortfolioHome() {
  const [activeType, setActiveType] = useState("Todo");
  const types = ["Todo", ...Array.from(new Set(portfolioWorks.map((work) => work.type)))];
  const visibleWorks = activeType === "Todo"
    ? portfolioWorks
    : portfolioWorks.filter((work) => work.type === activeType);

  useEffect(() => {
    document.title = "byStiven · Fotografía en Galápagos";
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "index,follow");
  }, []);

  return (
    <main className="portfolioPage">
      <section className="hero" id="inicio">
        <div
          className="heroBackground"
          style={{ backgroundImage: `url(${photographer.heroBackground})` }}
          aria-hidden="true"
        />
        <div className="heroShade" aria-hidden="true" />
        <img className="heroSubject" src={photographer.heroSubject} alt="" aria-hidden="true" />
        <Header />
        <div className="heroContent">
          <p className="eyebrow light">{photographer.location}</p>
          <h1>Fotografía cinematográfica, elegante y real.</h1>
          <p className="heroLead">
            Soy {photographer.name}. Creo recuerdos con dirección, emoción y una entrega digital que se siente profesional desde el primer clic.
          </p>
          <div className="actions">
            <a className="button primary" href="#trabajo">Explorar portafolio</a>
            <a className="button glass" href={photographer.instagramUrl} target="_blank" rel="noreferrer">Instagram · {photographer.handle}</a>
          </div>
          <div className="heroFacts" aria-label="Información de disponibilidad">
            <span><b>Base</b>{photographer.location}</span>
            <span><b>Sesiones</b>Eventos · Parejas · Maternidad</span>
            <span><b>Viajes</b>Disponible bajo coordinación</span>
          </div>
        </div>
        <a className="scrollCue" href="#trabajo" aria-label="Bajar al portafolio">Desliza <span>↓</span></a>
      </section>

      <section className="intro section" id="trabajo">
        <div>
          <p className="eyebrow">Portafolio</p>
          <h2>Historias visuales con estética editorial y emoción verdadera.</h2>
        </div>
        <div className="introCopy">
          <p>
            No se trata solamente de tomar una foto. Se trata de cuidar la luz, guiar sin forzar, anticipar el momento y entregar una experiencia fácil de disfrutar y compartir.
          </p>
          <a className="textLink" href="#galeria">Ver obras seleccionadas <span>↗</span></a>
        </div>
      </section>

      <section className="fineArt section">
        <div className="fineArtVisual">
          <span className="fineArtWord" aria-hidden="true">Fine Art</span>
          <img src={seaLionArt} alt="Lobo marino sobre una roca, fotografía fine art" loading="lazy" />
        </div>
        <div className="fineArtCopy">
          <p className="eyebrow">Galápagos Fine Art</p>
          <h2>Naturaleza con un toque artístico.</h2>
          <p>
            La vida salvaje también puede sentirse minimalista y cinematográfica. El espacio limpio y el movimiento sutil convierten la imagen en una pieza protagonista.
          </p>
          <div className="chips"><span>Vida salvaje</span><span>Blanco y negro</span><span>Fine art</span><span>Galápagos</span></div>
        </div>
      </section>

      <section className="specialties section" id="especialidades">
        <div className="sectionHeading">
          <p className="eyebrow">Especialidades</p>
          <h2>Una misma firma visual para historias diferentes.</h2>
          <p>Elige el tipo de experiencia que quieres recordar.</p>
        </div>
        <div className="specialtyGrid">
          {specialties.map((item) => (
            <article className="specialtyCard" key={item.title}>
              <img src={item.image} alt={item.title} loading="lazy" draggable={false} />
              <div className="cardShade" />
              <div className="cardCopy"><span>{item.number}</span><h3>{item.title}</h3><p>{item.text}</p></div>
            </article>
          ))}
        </div>
      </section>

      <section className="selectedWork section" id="galeria">
        <div className="sectionHeading inverted">
          <p className="eyebrow light">Obras seleccionadas</p>
          <h2>Explora el estilo, la luz y la forma de contar cada historia.</h2>
        </div>
        <div className="workFilters" role="group" aria-label="Filtrar portafolio">
          {types.map((type) => (
            <button className={activeType === type ? "active" : ""} type="button" key={type} onClick={() => setActiveType(type)}>{type}</button>
          ))}
        </div>
        <div className="workGrid">
          {visibleWorks.map((work) => (
            <article className={`workCard ${work.shape}`} key={`${work.title}-${work.type}`}>
              <img src={work.image} alt={work.title} loading="lazy" draggable={false} />
              <div><span>{work.type}</span><h3>{work.title}</h3></div>
            </article>
          ))}
        </div>
        <p className="portfolioNote">Las imágenes publicadas aquí son copias optimizadas para web. Los archivos originales se entregan únicamente a cada cliente.</p>
      </section>

      <section className="process section" id="proceso">
        <div className="sectionHeading">
          <p className="eyebrow">La experiencia</p>
          <h2>Simple para ti. Cuidada en cada detalle.</h2>
        </div>
        <div className="processGrid">
          <article><span>01</span><h3>Conectamos</h3><p>Conversamos sobre la idea, el lugar, el horario y lo que quieres sentir al ver las fotografías.</p></article>
          <article><span>02</span><h3>Creamos</h3><p>Te guío con naturalidad, cuido la luz y dejo espacio para que sucedan momentos reales.</p></article>
          <article><span>03</span><h3>Entrego</h3><p>Recibes una galería privada para revisar y, después de coordinar, tus archivos finales en alta calidad.</p></article>
        </div>
      </section>

      <section className="about section" id="equipo">
        <div className="aboutPhoto"><img src={photographer.portraitPhoto} alt={`${photographer.name}, fotógrafo`} loading="lazy" /></div>
        <div className="aboutCopy">
          <p className="eyebrow light">Detrás de cámara</p>
          <h2>{photographer.name}</h2>
          <p>{photographer.tagline}</p>
          <p className="aboutSmall">Mi objetivo es que la experiencia se sienta cercana y que el resultado conserve personalidad, emoción y calidad con el paso del tiempo.</p>
          <div className="gear">{photographer.gear.map((item) => <span key={item}>{item}</span>)}</div>
          <div className="actions">
            <a className="button primary" href={whatsapp("Hola Stiven, vi tu portafolio y quiero conversar sobre una sesión o evento.")} target="_blank" rel="noreferrer">Cotizar por WhatsApp</a>
            <a className="button glass" href={photographer.instagramUrl} target="_blank" rel="noreferrer">Ver Instagram</a>
          </div>
        </div>
      </section>

      <section className="finalCta section" id="contacto">
        <p className="eyebrow light">Reservas</p>
        <h2>Tu historia merece verse tan especial como se sintió.</h2>
        <p>Cuéntame qué tienes en mente y armamos una experiencia hecha para ti.</p>
        <a className="button primary" href={whatsapp("Hola Stiven, quiero reservar una sesión de fotos. Esta es mi idea:")} target="_blank" rel="noreferrer">Hablar con Stiven</a>
      </section>

      <footer><Brand /><p>Fotografía en Galápagos · Ecuador</p><a href={photographer.instagramUrl} target="_blank" rel="noreferrer">{photographer.handle}</a></footer>
    </main>
  );
}

function ClientGalleryPage({ gallery }: { gallery: ClientGallery }) {
  const [category, setCategory] = useState<GalleryCategory | "todos">("todos");
  const [selectedPhoto, setSelectedPhoto] = useState<GalleryPhoto | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const categories = useMemo(
    () => ["todos", ...Array.from(new Set(gallery.photos.map((photo) => photo.category)))] as Array<GalleryCategory | "todos">,
    [gallery.photos],
  );
  const visiblePhotos = category === "todos"
    ? gallery.photos
    : gallery.photos.filter((photo) => photo.category === category);

  useEffect(() => {
    document.title = `${gallery.title} · Galería privada byStiven`;
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow,noarchive");
    return () => document.querySelector('meta[name="robots"]')?.setAttribute("content", "index,follow");
  }, [gallery.title]);

  function toggleFavorite(code: string) {
    setFavorites((current) => current.includes(code)
      ? current.filter((item) => item !== code)
      : [...current, code]);
  }

  async function copyLink() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  const favoriteMessage = favorites.length
    ? `Hola Stiven, revisamos la galería de ${gallery.title}. Nuestras fotos favoritas son: ${favorites.join(", ")}. Queremos coordinar el aporte y la entrega final.`
    : gallery.contributionMessage;

  return (
    <main className="clientPage" onContextMenu={(event: MouseEvent<HTMLElement>) => event.preventDefault()}>
      <header className="clientHeader"><Brand /><button type="button" onClick={copyLink}>{copied ? "Enlace copiado" : "Compartir galería"}</button></header>
      <section className="clientHero">
        <img src={gallery.cover} alt="" aria-hidden="true" draggable={false} />
        <div className="clientHeroShade" />
        <div className="clientHeroContent">
          <p className="eyebrow light">Entrega privada · byStiven</p>
          <h1>{gallery.title}</h1>
          <p>{gallery.subtitle}</p>
          <div className="actions"><a className="button primary" href="#fotos">Ver fotografías</a><a className="button glass" href="/">Conocer el portafolio</a></div>
        </div>
      </section>

      <section className="clientIntro section">
        <div><p className="eyebrow light">Vista previa para cliente</p><h2>Revisa, disfruta y marca tus favoritas.</h2></div>
        <div className="previewPanel">
          <p>{gallery.note}</p>
          <ul><li>Copias optimizadas para visualización.</li><li>Marca de agua de vista previa.</li><li>Sin descarga de originales antes de coordinar.</li></ul>
        </div>
      </section>

      <section className="galleryToolbar section" id="fotos">
        <div><p className="eyebrow light">Galería privada</p><h2>{visiblePhotos.length} fotografías</h2><p>Toca el corazón para guardar una selección.</p></div>
        <div className="galleryFilters">{categories.map((item) => <button className={category === item ? "active" : ""} type="button" key={item} onClick={() => setCategory(item)}>{categoryLabels[item]}</button>)}</div>
      </section>

      <section className="clientMasonry" aria-label="Fotografías de la galería">
        {visiblePhotos.map((photo) => (
          <article className={`clientPhoto ${photo.orientation}`} key={photo.code}>
            <button className="photoOpen" type="button" onClick={() => setSelectedPhoto(photo)} aria-label={`Abrir ${photo.code}`}>
              <img src={photo.src} alt={photo.title} loading="lazy" draggable={false} />
              <Watermark />
              <span className="photoLabel"><b>{photo.code}</b>{photo.title}</span>
            </button>
            <button className={favorites.includes(photo.code) ? "favorite active" : "favorite"} type="button" onClick={() => toggleFavorite(photo.code)} aria-label={favorites.includes(photo.code) ? `Quitar ${photo.code} de favoritas` : `Agregar ${photo.code} a favoritas`}>{favorites.includes(photo.code) ? "♥" : "♡"}</button>
          </article>
        ))}
      </section>

      <section className="selectionBar" aria-live="polite">
        <div><b>{favorites.length}</b><span>{favorites.length === 1 ? "favorita" : "favoritas"}</span></div>
        <a href={whatsapp(favoriteMessage)} target="_blank" rel="noreferrer">{favorites.length ? "Enviar selección" : "Coordinar entrega"}</a>
      </section>

      <section className="clientFinal section">
        <p className="eyebrow light">Entrega final</p>
        <h2>¿Te gustó el resultado?</h2>
        <p>Coordina directamente con Stiven el aporte acordado y recibe las fotografías finales sin marca de agua y en alta calidad.</p>
        <a className="button primary" href={whatsapp(favoriteMessage)} target="_blank" rel="noreferrer">Coordinar aporte y entrega</a>
      </section>

      {selectedPhoto && <Lightbox photo={selectedPhoto} favorite={favorites.includes(selectedPhoto.code)} onFavorite={() => toggleFavorite(selectedPhoto.code)} onClose={() => setSelectedPhoto(null)} />}
    </main>
  );
}

function Watermark() {
  return <span className="watermark" aria-hidden="true"><i>byStiven · VISTA PREVIA</i><i>byStiven · VISTA PREVIA</i><i>byStiven · VISTA PREVIA</i></span>;
}

function Lightbox({ photo, favorite, onFavorite, onClose }: { photo: GalleryPhoto; favorite: boolean; onFavorite: () => void; onClose: () => void }) {
  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => { if (event.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.title} onClick={onClose}>
      <button className="lightboxClose" type="button" onClick={onClose} aria-label="Cerrar">×</button>
      <div className="lightboxInner" onClick={(event: MouseEvent<HTMLDivElement>) => event.stopPropagation()}>
        <div className="lightboxImage"><img src={photo.src} alt={photo.title} draggable={false} /><Watermark /></div>
        <div className="lightboxCaption"><div><b>{photo.code}</b><p>{photo.title}</p></div><button type="button" className={favorite ? "favoriteAction active" : "favoriteAction"} onClick={onFavorite}>{favorite ? "♥ Guardada" : "♡ Marcar favorita"}</button></div>
      </div>
    </div>
  );
}

function GalleryNotFound() {
  useEffect(() => {
    document.title = "Galería no disponible · byStiven";
    document.querySelector('meta[name="robots"]')?.setAttribute("content", "noindex,nofollow");
  }, []);

  return (
    <main className="notFound"><Brand /><div><p className="eyebrow light">Galería privada</p><h1>Este enlace no está disponible.</h1><p>Puede haber expirado o estar escrito de forma incorrecta. Solicita a Stiven un enlace actualizado.</p><a className="button primary" href={whatsapp("Hola Stiven, el enlace de mi galería no está disponible. ¿Me ayudas con uno actualizado?")} target="_blank" rel="noreferrer">Contactar a Stiven</a></div></main>
  );
}
