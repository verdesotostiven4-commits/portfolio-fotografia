const route = decodeURIComponent(window.location.pathname).toLowerCase().replace(/\/+$/, "");
const isMaternityGallery = route === "/galerias/maternidad-playa" || route === "/maternidad-playa";
const isMaternityAdmin = route === "/admin/maternidad" || route === "/admin/maternidad-playa";

function loadPublicScript(src: string): void {
  const script = document.createElement("script");
  script.src = src;
  script.defer = true;
  document.body.appendChild(script);
}

if (isMaternityGallery) {
  void import("./maternidad-gallery-loader");
  loadPublicScript("/maternidad-audio-auto.js");
  loadPublicScript("/maternidad-audio-gate.js");
} else if (isMaternityAdmin) {
  void import("./maternidad-admin").then(() => import("./maternidad-admin-pro"));
} else {
  void import("./main");
  ["/carousel.js", "/portfolio-polish.js", "/smooth-reveal.js", "/mobile-native.js"].forEach(loadPublicScript);
}
