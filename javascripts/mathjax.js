/* ===================== MathJax v3 配置 ===================== */
window.MathJax = {
  tex: {
    inlineMath: [["\\(","\\)"], ["$","$"]],
    displayMath: [["\\[","\\]"], ["$$","$$"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams"
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  },
  startup: { typeset: false }
};


if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    if (window.MathJax && MathJax.startup) {
      MathJax.startup.promise.then(() => {
        MathJax.texReset();
        MathJax.typesetClear();

        // ✅ 关键修复：必须传可迭代对象
        const targets =
          document.querySelectorAll(".md-content") ||
          document.querySelectorAll("body");

        MathJax.typesetPromise(targets).catch(err => {
          console.error("MathJax rendering error:", err);
        });
      });
    }
  });
}
