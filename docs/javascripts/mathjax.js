window.MathJax = {
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
  },
  options: {
    // 只忽略“不是 arithmatex 的内容”，避免误伤整页
    ignoreHtmlClass: "^(?!arithmatex).*$",
  },
};

function typesetMath() {
  if (!window.MathJax?.typesetPromise) return false;
  const nodes = document.querySelectorAll(".arithmatex");
  window.MathJax.typesetClear?.(nodes);
  window.MathJax.typesetPromise(nodes);
  return true;
}

document$.subscribe(() => {
  // 首次进入/切页都尝试渲染；如果 MathJax 还没加载好，下一轮再试一次
  if (typesetMath()) return;
  setTimeout(typesetMath, 0);
});
