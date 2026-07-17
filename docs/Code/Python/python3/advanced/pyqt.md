# Python PyQt

## 概念与用途

PyQt 将 Qt GUI 框架绑定到 Python，提供窗口、控件、布局、信号槽和跨平台事件循环。PyQt6 使用 GPL/商业双许可证，闭源分发前需确认许可；也可评估 LGPL 的 PySide6。

## 核心 API

安装 `python -m pip install PyQt6`。应用需要一个 `QApplication`，窗口调用 `show()`，最后进入 `app.exec()`；控件事件通过信号 `connect()` 到槽函数。

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

## 常见错误与工程注意

- GUI 更新必须在主线程，耗时任务应放工作线程并通过信号返回结果。
- 槽函数中阻塞会冻结界面；网络和计算任务应异步或分线程。
- 打包时需测试平台插件、字体、图标、高 DPI 和许可证文件。
