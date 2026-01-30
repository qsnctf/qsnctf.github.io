document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  const EXCLUDE_TAGS = new Set([
    "CODE", "PRE", "SCRIPT", "STYLE",
    "KBD", "MATH", "SVG"
  ]);

  function walk(node) {
    // 跳过不该处理的元素
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (EXCLUDE_TAGS.has(node.tagName)) return;
      for (const child of node.childNodes) {
        walk(child);
      }
      return;
    }

    // 只处理纯文本
    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.nodeValue;
    if (!text || !text.includes("**")) return;

    const replaced = text.replace(
      /(^|\S)\*\*([^*\n]+?)\*\*/g,
      (_, prefix, content) =>
        `${prefix}<strong>${content}</strong>`
    );

    if (replaced !== text) {
      const span = document.createElement("span");
      span.innerHTML = replaced;
      node.replaceWith(span);
    }
  }

  walk(root);
});
