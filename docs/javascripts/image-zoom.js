document.addEventListener("DOMContentLoaded", () => {
  document
    .querySelectorAll(".md-content article img:not([data-zoomable])")
    .forEach(img => {
      img.setAttribute("data-zoomable", "");
    });
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".md-content img").forEach(img => {
    img.addEventListener("click", () => {
      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.85);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        cursor: zoom-out;
      `;

      const clone = img.cloneNode();
      clone.style.cssText = `
        max-width: 92%;
        max-height: 92%;
        border-radius: 12px;
        box-shadow: 0 20px 60px rgba(0,0,0,.5);
      `;

      overlay.appendChild(clone);
      overlay.addEventListener("click", () => overlay.remove());
      document.body.appendChild(overlay);
    });
  });
});


