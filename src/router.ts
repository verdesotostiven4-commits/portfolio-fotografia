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
} else if (isMaternityAdmin) {
  void import("./maternidad-admin");
} else {
  void import("./main");
  ["/carousel.js", "/portfolio-polish.js", "/smooth-reveal.js", "/mobile-native.js"].forEach(loadPublicScript);
}
