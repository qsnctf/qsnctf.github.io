/**
 * =====================================================
 * MkDocs Material 增强修复脚本（统一稳定版）
 * 功能：
 *  - Markmap 修复 + 强制渲染
 *  - MathJax SVG 渲染（无 CSS 报错）
 *  - 图片点击缩放
 *  - Markdown **加粗** 修复
 *  - 主题配色持久化
 *  - 中英自动排版（pangu）
 * 适配：MkDocs Material SPA 导航
 * =====================================================
 */



/* ===================== 2. Markmap Base64 修复 ===================== */

(function patchAtob() {
  const originalAtob = window.atob;
  window.atob = function (str) {
    try {
      return originalAtob(str);
    } catch (e) {
      if (e instanceof DOMException || e.name === "InvalidCharacterError") {
        const safe = str.replace(/-/g, "+").replace(/_/g, "/");
        const binary = Uint8Array.from(originalAtob(safe), c =>
          c.charCodeAt(0)
        );
        return new TextDecoder("utf-8").decode(binary);
      }
      throw e;
    }
  };
})();

/* ===================== 3. 工具函数 ===================== */

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

/* ===================== 4. 主题恢复 ===================== */

function restoreTheme() {
  const body = document.body;

  const p = localStorage.getItem("data-md-color-primary");
  if (p) body.setAttribute("data-md-color-primary", p);

  const a = localStorage.getItem("data-md-color-accent");
  if (a) body.setAttribute("data-md-color-accent", a);

  const s = localStorage.getItem("data-md-color-scheme");
  if (s) body.setAttribute("data-md-color-scheme", s);
}

/* ===================== 5. 功能模块 ===================== */

/* ---- A. Markmap 强制渲染 ---- */
async function forceMarkmapRender(article) {
  const containers = article.querySelectorAll(".language-markmap");
  if (!containers.length) return;
  if (!window.markmap || !window.markmap.Markmap) return;

  const { Markmap, loadPlugins, deriveOptions } = window.markmap;

  for (const container of containers) {
    if (isDone(container, "data-markmap-fixed")) continue;

    const dataTag = container.querySelector("markmap-data");
    if (!dataTag) continue;

    try {
      const json = JSON.parse(dataTag.textContent);

      container.querySelector("svg")?.remove();

      const svg = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "svg"
      );
      svg.classList.add("markmap");
      svg.style.cssText = "width:100%;min-height:400px;";
      container.appendChild(svg);

      const opts = deriveOptions(json.opts);
      const mm = Markmap.create(svg, opts, json.root);

      if (json.features) {
        await loadPlugins(json.features);
        mm.setData(json.root);
        mm.fit();
      }

      markDone(container, "data-markmap-fixed");
      console.log("✅ Markmap 渲染完成");
    } catch (err) {
      console.warn("Markmap 渲染失败，等待重试", err);
    }
  }
}



/* ---- C. 加粗修复 ---- */
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

/* ---- D. 图片点击缩放 ---- */
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

/* ---- E. Pangu 自动加空格 ---- */
function applyPangu(article) {
  if (window.pangu) {
    window.pangu.spacingElement(article);
  }
}

/* ===================== 6. 统一入口 ===================== */

function runAllFixes() {
  const article = document.querySelector(".md-content article");
  if (!article) return;

  restoreTheme();
  fixBold(article);
  initImageZoom(article);
  forceMarkmapRender(article);
  applyPangu(article);
}

/* ===================== 7. MkDocs Material SPA 适配 ===================== */

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
