# Python AI 绘画

## 概念与用途

Python 可编排文本到图像模型的加载、推理、随机种子和结果保存。Hugging Face Diffusers 是常见本地方案，运行通常需要 PyTorch、模型权重和足够的 GPU 显存。

## 核心 API

外部依赖包括模型权重、磁盘空间和与设备匹配的 PyTorch。先按 PyTorch 官方安装器安装兼容版本，再执行 `python -m pip install "diffusers>=0.25" transformers accelerate safetensors`。`DiffusionPipeline.from_pretrained()` 加载模型，调用 pipeline 返回 PIL 图像；生产项目应锁定实际验证过的版本和模型 revision。

| 设备 | 推荐 dtype | 特点 |
| --- | --- | --- |
| NVIDIA CUDA | `float16` 或硬件支持的 `bfloat16` | 通常最快，需要匹配驱动/CUDA |
| Apple Silicon MPS | 通常 `float16` | 部分算子可能回退 CPU |
| CPU | `float32` | 可用但慢，内存压力可能较高 |

```python
import torch
from diffusers import DiffusionPipeline

model_id = "stable-diffusion-v1-5/stable-diffusion-v1-5"
pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=torch.float16)
pipe = pipe.to("cuda")
generator = torch.Generator("cuda").manual_seed(2026)
image = pipe("a small robot reading Python documentation", generator=generator).images[0]
image.save("robot.png")
```

## 示例：检测 CUDA、MPS 与 CPU

不要无条件把 `float16` 模型放到 CPU。下面先检测设备，再选择 dtype；模型标识仅是示例，首次运行还需要网络下载和接受对应许可证。

```python
import torch

if torch.cuda.is_available():
    device, dtype = "cuda", torch.float16
elif hasattr(torch.backends, "mps") and torch.backends.mps.is_available():
    device, dtype = "mps", torch.float16
else:
    device, dtype = "cpu", torch.float32

print("device=", device, "dtype=", dtype)
# pipe = DiffusionPipeline.from_pretrained(model_id, torch_dtype=dtype)
# pipe = pipe.to(device)
```

MPS 遇到不支持算子时可按 PyTorch 文档评估 CPU fallback，但回退会影响性能且不应作为无监控的生产默认值。CPU 推理可降低分辨率、步数或使用更小模型；显存不足时可评估 attention slicing、CPU offload 等 Diffusers 能力，并逐项测试质量和延迟。

## 资源与服务边界

推理服务应限制提示词长度、图片尺寸、批量大小和并发数，配置任务超时，并在请求结束后释放大对象引用。模型下载必须来自可信来源；`safetensors` 比任意 pickle 权重更适合不可信分发边界，但仍需校验来源和许可证。

## 常见错误与安全注意

- 示例需要兼容的 CUDA GPU；CPU 可运行但通常很慢且 dtype 配置不同。
- 核对模型许可证、数据与商用限制，不要生成或传播违法侵权内容。
- 固定模型版本、依赖和种子仍不保证跨硬件完全逐像素一致。
- API 或队列任务失败时应保存可诊断元数据，但日志中避免记录用户敏感提示词和原图。
