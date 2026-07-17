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

## 常见错误与安全注意

- 不要以 root 运行工作进程，也不要把管理 socket 暴露到不可信网络。
- 进程数需按内存和负载测试设置，并配置请求超时、日志轮换和优雅退出。
- uWSGI 协议与 HTTP 不同；Nginx 的代理指令必须与监听类型匹配。
