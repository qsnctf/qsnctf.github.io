document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  const EXCLUDE_TAGS = new Set([
    "PRE", "CODE", "SCRIPT", "STYLE", "KBD", "MATH", "SVG"
  ]);

  function processText(node) {
    let text = node.nodeValue;
    if (!text || !text.includes("**")) return false;

    // 保护行内 code
    const codes = [];
    text = text.replace(/`[^`]+`/g, m => {
      codes.push(m);
      return `@@CODE_${codes.length - 1}@@`;
    });

    // 统一修复加粗（行首/紧贴/跨空格都支持）
    text = text.replace(
      /\*\*([\s\S]+?)\*\*/g,
      "<strong>$1</strong>"
    );

    // 还原 code
    text = text.replace(/@@CODE_(\d+)@@/g, (_, i) => codes[i]);

    if (text !== node.nodeValue) {
      const span = document.createElement("span");
      span.innerHTML = text;
      node.replaceWith(span);
      return true;
    }
    return false;
  }

  function walk(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (EXCLUDE_TAGS.has(node.tagName)) return;
      for (const child of node.childNodes) walk(child);
      return;
    }
    if (node.nodeType === Node.TEXT_NODE) {
      processText(node);
    }
  }

  // ==== 关键 1：首次执行 ====
  walk(root);

  // ==== 关键 2：轮询补救（解决“第一次进不生效”） ====
  let tries = 0;
  const maxTries = 12;   // 约 6 秒
  const timer = setInterval(() => {
    walk(root);
    if (++tries >= maxTries) clearInterval(timer);
  }, 500);

  // ==== 关键 3：监听 DOM 变化（动态内容必备） ====
  const observer = new MutationObserver(mutations => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.nodeType === Node.TEXT_NODE) {
          processText(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          walk(node);
        }
      }
    }
  });

  observer.observe(root, {
    childList: true,
    subtree: true
  });
});



document.addEventListener("DOMContentLoaded", () => {
  const container = document.querySelector(".language-markmap");
  if (!container) return;

  // 先插个加载提示
  const tip = document.createElement("div");
  tip.innerText = "⏳ 知识树加载中...";
  tip.style.cssText = `
    text-align:center;
    padding: 2rem;
    color: var(--md-accent-fg-color);
    font-weight: 600;
  `;
  container.prepend(tip);

  let tries = 0;
  const maxTries = 20;
  const interval = 500;

  const checker = setInterval(() => {
    tries++;

    const svg = container.querySelector("svg");
    if (!svg || svg.getBoundingClientRect().height < 10) {
      const data = container.querySelector("markmap-data");
      if (data) data.dispatchEvent(new Event("markmap:rerender"));
    } else {
      tip.remove();      // 渲染成功就移除提示
      clearInterval(checker);
    }

    if (tries >= maxTries) clearInterval(checker);
  }, interval);
});

/* ======================================================
   修复 Markmap Base64 中文解码错误（必加）
   Fix: InvalidCharacterError: Failed to execute 'atob'
   ====================================================== */

(function patchMarkmapDecoder() {
  const originalAtob = window.atob;

  window.atob = function (str) {
    try {
      return originalAtob(str);
    } catch (e) {
      if (e instanceof DOMException || e.name === "InvalidCharacterError") {
        console.warn("🔧 Markmap Base64 UTF-8 修复已启用");

        // 关键修复：UTF-8 安全解码
        const binary = Uint8Array.from(
          atob(str.replace(/-/g, "+").replace(/_/g, "/")),
          c => c.charCodeAt(0)
        );

        const decoder = new TextDecoder("utf-8");
        return decoder.decode(binary);
      }
      throw e;
    }
  };
})();
