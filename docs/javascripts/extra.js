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

// --- 模块 A: Markmap 强力手动渲染 (核心修复) ---
async function forceMarkmapRender() {
    const containers = document.querySelectorAll(".language-markmap");
    if (containers.length === 0) return;

    // 检查 Markmap 全局库是否已加载
    if (!window.markmap || !window.markmap.Markmap) {
        return;
    }

    const { Markmap, loadPlugins, deriveOptions } = window.markmap;

    containers.forEach(async (container) => {
        // 如果已经渲染出了 svg 且内部有内容，则不再处理
        if (container.querySelector("svg g")) return;

        const dataTag = container.querySelector("markmap-data");
        if (!dataTag) return;

        try {
            console.log("♻️ 正在执行 Markmap 强力重绘...");
            const json = JSON.parse(dataTag.textContent);
            
            // 清理旧的残余 SVG
            const oldSvg = container.querySelector("svg");
            if (oldSvg) oldSvg.remove();

            // 创建新的 SVG 容器
            const newSvg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            newSvg.classList.add("markmap");
            newSvg.style.cssText = "width: 100%; min-height: 400px;";
            container.appendChild(newSvg);

            // 手动渲染
            const opts = deriveOptions(json.opts);
            const mm = Markmap.create(newSvg, opts, json.root);
            
            if (json.features) {
                await loadPlugins(json.features);
                mm.setData(json.root);
                mm.fit();
            }
        } catch (err) {
            console.warn("Markmap 手动渲染尝试失败，改用事件触发:", err);
            dataTag.dispatchEvent(new Event("markmap:rerender"));
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
            overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;z-index:999999;backdrop-filter:blur(5px);cursor:zoom-out;`;

            const wrapper = document.createElement("div");
            wrapper.style.cssText = `display:flex;flex-direction:column;align-items:center;gap:15px;cursor:default;`;

            const clone = img.cloneNode();
            clone.style.cssText = `max-width:90vw;max-height:80vh;border-radius:8px;box-shadow:0 10px 50px rgba(0,0,0,0.5);transition:transform 0.2s cubic-bezier(0.4,0,0.2,1);`;

            const panel = document.createElement("div");
            panel.innerHTML = `
                <button data-a="in">➕</button><button data-a="out">➖</button>
                <button data-a="l">⟲</button><button data-a="r">⟳</button>
                <button data-a="reset">↺</button><button data-a="close">✕</button>
            `;
            panel.style.cssText = `display:flex;gap:10px;background:rgba(0,0,0,0.6);padding:10px;border-radius:50px;backdrop-filter:blur(10px);`;

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

const runAllFixes = () => {
    const article = document.querySelector(".md-content article");
    if (!article) return;
    
    fixBold(article);
    initImageZoom(article);
    renderMath();
    forceMarkmapRender();
};

document$.subscribe(() => {
    // 1. 初始执行
    runAllFixes();

    // 2. 针对异步内容的“波次”补偿执行 (5秒内分5次)
    [100, 500, 1200, 2500, 5000].forEach(delay => {
        setTimeout(runAllFixes, delay);
    });

    // 3. 实时监听内容变化
    const article = document.querySelector(".md-content article");
    if (article) {
        const observer = new MutationObserver(runAllFixes);
        observer.observe(article, { childList: true, subtree: true });
    }
});