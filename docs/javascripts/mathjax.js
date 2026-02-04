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

        // ✅ 只重排正文（更快、更稳）
        const content = document.querySelector(".md-content") || document.body;

        MathJax.typesetPromise(content).catch(err => {
          console.error("MathJax rendering error:", err);
        });
      });
    }
  });
}
