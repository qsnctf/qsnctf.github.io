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
