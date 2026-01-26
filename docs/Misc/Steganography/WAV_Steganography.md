音频隐写术(Audio Steganography)是一种将秘密信息隐藏在音频文件中的技术。与加密不同,隐写术的目标不是使信息不可读,而是使信息的存在本身不被察觉。在CTF竞赛中,WAV格式因其无损、结构简单而成为音频隐写的主要载体。

### 隐写术的特点

**优势**:

- 隐蔽性高: 人耳对音频的微小变化不敏感
- 容量大: 可以隐藏大量数据
- 多样性: 可以使用时域、频域等多种方法

**检测难度**:

- 统计检测: 可以通过统计分析发现异常
- 视觉检测: 频谱图可能暴露隐藏信息
- 专用工具: 针对特定算法的检测工具

### CTF中的应用场景

在CTF竞赛的Misc或Crypto类别中,WAV隐写通常用于:

- 隐藏flag字符串
- 隐藏密码或密钥
- 隐藏压缩包或图片文件
- 隐藏加密后的数据
- 传递多阶段提示信息

---

## WAV文件格式详解

### RIFF结构原理

WAV文件基于RIFF (Resource Interchange File Format) 容器格式,这是微软和IBM开发的一种通用文件格式。RIFF采用"块"(Chunk)结构,每个块包含特定类型的数据。

### 完整文件结构

```
偏移(十六进制)  字段名称           大小    说明
================================================================================
RIFF Chunk (文件头)
--------------------------------------------------------------------------------
0x00           ChunkID           4字节   "RIFF" (0x52494646)
0x04           ChunkSize         4字节   文件大小 - 8 (小端序)
0x08           Format            4字节   "WAVE" (0x57415645)

fmt Chunk (格式块)
--------------------------------------------------------------------------------
0x0C           Subchunk1ID       4字节   "fmt " (0x666D7420)
0x10           Subchunk1Size     4字节   格式块大小,通常为16
0x14           AudioFormat       2字节   音频格式,1=PCM
0x16           NumChannels       2字节   声道数,1=单声道,2=立体声
0x18           SampleRate        4字节   采样率,如44100Hz
0x1C           ByteRate          4字节   每秒字节数 = SampleRate × NumChannels × BitsPerSample/8
0x20           BlockAlign        2字节   块对齐 = NumChannels × BitsPerSample/8
0x22           BitsPerSample     2字节   采样位深,8/16/24/32

data Chunk (数据块)
--------------------------------------------------------------------------------
0x24           Subchunk2ID       4字节   "data" (0x64617461)
0x28           Subchunk2Size     4字节   音频数据大小
0x2C           Data              N字节   实际音频采样数据
```

### 关键参数解析

**采样率 (Sample Rate)**:

- 定义: 每秒采集的样本数量
- 常见值: 8000Hz(电话), 22050Hz, 44100Hz(CD质量), 48000Hz(专业音频)
- 影响: 决定音频的频率范围,采样率越高,能表示的频率越高
- 奈奎斯特定理: 采样率应至少为最高频率的2倍

**位深度 (Bit Depth)**:

- 定义: 每个采样点用多少比特表示
- 常见值: 8位(256级), 16位(65536级), 24位, 32位
- 影响: 决定动态范围和信噪比,位深度越高,音质越好
- 动态范围: 约等于 6.02 × BitsPerSample (dB)

**声道数 (Channels)**:

- 单声道(Mono): 一个声道,文件较小
- 立体声(Stereo): 两个声道(左、右),可以产生空间感
- 多声道: 5.1、7.1等环绕声系统

### 十六进制示例

典型WAV文件头部的十六进制表示:

```
52 49 46 46  // "RIFF"
24 08 00 00  // ChunkSize = 2084字节
57 41 56 45  // "WAVE"
66 6D 74 20  // "fmt "
10 00 00 00  // fmt chunk大小 = 16
01 00        // PCM格式
02 00        // 立体声
44 AC 00 00  // 44100 Hz采样率
10 B1 02 00  // 字节率 = 176400
04 00        // 块对齐 = 4
10 00        // 16位采样
64 61 74 61  // "data"
00 08 00 00  // 数据大小 = 2048字节
[音频数据开始...]
```

---

## 隐写技术原理

### 1. LSB隐写 (最低有效位)

#### 原理详解

LSB (Least Significant Bit) 隐写是最常见的音频隐写方法。其核心思想是利用人耳对音频微小变化的不敏感性,将秘密信息嵌入到音频采样数据的最低位。

**数学原理**:

```
原始采样值: 01101010 11001101 (十进制: 27341)
隐藏比特:   1
修改后:     01101010 11001101 → 01101010 11001101
                              ↑
                          LSB位被替换
```

对于16位采样,修改最低1位只会造成 1/65536 的相对变化,这种变化人耳几乎无法察觉。

#### 容量计算

```
隐藏容量 = (采样数 × 使用的LSB位数) / 8 字节

例如:
- 时长: 10秒
- 采样率: 44100 Hz
- 声道: 立体声(2)
- 使用LSB位: 1位

总采样数 = 10 × 44100 × 2 = 882,000
隐藏容量 = 882,000 × 1 / 8 = 110,250 字节 ≈ 107.6 KB
```

#### 多位LSB

可以使用多个最低位来增加容量,但会降低隐蔽性:

- 1位LSB: 最隐蔽,容量最小
- 2位LSB: 平衡,常用
- 3-4位LSB: 容量大,但可能被察觉

#### 检测方法

**统计检测**:

- LSB位应该随机分布(50%为0, 50%为1)
- 如果嵌入了结构化数据,分布会出现偏差

**视觉检测**:

- 提取LSB位并可视化
- 如果是有意义的数据,会呈现模式

### 2. 频谱隐写

#### 原理详解

频谱隐写利用音频的频域表示来隐藏信息。通过傅里叶变换,音频从时域转换到频域,可以在频谱中"绘制"信息。

**傅里叶变换**:

```
时域信号 x(t) --[FFT]--> 频域信号 X(f)

每个频率分量的幅度和相位可以被调制
```

**实现方法**:

1. 对音频进行短时傅里叶变换(STFT)
2. 在特定频率范围内调制幅度
3. 使用逆变换合成音频
4. 在频谱图中可以看到隐藏的图案

#### 频谱图类型

**线性频谱**:

- Y轴: 频率(线性刻度)
- 适合查看宽带信息

**对数频谱**:

- Y轴: 频率(对数刻度)
- 适合查看低频细节

**梅尔频谱**:

- 基于人耳感知特性
- 低频分辨率高,高频分辨率低

#### 常见隐藏内容

- **文字**: 在频谱中显示ASCII字符
- **图片**: 二维码、Logo、图案
- **坐标**: 提示下一步操作的位置信息

### 3. 回声隐写 (Echo Hiding)

#### 原理详解

回声隐写通过在音频中添加延迟的回声来编码信息。人耳对短延迟(< 1ms)的回声不敏感,但可以通过信号处理检测。

**编码规则**:

```
比特 0: 延迟 d0 (例如 0.5ms)
比特 1: 延迟 d1 (例如 1.0ms)

原始信号: s(t)
回声信号: α × s(t - d)
混合信号: s(t) + α × s(t - d)

其中 α 是回声幅度系数(通常 < 0.5)
```

**参数选择**:

- 延迟时间: 0.5-2 ms
- 回声幅度: 0.1-0.5
- 分段长度: 每个比特对应一段音频

#### 检测方法

**自相关分析**:

```python
import numpy as np

def detect_echo(signal, max_delay):
    autocorr = np.correlate(signal, signal, mode='full')
    # 查找峰值对应的延迟
    peaks = find_peaks(autocorr)
    return bytes(bytes_data)

# 使用示例
data = extract_lsb('audio.wav', num_lsb=1)

# 保存提取的数据
with open('extracted.bin', 'wb') as f:
    f.write(data)

# 尝试解析为文本
try:
    text = data.decode('utf-8', errors='ignore')
    print("提取的文本:")
    print(text)
except:
    print("无法解析为文本,可能是二进制数据")

# 查看十六进制
print("\n前100字节的十六进制:")
print(data[:100].hex())
```

**方法3: 更高级的LSB提取**:

```python
import wave
import numpy as np

def advanced_lsb_extract(wav_file, num_lsb=1, bits_per_byte=8):
    """
    高级LSB提取,支持自定义位序
    """
    with wave.open(wav_file, 'rb') as wav:
        # 读取音频数据
        frames = wav.readframes(wav.getnframes())
        
        # 转换为numpy数组
        if wav.getsampwidth() == 1:
            audio = np.frombuffer(frames, dtype=np.uint8)
        elif wav.getsampwidth() == 2:
            audio = np.frombuffer(frames, dtype=np.int16)
        else:
            raise ValueError("不支持的采样宽度")
        
        # 提取LSB
        bits = []
        for sample in audio:
            for i in range(num_lsb):
                bits.append((sample >> i) & 1)
        
        # 按位重组为字节
        bytes_list = []
        for i in range(0, len(bits) - bits_per_byte + 1, bits_per_byte):
            byte = 0
            for j in range(bits_per_byte):
                byte |= bits[i + j] << j
            bytes_list.append(byte)
        
        return bytes(bytes_list)

# 使用
data = advanced_lsb_extract('audio.wav', num_lsb=2)
```

### 7. 十六进制编辑器

#### 010 Editor

**官网**: https://www.sweetscape.com/010editor/

**特点**:

- 支持二进制模板
- 内置WAV文件模板
- 强大的脚本功能

**使用模板**:

```
1. 打开WAV文件
2. Templates → Open Template → WAV.bt
3. 自动解析文件结构
4. 查看各个chunk的详细信息
```

#### hexdump (Linux命令行)

**基本用法**:

```bash
# 查看文件十六进制
hexdump -C audio.wav | less

# 只看前100字节
hexdump -C audio.wav | head -n 20

# 查看特定偏移
hexdump -C -s 0x2C -n 100 audio.wav

# 搜索字符串
hexdump -C audio.wav | grep -i "flag"

# 以不同格式显示
hexdump -e '16/1 "%02x " "\n"' audio.wav
```

**提取文件末尾数据**:

```bash
# 1. 查看WAV头部,获取data chunk大小
hexdump -C audio.wav | head -n 3

# 假设data chunk在0x28,大小为0x1000
# 理论文件大小 = 0x2C + 0x1000 = 0x102C

# 2. 查看实际文件大小
ls -l audio.wav
# 假设实际大小为 0x1100

# 3. 提取额外数据
dd if=audio.wav of=extra.bin bs=1 skip=$((0x102C))

# 4. 分析提取的数据
file extra.bin
binwalk extra.bin
```

### 8. DTMF解码工具

#### multimon-ng (Linux)

**安装**:

```bash
sudo apt-get install multimon-ng
```

**使用**:

```bash
# 解码DTMF
multimon-ng -t wav -a DTMF audio.wav

# 同时解码多种信号
multimon-ng -t wav -a DTMF -a MORSE audio.wav

# 从sox管道输入
sox audio.wav -t raw -r 22050 -e signed -b 16 -c 1 - | multimon-ng -t raw -a DTMF -
```

#### 在线DTMF解码器

**推荐网站**:

- http://dialabc.com/sound/detect/
- https://dtmf.netlify.app/

**使用步骤**:

```
1. 上传WAV文件或录音
2. 自动识别DTMF音
3. 显示对应的数字序列
```

### 9. 摩尔斯电码工具

#### 在线解码器

**推荐**:

- https://morsecode.world/international/decoder/audio-decoder-adaptive.html
- https://databorder.com/transfer/morse-sound-receiver/

**使用方法**:

```
1. 上传音频文件
2. 调整参数:
   - WPM (每分钟字数)
   - 频率范围
   - 阈值
3. 自动识别并转换为文本
```

#### Python解码

```python
import numpy as np
from scipy.io import wavfile
from scipy import signal

def decode_morse(wav_file, threshold=0.3):
    """
    简单的摩尔斯电码解码
    """
    # 读取音频
    rate, data = wavfile.read(wav_file)
    
    # 转换为单声道
    if len(data.shape) > 1:
        data = data[:, 0]
    
    # 计算包络
    analytic_signal = signal.hilbert(data)
    amplitude_envelope = np.abs(analytic_signal)
    
    # 归一化
    envelope = amplitude_envelope / np.max(amplitude_envelope)
    
    # 二值化
    binary = (envelope > threshold).astype(int)
    
    # 查找音调变化
    diff = np.diff(binary)
    on_times = np.where(diff == 1)[0]
    off_times = np.where(diff == -1)[0]
    
    # 计算持续时间
    durations = []
    for i in range(min(len(on_times), len(off_times))):
        duration = off_times[i] - on_times[i]
        durations.append(duration)
    
    # 分类为点和划
    avg_duration = np.mean(durations)
    morse_code = []
    for d in durations:
        if d < avg_duration * 1.5:
            morse_code.append('.')
        else:
            morse_code.append('-')
    
    return ''.join(morse_code)

# 摩尔斯电码字典
MORSE_DICT = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D',
    '.': 'E', '..-.': 'F', '--.': 'G', '....': 'H',
    '..': 'I', '.---': 'J', '-.-': 'K', '.-..': 'L',
    '--': 'M', '-.': 'N', '---': 'O', '.--.': 'P',
    '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X',
    '-.--': 'Y', '--..': 'Z',
    '-----': '0', '.----': '1', '..---': '2', '...--': '3',
    '....-': '4', '.....': '5', '-....': '6', '--...': '7',
    '---..': '8', '----.': '9'
}

def morse_to_text(morse_code, separator=' '):
    """将摩尔斯电码转换为文本"""
    words = morse_code.split('  ')  # 双空格分隔单词
    result = []
    for word in words:
        letters = word.split(separator)
        decoded_word = ''.join([MORSE_DICT.get(letter, '?') for letter in letters])
        result.append(decoded_word)
    return ' '.join(result)
```

### 10. 频谱分析工具

#### Spek

**下载**: http://spek.cc/

**特点**:

- 轻量级
- 实时频谱显示
- 跨平台

**使用**:

```
拖放WAV文件到窗口
自动显示频谱图
可以保存为PNG图片
```

### 11. 其他实用工具

#### SoX (Sound eXchange)

**安装**:

```bash
# Linux
sudo apt-get install sox

# macOS
brew install sox

# Windows
下载安装包: https://sourceforge.net/projects/sox/
```

**常用操作**:

```bash
# 查看文件信息
sox --i audio.wav

# 转换格式
sox input.wav output.mp3

# 改变采样率
sox audio.wav -r 22050 output.wav

# 提取声道
sox stereo.wav left.wav remix 1
sox stereo.wav right.wav remix 2

# 生成频谱图
sox audio.wav -n spectrogram -o spectrogram.png

# 改变速度
sox audio.wav output.wav speed 0.5  # 慢一倍

# 音量调整
sox audio.wav output.wav vol 2.0  # 放大2倍

# 剪切音频
sox audio.wav output.wav trim 0 10  # 前10秒
```

#### ffmpeg

**音频分析**:

```bash
# 查看详细信息
ffmpeg -i audio.wav

# 提取音频流
ffmpeg -i input.mp4 -vn -acodec copy audio.wav

# 转换格式
ffmpeg -i audio.wav -acodec libmp3lame output.mp3

# 分离声道
ffmpeg -i stereo.wav -map_channel 0.0.0 left.wav
ffmpeg -i stereo.wav -map_channel 0.0.1 right.wav

# 改变速度
ffmpeg -i audio.wav -filter:a "atempo=0.5" output.wav
```

#### binwalk

**扫描嵌入文件**:

```bash
# 基本扫描
binwalk audio.wav

# 提取所有文件
binwalk -e audio.wav

# 详细信息
binwalk -v audio.wav

# 扫描特定签名
binwalk --signature audio.wav
```