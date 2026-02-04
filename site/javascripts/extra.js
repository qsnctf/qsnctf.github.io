/**
 * 精简版 MkDocs Material 修复脚本
 * 仅保留：
 *  - 图片点击缩放
 *  - Markdown **加粗** 修复
 * 适配：MkDocs Material SPA 导航
 */

/* ===================== 工具函数 ===================== */

// 防抖 + requestIdleCallback（防止渲染风暴）
let runScheduled = false;
function schedule(fn) {
  if (runScheduled) return;
  runScheduled = true;

  requestIdleCallback(() => {
    runScheduled = false;
    fn();
  });
}

// 只运行一次标记
function markDone(el, key = "data-fixed") {
  el.setAttribute(key, "true");
}
function isDone(el, key = "data-fixed") {
  return el.hasAttribute(key);
}

/* ===================== 功能模块 ===================== */

/* ---- A. 加粗修复 ---- */
function fixBold(article) {
  const EXCLUDE = new Set([
    "PRE",
    "CODE",
    "SCRIPT",
    "STYLE",
    "KBD",
    "MATH",
    "SVG",
  ]);

  function walk(node) {
    if (node.nodeType === 1) {
      if (EXCLUDE.has(node.tagName)) return;
      if (isDone(node, "data-bold-fixed")) return;
      Array.from(node.childNodes).forEach(walk);
    } else if (node.nodeType === 3) {
      const val = node.nodeValue;
      if (val && val.includes("**")) {
        const span = document.createElement("span");
        span.dataset.boldFixed = "true";
        span.innerHTML = val.replace(
          /\*\*([\s\S]+?)\*\*/g,
          "<strong>$1</strong>"
        );
        node.replaceWith(span);
      }
    }
  }

  walk(article);
}

/* ---- B. 图片点击缩放 ---- */
function initImageZoom(article) {
  article
    .querySelectorAll("img:not([data-zoom-bound])")
    .forEach(img => {
      markDone(img, "data-zoom-bound");
      img.style.cursor = "zoom-in";

      img.addEventListener("click", () => {
        let scale = 1,
          rotate = 0;

        const overlay = document.createElement("div");
        overlay.style.cssText = `
        position:fixed;inset:0;
        background:rgba(0,0,0,.88);
        display:flex;align-items:center;justify-content:center;
        z-index:999999;backdrop-filter:blur(5px);
        cursor:zoom-out;
      `;

        const wrapper = document.createElement("div");
        wrapper.style.cssText = `
        display:flex;flex-direction:column;
        align-items:center;gap:15px;
      `;

        const clone = img.cloneNode();
        clone.style.cssText = `
        max-width:90vw;max-height:80vh;
        border-radius:8px;
        box-shadow:0 10px 50px rgba(0,0,0,0.5);
        transition:transform .2s;
      `;

        const panel = document.createElement("div");
        panel.innerHTML = `
        <button data-a="in">➕</button>
        <button data-a="out">➖</button>
        <button data-a="l">⟲</button>
        <button data-a="r">⟳</button>
        <button data-a="reset">↺</button>
        <button data-a="close">✕</button>
      `;

        panel.onclick = e => {
          const a = e.target.dataset.a;
          if (a === "in") scale += 0.2;
          if (a === "out") scale = Math.max(0.2, scale - 0.2);
          if (a === "l") rotate -= 90;
          if (a === "r") rotate += 90;
          if (a === "reset") {
            scale = 1;
            rotate = 0;
          }
          if (a === "close") overlay.remove();

          clone.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        };

        overlay.onclick = e => {
          if (e.target === overlay) overlay.remove();
        };

        wrapper.append(clone, panel);
        overlay.append(wrapper);
        document.body.append(overlay);
      });
    });
}

/* ===================== 统一入口 ===================== */

function runAllFixes() {
  const article = document.querySelector(".md-content article");
  if (!article) return;

  fixBold(article);
  initImageZoom(article);
}

/* ===================== MkDocs Material SPA 适配 ===================== */

document$.subscribe(() => {
  schedule(runAllFixes);

  [300, 1500, 4000].forEach(d =>
    setTimeout(() => schedule(runAllFixes), d)
  );

  const article = document.querySelector(".md-content article");
  if (article) {
    const observer = new MutationObserver(() =>
      schedule(runAllFixes)
    );
    observer.observe(article, {
      childList: true,
      subtree: false,
    });
  }
});
