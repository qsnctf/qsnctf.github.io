window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
  },
  options: {
    ignoreHtmlClass: "^(?!arithmatex).*$",
  },
};

/* ============ 核心渲染函数（已重写） ============ */
function safeTypeset(nodes) {
  if (!window.MathJax?.typesetPromise) return false;

  const targets =
    nodes ||
    document.querySelectorAll(".arithmatex");

  if (!targets || targets.length === 0) return false;

  try {
    // 关键：先清理旧渲染，再延迟重渲染
    window.MathJax.typesetClear?.(targets);

    // 非常关键：微延迟，避免被 Material DOM 更新覆盖
    setTimeout(() => {
      window.MathJax.typesetPromise(targets);
    }, 30);

    return true;
  } catch (e) {
    console.warn("MathJax render failed, retrying:", e);
    setTimeout(() => safeTypeset(targets), 100);
    return false;
  }
}

/* ============ 兜底策略 A：Material 切页 ============ */
document$.subscribe(() => {
  // 三级重试
  safeTypeset();
  setTimeout(() => safeTypeset(), 80);
  setTimeout(() => safeTypeset(), 400);
});

/* ============ 兜底策略 B：页面首次加载 ============ */
window.addEventListener("load", () => {
  safeTypeset();
});

/* ============ 兜底策略 C：监听动态内容（关键修复空白） ============ */
const observer = new MutationObserver(muts => {
  let needRender = false;

  for (const m of muts) {
    for (const node of m.addedNodes) {
      if (node.nodeType === 1) {
        if (
          node.matches?.(".arithmatex") ||
          node.querySelector?.(".arithmatex")
        ) {
          needRender = true;
        }
      }
    }
  }

  if (needRender) {
    // 延迟一下，防止和 Material 冲突
    setTimeout(() => safeTypeset(), 40);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  observer.observe(root, {
    childList: true,
    subtree: true,
  });

  // 最后兜一遍
  safeTypeset();
});
