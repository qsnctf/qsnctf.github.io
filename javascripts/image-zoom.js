document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  function makeZoomable(img) {
    if (img.dataset.zoomBound) return;
    img.dataset.zoomBound = "true";
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
      let scale = 1;
      let rotate = 0;

      const overlay = document.createElement("div");
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,.88);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 999999;
        cursor: zoom-out;
        backdrop-filter: blur(4px);
      `;

      const wrapper = document.createElement("div");
      wrapper.style.cssText = `
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 12px;
      `;

      const clone = img.cloneNode();
      clone.style.cssText = `
        max-width: 92vw;
        max-height: 82vh;
        border-radius: 14px;
        box-shadow: 0 20px 70px rgba(0,0,0,.6);
        transition: transform .15s ease;
        transform-origin: center center;
        animation: zoomIn .2s ease-out;
      `;

      // ====== 控制面板 ======
      const panel = document.createElement("div");
      panel.innerHTML = `
        <button data-act="zoom-in">➕</button>
        <button data-act="zoom-out">➖</button>
        <button data-act="rotate-l">⟲</button>
        <button data-act="rotate-r">⟳</button>
        <button data-act="reset">↺</button>
        <button data-act="close">✕</button>
      `;

      panel.style.cssText = `
        display: flex;
        gap: 10px;
        background: rgba(0,0,0,.65);
        padding: 8px 12px;
        border-radius: 12px;
        backdrop-filter: blur(6px);
      `;

      panel.querySelectorAll("button").forEach(btn => {
        btn.style.cssText = `
          border: none;
          background: rgba(255,255,255,.12);
          color: #e5e5e5;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
          transition: all .15s;
        `;
        btn.onmouseenter = () =>
          (btn.style.background = "rgba(0,255,160,.25)");
        btn.onmouseleave = () =>
          (btn.style.background = "rgba(255,255,255,.12)");
      });

      function applyTransform() {
        clone.style.transform =
          `scale(${scale}) rotate(${rotate}deg)`;
      }

      panel.addEventListener("click", e => {
        const act = e.target.dataset.act;
        if (!act) return;

        switch (act) {
          case "zoom-in":
            scale = Math.min(scale + 0.2, 5);
            break;
          case "zoom-out":
            scale = Math.max(scale - 0.2, 0.2);
            break;
          case "rotate-l":
            rotate -= 90;
            break;
          case "rotate-r":
            rotate += 90;
            break;
          case "reset":
            scale = 1;
            rotate = 0;
            break;
          case "close":
            overlay.remove();
            return;
        }
        applyTransform();
      });

      wrapper.appendChild(clone);
      wrapper.appendChild(panel);
      overlay.appendChild(wrapper);

      overlay.addEventListener("click", e => {
        if (e.target === overlay) overlay.remove();
      });

      document.body.appendChild(overlay);
    });
  }

  function scanImages(container) {
    container
      .querySelectorAll("img:not([data-zoom-bound])")
      .forEach(makeZoomable);
  }

  // 首次扫描
  scanImages(root);

  // 轮询补救
  let tries = 0;
  const maxTries = 12;
  const timer = setInterval(() => {
    scanImages(root);
    if (++tries >= maxTries) clearInterval(timer);
  }, 500);

  // 监听动态插入
  const observer = new MutationObserver(muts => {
    for (const m of muts) {
      for (const node of m.addedNodes) {
        if (node.nodeType === 1) {
          if (node.tagName === "IMG") makeZoomable(node);
          else scanImages(node);
        }
      }
    }
  });

  observer.observe(root, { childList: true, subtree: true });

  // 动画
  const style = document.createElement("style");
  style.innerHTML = `
  @keyframes zoomIn {
    from { transform: scale(.95); opacity: .8; }
    to   { transform: scale(1);  opacity: 1; }
  }
  `;
  document.head.appendChild(style);
});
