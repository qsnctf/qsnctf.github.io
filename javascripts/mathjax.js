window.MathJax = {
    tex2jax: {
    inlineMath: [ ["\\(","\\)"], ["$","$"] ],
    displayMath: [ ["\\[","\\]"], ["$$","$$"] ],
    processEscapes: true
    },
    TeX: {
      TagSide: "right",
      TagIndent: ".8em",
      MultLineWidth: "85%",
      equationNumbers: {
        autoNumber: "AMS",
      },
      unicode: {
        fonts: "STIXGeneral,'Arial Unicode MS'"
      }
    },
    showProcessingMessages: false,
    messageStyle: "none"
  };

// 主题颜色设置
window.addEventListener('load', function() { 
    var p=localStorage.getItem("data-md-color-primary");
    if (p){
        document.body.setAttribute('data-md-color-primary',p);
    }
    var a=localStorage.getItem('data-md-color-accent');
    if (a){
        document.body.setAttribute('data-md-color-accent',a);
    }
    var s = localStorage.getItem('data-md-color-scheme');
    if (s) {
        document.body.setAttribute('data-md-color-scheme', s);
    }
}, false);

// 延时渲染 MathJax 的函数
function delayedMathJaxRender() {
    // 等待页面内容完全加载
    setTimeout(() => {
        if (typeof MathJax !== 'undefined' && MathJax.typeset) {
            try {
                MathJax.startup.output.clearCache();
                MathJax.typesetClear();
                MathJax.texReset();
                MathJax.typesetPromise().catch(error => {
                    console.warn('MathJax 首次渲染失败，将在 500ms 后重试:', error);
                    // 首次失败后重试
                    setTimeout(() => {
                        if (typeof MathJax !== 'undefined' && MathJax.typeset) {
                            MathJax.typesetPromise().catch(err => {
                                console.error('MathJax 重试渲染失败:', err);
                            });
                        }
                    }, 500);
                });
            } catch (error) {
                console.error('MathJax 渲染出错:', error);
            }
        }
    }, 300); // 延时 300ms 确保 DOM 完全渲染
}

// 初始页面加载
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', delayedMathJaxRender);
} else {
    delayedMathJaxRender();
}

// SPA 页面切换处理
document$.subscribe(() => {
    // 延时处理，确保新内容已渲染
    setTimeout(delayedMathJaxRender, 200);
});