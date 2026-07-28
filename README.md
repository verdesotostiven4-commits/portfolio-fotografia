# byStiven · Portfolio Fotografía

Portafolio responsive en React + Vite para fotografía de eventos, parejas, maternidad, retrato y naturaleza, con galerías privadas de vista previa para clientes.

## Qué cambió

- Una sola aplicación responsive para celular, tablet y computadora.
- Eliminación de la página móvil duplicada y de los parches que modificaban el DOM.
- Portafolio público con filtros, especialidades, proceso y contacto.
- Galerías de cliente sin PIN visible ni botones de descarga.
- Marca de agua visual, selección de favoritas y envío de códigos por WhatsApp.
- SEO básico, Open Graph y `noindex` para rutas de galerías.

## Protección de fotos

La web no ofrece descargas de originales. En las galerías se deben usar **copias web reducidas y con la marca de agua incorporada en el archivo**. La marca de agua de la interfaz es una protección adicional, pero no sustituye una marca horneada en la imagen.

Flujo recomendado:

1. Exportar previews a 1600 px en el lado largo y calidad JPEG/WebP aproximada de 70–80%.
2. Incorporar `byStiven · VISTA PREVIA` sobre cada preview antes de subirla.
3. Publicar solamente esas previews en la galería.
4. Después de recibir el aporte o pago, entregar los originales mediante Google Drive, Dropbox, WeTransfer o almacenamiento con enlaces temporales.

No existe una forma de impedir totalmente una captura de pantalla. La protección efectiva consiste en no publicar los originales antes de la entrega final.

## Agregar una galería nueva

Editar `src/data.ts` y añadir un objeto a `clientGalleries`:

```ts
{
  slug: "maternidad-nombres",
  title: "Sesión de maternidad",
  subtitle: "Playa · julio de 2026",
  cover: "URL_DE_PREVIEW",
  note: "Vista previa para revisar el trabajo.",
  contributionMessage: "Hola Stiven, nos gustó la sesión y queremos coordinar el aporte y la entrega final.",
  photos: [
    {
      code: "MAT-01",
      title: "Caminando junto al mar",
      category: "emocion",
      src: "URL_DE_PREVIEW_CON_MARCA",
      orientation: "horizontal"
    }
  ]
}
```

El enlace quedará así:

`https://TU-DOMINIO/galerias/maternidad-nombres`

## Desarrollo

```bash
npm install
npm run dev
npm run build
```
