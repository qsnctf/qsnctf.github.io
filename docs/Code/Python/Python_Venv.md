# Python 虚拟环境的创建 

Python 虚拟环境（Virtual Environment）是一个独立的 Python 运行环境，它允许你在同一台机器上为不同的项目创建隔离的 Python 环境。每个虚拟环境都有自己的：

- Python 解释器
- 安装的包/库
- 环境变量

## 为什么需要虚拟环境

- **项目隔离**：不同项目可能需要不同版本的 Python 或第三方库
- **避免冲突**：防止全局 Python 环境被污染
- **依赖管理**：方便记录和分享项目的依赖关系
- **测试环境**：可以安全地测试新包而不影响其他项目

**场景举例**：
- 项目 A 需要 Django 3.2 版本
- 项目 B 需要 Django 4.0 版本
- 如果在系统全局安装，两个版本会冲突

## 虚拟环境工具

| 工具名称 | 类型 | Python版本支持 | 安装方式 | 特点 | 适用场景 |
|---------|------|---------------|----------|------|----------|
| venv（推荐） | 内置模块 | ≥ 3.3 | 无需安装，内置 | 轻量级、官方推荐、使用简单 | 通用开发、日常项目 |
| virtualenv | 第三方工具 | 2.x 和 3.x | pip install virtualenv | 功能丰富、兼容多版本 | 需要兼容旧版本或高级功能 |
| conda | Anaconda自带 | 2.x 和 3.x | 随 Anaconda/Miniconda 安装 | 跨语言包管理、数据科学生态 | 数据科学、机器学习项目 |

若需更老版本支持，可使用 virtualenv（Python 2兼容）：

```bash
pip install virtualenv  # 非必须，venv 通常够用
```

本章节我们将使用 venv 创建和管理虚拟环境。

## 创建虚拟环境

Python 3.3+ 内置了 venv 模块，无需额外安装。

### 检查 Python 版本：

```bash
python3 --version
# 或者
python --version
```

### 创建虚拟环境：

```bash
# 基本语法
python3 -m venv 环境名称
```

例如，创建一个名为 .venv 的虚拟环境：

**实例**
```bash
# 进入项目目录
mkdir my_project && cd my_project

# 创建虚拟环境（命名为'.venv'是常见约定）
python3 -m venv .venv
```

**参数说明**：
- `-m venv`：使用 venv 模块
- `.venv`：虚拟环境的名称（可以自定义）

### 创建后的目录结构

```
.venv/
├── bin/            # 在 Unix/Linux 系统上
│   ├── activate    # 激活脚本
│   ├── python      # 环境 Python 解释器
│   └── pip         # 环境的 pip
├── Scripts/        # 在 Windows 系统上
│   ├── activate    # 激活脚本
│   ├── python.exe  # 环境 Python 解释器
│   └── pip.exe     # 环境的 pip
└── Lib/            # 安装的第三方库
```

## 激活虚拟环境

激活环境后，所有 Python 和 pip 命令都会使用虚拟环境中的版本。

### Windows 系统
```bash
.venv\Scripts\activate
```

### Unix/Linux/MacOS 系统
```bash
source .venv/bin/activate
```

激活成功后，命令行提示符通常会显示环境名称：

```bash
(.venv) $
```

## 使用虚拟环境

### 安装包

在激活的环境中，使用 pip 安装的包只会影响当前环境：

```bash
pip install package_name
```

例如：

```bash
# 安装单个包（如Django）
(.venv) pip install django==3.2.12

# 安装多个包
(.venv) pip install requests pandas
```

### 查看已安装的包

```bash
(.venv) pip list
Package    Version
---------- -------
Django     3.2.12
pip        21.2.4
```

### 导出依赖

```bash
(.venv) pip freeze > requirements.txt
```

requirements.txt 文件内容示例：

```
Django==3.2.12
requests==2.26.0
pandas==1.3.3
```

### 从文件安装依赖

```bash
(.venv) pip install -r requirements.txt
```

## 退出虚拟环境

当完成工作后，可以退出虚拟环境：

```bash
deactivate
```

退出后，命令行提示符会恢复正常，Python 和 pip 命令将使用系统全局版本。

## 删除虚拟环境

要删除虚拟环境，只需删除对应的目录即可：

```bash
# 确保已退出环境
deactivate

# 删除目录
rm -rf .venv  # Linux/macOS
del /s /q .venv  # Windows (命令提示符)
```

## 实际项目示例

假设开发一个 Django 项目：

**实例**
```bash
# 创建环境并激活
python3 -m venv .venv
source .venv/bin/activate

# 安装Django
(.venv) pip install django==3.2.12

# 创建Django项目
(.venv) django-admin startproject my_site

# 运行测试
(.venv) cd my_site
(.venv) python manage.py runserver

# 完成后退出环境
(.venv) deactivate
```

## 高级用法

### 指定 Python 版本

如果你安装了多个 Python 版本，可以指定使用哪个版本来创建虚拟环境：

```bash
python3.8 -m venv .venv  # 使用 Python 3.8
```

### 创建不带 pip 的环境

```bash
python -m venv --without-pip .venv
```

### 创建继承系统包的虚拟环境

```bash
python -m venv --system-site-packages .venv
```

## 常见问题解答

### 1. 为什么我的虚拟环境没有 activate 脚本？

确保你使用的是正确的路径：
- Windows: `Scripts\activate`
- Unix/Linux: `bin/activate`

### 2. 如何知道当前是否在虚拟环境中？

检查命令行提示符是否有环境名称前缀，或运行：

```bash
which python
```

查看 Python 解释器的路径是否在虚拟环境目录中。

### 3. 安装包速度慢

使用国内镜像源：

```bash
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple package_name
```

### 4. 虚拟环境可以移动位置吗？

不建议移动虚拟环境，因为其中的路径是硬编码的。如果需要移动，最好重新创建。

### 5. 虚拟环境会占用多少空间？

虚拟环境本身很小（约 20-50MB），但随着安装的包增多，空间占用会增加。