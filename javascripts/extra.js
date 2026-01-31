/**
 * MkDocs Material 终极全能修复脚本 (强制兼容 Markmap 版)
 */

/* ============ 1. 全局补丁 (立即执行) ============ */
(function globalPatches() {
    // 修复 Markmap 的 Base64 解码问题，防止 UTF-8 字符乱码
    const originalAtob = window.atob;
    window.atob = function (str) {
        try {
            return originalAtob(str);
        } catch (e) {
            if (e instanceof DOMException || e.name === "InvalidCharacterError") {
                const safe = str.replace(/-/g, "+").replace(/_/g, "/");
                const binary = Uint8Array.from(originalAtob(safe), c => c.charCodeAt(0));
                return new TextDecoder("utf-8").decode(binary);
            }
            throw e;
        }
    };
})();

/* ============ 2. 各功能模块定义 ============ */

// --- 模块 A: Markmap 强制重绘 (核心修复) ---
function forceMarkmap() {
    const containers = document.querySelectorAll(".language-markmap");
    containers.forEach(container => {
        // 如果已经渲染出了 svg 且内部有内容，则不再处理
        if (container.querySelector("svg g")) return;

        console.log("♻️ 正在强制激活 Markmap...");
        
        // 关键：通过分发自定义事件通知 Markmap 插件
        const dataTag = container.querySelector("markmap-data");
        if (dataTag) {
            dataTag.dispatchEvent(new Event("markmap:rerender"));
        }

        // 补救措施：针对部分版本，重新触发渲染属性
        const svg = container.querySelector("svg");
        if (svg && !svg.innerHTML.trim()) {
            svg.remove(); // 移除空的 SVG 让插件有机会重新生成
        }
    });
}

// --- 模块 B: 数学公式渲染 ---
function renderMath() {
    if (!window.MathJax?.typesetPromise) return;
    const targets = document.querySelectorAll(".arithmatex");
    if (targets.length === 0) return;

    try {
        window.MathJax.typesetClear?.(targets);
        setTimeout(() => {
            window.MathJax.typesetPromise(targets);
        }, 40);
    } catch (e) {
        console.warn("MathJax error:", e);
    }
}

// --- 模块 C: 文本加粗修复 ---
function fixBold(root) {
    const EXCLUDE = new Set(["PRE", "CODE", "SCRIPT", "STYLE", "KBD", "MATH", "SVG"]);
    
    function walk(node) {
        if (node.nodeType === 1) {
            if (EXCLUDE.has(node.tagName)) return;
            Array.from(node.childNodes).forEach(walk);
        } else if (node.nodeType === 3) {
            let val = node.nodeValue;
            if (val && val.includes("**")) {
                const span = document.createElement("span");
                // 支持跨行加粗修复
                span.innerHTML = val.replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");
                node.replaceWith(span);
            }
        }
    }
    walk(root);
}

// --- 模块 D: 图片点击缩放 (含控制面板) ---
function initImageZoom(root) {
    root.querySelectorAll("img:not([data-zoom-bound])").forEach(img => {
        img.dataset.zoomBound = "true";
        img.style.cursor = "zoom-in";

        img.addEventListener("click", () => {
            let scale = 1, rotate = 0;
            const overlay = document.createElement("div");
            overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.85);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(5px);`;

            const wrapper = document.createElement("div");
            wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:15px;`;

            const clone = img.cloneNode();
            clone.style.cssText = `max-width:90vw;max-height:80vh;border-radius:8px;box-shadow:0 10px 50px rgba(0,0,0,0.5);transition:transform 0.2s cubic-bezier(0.4,0,0.2,1);`;

            const panel = document.createElement("div");
            panel.innerHTML = `
                <button data-a="in">➕</button><button data-a="out">➖</button>
                <button data-a="l">⟲</button><button data-a="r">⟳</button>
                <button data-a="reset">↺</button><button data-a="close">✕</button>
            `;
            panel.style.cssText = `display:flex;gap:10px;background:rgba(255,255,255,0.1);padding:10px;border-radius:50px;`;

            panel.querySelectorAll("button").forEach(b => {
                b.style.cssText = `background:none;border:none;color:white;cursor:pointer;font-size:18px;padding:5px 10px;`;
            });

            const update = () => { clone.style.transform = `scale(${scale}) rotate(${rotate}deg)`; };

            panel.onclick = (e) => {
                const a = e.target.dataset.a;
                if (a === "in") scale += 0.2;
                else if (a === "out") scale = Math.max(0.2, scale - 0.2);
                else if (a === "l") rotate -= 90;
                else if (a === "r") rotate += 90;
                else if (a === "reset") { scale = 1; rotate = 0; }
                else if (a === "close") overlay.remove();
                update();
            };

            overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };
            wrapper.append(clone, panel);
            overlay.append(wrapper);
            document.body.append(overlay);
        });
    });
}

/* ============ 3. 运行调度 (MkDocs Material 专用) ============ */

// 动画样式注入
const styleTag = document.createElement("style");
styleTag.innerHTML = `
    @keyframes zoomIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
    .language-markmap { min-height: 300px; } /* 防止跳转时高度塌陷导致插件不工作 */
`;
document.head.append(styleTag);

document$.subscribe(() => {
    const article = document.querySelector(".md-content article");
    if (!article) return;

    // 核心执行逻辑
    const triggerAll = () => {
        fixBold(article);
        initImageZoom(article);
        renderMath();
        forceMarkmap();
    };

    // 1. 立即执行
    triggerAll();

    // 2. 针对 Markmap 和 MathJax 的异步性，进行波次补救
    // 这是解决“只有刷新才显示”的最有效手段
    [50, 200, 500, 1000, 2000].forEach(delay => {
        setTimeout(triggerAll, delay);
    });

    // 3. 监听 DOM 动态注入 (如 Instant loading 替换内容)
    const observer = new MutationObserver((mutations) => {
        triggerAll();
    });
    observer.observe(article, { childList: true, subtree: true });
});