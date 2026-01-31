/**
 * MkDocs Material 全能修复插件
 * 涵盖：图片缩放、MathJax 渲染、文本加粗修复、Markmap 编码补丁
 */

/* ============ 1. 全局配置与补丁（立即执行） ============ */
(function patchMarkmapDecoder() {
    const originalAtob = window.atob;
    window.atob = function (str) {
        try {
            return originalAtob(str);
        } catch (e) {
            if (e instanceof DOMException || e.name === "InvalidCharacterError") {
                console.warn("🔧 Markmap Base64 UTF-8 修复已启用");
                const safe = str.replace(/-/g, "+").replace(/_/g, "/");
                const binary = Uint8Array.from(originalAtob(safe), c => c.charCodeAt(0));
                return new TextDecoder("utf-8").decode(binary);
            }
            throw e;
        }
    };
})();

/* ============ 2. 功能函数模块 ============ */

// --- 模块 A: 数学公式渲染 ---
function safeTypeset(nodes) {
    if (!window.MathJax?.typesetPromise) return false;
    const targets = nodes || document.querySelectorAll(".arithmatex");
    if (!targets || targets.length === 0) return false;

    try {
        window.MathJax.typesetClear?.(targets);
        setTimeout(() => {
            window.MathJax.typesetPromise(targets);
        }, 30);
        return true;
    } catch (e) {
        console.warn("MathJax render failed, retrying:", e);
        setTimeout(() => safeTypeset(targets), 100);
        return false;
    }
}

// --- 模块 B: 图片缩放功能 ---
function makeZoomable(img) {
    if (img.dataset.zoomBound) return;
    img.dataset.zoomBound = "true";
    img.style.cursor = "zoom-in";

    img.addEventListener("click", () => {
        let scale = 1;
        let rotate = 0;

        const overlay = document.createElement("div");
        overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.88);display:flex;align-items:center;justify-content:center;z-index:999999;cursor:zoom-out;backdrop-filter:blur(4px);`;

        const wrapper = document.createElement("div");
        wrapper.style.cssText = `position:relative;display:flex;flex-direction:column;align-items:center;gap:12px;`;

        const clone = img.cloneNode();
        clone.style.cssText = `max-width:92vw;max-height:82vh;border-radius:14px;box-shadow:0 20px 70px rgba(0,0,0,.6);transition:transform .15s ease;transform-origin:center center;animation:zoomIn .2s ease-out;`;

        const panel = document.createElement("div");
        panel.innerHTML = `
            <button data-act="zoom-in">➕</button>
            <button data-act="zoom-out">➖</button>
            <button data-act="rotate-l">⟲</button>
            <button data-act="rotate-r">⟳</button>
            <button data-act="reset">↺</button>
            <button data-act="close">✕</button>
        `;
        panel.style.cssText = `display:flex;gap:10px;background:rgba(0,0,0,.65);padding:8px 12px;border-radius:12px;backdrop-filter:blur(6px);`;

        panel.querySelectorAll("button").forEach(btn => {
            btn.style.cssText = `border:none;background:rgba(255,255,255,.12);color:#e5e5e5;padding:6px 10px;border-radius:8px;cursor:pointer;font-size:16px;transition:all .15s;`;
            btn.onmouseenter = () => (btn.style.background = "rgba(0,255,160,.25)");
            btn.onmouseleave = () => (btn.style.background = "rgba(255,255,255,.12)");
        });

        const applyTransform = () => { clone.style.transform = `scale(${scale}) rotate(${rotate}deg)`; };

        panel.addEventListener("click", e => {
            const act = e.target.dataset.act;
            if (!act) return;
            if (act === "zoom-in") scale = Math.min(scale + 0.2, 5);
            else if (act === "zoom-out") scale = Math.max(scale - 0.2, 0.2);
            else if (act === "rotate-l") rotate -= 90;
            else if (act === "rotate-r") rotate += 90;
            else if (act === "reset") { scale = 1; rotate = 0; }
            else if (act === "close") { overlay.remove(); return; }
            applyTransform();
        });

        wrapper.appendChild(clone);
        wrapper.appendChild(panel);
        overlay.appendChild(wrapper);
        overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
        document.body.appendChild(overlay);
    });
}

// --- 模块 C: 文本加粗逻辑修复 ---
function fixBoldText(root) {
    const EXCLUDE_TAGS = new Set(["PRE", "CODE", "SCRIPT", "STYLE", "KBD", "MATH", "SVG"]);
    
    function processText(node) {
        let text = node.nodeValue;
        if (!text || !text.includes("**")) return;
        const codes = [];
        text = text.replace(/`[^`]+`/g, m => {
            codes.push(m);
            return `@@CODE_${codes.length - 1}@@`;
        });
        text = text.replace(/\*\*([\s\S]+?)\*\*/g, "<strong>$1</strong>");
        text = text.replace(/@@CODE_(\d+)@@/g, (_, i) => codes[i]);

        if (text !== node.nodeValue) {
            const span = document.createElement("span");
            span.innerHTML = text;
            node.replaceWith(span);
        }
    }

    function walk(node) {
        if (node.nodeType === 1) {
            if (EXCLUDE_TAGS.has(node.tagName)) return;
            Array.from(node.childNodes).forEach(walk);
        } else if (node.nodeType === 3) {
            processText(node);
        }
    }
    walk(root);
}

// --- 模块 D: Markmap 强制渲染 ---
function forceRerenderMarkmap() {
    const containers = document.querySelectorAll(".language-markmap");
    containers.forEach(container => {
        // 如果已经渲染出 SVG 则跳过
        if (container.querySelector("svg")) return;
        const data = container.querySelector("markmap-data");
        if (data) {
            console.log("♻️ 激活 Markmap 渲染...");
            data.dispatchEvent(new Event("markmap:rerender"));
        }
    });
}

/* ============ 3. 核心驱动：监听 Material 生命周期 ============ */

// 注入动画样式
const style = document.createElement("style");
style.innerHTML = `@keyframes zoomIn { from { transform: scale(.95); opacity: .8; } to { transform: scale(1); opacity: 1; } }`;
document.head.appendChild(style);

// 订阅 Material 页面切换事件（解决 SPA 第一次加载及跳页问题）
document$.subscribe(() => {
    const root = document.querySelector(".md-content article");
    if (!root) return;

    // 统一步骤执行函数
    const runAllFixes = () => {
        // 1. 修复加粗
        fixBoldText(root);
        // 2. 扫描图片缩放
        root.querySelectorAll("img:not([data-zoom-bound])").forEach(makeZoomable);
        // 3. 渲染数学公式
        safeTypeset();
        // 4. 重绘 Markmap
        forceRerenderMarkmap();
    };

    // 策略：立即执行 + 多重延迟补偿（应对异步组件加载）
    runAllFixes();
    [100, 300, 600, 1200].forEach(delay => {
        setTimeout(runAllFixes, delay);
    });

    // 针对动态插入内容的监听
    const observer = new MutationObserver(() => {
        runAllFixes();
    });
    observer.observe(root, { childList: true, subtree: true });
});