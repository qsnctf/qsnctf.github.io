/* ===================== MathJax v3 Final Fix ===================== */
window.MathJax = {
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams",
    packages: {'[+]': ['ams']}
  },
  options: {
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex"
  },
  startup: { typeset: false }
};

let isRendering = false;

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    if (window.MathJax && MathJax.startup && !isRendering) {
      isRendering = true;

      // Small delay to let the SPA transition finish DOM manipulations
      requestAnimationFrame(() => {
        MathJax.startup.promise.then(() => {
          if (!document.head) {
            isRendering = false;
            return;
          }

          // Force MathJax to forget previous page's CSS/State
          if (MathJax.startup.output && MathJax.startup.output.clearCache) {
            MathJax.startup.output.clearCache();
          }
          
          MathJax.texReset();

          const content = document.querySelector('.md-content article');
          if (content) {
            MathJax.typesetPromise([content])
              .catch(err => {
                // Silently swallow insertRule errors during fast navigation
                if (!err.message?.includes('insertRule')) {
                  console.warn("MathJax notice:", err);
                }
              })
              .finally(() => {
                isRendering = false;
              });
          } else {
            isRendering = false;
          }
        });
      });
    }
  });
}