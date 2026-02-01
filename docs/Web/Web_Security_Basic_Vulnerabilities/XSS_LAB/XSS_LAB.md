![](attachments/image-20260201145715075.png)

题目地址：https://www.qsnctf.com/#/main/driving-range?page=1&category=15&difficulty=&keyword=&user_answer=&user_favorite=&tag_ids=&challenge_id=23

## 过程

![](image-20260201150258154.png)

点击中间的图片开始

### Level1

![image-20260201150336840](attachments/image-20260201150336840.png)

在页面内，发现test，在链接中，发现一个参数，name

name=test

尝试修改test，修改为1234![image-20260201150429485](attachments/image-20260201150429485.png)

发现欢迎用户变成1234了

查看网页源码

![image-20260201150539709](attachments/image-20260201150539709.png)

当我们在地址栏修改name等于`<script>alert("1")</script>`

![image-20260201150743851](attachments/image-20260201150743851.png)

发现页面是存在html的渲染

![](attachments/image-20260201150830371.png)

### Level2

![](attachments/image-20260201150943593.png)

![image-20260201151001287](attachments/image-20260201151001287.png)

修改完一个位置，都同时更改了

![image-20260201151055304](attachments/image-20260201151055304.png)

继续使用上一关的Payload

![](attachments/image-20260201151147166.png)

发现在“没有找到”这个位置的提示是有转义的，将xss的代码转义成了非可执行字符。

但是在input位置，是没有转义的。

![](attachments/image-20260201151321789.png)

回到渲染页面，发现双引号有问题

![image-20260201151356930](attachments/image-20260201151356930.png)

双引号导致闭合了

![image-20260201151554979](attachments/image-20260201151554979.png)

双引号的位置可以先提前闭合

```
"><script>alert("1")</script><"
```

![](attachments/image-20260201151654758.png)

![](attachments/image-20260201151719432.png)

### Level3

![](attachments/image-20260201151836746.png)

先随便进行搜索

![](attachments/image-20260201151902202.png)

查看源代码

![image-20260201151951570](attachments/image-20260201151951570.png)

![image-20260201152055019](attachments/image-20260201152055019.png)

试试上一关类似的思路，发现都被转义了

这下怎么办呢

![image-20260201152221895](attachments/image-20260201152221895.png)

![image-20260201152315567](attachments/image-20260201152315567.png)

单引号是可以的

![](attachments/image-20260201152454426.png)

使用onmouseover的事件

```
'onmouseover='javascript:alert(1)
```

最后一个单引号用原有的单引号即可

![image-20260201152705481](attachments/image-20260201152705481.png)

### Level4

![image-20260201152745601](attachments/image-20260201152745601.png)

Level4，先用传统的语句去搜索

![image-20260201152814053](attachments/image-20260201152814053.png)

应该是去掉了我们的大于号和小于号

![image-20260201152836858](attachments/image-20260201152836858.png)

![image-20260201152905471](attachments/image-20260201152905471.png)

用上一关的Payload，改成双引号即可

```
"onmouseover="javascript:alert(1)
```

### Level5

![image-20260201153129341](attachments/image-20260201153129341.png)

第五关，先用xss祖师爷`<script>alert(1)</script>`试试

发现script变成了scr_ipt

![image-20260201153422088](attachments/image-20260201153422088.png)

事实上，是替换了<script为<scr_ipt

```
"><a href="javascript:alert(1)">aaa</a><"
```

![](attachments/image-20260201153331537.png)

### Level6

![](attachments/image-20260201153554676.png)

有请祖师爷登场

然后看源代码

![image-20260201153616493](attachments/image-20260201153616493.png)

类似于上一关的小套路

![image-20260201153659626](attachments/image-20260201153659626.png)

替换的比较多

但是可以大小写绕过

```
"><SCRIPT>alert(1)</script>
```

![](attachments/image-20260201153823734.png)

### Level7

![image-20260201153856367](attachments/image-20260201153856367.png)

第七关，依旧祖师爷

但是发现祖师爷没了！！！

双写绕过

```
"><scrscriptipt>alert(1)</scrscriptipt>
```

![image-20260201154034122](attachments/image-20260201154034122.png)



### Level8

![image-20260201154145867](attachments/image-20260201154145867.png)

页面内包含一个友情链接，还记得我们前面的href吧？

![image-20260201154227659](attachments/image-20260201154227659.png)

思路是修改一下友情链接的地址

![](attachments/image-20260201154315288.png)

![image-20260201154419957](attachments/image-20260201154419957.png)

ASCII码过滤

```
javascrip&#116:alert(1)
```

### Level9

试试上一关的Payload

![image-20260201154515491](attachments/image-20260201154515491.png)

发现不行

```
javascrip&#116:alert('http://baidu.com')
```

![](attachments/image-20260201154619037.png)

![image-20260201154708946](attachments/image-20260201154708946.png)

原因就是判断了输入内容是否有http://

### Level10

查看源代码，发现3个隐藏的input

![image-20260201154943942](attachments/image-20260201154943942.png)

尝试去传参数

```
?t_link=aaa&t_history=bbb&t_sort=ccc
```

![image-20260201155026069](attachments/image-20260201155026069.png)

发现只有t_sort

```
?t_link=aaa&t_history=bbb&t_sort=ccc%22onmouseover=%27alert(1)%27%20type=%22text
```

![image-20260201155211777](attachments/image-20260201155211777.png)