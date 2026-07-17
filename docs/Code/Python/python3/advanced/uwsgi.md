# Python uWSGI 安装配置

## 概念与用途

uWSGI 是可托管 WSGI 应用的应用服务器，常位于 Nginx 后方。它主要面向同步 WSGI 生态，现代 ASGI 应用通常使用 Uvicorn/Hypercorn；Windows 不是 uWSGI 的主要部署平台。

## 安装与配置

在 Linux 构建环境中执行 `python -m pip install uwsgi`。典型 INI 指定模块、进程、socket 和退出清理：

```ini
[uwsgi]
module = app:application
master = true
processes = 4
http-socket = 127.0.0.1:8000
vacuum = true
die-on-term = true
```

可运行的最小 `app.py`：

```python
def application(environ, start_response):
    body = b"Hello from WSGI"
    start_response("200 OK", [("Content-Type", "text/plain"), ("Content-Length", str(len(body)))])
    return [body]
```

## 运行依赖与检查

uWSGI 需要 C 编译工具链、Python 开发头文件和类 Unix 环境；版本应固定为团队在目标发行版验证过的版本，例如依赖文件中使用兼容范围并通过镜像构建测试。它不是 Windows 原生开发的首选方案。

```python
from importlib.metadata import PackageNotFoundError, version

try:
    print("uWSGI:", version("uWSGI"))
except PackageNotFoundError:
    print("未安装 uWSGI；请在目标 Linux 构建环境安装")
```

| 配置 | 作用 | 边界 |
| --- | --- | --- |
| `harakiri` | 请求执行上限 | 超时会终止 worker |
| `max-requests` | 周期回收 worker | 缓解长期内存增长 |
| `vacuum` | 退出清理 socket | 不能替代正常关停 |
| `uid/gid` | 降低进程权限 | 启动后切换用户 |

应用自身还应为数据库和 HTTP 调用配置超时；仅依赖 uWSGI 杀 worker 会中断事务并产生不完整操作。

## 常见错误与安全注意

- 不要以 root 运行工作进程，也不要把管理 socket 暴露到不可信网络。
- 进程数需按内存和负载测试设置，并配置请求超时、日志轮换和优雅退出。
- uWSGI 协议与 HTTP 不同；Nginx 的代理指令必须与监听类型匹配。
