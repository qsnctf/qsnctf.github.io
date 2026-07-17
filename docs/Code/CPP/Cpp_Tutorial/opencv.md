# C++ OpenCV

OpenCV 是常用的计算机视觉库，C++ 是其主要接口语言之一。

## 安装

Ubuntu 示例：

```bash
sudo apt update
sudo apt install libopencv-dev
```

检查版本：

```bash
pkg-config --modversion opencv4
```

## 读取和显示图片

```cpp
#include <opencv2/opencv.hpp>

int main() {
    cv::Mat img = cv::imread("input.png");
    if (img.empty()) {
        return 1;
    }
    cv::imshow("image", img);
    cv::waitKey(0);
}
```

编译：

```bash
g++ main.cpp -o main `pkg-config --cflags --libs opencv4`
```

## 灰度转换

```cpp
cv::Mat gray;
cv::cvtColor(img, gray, cv::COLOR_BGR2GRAY);
cv::imwrite("gray.png", gray);
```

## CTF 中的用途

- 图片隐写辅助分析。
- 像素矩阵处理。
- 二值化、边缘检测、轮廓识别。
- 批量提取二维码、条形码、图像块。

## 注意事项

- OpenCV 默认读取彩色图像为 BGR 通道顺序，不是 RGB。
- `cv::Mat` 使用引用计数，复制时通常是浅拷贝，需要深拷贝时使用 `clone()`。
- 图像坐标通常是 `(x, y)`，矩阵访问通常是 `(row, col)`。
