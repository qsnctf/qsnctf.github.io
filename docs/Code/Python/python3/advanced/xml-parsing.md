# Python3 XML 解析

## 概念与用途

XML 以元素、属性和文本表达树形数据。标准库 `xml.etree.ElementTree` 可处理可信、规模适中的 XML，并支持路径查找和构造输出。

## 核心 API

`ET.fromstring()` 解析字符串，`ET.parse()` 解析文件，`findall()` 查询节点，`Element` 与 `SubElement` 构建文档。

```python
import xml.etree.ElementTree as ET

xml = "<users><user id='1'>Alice</user><user id='2'>Bob</user></users>"
root = ET.fromstring(xml)
for user in root.findall("user"):
    print(user.get("id"), user.text)
```

## 常见错误与安全注意

- 不可信 XML 可能触发实体扩展等攻击，使用 `defusedxml` 并限制输入大小。
- 命名空间会改变标签名称，查询时需提供前缀映射。
- 大文件应使用 `iterparse()` 流式处理并及时清理节点。
