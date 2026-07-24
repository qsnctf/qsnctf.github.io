# 思而听-solar应急响应靶场训练合集(持续更新)V1.0_251025

> 本合集汇编了已构建的多个网络安全实验环境，旨在为技术交付提供一份清晰的资源索引。
> 
> 合集内容主要围绕应急响应和渗透测试两个领域。每个环境均模拟了特定的网络攻防技术场景，可用于技术验证、复现和实战演练。
> 
> 文档中的每一个环境条目均包含以下内容：
> 
> 1. **环境简介**：概述该环境的拓扑、设定的安全事件或主要技术点。
> 2. **访问地址**：提供可用的在线访问链接及离线环境包。
> 3. **相关文档**：附上对应的技术文章链接，用于说明环境的构建过程或分析思路。
> 4. **参考图示**：展示该环境的核心架构或关键节点。
> 
> 我们希望这份资料能为相关的技术演练和能力建设工作提供实用的参考和支持。
> 
> **版权所有©：思而听(山东)网络科技有限公司、solar应急响应团队、州弟学安全**
> 
> ![图片展示的是思而听-solar应急响应靶场训练合集的参考图示。画面中有一个蓝色文件夹，文件夹上有四个二维码，分别对应“思而听”“Solar应急响应”“青少年CTF”“州弟学安全”四个内容。画面左上角有“REC”标识，右上角有一个喇叭。背景为蓝色，有绿色线条装饰。该图片位于文档介绍该环境合集相关资料时，用于直观呈现合集中相关技术文章的二维码标识。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDMxYjU1NGE0MzEwZGU1NjU0ZDM1MjcwOTI3OTY1ZDBfOGYyN2IwYjg5NGRjOGE2MmEwOTQ1NGI5NzU0MWQxNDZfSUQ6NzU2NTA0MTE2MDIwMzU1MDcyM18xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 一、 勒索病毒应急响应与溯源环境

1. **环境简介**

本环境模拟了一个典型的勒索病毒攻击场景。系统（Windows Server 2016）对外开放了“若依”管理系统（12333端口）。

攻击者利用该系统的Shiro反序列化漏洞获取服务器权限，随后通过PowerShell关闭Windows Defender，并上传C2木马（CobaltStrike）和“Live”家族勒索病毒（systime.exe）。最后，攻击者执行加密器，导致服务器文件被加密。

该环境用于演练勒索事件的全流程排查，包括：

- 勒索家族识别与数据恢复。
- 攻击路径溯源（定位Shiro漏洞利用、C2木马和加密器）。
- 熟悉Windows日志和工具（如EventLogView, Everything）在应急响应中的应用。

1. **访问地址**

- **在线环境 (青少年CTF):** `https://www.qsnctf.com/` (平台内搜索：勒索)
- **离线环境 (夸克网盘):** `https://pan.quark.cn/s/9263f5886cab`
- **离线环境（百度网盘）：`https://pan.baidu.com/s/1HNErGe5LuxLNC8S3XiLFMQ?pwd=vj3t`**

1. **相关文档**

- [应急响应|2025年勒索病毒排查溯源指南(附开源训练环境)](https://mp.weixin.qq.com/s/P0x6W7QhhPToJod8v-QI0g)
- [全网首发！教科书式学习勒索溯源排查(附开源环境+溯源报告)](https://mp.weixin.qq.com/s/1RgNzrEmNc6urisdmKEjPg)

1. **参考图示**

![图片为2025勒索病毒排查思路图，由州弟学安全制作。图中以蓝色框突出显示“2025勒索病毒排查思路”，分为解密和取证两部分。解密部分包含多个步骤，如使用解密工具、分析勒索病毒等；取证部分同样有多个步骤，如分析勒索病毒、分析勒索病毒传播途径等。图中还标注了多个日期，如2025/4/25 10:00、2025/4/25 10:40等。该图与文档中勒索病毒应急响应与溯源环境相关，为排查提供思路。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YmUyYTc3NjVjYzAwNDlhNzk2MjFiMzEyMzFiOWEyMTBfYzcxNjRmNDZiZTYzZWE0NDAyYjY3NWU4OGM3OTBlMDZfSUQ6NzU2NTAyNDQ5NzY0NTQ4NjA4M18xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 二、 特洛伊挖矿木马排查（Linux）

1. **环境简介**

本环境模拟了Linux服务器（Ubuntu 22.04）遭遇挖矿木马的应急响应事件。起因是运维人员从非官方渠道下载了被植入后门的`superlog`工具并执行。

该后门程序（`setup`）通过感染系统核心指令（如`ls`, `ps`, `top`, `stat`等）来实现持久化。它会释放挖矿程序（`/tmp/kworkerds`）并创建守护脚本（`/usr/bin/.0guardian`）和定时任务（`/etc/cron.d/0guardian`）。定时任务通过调用已被感染的`stat`指令，实现挖矿进程的“不死”效果。

该环境用于演练Linux下的挖矿事件排查，包括：

- 通过`top`（处理`alias`劫持）、`lsof`、`ss`等指令定位挖矿进程、文件和矿池地址。
- 识别和处置由`cron`定时任务和受感染系统文件构成的组合持久化机制。
- 通过内部聊天记录进行溯源，定位攻击源于“供应链投毒”（非官方软件）。
- 使用`dpkg`在断网环境下恢复系统文件的完整性。

1. **访问地址**

- **在线环境 (青少年CTF):** `https://www.qsnctf.com/` (靶场模块)
- **离线环境（百度网盘）：**`https://pan.baidu.com/s/1Zjghkg55-USdDiWKgnJ7Dw?pwd=zhou`` `
- **离线环境（夸克网盘）：**`https://pan.quark.cn/s/a2c2454a196c`

1. **相关文档**

- [《特洛伊挖矿木马事件排查》](https://mp.weixin.qq.com/s/HSxn6nJWNtMr1w6kTXwu-g)
- [应急响应|某项目特洛伊挖矿木马靶场复现(附开源环境)](https://mp.weixin.qq.com/s/cMj5vZqF4hBSeMSmqpSqZw)

1. **参考图示**

![图片展示了思而听-solar应急响应靶场训练合集中特洛伊挖矿木马排查（Linux）的相关参考图示。图中以流程图形式呈现，从“/etc/init.d/solar”开始，经“/etc/solar”等多步骤，最终到“/etc/solar/solar”结束。各步骤旁有对应的操作说明，如“检查是否有solar进程”“检查是否有solar服务”等。该图与上下文紧密相关，为特洛伊挖矿木马排查提供操作指引，帮助理解排查流程。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MDY1MzA4YjA1MWJlM2E1OGU2OTlkODlmM2U5YzQ0ZTZfNDgyN2M1NzY0YzQxNjJhOThlNWJkNzNmOTRlZjVjZmNfSUQ6NzU2NTcxMzI0NjAwMDc0MjQxOV8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 三、 某学校挖矿病毒应急响应（Linux + 流量分析）

1. **环境简介**

本环境模拟了某学校管理系统（Ubuntu 22.04, Tomcat）遭受挖矿攻击的场景。系统对外开放了WEB服务（19999端口）和SSH（2222端口）。

攻击者通过注册普通用户（`wangyunqing`）后，利用个人资料处的任意文件上传漏洞（`/servlet/user/uploadAvatar`）上传了JSP网页木马（冰蝎），从而获得服务器控制权。

取得权限后，攻击者上传并运行了一个Java挖矿程序（`/tmp/miner.jar`），导致服务器CPU占用率飙升。同时，攻击者设置了`cron`定时任务（`/usr/share/.per/persistence.sh`）作为持久化后门。该脚本会定时检测挖矿进程，如果进程被清除，它将从备份目录（`/usr/share/.miner/miner.jar`）恢复并重新启动挖矿程序。

该环境用于演练“WEB入侵 + 挖矿”的复合场景，包括：

- 结合`.pcap`流量包（使用Wireshark或ZUI）与WEB站点日志进行溯源，还原攻击者利用文件上传漏洞的完整路径。
- 上机排查高CPU占用的挖矿进程（`miner.jar`）。
- 分析`crontab`和隐藏目录中的持久化脚本，并进行完整清除。
- 结合流量分析工具（如ZUI）和`find`、`top`、`ps`、`crontab -l`等Linux命令进行综合排查。

1. **访问地址**

- **离线环境 (腾讯文档):** `https://docs.qq.com/doc/DVkNMaVhUTXpnekpa`
- **SSH:** `root/edusec123` (端口: `2222`)（docker映射）
- **WEB:** 端口 `19999`

1. **相关文档**

- [《应急响应 | 学校不教的我来教！某学校系统中挖矿病毒的超详细排查思路》](https://mp.weixin.qq.com/s/xIh4NukshMVEIuQzuu4rbw)

1. **参考图示**

![图片是“学校挖矿排查应急响应靶场”思维导图，分为学习背景、环境搭建、题目解析、操作输出四部分。学习背景介绍在红帽认证考试中，Linux系统安全相关知识占比20%；环境搭建涵盖操作系统、网络环境、安全工具等内容；题目解析详细列出挖矿病毒排查步骤；操作输出包括排查思路、操作步骤等。该图与文档中某学校挖矿病毒应急响应（Linux+流量分析）内容相关，为应急响应提供思路和操作指南。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NmRjNDA3MWE2MzQ0MzIzNGJmZWE1Mjc5ZGZjYjI3MzRfYmE0ZGM4YTI5OGZmZjkzMmY5MGRiNzQ2ZjEzOWYyZDFfSUQ6NzU2NTAyNzA5NDg3OTgxMzYzM18xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 四、 某医院脱库应急响应与安全加固（Windows + 流量）

1. **环境简介**

本环境模拟了某医院管理系统（Windows Server 2019, PHPStudy）发生数据泄露的应急处置场景。

攻击者的主要路径是：

1. **信息泄露：** 在Gitee上发现了泄露的系统源代码，获取了数据库连接密码（`zhoudi123`）和默认后台用户名（`admin`）。
2. **密码复用：** 利用获取的数据库密码，成功登录了`admin`管理员账户（`admin/zhoudi123`）。
3. **SQL注入：** 登录后台后，利用“系统设置”中的“用户查询”功能（`/admin/settings.php`）存在的SQL注入漏洞，对`patients`（患者信息）表进行脱库。

此外，流量中还包含了端口扫描、AWVS漏扫、WEB爆破、批量注册垃圾用户等多种攻击行为的痕迹。

该环境用于演练综合性的应急响应与加固，包括：

- 使用流量分析工具（Wireshark, ZUI）区分不同IP的攻击行为（扫描、爆破、注入、批量注册）。
- 结合Gitee源码泄露进行溯源，分析攻击者如何获取后台权限。
- 定位后台SQL注入漏洞点，并分析脱库行为。
- 对漏洞代码（使用预处理语句）和泄露的密码进行修复与加固。
- 撰写完整的应急响应报告。

1. **访问地址**

- **离线环境 (123网盘):** `https://www.123684.com/s/oJnajv-EzWnh`
- **登录账号:** `administrator/Zhoudi666`

1. **相关文档**

- [《应急加固|超详细的某医院系统被脱库 从溯源到报告输出的项目式教学》](https://mp.weixin.qq.com/s/QmBXMJ9juDKxD19iVlj95g)

1. **参考图示**

![图片为“医院应急加固州弟学安全”流程图，分为“事件响应流程”“应急响应操作”“应急响应报告”“应急响应总结”四大板块。事件响应流程包括事件发现、事件确认、事件响应、事件处理、事件总结；应急响应操作涵盖事件发现、事件确认、事件响应、事件处理、事件总结；应急响应报告包括事件发现、事件确认、事件响应、事件处理、事件总结；应急响应总结包括事件发现、事件确认、事件响应、事件处理、事件总结。该图与文档中医院脱库应急响应与安全加固内容相关，为应急响应操作流程提供可视化说明。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YzgwNTY2MDEzMTc2MjNiMTI1ZmJmNzJlODgxNjkwYzNfZmRkM2RkOWYxZTQ1MTZlODhlZjU5M2FiMDA1MDcyYjRfSUQ6NzU2NTAyNzkzMDA0NjA3MDgxMl8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 五、 Windows 应急响应综合研判

1. **环境简介**

本环境模拟了一个Windows服务器（Windows Server 2019, PHPStudy, Nginx, DedeCMS）被多方攻击的综合研判场景。

攻击者（`192.168.18.133`）对WEB服务（DedeCMS）进行了登录爆破和后台文件上传漏洞利用（尝试写入`newfile1.php`木马）。同时，另一攻击者（`192.168.18.1`）通过3389端口成功登录了远程桌面。

该环境用于演练Windows下的综合日志分析与研判思路，包括：

- **系统排查：** 使用`netstat -ano`检查开放端口（如3389, 8080）。
- **Windows日志分析：** 使用`FullEventLogView`工具分析安全日志，通过事件ID `4625`（登录失败）和`4624`（登录成功）排查RDP爆破和登录行为。
- **WEB日志分析：** 使用`awk`命令分析Nginx的`access.log`，排查WEB攻击（如目录扫描、爆破、漏洞利用）痕迹。
- **流量包分析：** 结合`Wireshark`和`ZUI (Brim)`工具，对`.pcap`流量包进行全方位分析，还原DedeCMS漏洞利用和RDP登录的完整过程。

1. **访问地址**

- **离线环境 (夸克网盘):** `https://pan.quark.cn/s/7b67f6737eae`
- **登录账号:** `administrator/P@ssw0rd`

1. **相关文档**

- [《应急研判|原创最详细Windows应急响应研判思路讲解》](https://mp.weixin.qq.com/s/k7VwLpn3XGMjobhUAZF22A)

1. **参考图示**

![图片是一张应急响应流程图，展示了Windows应急响应的综合研判流程。从开始分支出理论部分和应急响应步骤，理论部分包括故事背景、日志分析概述、Windows日志分析简介；应急响应步骤有调后作业、数据收集、事件响应。数据收集下有WEB日志收集、Windows日志收集、流量数据收集；事件响应下有事件梳理、采取措施。该图与文档中介绍Windows应急响应综合研判的内容相呼应，直观呈现了研判流程。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=NzcwMDY2MDk2YzA4NmU0YTVmODAyZTMwNmE4NWIyZjVfNzFiZmMyNDY2ZmZmMjQ1N2NmOWUxYjc4ZjhkMTJmMjhfSUQ6NzU2NTAyODYzNzUyNDAwMDc5Nl8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 六、 三层内网综合渗透

1. **环境简介**

本环境模拟了一个包含DMZ区、二层网络和三层网络的多层内网渗透场景。

- **DMZ (Layer 1):** Windows Server (192.168.59.5 / 192.168.52.2)，运行 DedeCMS (8080端口) 和 FTP (21端口)。
- **Layer 2:** Linux (192.168.52.4 / 192.168.37.2)，运行 Nginx (80端口, 含phpinfo)、Redis (6379端口) 和 Nacos (8848端口)。
- **Layer 3:** Windows 7 (192.168.37.6)，存在 MS17-010 漏洞。

攻击流程涉及：

1. **突破DMZ：** 通过FTP泄露获取DedeCMS源码，审计发现后台文件上传漏洞 (`archives_do.php`)，利用该漏洞获取Webshell。
2. **横向到二层：** 在DMZ上扫描二层网络，发现二层设备及Nacos未授权访问漏洞和Redis服务。设置FRP反向代理，利用Nacos漏洞获取Redis密码，再结合phpinfo泄露的路径，通过Redis写入Webshell，控制二层设备。
3. **深入三层：** 在二层设备上扫描三层网络，发现三层设备及MS17-010漏洞。设置FRP二级代理链，使用特定EXP工具（MSF因代理链问题失败）利用MS17-010漏洞获取三层设备权限。

该环境用于演练多层内网环境下的横向移动和代理搭建技术，包括：

- 信息收集与漏洞利用（DedeCMS文件上传、Nacos未授权、Redis写Webshell、MS17-010）。
- 多级代理搭建与应用（FRP、proxychains、Proxifier）。
- 代码审计基础（定位文件上传漏洞）。
- 跨网段扫描与渗透。

1. **访问地址**

- **离线环境 (夸克网盘):**

  - 主环境: `https://pan.quark.cn/s/9de384312d0f`
- **DMZ:** `administrator/P@ssw0rd1`
- **Layer 2:** `dmz/P@ssw0rd2`
- **Layer 3:** `pro/P@ssw0rd3`

1. **相关文档**

- [《综合渗透|超详细！手把手学习三层网络渗透及综合渗透概念》](https://mp.weixin.qq.com/s/dYIukeFpgz68ih10uF_Eow)

1. **参考图示**

![图片为“决赛A靶场路线图”，展示了三层内网综合渗透的靶场环境布局。图中有多个区域，如“主环境”“DMZ”“Layer 2”“Layer 3”等，各区域间通过箭头连接，箭头旁标注了对应区域的用户名和密码。图中还标注了“主攻击路径”“辅助攻击路径”“渗透测试交互”等不同路径。该图与文档中三层内网综合渗透的靶场环境介绍相关，直观呈现了靶场的结构与各部分的连接关系。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ZGQyNjM1MGU2Y2ViM2ZlMzA0NjJiN2IwZTE5ZTI4MjRfYjA2OWU4MmU5ZDAzYjQ4MWU0ZmQzNjljMmFjYWU0NjZfSUQ6NzU2NTAzMDA0NDcxNzcxMTM4OF8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 七、 蓝队攻击流量研判

1. **环境简介**

本环境（或文档）侧重于教授蓝队成员如何快速、准确地研判常见的攻击流量。它并非一个特定的靶机环境，而是提供了一系列真实或模拟的攻击流量包（`.pcap`文件）以及对应的分析思路和特征。

涵盖的攻击类型和研判要点包括：

- **常规漏洞利用流量：** 识别 SQL注入、XSS、XXE、命令执行、任意文件上传等 OWASP Top 10 漏洞的流量特征。
- **暴力破解与密码喷洒：** 分析登录接口流量，区分暴力破解（多密码对一账号）和密码喷洒（一密码对多账号）的不同模式。
- **漏洞扫描器流量：** 识别 AWVS (特征: `acunetix`, `bxss.me`)、Goby (特征: `gobygo.net`, 变化UA)、Xray (无明显域名特征，侧重POC和指纹) 以及专项漏洞扫描工具（如 ThinkPHP 利用工具）的独特流量模式。
- **Webshell 流量：** 分析常见 Webshell 工具（如冰蝎、哥斯拉、蚁剑）的连接、心跳和命令执行流量特征（参考关联文章）。
- **其它攻击流量：** 理解 DDOS 攻击（如 SYN Flood）和 ARP 欺骗的流量表现。
- **研判方法：** 强调结合日志（如 Nginx `access.log`）和流量包（使用 Wireshark、ZUI 等工具）进行综合分析，关注请求URL、请求方法、请求头（Header）、请求体（Body）、状态码、流量频率、UA特征、特殊字符串等关键信息，区分攻击行为与误报。

1. **访问地址**

- **流量包及相关文件下载 (夸克网盘):** `https://pan.quark.cn/s/a34f767dbc8e` (提取码: F3rJ)
- **流量包及相关文件下载 (百度网盘):** `https://pan.baidu.com/s/1J2S06vkMiW7N5_VFAG0x9A?pwd=lp5e`

1. **相关文档**

- 《[蓝队研判|攻击流量事件研判计划-从此成为"秒男"(附文件)》](https://mp.weixin.qq.com/s/h6B611dKZoziDivQbYNTqg)
- [《学习干货|小白女友看完这篇文章后，面试工作和护网蓝队初级竟然秒通过！建议收藏》 (常规漏洞流量分析)](https://mp.weixin.qq.com/s/jWoUm6f14nlW__3e6K5EbQ)
- [《学习干货|HVV必学远控工具及Webshell流量合集分析(建议收藏+附面试题)》 (Webshell流量分析)](https://mp.weixin.qq.com/s/BoS3eNyC7Vn7phkTRpg2og)

1. **参考图示**

![图片为思而听-solar应急响应靶场训练合集中的流量分析流程图。图中以黄色框突出显示“流量”二字，从“流量”出发，分为“Webshell流量分析”“漏洞流量分析”“远控流量分析”“其他流量分析”四大类，每类下又细分多个子类，如“Webshell流量分析”下有“Webshell流量分析 - 木马”“Webshell流量分析 - 远程代码执行”等。该图与上下文紧密相关，是对流量分析相关内容的直观呈现。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MjlkNmFlYWQ2NWQzMTYzOTM2YzFjOTUzNDViZGQ2NWVfOGU2ZTdiMjI4NTNmYzBmODhlZDNhMDk1ZTdjN2Y2N2NfSUQ6NzU2NTAzMTM3NTkxNzc3Njg5OV8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 八、 Windows 日志分析专项

1. **环境简介**

本环境模拟了一台 Windows 7 服务器遭受 RDP 爆破攻击后的应急响应场景。攻击者通过爆破成功登录 `winlog` 账户后，执行了一系列后续操作：创建隐藏账户 (`hacker$`) 和影子账户 (`hackers$`)，植入远程控制木马 (`xiaowei.exe`，疑似CobaltStrike/Meterpreter) 并通过注册表 Run 键实现自启动，同时设置计划任务 (`download.bat`) 定时下载并执行该木马以实现持久化。此外，系统 WEB 日志（Nginx `access.log`）中也记录了来自其他 IP 的扫描行为。

该环境专注于 Windows 日志分析在应急响应中的核心应用，演练内容包括：

- **WEB日志分析：** 使用 `awk` 分析 Nginx `access.log`，识别 WEB 扫描行为。
- **系统日志分析：** 重点分析 Windows 安全事件日志（Event Viewer 或 `FullEventLogView` 工具），利用事件 ID `4625`（登录失败）统计 RDP 爆破次数，利用事件 ID `4624`（登录成功）和 `4648`（使用显式凭据登录）追踪成功登录的 IP 地址。
- **系统排查：**

  - 用户账户排查：使用 `net user`、`lusrmgr.msc`、注册表 (`HKEY_LOCAL_MACHINE\SAM\SAM\Domains\Account\Users\Names`) 和 D盾 等工具发现隐藏账户和影子账户。
  - 持久化排查：检查注册表启动项 (`HKEY_CURRENT_USER\Software\Microsoft\Windows\CurrentVersion\Run`) 和计划任务，定位恶意程序 (`xiaowei.exe`, `download.bat`)。
  - 进程与网络连接排查：使用 `netstat -nao`、`tasklist | findstr <PID>`、`wmic proc``ess get name,executablepath,processid | findstr <PID>` 或 D盾，关联恶意进程 (`xiaowei.exe`) 与其 C2 连接 (如 `185.117.118.21:4444`)。

1. **访问地址**

- **离线环境 (天翼网盘):** `https://cloud.189.cn/t/jQJbeu6ZBBzq` (访问码: il8x)
- **登录账号:** `winlog/winlog123`

1. **相关文档**

- [《学习干货|实战学习应急响应之Windows日志分析(附镜像)》](https://mp.weixin.qq.com/s/eJpsOeaEczcPE-uipP7vCQ)

1. **参考图示**

![图片为“应急响应之Windows日志分析”思维导图，中心为标题。左侧分为计划任务排查、进程端口排查两部分，分别对应自动启动的任务、计划任务、注册表计划任务，以及可疑的端口、进程等。右侧为WEB日志排查、系统日志排查两部分，分别对应相关WEB端口、中间件日志，以及对外服务、服务日志等。该图与文档中Windows日志分析专项内容相关，为专项分析提供思路框架。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=OTYwZjJkMGJlMjRkMmI1MTgzZmU2YmJjYjlhYTcyM2VfMTM3YjliODMwMDAwMjQwOTMwYjE3NTkxZjhjNmQ1OWFfSUQ6NzU2NTA2MDI5MjU5OTA1NDMzOV8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 九、 行业攻防演练应急响应

1. **环境简介**

本环境模拟了一次行业攻防演练中的应急响应场景。目标系统为 Ubuntu 22.04，运行着一个模拟的 Spring Boot 应用（基于若依框架），对外开放了 SSH (22端口)、Spring Boot Actuator (9988端口) 和主应用 (12333端口)。

攻击方（多个IP）进行了多阶段的攻击：

1. **信息收集：** 使用 Nmap、AWVS 等工具进行端口扫描和漏洞探测。
2. **漏洞利用：**

   - 利用 9988 端口的 Spring Boot Actuator `/heapdump` 接口泄露了内存信息，从中提取到了 Shiro 密钥 (`c+3hFGPjbgzGdrC+MHgoRQ==`) 和多个弱口令 (`ruoyi123`, `admin123`, `123456`)。
   - 使用获取到的 Shiro 密钥，针对 12333 端口的若依应用进行 Shiro 反序列化漏洞攻击，通过 DNSLog/Burp Collaborator 进行出网探测和命令执行，最终反弹 Shell (`192.168.0.251:8888`)。
3. **权限维持与横向移动：**

   - 在 `/opt/.f/.s/.c/.a/.n` 目录下放置并执行了改名的 `fscan` 工具，扫描内网发现 MS17-010 漏洞主机。
   - 创建了多个权限维持机制：`cron` 定时任务 (`/opt/.Abc/.qxwc.sh`)、`systemd` 服务 (`happy.service`) 以及 SSH 公钥 (`/root/.ssh/id_rsa.pub`)。

该环境用于演练攻防场景下的应急响应全流程，包括：

- **攻击复现（可选）：** 从信息收集到漏洞利用、权限维持的完整攻击链。
- **应急响应（重点）：**

  - **流量分析：** 使用 Wireshark 分析 `.pcap` 包，识别 Nmap、AWVS、Shiro 密钥爆破、Shiro RCE (含 DNSLog 和反弹 Shell) 等攻击流量。
  - **主机排查：**
  
    - 定位 Actuator heapdump 泄露点。
    - 排查 `cron`、`systemd`、SSH `authorized_keys` 等持久化后门。
    - 使用 `grep` 或文件 `md5sum` 定位恶意工具 (如改名的 `fscan`)。
    - 分析反弹 Shell 进程及连接。
  - **溯源与报告：** 梳理攻击时间线，确定攻击者 IP 及行为，输出应急响应报告。

1. **访问地址**

- **离线环境 (夸克网盘):** `https://pan.quark.cn/s/e3de421439d4`
- **登录账号:** `root/security123`
- **应急主机 IP:** `192.168.0.211`
- **流量包路径:** `/home/security/security.pcap`

1. **相关文档**

- [《学习干货|实战某次行业攻防应急响应(附环境)》](https://mp.weixin.qq.com/s/2eYZGnDaD6M0sdrIVPhbhQ)

1. **参考图示**

![图片为某次应急响应总论图示，分为防、攻、结三个阶段。防阶段包括前期准备、应急阶段、信息收集、漏洞利用、主机利用等；攻阶段有渗透阶段，涉及信息收集、漏洞利用、主机利用等；结阶段为总结。图中还标注了渗透阶段的渗透目标、渗透步骤、渗透方法等内容，如渗透目标为获取系统权限，渗透步骤包括获取系统权限、获取系统信息、获取系统权限等。该图与文档中行业攻防演练应急响应内容相关，为应急响应流程提供参考。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=YWI0YTgxNzU4YTBkN2ZiZmI1OGUwNTdhN2Y5YTAxZjZfNzNmZTk3YzgxODg2Yjc4N2M4NWJlMzM0MzAwNGE3ZjhfSUQ6NzU2NTc2OTA2Njc0NTcwODU2M18xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 十、 Phobos勒索病毒（变种）钓鱼邮件与解密

1. **环境简介**

本环境模拟了一起由钓鱼邮件引发的Phobos勒索病毒（2700变种）攻击事件。与传统的Web漏洞入侵不同，本次模拟侧重于“人”的因素。

受害者（用户 `Solar`）在点击了伪装成“发票.zip”的钓鱼邮件附件后，计算机被植入勒索病毒，文件被加密。

该环境用于演练从钓鱼邮件分析到数据恢复的全流程，包括：

- **钓鱼邮件分析：** 检查邮件客户端（Foxmail）的邮件源码和头部信息，追踪攻击者真实IP（如 `39.91.141.213`）。
- **样本分析（C2提取）：** 提取邮件附件中的恶意样本，结合云沙箱（微步/奇安信）分析其网络行为，定位木马回连的C2地址（如 `182.9.80.123`）。
- **勒索解密：** 识别勒索病毒家族（Phobos 2700），寻找并使用对应的解密工具进行数据恢复。
- **备份恢复：** 在部分文件无法解密或丢失的情况下，使用数据恢复工具（如 DiskGenius）从磁盘备份目录（`C:\Users\Solar\Desktop\工具\backup`）中恢复被删除的备份文件（`flag.bak`）。

1. **访问地址**

- **在线环境 (青少年CTF):** https://www.qsnctf.com/ 进入靶场
- **离线环境:** https://pan.quark.cn/s/487fc06fbcd1 (需确保本地硬盘空间大于30G)
- **登录账号/密码:** `solar/Solar521` (Windows环境)

1. **相关文档**

- [《应急响应|首发！变种勒索病毒仿真靶场：从排查到解密(附开源训练环境)》](https://mp.weixin.qq.com/s/k7psP3s4srrMuobflcJ9Ug)

1. **参考图示**

![图片为变种勒索病毒（Phobos）仿真靶场实战演练图示，分为6个部分。1. 数据泄露概况，包括泄露数据、泄露时间、泄露方式等。2. 场景描述与定位，如勒索病毒类型、传播途径等。3. 关键信息提取，如勒索病毒名称、加密方式等。4. 数据恢复实战（解密），列出解密工具、解密步骤等。5. 数据泄露（内容泄露），展示泄露内容。6. 数据恢复实战（渗透测试），列出渗透测试工具、渗透测试步骤等。该图与文档中介绍的Phobos勒索病毒靶场训练内容相关，为训练提供直观的流程和信息参考。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MzkzM2QyYzI4NGJmYTcxNjk3NTcyMzZiODEzZjY4YzFfMzk0Y2Q3NzA3ZDdiMzI4YTkzNmZlZGQ4NDk4YTVjY2RfSUQ6NzU4NDY1NDQyNjk3ODA5NDAyOV8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 十一、 内网DMZ区应急响应排查（Windows+Linux）

1. **环境简介**

本环境仿真了一个未做严格物理隔离的生产/测试车间网络环境。攻击者以DMZ区的一台Windows服务器为突破口，成功入侵后进行了内网扫描，并进一步横向移动攻陷了内网的一台Linux服务器。

该环境包含两台靶机，需要按顺序进行排查：

- **机器1 (DMZ1 - Windows Server 2019)：**

  - **Web漏洞排查：** 审计IIS日志，定位攻击者利用 **Ueditor** 编辑器历史漏洞（`.net`版本任意文件上传）上传Webshell的痕迹。
  - **Defender日志分析：** 在无高级安全设备的情况下，分析 **Windows Defender** 日志（事件ID 1116, 5001等），还原攻击者执行命令（`whoami`）、Webshell被查杀以及Defender被手动关闭的时间线。
  - **Webshell分析：** 提取并分析 **哥斯拉 (Godzilla)** Webshell样本，获取连接密钥（Key/Pass）。
  - **系统痕迹排查：** 分析系统安全日志，发现攻击者创建的隐藏账户（`$system`）以及通过 **RDP** (3389) 远程登录的IP和时间。
  - **恶意文件取证：** 利用 **Amcache/ShimCache** 痕迹，排查攻击者上传并运行的内网扫描工具（`fscan`）和代理工具（`frp`），即使文件已被删除也能追踪。
- **机器2 (DMZ2 - Ubuntu)：**

  - **内网渗透排查：** 根据DMZ1的线索（fscan扫描结果），发现内网Linux机器的 **Nacos** 服务存在未授权/弱口令漏洞。
  - **权限维持分析：** 攻击者利用Nacos配置文件获取SSH账号密码后，创建了极具欺骗性的 **特权隐藏账户**（`sys-update`，UID为0，家目录伪装为 `/var/tmp/.sys`）。
  - **安全加固：** 清除恶意账户、修复Web漏洞并停止相关服务。

1. **访问地址**

- **在线环境 (青少年CTF): http://qsnctf.com/** 需下载题目附件，在线解题。
- **离线环境:** - 主地址：https://pan.baidu.com/s/1kM2ojRM7QvsZvwbejqE4gQ 提取码: ek24- 备用下载：https://pan.quark.cn/s/51fb78ad3ac1- 解压密码：HHsolar88\*90
- **登录账号:**

  - Windows: `administrator` / `Solarsec521`
  - Ubuntu: `root` / `Solarsec521`

1. **相关文档**

- [《学习干货 | 新手必练！真实复现DMZ区攻防场景与排查思路（附开源环境）》](https://mp.weixin.qq.com/s/3PjV7WIAM1C7Yu7cSLqUcA)

1. **参考图示**

![图片是DMZ区应急响应靶场复盘图，展示了州学弟安全的应急响应流程。分为流量与入口分析、Web区排查、Linux系统得失复盘、城/域内移动排查、总结与加固五个步骤。如流量分析涉及Nginx、Webshell分析有文件定位、Web脚本等，Linux系统得失复盘有权限用户、日志分析等，城/域内移动排查有攻击工具痕迹、账号痕迹等，总结与加固有停止Nacos服务、进程驻留等。该图与文档中DMZ区应急响应排查内容相关，是对排查步骤的总结。](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=ODc0YTQ5ZGI0Mjg5ODlmMTk1YjJiYzQwNjM4NzJlYzRfNzZiMWU5ZjNjZDQ4N2Y0NTRkNDM1MGY1NDZlZTVhNDhfSUQ6NzU5NjYwMzM3NTY3NDQ3Nzc1OF8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)

### 十二、 恶意浏览器插件窃密与远控溯源排查（谁偷了我的数据？）

1. **环境简介**

本环境背景源于真实的国家安全部披露事件及黑灰产攻击手法。攻击者通过向国内用户投递恶意浏览器插件（类似MaaS订阅服务），进行隐蔽的网络监控与敏感数据窃取，随后通过伪造系统弹窗下发后续的远控木马。

本次排查以安全设备捕获到的可疑外联IP（`47.105.126.219`）为起点，要求串联起完整的攻击链路：

- **初露端倪（进程溯源）：** 使用火绒剑等系统行为分析工具，追踪定位发起异常网络外联的宿主白名单程序（`chrome.exe`）。
- **隐蔽组件排查（插件提取）：** 利用Chrome自带的任务管理器（Shift+Esc）甄别异常的 Service Worker，提取隐藏恶意插件的ID及物理存放路径。
- **时间线梳理（落地时间）：** 对恶意插件目录下的核心文件（如 `background.js`）属性进行分析，精确锁定其植入本地的时间刻度。
- **初始感染源溯源（DB取证）：** 突破浏览器UI限制，利用 `HackBrowserData` 提取底层SQLite数据库中的下载记录（`chrome_default_download.csv`），还原受害者最初下载恶意压缩包（`extension.zip`）的钓鱼博客源地址。
- **代码审计（核心逻辑）：** 审计恶意插件源码（`content.js`, `background.js`），剖析其注入全屏钓鱼页面、窃取 LocalStorage 以及调用外部API（`api.ipify.org`）获取公网IP的恶意行为。
- **致命诱饵与终极远控：** 结合下载日志，发掘受害者点击系统伪造弹窗后被诱导下载的实体远控木马（`运维助手.exe`）。通过动态执行与网络监控（火绒剑/云沙箱），剥离出木马最终进行深度控制的C2基础设施（IP与端口）。

1. **访问地址**

- **在线环境 (玄机):** `xj.edisec.net/challenges/441`
- **在线环境 (青少年CTF):** `www.qsnctf.com/#/main/target`
- **离线环境 (百度网盘):** `pan.baidu.com/s/1jHrVWDZRp776ra7k53n41w?pwd=imbf`
- **离线环境 (夸克网盘):** `pan.quark.cn/s/22c990460265`
- **登录账号:**

  - Windows主机: `solar` / `Solar2026`

1. **相关文档**

- [学习干货|首发黑灰产靶场之恶意浏览器插件窃密与远控溯源复盘](https://mp.weixin.qq.com/s/hLIdSswvBCukt2qsKUPBfA)
- [2026-3月Solar应急响应公益月赛排名及官方题解](https://mp.weixin.qq.com/s/2mnpzKlVuQi-AhszjZ642Q)

![图片是“谁偷了我的数据？-浏览器插件窃密与远控实战”相关内容的思维导图。导图分为“常规窃密定位外部进程”“获取插桩组件”“进程窃密数据设置”“网络操作数据传输”“进程操作数据传输”“进程窃密数据”“指定插桩组件”“指定进程”“指定进程组件”“指定进程组件函数”“指定进程组件函数参数”等板块，各板块间有箭头连接，标注了对应的操作步骤和关键信息，如获取插桩组件时的Flag为“flag{badminton@jx.com#m0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000](https://internal-api-drive-stream.feishu.cn/space/api/box/stream/download/authcode/?code=MmM5YjBjMmI4NmI0ZTc1Y2Y0ODczM2UyOWJhMzRkNTVfYTdjNWYxNDExMmRjNmUwM2ZiYWRlZDUzOWY2Y2Y4NzRfSUQ6NzYzMDY3MDQ4NTczNTExNTc0MF8xNzg0ODcyMDg1OjE3ODQ4NzU2ODVfVjM)