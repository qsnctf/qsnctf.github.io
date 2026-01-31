window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
  },
  options: {
    // 只处理 arithmatex，避免污染整页
    ignoreHtmlClass: "^(?!arithmatex).*$",
  },
};

/**
 * 安全渲染 MathJax
 */
function typesetMath(nodes) {
  if (!window.MathJax?.typesetPromise) return false;

  const targets =
    nodes ||
    document.querySelectorAll(".arithmatex");

  if (!targets || targets.length === 0) return false;

  window.MathJax.typesetClear?.(targets);
  window.MathJax.typesetPromise(targets);
  return true;
}

/* ===========================
   三重兜底策略（关键）
   =========================== */

/* —— 1️⃣ Material 切页时触发（必须保留） —— */
document$.subscribe(() => {
  // 先立刻尝试
  typesetMath();

  // 50ms 后再补一刀
  setTimeout(() => typesetMath(), 50);

  // 500ms 再补一刀（兜慢加载）
  setTimeout(() => typesetMath(), 500);
});

/* —— 2️⃣ 页面首次加载兜底 —— */
window.addEventListener("load", () => {
  typesetMath();
});

/* —— 3️⃣ 监听动态插入（markmap / tab / 折叠块必备） —— */
const observer = new MutationObserver(muts => {
  for (const m of muts) {
    for (const node of m.addedNodes) {
      if (node.nodeType === 1) {
        const found =
          node.matches?.(".arithmatex") ||
          node.querySelector?.(".arithmatex");

        if (found) {
          typesetMath(node.querySelectorAll?.(".arithmatex"));
        }
      }
    }
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (root) {
    observer.observe(root, {
      childList: true,
      subtree: true
    });

    // 最后再渲染一次
    typesetMath();
  }
});
