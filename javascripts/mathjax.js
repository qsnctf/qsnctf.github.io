/* ===================== MathJax v3 & MkDocs Material SPA 最终完美整合版 ===================== */
window.MathJax = {
  loader: {
    load: ['[tex]/ams']
  },
  tex: {
    inlineMath: [["\\(", "\\)"], ["$", "$"]],
    displayMath: [["\\[", "\\]"], ["$$", "$$"]],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams",
    packages: {'[+]': ['ams']}
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'],
    processHtmlClass: "arithmatex|md-content|md-nav__link" 
  },
  startup: { typeset: false }
};

let isRendering = false;

if (typeof document$ !== "undefined") {
  document$.subscribe(() => {
    if (window.MathJax && MathJax.startup && !isRendering) {
      isRendering = true;

      // 使用 requestAnimationFrame 确保在浏览器完成页面切换的 DOM 更新后执行
      requestAnimationFrame(() => {
        MathJax.startup.promise.then(() => {
          if (!document.head) {
            isRendering = false;
            return;
          }

          // 清理旧缓存，防止 SPA 模式下样式冲突
          if (MathJax.startup.output && MathJax.startup.output.clearCache) {
            MathJax.startup.output.clearCache();
          }
          
          MathJax.texReset();

          // 【关键更新】：同时抓取正文和侧边栏目录
          const content = document.querySelector('.md-content article');
          const toc = document.querySelector('.md-sidebar--secondary'); 

          const targets = [];
          if (content) targets.push(content);
          if (toc) targets.push(toc);

          if (targets.length > 0) {
            MathJax.typesetPromise(targets)
              .catch(err => {
                // 忽略 SPA 切换时由于 DOM 销毁导致的典型样式插入错误
                if (!err.message?.includes('insertRule')) {
                  console.warn("MathJax Rendering Notice:", err);
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