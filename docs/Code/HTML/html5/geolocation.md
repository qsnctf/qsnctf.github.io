# 地理定位

## 学习目标

- 在用户操作后请求位置，并处理拒绝与失败。
- 理解 HTTPS、安全上下文、权限和隐私要求。
- 不把浏览器坐标当作可信身份或授权依据。

## 核心概念

Geolocation API 通过 `navigator.geolocation` 提供设备估算的位置。来源可能是 GPS、
Wi-Fi、基站或 IP，精度和更新时间都不固定。除 `localhost` 等开发例外外，现代浏览器
通常只在 **HTTPS 安全上下文** 中开放，并要求用户授权；嵌入页面还可能受 Permissions Policy 限制。

## 安全可运行示例

页面必须经 HTTPS 或本机开发服务器打开，且只有点击按钮后才请求权限：

```html
<button id="locate" type="button">使用我的位置</button>
<p id="result" role="status">尚未请求位置。</p>
<script>
  const result = document.querySelector('#result');
  document.querySelector('#locate').addEventListener('click', () => {
    if (!navigator.geolocation) {
      result.textContent = '此浏览器不提供地理定位，请手动选择地区。';
      return;
    }
    result.textContent = '正在请求位置…';
    navigator.geolocation.getCurrentPosition(
      position => {
        const { latitude, longitude, accuracy } = position.coords;
        result.textContent =
          `纬度 ${latitude.toFixed(3)}，经度 ${longitude.toFixed(3)}，精度约 ${Math.round(accuracy)} 米。`;
      },
      () => { result.textContent = '无法获取位置，请手动选择地区。'; },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
</script>
```

生产界面应在请求前解释用途，并提供城市、地址或地区选择器作为替代。不要通过错误文案
施压用户授权，也不要在页面加载时连续弹出权限请求。

## 隐私与安全

- 只收集完成任务所需的最低精度，能用城市就不要保存精确坐标。
- 说明用途、保存期限和共享对象，并允许撤回与删除。
- 传输和接口使用 HTTPS，日志中避免记录完整坐标。
- 坐标可被伪造且会漂移，不能用于认证、授权或反作弊的唯一证据。
- 使用 `watchPosition()` 后在不再需要时调用 `clearWatch()`。

## 兼容与无障碍

接口支持较广，但权限设置、操作系统定位服务和嵌入策略会影响结果。所有状态使用文字
表达，焦点不要被强制移动；地图若用于选点，还需提供地址搜索、列表或文本输入路径。

## 常见错误

- 在 HTTP 页面或跨源 iframe 中假设接口必然可用。
- 只处理成功回调，不处理拒绝、超时和位置不可用。
- 永久保存高精度轨迹，却没有明确业务必要和删除机制。
- 将位置等同于用户身份或访问权限。
- 没有手动输入替代，导致拒绝授权后任务无法完成。

## 相关链接

- [HTML5 教程入口](index.md)
- [浏览器支持](browser-support.md)
- [MDN：Geolocation API](https://developer.mozilla.org/zh-CN/docs/Web/API/Geolocation_API)
- [MDN：安全上下文](https://developer.mozilla.org/zh-CN/docs/Web/Security/Secure_Contexts)
- [W3C：Geolocation](https://www.w3.org/TR/geolocation/)
