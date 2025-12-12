# PNG 隐写术

对于PNG来说，隐写术有很多很多，比如我们前面所讲的一个高宽问题，针对于这种我们只需要修改高宽就可以解决，但是后面也有很多更复杂的隐写术。

## LSB隐写

**LSB(Least Significant Bit) 隐写** 是一种常见的信息隐藏技术，主要用于在图像中嵌入秘密信息。它通过修改图像像素的最低有效位来实现信息的隐藏，而这种修改对人眼几乎不可察觉。

### 原理

图片中的像素一般都是由RGB三原色（红绿蓝）组成，每一种颜色占用8位，取值范围为`0x00~0xFF`，即有256中颜色，一共包含了256的3次方的颜色，即16777216中颜色。而人类的眼睛可以区分约1000万种不同的颜色，这就意味着人类的眼睛无法区分余下的颜色大约有6777216种。

![](attachments/image.png)

LSB隐写就是修改RGB颜色分量的最低二进制位也就是最低有效位（LSB），而人类的眼睛不会注意到这前后的变化。

例如，十进制的235表示绿色，二进制为11101011。修改最低位后，颜色看起来依旧没有变化，但实际上已经嵌入了信息。

出题脚本如下：

```python
from PIL import Image
def encode(image_path, secret_data, output_path):
   image = Image.open(image_path)
   pixels = list(image.getdata())
   binary_secret = ''.join(format(ord(char), '08b') for char in secret_data)
   binary_secret += '1111111111111110' # 结束标志
   new_pixels = []
   data_index = 0
   for pixel in pixels:
       new_pixel = list(pixel)
       for i in range(3): # 对RGB三个通道进行修改
           if data_index < len(binary_secret):
               new_pixel[i] = (new_pixel[i] & ~1) | int(binary_secret[data_index])
               data_index += 1
       new_pixels.append(tuple(new_pixel))
   new_image = Image.new(image.mode, image.size)
   new_image.putdata(new_pixels)
   new_image.save(output_path)
encode('input.png', 'Secret Message', 'output.png')
```

### 解题
针对解题，我们需要一个工具，`StegSolve`。

下载地址如下：

```text
http://www.caesum.com/handbook/Stegsolve.jar
```
这个工具需要`java`环境，然后双击打开即可。如果下载之后出现的是一个压缩包的格式，这里给出两个解决方法。

#### 方法1

右键 -> 打开方式 -> 选择程序 -> ` Java(TM) Platform binary` -> 把"始终使用选择的程序打开这种文件"的勾打上。

#### 方法2

首先`Ctrl + R`， 在窗口中输入`regedit`，打开注册表。

`HKEY_CLASSES_ROOT\Applications\javaw.exe\shell\open\commandb`，将注册表的值进行修改。

将数据的数值改为`"D:\jdk1.8\bin\javaw.exe" -jar "%1"`，其中`javaw`的地址为你本地的地址。

最后选择jar包打开方式，找到对应的`jdk`下面的`javaw.exe`打开即可。



回到正题。

使用`stegsolve`打开图片，按右方向键查看各通道显示的图像。

图像处理主要是analyse这个模块，主要有这四个功能：

+ File Format: 文件格式，查看图片的具体信息

+ Data Extract: 数据抽取，提取图片中隐藏数据

+ Frame Browser: 帧浏览器，主要是对GIF之类的动图进行分解，动图变成一张张图片

+ Image Combiner: 拼图，图片拼接

对于LSB隐写的图片，我们用StegSolve打开模块，由于是RGB三原色的最低位隐写，所以在Data Extract模，提取Red，Green，和Blue的0通道信息，在这三个颜色的0通道上打勾，并按下Preview键，当隐写的内容为文本文件时如下所示：

![](attachments/image1.png)


当隐写的内容为图片时如下所示：

![](attachments/image2.png)

由PNG文件头可以看出隐写内容为PNG文件，按save Bin键保存为PNG文件。

