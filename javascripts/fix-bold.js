document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector(".md-content article");
  if (!root) return;

  const EXCLUDE_TAGS = new Set([
    "CODE", "PRE", "SCRIPT", "STYLE", "KBD",
    "MATH", "SVG"
  ]);

  function walk(node) {
    // 跳过不该处理的标签
    if (node.nodeType === Node.ELEMENT_NODE) {
      if (EXCLUDE_TAGS.has(node.tagName)) return;
      for (const child of node.childNodes) {
        walk(child);
      }
      return;
    }

    // 只处理纯文本节点
    if (node.nodeType !== Node.TEXT_NODE) return;

    const text = node.nodeValue;

    // 必须包含 ** 才处理
    if (!text || !text.includes("**")) return;

    // 关键正则：
    // 捕获：非空白前缀 + **内容**
    const replaced = text.replace(
      /(\S)\*\*([^*\n]+?)\*\*/g,
      "$1<strong>$2</strong>"
    );

    if (replaced !== text) {
      const span = document.createElement("span");
      span.innerHTML = replaced;
      node.replaceWith(span);
    }
  }

  walk(root);
});
