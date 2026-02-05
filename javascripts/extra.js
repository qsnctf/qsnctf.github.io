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
        position:relative;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:20px;
        max-width:95vw;
        max-height:90vh;
      `;

        const panel = document.createElement("div");
        panel.style.cssText = `
        position:absolute;
        bottom:20px;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        gap:12px;
        background:rgba(0,0,0,0.7);
        padding:12px 16px;
        border-radius:12px;
        backdrop-filter:blur(10px);
        z-index:10;
        box-shadow:0 4px 20px rgba(0,0,0,0.3);
      `;
        
        panel.innerHTML = `
        <button data-a="in" title="放大" style="background:#4CAF50;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">➕</button>
        <button data-a="out" title="缩小" style="background:#f44336;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">➖</button>
        <button data-a="l" title="左旋转" style="background:#2196F3;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">⟲</button>
        <button data-a="r" title="右旋转" style="background:#2196F3;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">⟳</button>
        <button data-a="reset" title="重置" style="background:#FF9800;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">↺</button>
        <button data-a="close" title="关闭" style="background:#9E9E9E;color:white;border:none;border-radius:6px;width:36px;height:36px;font-size:16px;cursor:pointer;transition:all 0.2s;">✕</button>
      `;

        // 按钮悬停效果
        panel.querySelectorAll('button').forEach(btn => {
          btn.addEventListener('mouseenter', () => {
            btn.style.transform = 'scale(1.1)';
            btn.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          });
          btn.addEventListener('mouseleave', () => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
          });
        });

        const clone = img.cloneNode();
        clone.style.cssText = `
        max-width:90vw;
        max-height:80vh;
        border-radius:8px;
        box-shadow:0 15px 60px rgba(0,0,0,0.5);
        transition:transform 0.3s ease;
        z-index:1;
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

        // 添加键盘快捷键支持
        const handleKeydown = (e) => {
          if (e.key === 'Escape') overlay.remove();
          if (e.key === '+' || e.key === '=') scale += 0.2;
          if (e.key === '-' || e.key === '_') scale = Math.max(0.2, scale - 0.2);
          if (e.key === '[') rotate -= 90;
          if (e.key === ']') rotate += 90;
          if (e.key === 'r' || e.key === 'R') {
            scale = 1;
            rotate = 0;
          }
          clone.style.transform = `scale(${scale}) rotate(${rotate}deg)`;
        };
        
        overlay.addEventListener('keydown', handleKeydown);
        overlay.setAttribute('tabindex', '0');
        overlay.focus();

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


document.addEventListener("DOMContentSwitch", function() {
  // 触发 Markmap 重新扫描 DOM 并渲染
  if (typeof markmap !== 'undefined' && markmap.autoLoader) {
    markmap.autoLoader.renderAll();
  }
});