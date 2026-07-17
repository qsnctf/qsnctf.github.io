# Python PyQt

## 概念与用途

PyQt 将 Qt GUI 框架绑定到 Python，提供窗口、控件、布局、信号槽和跨平台事件循环。PyQt6 使用 GPL/商业双许可证，闭源分发前需确认许可；也可评估 LGPL 的 PySide6。

## 核心 API

本教程建议 `python -m pip install "PyQt6>=6.5"`，需要受支持的桌面系统、显示服务和 Qt 平台插件。无图形 CI 可能需要 offscreen 平台或虚拟显示环境。

```python
import sys
from PyQt6.QtWidgets import QApplication, QPushButton

app = QApplication(sys.argv)
button = QPushButton("点击我")
button.clicked.connect(lambda: button.setText("已点击"))
button.resize(240, 80)
button.show()
raise SystemExit(app.exec())
```

## 核心对象

| 对象 | 作用 | 生命周期 |
| --- | --- | --- |
| `QApplication` | 全局事件循环 | 每进程通常一个 |
| `QWidget` | 可视控件 | 父对象负责子对象 |
| Signal/Slot | 解耦事件通知 | 跨线程连接需谨慎 |
| `QThread` | Qt 线程机制 | worker 移入线程 |

## 示例：无需显示的信号槽

```python
from PyQt6.QtCore import QObject, pyqtSignal

class Worker(QObject):
    completed = pyqtSignal(str)

worker = Worker()
worker.completed.connect(lambda message: print("收到:", message))
worker.completed.emit("done")
```

窗口、线程和网络对象应建立清晰所有权，在关闭事件中停止任务并释放资源。外部请求必须配置超时；不能用强制终止线程代替协作式取消。

## 常见错误与工程注意

- GUI 更新必须在主线程，耗时任务应放工作线程并通过信号返回结果。
- 槽函数中阻塞会冻结界面；网络和计算任务应异步或分线程。
- 打包时需测试平台插件、字体、图标、高 DPI 和许可证文件。
