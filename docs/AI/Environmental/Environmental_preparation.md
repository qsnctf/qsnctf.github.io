每一个方向都需要一个环境的准备，当然AI安全当然不例外

## 环境准备

安装anaconda

### windows

打开 [Anaconda 官方网站](https://www.anaconda.com/products/distribution)。

在页面右上角选择 **用户登录 (Sign In)** 或 **注册新用户 (Sign Up)**，登录后即可点击 **Free Download** 按钮免费下载适合你操作系统的 Anaconda 安装包。

后面正常安装即可，并没有什么麻烦的地方。

安装完成之后，开一个终端输入

```
conda --version
```

查看版本是否和安装的相符，如果相符合，说明安装成功。

### linux

#### 查看Linux系统内核

Linux系统内核有两种,一种为arch64,另一种为X86_64
使用命令`uname -a` 查看系统内核

下载地址如下：

[anaconda安装包下载地址](https://repo.anaconda.com/archive/)

在控制台输入

```
wget https://repo.anaconda.com/archive/Anaconda3-xxxx.sh
```

下载完输入

```
./Anaconda3-xxxx.sh
```

开始安装,一直enter ,yes 直到安装完

点击enter，等待安装完成之后。

#### 配置Anaconda环境

打开/etc/profile

```
vim /etc/profile
```

在末尾添加环境变量

```
export PATH=~/anaconda3/bin:$PATH
```

如果你使用的是bash，那么打开 `~/.bashrc`，如果使用的是zsh，那么就打开zsh的配置

这里给出是bash的方法，zsh同样适用。

```
vim ~/.bashrc
```

在末尾添加环境变量

```
export PATH=~/anaconda3/bin:$PATH
```

刷新环境变量或者新开一个终端

```
source /etc/profile
source ~/.bashrc
```

输入`conda -V`，出现conda xx.xx 安装成功。

### Anaconda 命令

在windows中，如果想要安装的虚拟环境在anaconda安装目录下，需要`Anaconda Powershell Prompt`以管理员身份运行。

**查看Conda版本**

```
conda --version
```

**创建新环境**

```
conda create --name myenv python=3.8
```

- **作用**：创建一个名为 `myenv` 的新虚拟环境，并指定使用 Python 3.8 版本。每个环境可以独立安装不同的包和 Python 版本，不会相互干扰。

**激活环境**

```
conda activate myenv
```

- **作用**：激活您创建的虚拟环境 `myenv`。激活后，您可以在该环境中安装库或运行 Python 程序。

**查看已有的虚拟环境**

```
conda env list
```

- **作用**：列出系统中所有已创建的虚拟环境，方便查看和管理环境。

**退出当前环境**

```
conda deactivate
```

+ **作用**：退出当前激活的虚拟环境，返回 base 环境

**删除虚拟环境**

```
conda remove --name myenv --all
```

## Ollama

在现在新版的ollama中安装是安装到默认位置的，如果你的C盘足够大，那么你可以选择安装的位置为默认。

```
OllamaSetup.exe /DIR="d:\some\location"
```

即可更改安装地址，当然安装的model也是在默认的位置，可以在环境变量里面设置下路径，将下载的模型放到其他盘。

![](attachments/index.PNG)

### Ollama命令

Ollama 提供了多种命令行工具（CLI）供用户与本地运行的模型进行交互。

基本格式：

```
ollama <command> [args]
```

- serve：启动 ollama 服务。
- create：根据一个 Modelfile 创建一个模型。
- show：显示某个模型的详细信息。
- run：运行一个模型。
- stop：停止一个正在运行的模型。
- pull：从一个模型仓库（registry）拉取一个模型。
- push：将一个模型推送到一个模型仓库。
- list：列出所有模型。
- ps：列出所有正在运行的模型。
- cp：复制一个模型。
- rm：删除一个模型。
- help：获取关于任何命令的帮助信息。

**拉取与删除模型**

```
ollama pull <model>
```

**删除本地模型**

```
ollama rm <model>
```

**列出所有本地模型**

```
ollama list
```

**交互模式运行模型，不退出**

```
ollama run <model>
```

**可带系统信息与 prompt**

```
ollama run <model> -s "<system>" -p "<prompt>"
```

**generate**
执行单次推理，输出文本

```
ollama generate <model> -p "<prompt>"
```

**创建与修改模型**

用 Modelfile 创建本地模型

```
ollama create <model-name> -f Modelfile
```

**Modelfile 指令**

构建模型时使用：

- **FROM <model>**：基础模型
- **SYSTEM "xxx"**：设定系统提示
- **PARAMETER key=value**：设定默认参数
- **TEMPLATE "xxx"**：自定义 Chat 模板
- **LICENSE "xxx"**：设置 License
- **ADAPTER <file>** / **WEIGHTS <file>**：加载 LoRA 或额外权重
