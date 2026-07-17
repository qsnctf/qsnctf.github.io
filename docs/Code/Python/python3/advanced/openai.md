# Python OpenAI

## 概念与用途

OpenAI Python SDK 用于调用模型生成文本、结构化结果和其他能力。本页 Responses API 示例建议 `python -m pip install "openai>=1.66"`；需要网络、有效 API 密钥、可用模型和账户额度。

## 核心 API

创建 `OpenAI()` 客户端后调用 Responses API，并读取 `response.output_text`。模型名称、超时和重试策略应作为配置，而不是散落在业务代码中。

```python
import os
from openai import OpenAI

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
response = client.responses.create(
    model=os.environ.get("OPENAI_MODEL", "gpt-4.1-mini"),
    input="用一句话解释 Python 生成器。",
)
print(response.output_text)
```

## 客户端边界

| 配置 | 用途 | 工程要求 |
| --- | --- | --- |
| `api_key` | 身份认证 | 仅来自秘密管理 |
| `timeout` | 请求截止 | 按交互/批处理区分 |
| `max_retries` | 临时故障重试 | 限制次数和成本 |
| `model` | 能力与价格 | 配置化并允许迁移 |

## 示例：先验证本地配置

```python
import os

key = os.environ.get("OPENAI_API_KEY", "")
model = os.environ.get("OPENAI_MODEL", "")
print("密钥已配置:", bool(key))
print("模型已配置:", model or "使用应用默认值")
if key:
    print("密钥长度:", len(key))  # 不打印密钥本身
```

客户端支持显式超时和重试配置，生产应用应设置总请求预算并关闭不再使用的客户端/流式响应。模型名和 SDK API 会演进，升级时需依据官方迁移文档和契约测试。

## 常见错误与安全注意

- 不要提交 API 密钥，也不要把敏感数据未经授权发送给第三方服务。
- 模型输出不可信，执行代码、SQL 或工具调用前必须验证和授权。
- 生产系统需处理限流、网络失败、成本预算、内容审核和 SDK 版本变化。
