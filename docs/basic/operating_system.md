## 什么是操作系统？

操作系统（Operating System，简称 **OS**）是计算机系统中最基本、最核心的软件，它起到 **管理硬件资源和提供应用程序运行环境** 的作用。

### **1. 功能角度**

操作系统是 **管理和协调计算机硬件与软件资源的系统软件** 。它负责：

1. **硬件管理**：CPU、内存、硬盘、外设等。
2. **进程管理**：创建、调度、终止程序执行。
3. **存储管理**：文件系统、磁盘空间分配。
4. **设备管理**：驱动外设、输入输出控制。
5. **用户接口**：提供命令行或图形界面，方便用户操作计算机。

------

### **2. 系统角度**

操作系统是 **介于硬件与应用程序之间的桥梁** ：

- 硬件提供原始计算能力和物理资源。
- 操作系统把这些资源抽象化、统一化，让应用程序不必直接操作硬件。
- 应用程序通过操作系统调用（system call）使用硬件功能。

------

### **3. 抽象角度**

操作系统可以看作 **“资源管理器”** 或 **“虚拟机”** ：

- **资源管理器**：高效分配 CPU 时间、内存空间、外设等资源。
- **虚拟机**：给应用程序提供一个统一、简化的运行环境，使程序运行与底层硬件无关。

### 简明定义

> 操作系统是管理计算机硬件与软件资源，为用户和应用程序提供统一、方便的运行环境的系统软件。

## 操作系统的分类

![](assets/image-20260128174724124.png)

### 1.按用户分类

**桌面/个人电脑操作系统（PC）**

- Windows（如 Windows 10、11）
- macOS（苹果电脑）
- Linux 桌面版（如 Ubuntu、Fedora、Debian）

**移动设备操作系统**

- Android
- iOS
- HarmonyOS（华为）
- KaiOS（功能机常用）

### 2.按内核类型分类

- **单内核/宏内核（Monolithic kernel）**
  - Linux、Windows NT 内核
- **微内核（Microkernel）**
  - QNX、Minix、L4 系列
- **混合内核（Hybrid kernel）**
  - Windows NT、macOS 的 XNU 内核

### 3.按使用场景分类

**服务器操作系统**

- Windows Server、Ubuntu Server、Red Hat Enterprise Linux

**嵌入式操作系统**

- FreeRTOS、VxWorks、RTEMS

**实时操作系统（RTOS）**

- 用于航空航天、工业控制，如 QNX、RTEMS

**分布式操作系统**

- 如 Google Fuchsia、Plan 9

### 4.按授权方式分类

**专有/商业操作系统**

- Windows、macOS、iOS

**开源操作系统**

- Linux、FreeBSD、OpenBSD、Android（AOSP 版本）

## Windows系统命令

在Windows下，按下【Win徽标键】+【R】可以打开运行窗口，输入程序名称可以快速打开。

![](assets/image-20260128175115681.png)

如上图所示，输入CMD后回车，即打开了命令提示符。

![](assets/image-20260128175139233.png)

### cd命令（通用）

`cd` 是 **change directory（切换目录）** 的缩写，用于在 **命令行**（Linux、Mac、Windows 的命令提示符/PowerShell）中切换当前工作目录。

```bash
cd [目录路径]
```

可以使用“绝对路径”、“相对路径”及一些快捷方式。

#### 绝对路径

> **绝对路径** 是从根目录（如Windows下是C:\、Linux和MacOS是/）开始，完整描述文件或文件夹位置的路径。它不依赖于当前工作目录，在任何位置都能唯一确定目标。

```bash
cd /home/user/Documents   # Linux/Mac
cd C:\Users\Alice\Documents   # Windows
```

#### 相对路径

> **相对路径** 是以当前工作目录为基准，描述目标位置的路径。它省略了从根目录到当前目录的部分，只描述从当前目录到目标的路径。

```bash
cd Documents   # 进入当前目录下的 Documents 文件夹
cd ../         # 返回上一级目录
cd ../../      # 返回上两级目录
```

#### 快捷方式

`cd ~` → 回到当前用户的主目录

`cd -` → 回到上一次所在的目录

`cd` 或 `cd ~` → 在 Linux/Mac 下也能直接返回用户主目录

#### Windows的特殊情况

Windows 的路径分隔符是反斜杠 `\`，但大部分命令行也支持正斜杠 `/`。

切换盘符需要先输入盘符：

```bash
D:
cd D:\Projects
```

#### 小技巧

!!! note

    使用 `pwd`（Linux/Mac）或 `cd`（Windows）可以显示当前路径。
    
    使用 Tab 键可以 **自动补全文件夹名**，避免拼写错误。