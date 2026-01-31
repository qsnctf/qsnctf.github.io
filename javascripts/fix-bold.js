document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  const EXCLUDE_TAGS = new Set([
    "PRE", "CODE", "SCRIPT", "STYLE", "KBD", "MATH", "SVG"
  ]);

  function walk(node) {
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (EXCLUDE_TAGS.has(node.tagName)) return;
      for (const child of node.childNodes) walk(child);
      return;
    }

    if (node.nodeType !== Node.TEXT_NODE) return;

    let text = node.nodeValue;
    if (!text || !text.includes("**")) return;

    // 保护行内 code
    const codes = [];
    text = text.replace(/`[^`]+`/g, m => {
      codes.push(m);
      return `@@CODE_${codes.length - 1}@@`;
    });

    // ✅ 修复 **内容**
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
    }
  }

  walk(root);
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

