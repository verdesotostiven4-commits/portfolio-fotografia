(function () {
  "use strict";

  var installed = false;
  var gateLocked = false;
  var manifestPromise = null;
  var savedBodyStyles = null;

  function installStyles() {
    if (document.getElementById("maternityClientPolishStyles")) return;

    var style = document.createElement("style");
    style.id = "maternityClientPolishStyles";
    style.textContent = [
      "html.maternityGateLocked,html.maternityGateLocked body{height:100%!important;overflow:hidden!important;overscroll-behavior:none!important}",
      "html.maternityGateLocked body{touch-action:none!important}",
      ".mag{touch-action:none!important;overscroll-behavior:none!important}",
      ".magHint{display:none!important}",
      ".magCard{padding-bottom:22px!important}",
      ".magEyebrow{margin-top:22px!important}",
      ".mag h2{max-width:13ch!important}",
      ".mag p{max-width:34ch!important}",
      ".gStage>#viewerImage[hidden],.gStage>#viewerVideo[hidden]{display:none!important}",
      ".gViewer{background:#080808!important}",
      ".gViewerTop{position:absolute!important;z-index:8!important;top:0!important;left:0!important;right:0!important;height:auto!important;padding:max(14px,env(safe-area-inset-top)) 14px 34px!important;background:linear-gradient(180deg,rgba(0,0,0,.86),rgba(0,0,0,0))!important}",
      ".gViewerButton{height:40px!important;padding:0 13px!important;border-color:rgba(255,255,255,.16)!important;background:rgba(20,20,20,.55)!important;backdrop-filter:blur(16px)!important;-webkit-backdrop-filter:blur(16px)!important}",
      ".gViewerTop>div:last-child .gViewerButton{width:40px!important;padding:0!important}",
      ".gViewerCount{font-size:11px!important;letter-spacing:.08em!important;color:rgba(255,255,255,.72)!important}",
      ".gStage{padding:max(78px,calc(60px + env(safe-area-inset-top))) 0 max(142px,calc(126px + env(safe-area-inset-bottom)))!important;background:#080808!important;overflow:hidden!important}",
      ".gStage img{width:auto!important;height:auto!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;background:#080808!important}",
      ".gStage video:not([hidden]){width:100%!important;height:100%!important;max-width:100%!important;max-height:100%!important;object-fit:contain!important;background:#000!important}",
      ".gViewerBottom{position:absolute!important;z-index:8!important;left:0!important;right:0!important;bottom:0!important;width:100%!important;max-width:none!important;padding:42px 14px max(14px,env(safe-area-inset-bottom))!important;background:linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,.94) 38%)!important}",
      ".gControls{grid-template-columns:42px minmax(0,1fr) 42px!important;gap:8px!important;max-width:620px!important;margin:0 auto!important}",
      ".gViewerNav{width:42px!important;height:46px!important;background:rgba(255,255,255,.1)!important;border-color:rgba(255,255,255,.14)!important}",
      ".gViewerDownload{height:46px!important;border-radius:999px!important;font-size:13px!important;box-shadow:0 10px 35px rgba(0,0,0,.24)!important}",
      ".gFilmstrip{max-width:620px!important;margin:9px auto 0!important;gap:6px!important;padding:0 2px!important}",
      ".gThumb{width:42px!important;height:52px!important;border-radius:10px!important;border-width:1.5px!important;opacity:.42!important}",
      ".gThumb.active{opacity:1!important;border-color:#fff!important}",
      ".gHeader .gShare{width:39px!important;height:39px!important;border:0!important;background:rgba(15,13,11,.24)!important;box-shadow:none!important}",
      ".gHeader.scrolled .gShare{background:transparent!important;color:var(--g-ink)!important}",
      ".gDownloadAll{min-height:40px!important;padding:0 13px!important;border-radius:999px!important;background:transparent!important}",
      ".gProgressCard h3{font-size:27px!important}",
      "@media(max-height:620px){.gFilmstrip{display:none!important}.gStage{padding-bottom:94px!important}.gViewerBottom{padding-top:28px!important}}"
    ].join("");
    document.head.appendChild(style);
  }

  function lockGate(gate) {
    if (gateLocked) return;
    gateLocked = true;

    window.scrollTo(0, 0);
    savedBodyStyles = {
      position: document.body.style.position,
      top: document.body.style.top,
      left: document.body.style.left,
      right: document.body.style.right,
      width: document.body.style.width,
      overflow: document.body.style.overflow
    };

    document.documentElement.classList.add("maternityGateLocked");
    document.body.style.position = "fixed";
    document.body.style.top = "0";
    document.body.style.left = "0";
    document.body.style.right = "0";
    document.body.style.width = "100%";
    document.body.style.overflow = "hidden";

    gate.addEventListener("touchmove", function (event) {
      event.preventDefault();
    }, { passive: false });

    gate.addEventListener("wheel", function (event) {
      event.preventDefault();
    }, { passive: false });
  }

  function unlockGate() {
    if (!gateLocked) return;
    gateLocked = false;
    document.documentElement.classList.remove("maternityGateLocked");

    if (savedBodyStyles) {
      document.body.style.position = savedBodyStyles.position;
      document.body.style.top = savedBodyStyles.top;
      document.body.style.left = savedBodyStyles.left;
      document.body.style.right = savedBodyStyles.right;
      document.body.style.width = savedBodyStyles.width;
      document.body.style.overflow = savedBodyStyles.overflow;
    }

    window.scrollTo(0, 0);
  }

  function polishGate(gate) {
    if (!gate || gate.dataset.clientPolished === "true") return;
    gate.dataset.clientPolished = "true";

    var eyebrow = gate.querySelector(".magEyebrow");
    var title = gate.querySelector("h2");
    var paragraph = gate.querySelector(".magCard>p:not(.magEyebrow)");
    var hint = gate.querySelector(".magHint");
    var button = gate.querySelector("#maternityAudioEnter");

    if (eyebrow) eyebrow.textContent = "Maternidad en la playa";
    if (title) title.textContent = "Bienvenidos a sus recuerdos.";
    if (paragraph) paragraph.textContent = "Una historia creada para volver a sentir este momento.";
    if (hint) hint.remove();

    lockGate(gate);

    if (button) {
      button.addEventListener("click", function () {
        var watcher = window.setInterval(function () {
          if (!document.getElementById("maternityAudioGate")) {
            window.clearInterval(watcher);
            unlockGate();
          }
        }, 40);
        window.setTimeout(function () {
          window.clearInterval(watcher);
          unlockGate();
        }, 1200);
      }, { once: true });
    }
  }

  function publicRoot() {
    var sourceElement = document.querySelector(".gHeroImage,[data-inline-video],.gCard img,.gHighlight img");
    if (!sourceElement) return "";
    var url = sourceElement.getAttribute("src") || sourceElement.getAttribute("poster") || "";
    var marker = "/maternidad-playa/";
    var index = url.indexOf(marker);
    return index >= 0 ? url.slice(0, index) : "";
  }

  function loadManifest() {
    if (manifestPromise) return manifestPromise;
    manifestPromise = new Promise(function (resolve, reject) {
      var attempts = 0;
      function tryLoad() {
        attempts += 1;
        var root = publicRoot();
        if (!root) {
          if (attempts < 40) {
            window.setTimeout(tryLoad, 150);
            return;
          }
          reject(new Error("No se encontró la galería."));
          return;
        }

        fetch(root + "/maternidad-playa/manifest.json?v=" + Date.now(), {
          cache: "no-store",
          headers: { Accept: "application/json" }
        }).then(function (response) {
          if (!response.ok) throw new Error("No se pudo leer la sesión.");
          return response.json();
        }).then(function (manifest) {
          resolve({ manifest: manifest, root: root });
        }).catch(reject);
      }
      tryLoad();
    });
    return manifestPromise;
  }

  function downloadUrl(root, item) {
    var name = item.name || "byStiven.jpg";
    var separator = String(item.originalPath).indexOf("?") >= 0 ? "&" : "?";
    return root + "/" + String(item.originalPath).replace(/^\/+/, "") + separator + "download=" + encodeURIComponent(name);
  }

  function triggerDirectDownload(url, name) {
    var anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name || "";
    anchor.target = "_blank";
    anchor.rel = "noopener";
    anchor.style.display = "none";
    document.body.appendChild(anchor);
    anchor.click();
    window.setTimeout(function () { anchor.remove(); }, 1200);
  }

  function showDownloadProgress(total) {
    var overlay = document.getElementById("downloadProgress");
    var title = overlay && overlay.querySelector("h3");
    var text = document.getElementById("downloadProgressText");
    var fill = document.getElementById("downloadProgressFill");

    if (title) title.textContent = "Guardando sus recuerdos";
    if (text) text.textContent = "Preparando " + total + " archivos…";
    if (fill) fill.style.width = "0%";
    if (overlay) overlay.hidden = false;

    return { overlay: overlay, text: text, fill: fill };
  }

  function hideDownloadProgress(progress) {
    if (!progress || !progress.overlay) return;
    window.setTimeout(function () {
      progress.overlay.hidden = true;
      if (progress.fill) progress.fill.style.width = "0%";
    }, 900);
  }

  function downloadAllSeparately(event) {
    event.preventDefault();
    event.stopPropagation();
    if (typeof event.stopImmediatePropagation === "function") event.stopImmediatePropagation();

    var button = document.getElementById("downloadAll");
    if (button && button.dataset.downloading === "true") return;
    if (button) button.dataset.downloading = "true";

    loadManifest().then(function (payload) {
      var media = Array.isArray(payload.manifest.media) ? payload.manifest.media.filter(function (item) {
        return item && item.originalPath;
      }) : [];

      if (!media.length) throw new Error("No hay archivos para guardar.");
      var progress = showDownloadProgress(media.length);
      var index = 0;

      function next() {
        if (index >= media.length) {
          if (progress.text) progress.text.textContent = "Descargas iniciadas";
          if (progress.fill) progress.fill.style.width = "100%";
          hideDownloadProgress(progress);
          if (button) button.dataset.downloading = "false";
          return;
        }

        var item = media[index];
        if (progress.text) progress.text.textContent = "Guardando " + (index + 1) + " de " + media.length;
        if (progress.fill) progress.fill.style.width = Math.round(((index + 1) / media.length) * 100) + "%";
        triggerDirectDownload(downloadUrl(payload.root, item), item.name || "byStiven-" + (index + 1));
        index += 1;
        window.setTimeout(next, 520);
      }

      next();
    }).catch(function () {
      if (button) button.dataset.downloading = "false";
      var toast = document.getElementById("toast");
      if (toast) {
        toast.textContent = "No se pudieron iniciar las descargas";
        toast.classList.add("show");
        window.setTimeout(function () { toast.classList.remove("show"); }, 2400);
      }
    });
  }

  function updateViewerDownloadLabel() {
    var count = document.getElementById("viewerCount");
    var label = document.querySelector("#downloadCurrent span");
    if (!count || !label) return;

    var index = Math.max(0, parseInt(count.textContent || "1", 10) - 1);
    loadManifest().then(function (payload) {
      var media = Array.isArray(payload.manifest.media) ? payload.manifest.media : [];
      var item = media[index];
      label.textContent = item && item.type === "video" ? "Guardar video" : "Guardar foto";
    }).catch(function () {
      label.textContent = "Guardar";
    });
  }

  function polishGallery() {
    if (installed || !document.getElementById("galleryApp")) return;
    installed = true;

    var downloadAll = document.getElementById("downloadAll");
    if (downloadAll) {
      var span = downloadAll.querySelector("span");
      if (span) span.textContent = "Guardar todas";
      downloadAll.addEventListener("click", downloadAllSeparately, true);
    }

    var shareTop = document.getElementById("shareTop");
    if (shareTop) {
      shareTop.setAttribute("aria-label", "Compartir");
      shareTop.setAttribute("title", "Compartir");
    }

    var viewerShare = document.getElementById("viewerShare");
    if (viewerShare) {
      viewerShare.setAttribute("aria-label", "Compartir");
      viewerShare.setAttribute("title", "Compartir");
    }

    var viewerCount = document.getElementById("viewerCount");
    if (viewerCount) {
      new MutationObserver(updateViewerDownloadLabel).observe(viewerCount, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener("click", function (event) {
      if (event.target && event.target.closest && event.target.closest("[data-open],[data-thumb],#prevMedia,#nextMedia")) {
        window.setTimeout(updateViewerDownloadLabel, 30);
      }
    });

    void loadManifest();
  }

  installStyles();

  var observer = new MutationObserver(function () {
    var gate = document.getElementById("maternityAudioGate");
    if (gate) polishGate(gate);
    polishGallery();
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });
  var existingGate = document.getElementById("maternityAudioGate");
  if (existingGate) polishGate(existingGate);
  polishGallery();
})();
