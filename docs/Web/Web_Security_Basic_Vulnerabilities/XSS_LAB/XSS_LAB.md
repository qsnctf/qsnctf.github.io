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