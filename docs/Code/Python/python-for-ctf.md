# Python 在 CTF 中的安全用法
本篇只面向授权 CTF、本地靶场和离线样本分析，展示通用数据处理能力。
不提供扫描、漏洞利用、凭据攻击、持久化或针对真实系统的攻击自动化。
运行未知附件前应使用隔离环境，保留原始样本哈希，并限制文件大小、网络和权限。
## 文本、字节与显示
CTF 数据经常在十六进制文本、Base64 文本、Unicode 字符串和原始字节间转换。
先确定当前层的类型，再转换：
```python
text = "flag{study}"
raw = text.encode("utf-8")
print(raw.hex())
print(repr(raw))
```
`repr()` 和 `.hex()` 比直接打印二进制更容易发现空字节与控制字符。
## 十六进制与 Base64
```python
import base64
raw = bytes.fromhex("66 6c 61 67")
encoded = base64.b64encode(raw)
decoded = base64.b64decode(encoded, validate=True)
print(decoded.decode("ascii"))
```
`base64` 是编码，不是加密。`validate=True` 可拒绝部分非 Base64 字符；
解码后仍应验证长度和格式。
URL-safe Base64 使用：
```python
token = base64.urlsafe_b64encode(b"local sample")
plain = base64.urlsafe_b64decode(token)
```
缺失填充是否允许取决于具体协议，不应盲目补 `=` 掩盖格式错误。
## 常见编码链
多层编码应一次剥一层并记录中间类型：
```python
layer1 = "5a6d78685a33744359584e6c4e6a5239"
layer2 = bytes.fromhex(layer1)
result = base64.b64decode(layer2, validate=True)
print(result)
```
不要对来源不明的数据使用 `eval()`、`pickle.loads()` 或不受限解压。
反序列化和压缩包可能执行代码、消耗大量资源或写出目标目录。
## 整数与字节转换
```python
value = 0x12345678
big_endian = value.to_bytes(4, "big")
little_endian = value.to_bytes(4, "little")
assert int.from_bytes(big_endian, "big") == value
```
必须知道字段宽度、字节序和是否有符号：
```python
signed = int.from_bytes(b"\xff\xfe", "big", signed=True)
```
随意删除前导零会改变固定宽度字段的语义。
## struct 解析二进制
`struct` 按格式串打包和解包固定布局：
```python
import struct
header = struct.pack(">4sHI", b"DEMO", 1, 12)
magic, version, length = struct.unpack(">4sHI", header)
```
`>` 表示大端，`<` 表示小端，`!` 表示网络字节序。
优先显式指定字节序，避免原生对齐 `@` 带来平台差异。
解析前先检查长度：
```python
HEADER = struct.Struct(">4sHI")
def parse_header(data: bytes) -> tuple[bytes, int, int]:
    if len(data) < HEADER.size:
        raise ValueError("truncated header")
    magic, version, length = HEADER.unpack_from(data)
    if magic != b"DEMO" or length > 1_000_000:
        raise ValueError("invalid header")
    return magic, version, length
```
由文件声明的偏移和长度必须验证上下界及相加溢出语义，不能直接用于大规模分配。
## XOR 学习示例
单字节 XOR 可用于理解按位运算，不代表安全加密：
```python
def xor_byte(data: bytes, key: int) -> bytes:
    if not 0 <= key <= 255:
        raise ValueError("key must fit in one byte")
    return bytes(value ^ key for value in data)
sample = b"local exercise"
ciphertext = xor_byte(sample, 0x23)
assert xor_byte(ciphertext, 0x23) == sample
```
循环密钥示例同样只用于本地练习：
```python
from itertools import cycle
def xor_repeating(data: bytes, key: bytes) -> bytes:
    if not key:
        raise ValueError("key must not be empty")
    return bytes(value ^ mask for value, mask in zip(data, cycle(key)))
```
真实保密需求应使用经过审查的现代密码库和协议，而不是自制 XOR 方案。
## 正则提取
```python
import re
FLAG_RE = re.compile(r"flag\{[A-Za-z0-9_\-]{1,64}\}")
match = FLAG_RE.search("result: flag{local_demo}")
if match:
    print(match.group(0))
```
字节模式与字符串模式不能混用：
```python
magic = re.search(rb"MAGIC:[0-9A-F]{8}", binary_data)
```
对不可信大文本使用复杂回溯正则可能造成性能问题。
限制输入大小，偏好有界量词和简单模式；固定分隔符解析常可用 `split()` / `partition()`。
## 文件签名与分块哈希
```python
import hashlib
from pathlib import Path
def sha256_file(path: Path, limit: int = 100 * 1024 * 1024) -> str:
    if not path.is_file() or path.stat().st_size > limit:
        raise ValueError("file exceeds analysis limit")
    digest = hashlib.sha256()
    total = 0
    with path.open("rb") as stream:
        while chunk := stream.read(64 * 1024):
            total += len(chunk)
            if total > limit:
                raise ValueError("file exceeds analysis limit")
            digest.update(chunk)
    return digest.hexdigest()
```
循环内再次累计实际读取量，可以限制检查后增长的普通文件。处理攻击者可同时修改的目录时，还需使用受控副本、文件描述符和操作系统级隔离降低竞态风险。
摘要用于标识和完整性比较，不会判断文件是否恶意。
常见文件头可辅助识别，但扩展名和魔数都可能伪造。
## 受限 TLV 文件解析
下面只解析本地内存样本，不执行其中内容：
```python
import struct
def parse_tlv(data: bytes) -> list[tuple[int, bytes]]:
    records = []
    offset = 0
    while offset < len(data):
        if len(data) - offset < 3:
            raise ValueError("truncated TLV header")
        kind, size = struct.unpack_from(">BH", data, offset)
        offset += 3
        end = offset + size
        if end > len(data) or size > 4096:
            raise ValueError("invalid TLV size")
        records.append((kind, data[offset:end]))
        offset = end
    return records
```
安全解析的原则是先验证、后切片，设置总大小、字段数、嵌套深度和单字段上限。
## HTTP 基础
标准库可访问明确授权的固定地址。以下使用保留域名 `example.test`，
它仅作代码结构示意，不要求实际可连接：
```python
from urllib.request import Request, urlopen
request = Request(
    "https://example.test/challenge",
    headers={"User-Agent": "ctf-learning-client/1.0"},
)
with urlopen(request, timeout=5) as response:
    if response.length is not None and response.length > 1_000_000:
        raise ValueError("response too large")
    body = response.read(1_000_001)
    if len(body) > 1_000_000:
        raise ValueError("response too large")
```
客户端应设置超时、限制响应大小、检查状态与内容类型，并避免记录令牌。
不要关闭 TLS 验证来“修复”证书错误。
第三方 `requests` 更易用，但必须先安装：
```bash
python -m pip install requests
```
使用时同样要设置 `timeout`，并只连接题目明确授权的目标。
## socket 基础
socket 接口处理字节。以下仅与本机测试服务通信：
```python
import socket
with socket.create_connection(("127.0.0.1", 9000), timeout=3) as sock:
    sock.settimeout(3)
    sock.sendall(b"HELLO\n")
    reply = sock.recv(4096)
    print(reply)
```
TCP 是字节流，一次 `recv()` 不保证得到完整消息。
真实解析应依据长度字段、分隔符或连接关闭循环接收，并设置最大消息长度。
```python
def recv_until(sock: socket.socket, marker: bytes, limit: int = 65536) -> bytes:
    buffer = bytearray()
    while marker not in buffer:
        chunk = sock.recv(4096)
        if not chunk:
            raise EOFError("connection closed before marker")
        buffer.extend(chunk)
        if len(buffer) > limit:
            raise ValueError("message exceeds limit")
    return bytes(buffer)
```
## pwntools 的边界
pwntools 是常见第三方 CTF 库，不属于标准库，需明确安装：
```bash
python -m pip install pwntools
```
它可简化本地进程、字节打包和竞赛连接，但本文不提供利用链或攻击自动化。
使用前确认平台支持和赛事授权，脚本中保留超时、长度检查与目标白名单。
## 调试与可重复性
- 保留原始输入，不直接覆盖样本。
- 记录 Python 版本、依赖版本、输入哈希和运行参数。
- 将解析、转换和 I/O 分离，便于单元测试。
- 为截断、超长、错误魔数、错误编码编写失败测试。
- 网络题先用本地固定响应验证解析器，再连接授权服务。
- 输出秘密值前确认终端历史、日志和共享环境不会泄露。
## 禁止的捷径
- 不对不可信内容使用 `eval()`、`exec()` 或不安全 pickle 反序列化。
- 不无上限读取文件、响应、压缩包或 socket 数据。
- 不把目标地址、令牌和密钥硬编码后提交仓库。
- 不因竞赛方便关闭 TLS 验证或绕过主机校验。
- 不把竞赛脚本迁移到未授权真实目标。
## 小结
CTF 中高质量 Python 脚本本质上是边界明确的数据转换程序：
区分文本与字节，验证长度与格式，限制资源，隔离 I/O，并只操作授权目标。
