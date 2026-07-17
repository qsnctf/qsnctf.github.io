# Python OpenAI

## 概念与用途

OpenAI Python SDK 用于调用模型生成文本、结构化结果和其他能力。安装命令为 `python -m pip install openai`；API 密钥应通过 `OPENAI_API_KEY` 环境变量或密钥管理系统提供。

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

## 常见错误与安全注意

- 不要提交 API 密钥，也不要把敏感数据未经授权发送给第三方服务。
- 模型输出不可信，执行代码、SQL 或工具调用前必须验证和授权。
- 生产系统需处理限流、网络失败、成本预算、内容审核和 SDK 版本变化。
