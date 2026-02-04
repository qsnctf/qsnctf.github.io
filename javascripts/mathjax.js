/* ===================== MathJax v3 配置 ===================== */
window.MathJax = {
  tex: {
    // MathJax v3 使用 'tex' 而不是 'tex2jax'
    inlineMath: [ ["\\(","\\)"], ["$","$"] ],
    displayMath: [ ["\\[","\\]"], ["$$","$$"] ],
    processEscapes: true,
    processEnvironments: true,
    tags: "ams" // 对应 v2 的 autoNumber: "AMS"
  },
  options: {
    // 忽略特定标签，防止处理代码块内部
    ignoreHtmlClass: ".*|",
    processHtmlClass: "arithmatex" 
  },
  // 启动时不自动进行全页面渲染，由后面的 document$ 订阅手动控制
  startup: {
    typeset: false 
  }
};

/* ===================== SPA 页面切换处理 ===================== */
// 确保是在 MkDocs Material 环境下
if (typeof document$ !== "undefined") {
  document$.subscribe(function() {
    // 1. 检查 MathJax 是否已加载
    if (window.MathJax && window.MathJax.typesetPromise) {
      // 2. 清除上一次的排版状态
      MathJax.texReset();
      MathJax.typesetClear();
      
      // 3. 重新渲染整个文档
      MathJax.typesetPromise(document.querySelectorAll("body")).catch(function (err) {
        console.error('MathJax rendering error:', err);
      });
    }
  });
}