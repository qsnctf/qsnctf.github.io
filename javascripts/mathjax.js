// docs/javascripts/mathjax.js
window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
  },
  options: {
    // 关键：别让它全页乱扫
    ignoreHtmlClass: ".*",
    processHtmlClass: "arithmatex",
  },
};

document$.subscribe(() => {
  if (!window.MathJax?.typesetPromise) return;
  const nodes = document.querySelectorAll(".arithmatex");
  window.MathJax.typesetClear?.(nodes);
  window.MathJax.typesetPromise(nodes);
});
