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

### 4. 十六进制编辑器

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

### 5. DTMF解码工具

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

### 6. 摩尔斯电码工具

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

### 7. 频谱分析工具

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

### 8. 其他实用工具

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

## 1. 文件基本信息

```bash
# 查看文件类型
file audio.wav
# 输出: audio.wav: RIFF (little-endian) data, WAVE audio, Microsoft PCM, 16 bit, stereo 44100 Hz

# 查看文件大小
ls -lh audio.wav
# 检查是否异常大

# 计算哈希值(用于对比)
md5sum audio.wav
sha256sum audio.wav

# 查看元数据
exiftool audio.wav
```

**关注点**:

- 文件大小是否异常
- 采样率和位深度
- 声道数
- 是否有特殊的元数据字段

## 2. 试听音频

```
使用任何播放器播放音频:
- VLC
- Windows Media Player
- macOS QuickTime

注意听:
- 是否有人声
- 是否有规律的嘀嘀声(可能是摩尔斯电码)
- 是否有DTMF音(电话拨号音)
- 是否有异常的噪音或失真
- 左右声道是否有差异
```

## 3. 快速字符串检查

```bash
# 搜索可打印字符串
strings audio.wav | less

# 搜索flag关键字
strings audio.wav | grep -i flag
strings audio.wav | grep -i ctf
strings audio.wav | grep -i key
strings audio.wav | grep -i password

# 搜索常见文件头
strings audio.wav | grep -i "PK"  # ZIP
strings audio.wav | grep -i "�PNG"  # PNG
strings audio.wav | grep -i "JFIF"  # JPEG
```

## 4. 十六进制初步检查

```bash
# 查看文件头部
hexdump -C audio.wav | head -n 10

# 查看文件尾部
hexdump -C audio.wav | tail -n 20

# 检查是否有追加数据
# 计算理论大小并与实际大小对比
```

## 1. Audacity频谱分析

```
详细步骤:
1. 打开Audacity
2. 导入音频文件
3. 切换到频谱图视图
4. 调整参数寻找最佳显示:
   
   窗口大小设置建议:
   - 256: 时间分辨率高,适合快速变化
   - 2048: 平衡,最常用
   - 8192: 频率分辨率高,适合查看细节文字
   
   颜色方案尝试:
   - Grayscale
   - Inverse grayscale (黑底白字)
   - Color (spectrum)
   
5. 仔细查看整个频谱图
6. 特别注意:
   - 顶部区域(高频)
   - 底部区域(低频)  
   - 是否有文字
   - 是否有图案或二维码
   - 是否有规律的条纹
```

**常见频谱隐藏位置**:

```
高频区域 (10kHz - 20kHz):
- 人耳不敏感
- 常用于隐藏文字
- 需要调整频谱范围才能看清

中频区域 (1kHz - 10kHz):
- 可能混合在正常音频中
- 需要仔细观察

低频区域 (0 - 1kHz):
- 较少使用
- 但也需要检查
```

## 2. 波形分析

```
在Audacity中:
1. 切换到波形视图
2. 使用放大工具(Ctrl + 1)逐步放大
3. 查看是否有:
   - 数字形状
   - 字母形状
   - 规律的高低变化(摩尔斯)
   - 周期性模式
```

**摩尔斯电码识别**:

```
视觉特征:
短音(点): ▂
长音(划): ▂▂▂
间隔: 空白

示例:
SOS: ▂▂▂ (···) 空白 ▂▂▂▂▂▂ (---) 空白 ▂▂▂ (···)
```

## 3. 立体声分析

```
步骤:
1. 确认是立体声文件
2. 在Audacity中分离声道:
   轨道菜单 → 分离立体声为单声道
3. 单独查看每个声道:
   - 左声道的频谱图
   - 右声道的频谱图
4. 对比差异
5. 尝试反相操作:
   - 选中一个声道
   - 效果 → 反相
   - 混合两个声道
6. 计算声道差:
   使用插件或导出后用Python处理
```

## 1. Python脚本提取

```python
# 使用前面提供的extract_lsb函数
for num_bits in range(1, 5):
    print(f"\n尝试提取 {num_bits} 位LSB...")
    data = extract_lsb('audio.wav', num_lsb=num_bits)
    
    # 保存到文件
    filename = f'lsb_{num_bits}bit.bin'
    with open(filename, 'wb') as f:
        f.write(data)
    
    # 尝试识别文件类型
    print(f"文件大小: {len(data)} 字节")
    print(f"前20字节: {data[:20].hex()}")
    
    # 尝试解析为文本
    try:
        text = data.decode('utf-8', errors='ignore')
        if 'flag' in text.lower() or 'ctf' in text.lower():
            print(f"可能找到flag: {text[:200]}")
    except:
        pass
    
    # 使用file命令识别(Linux)
    import subprocess
    result = subprocess.run(['file', filename], capture_output=True, text=True)
    print(f"文件类型: {result.stdout}")
```

## 2. 分析提取的数据

```bash
# 查看文件类型
file lsb_1bit.bin

# 如果是压缩包
unzip lsb_1bit.bin
# 或
7z x lsb_1bit.bin

# 如果是图片
mv lsb_1bit.bin extracted.png
xdg-open extracted.png

# 如果是文本
cat lsb_1bit.bin

# 查找可打印字符
strings lsb_1bit.bin

# 熵分析(检查是否加密)
ent lsb_1bit.bin
```

## 1. Steghide扫描

```bash
# 查看信息
steghide info audio.wav

# 尝试常见密码
passwords=("" "password" "123456" "admin" "ctf" "flag" "audio" "secret")

for pass in "${passwords[@]}"; do
    echo "尝试密码: $pass"
    steghide extract -sf audio.wav -p "$pass" -xf output_$pass.txt 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "成功! 密码是: $pass"
        cat output_$pass.txt
        break
    fi
done
```

## 2. DeepSound检测

```
Windows GUI操作:
1. 打开DeepSound
2. 加载音频文件
3. 查看是否显示"contains hidden data"
4. 尝试提取
5. 如果需要密码,尝试:
   - 空密码
   - 文件名
   - 题目描述中的关键词
   - 常见密码字典
```

## 3. 其他工具尝试

```bash
# SilentEye(需要图形界面)
# WavSteg
# OpenStego
```

## 1. DTMF解码

```bash
# 使用multimon-ng
multimon-ng -t wav -a DTMF audio.wav > dtmf_output.txt
cat dtmf_output.txt

# 或使用在线工具
# 上传到 http://dialabc.com/sound/detect/
```

## 2. 摩尔斯解码

```bash
# 如果是明显的嘀嘀声
# 使用在线工具:
# https://morsecode.world/international/decoder/audio-decoder-adaptive.html

# 或使用Python脚本(前面提供的)
python decode_morse.py audio.wav
```

## 3. 频谱水印检测

```python
import numpy as np
from scipy.io import wavfile
from scipy import fft
import matplotlib.pyplot as plt

def analyze_spectrum(wav_file):
    """详细的频谱分析"""
    rate, data = wavfile.read(wav_file)
    
    # 转单声道
    if len(data.shape) > 1:
        data = data[:, 0]
    
    # FFT
    fft_data = fft.fft(data)
    freqs = fft.fftfreq(len(data), 1/rate)
    
    # 只看正频率
    positive_freqs = freqs[:len(freqs)//2]
    positive_fft = np.abs(fft_data[:len(fft_data)//2])
    
    # 绘图
    plt.figure(figsize=(12, 6))
    plt.plot(positive_freqs, positive_fft)
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Magnitude')
    plt.title('Frequency Spectrum')
    plt.xlim(0, rate/2)
    plt.savefig('spectrum.png')
    
    # 查找异常峰值
    threshold = np.mean(positive_fft) + 3 * np.std(positive_fft)
    peaks = positive_freqs[positive_fft > threshold]
    print(f"异常频率峰值: {peaks}")

analyze_spectrum('audio.wav')
```

## 4. 回声检测

```python
import numpy as np
from scipy.io import wavfile
from scipy import signal

def detect_echo(wav_file, max_delay_ms=10):
    """检测回声隐写"""
    rate, data = wavfile.read(wav_file)
    
    if len(data.shape) > 1:
        data = data[:, 0]
    
    # 计算自相关
    max_delay_samples = int(max_delay_ms * rate / 1000)
    autocorr = signal.correlate(data, data, mode='full')
    autocorr = autocorr[len(autocorr)//2:]
    
    # 查找峰值
    peaks, _ = signal.find_peaks(autocorr[:max_delay_samples], 
                                   height=np.max(autocorr)*0.1)
    
    if len(peaks) > 0:
        delays_ms = peaks * 1000 / rate
        print(f"检测到可能的回声延迟: {delays_ms} ms")
        return delays_ms
    else:
        print("未检测到明显回声")
        return None

detect_echo('audio.wav')
```

## 典型题型案例

### 案例1: 频谱图隐藏FLAG

**题目描述**: 
给定一个WAV文件,提示"有时候,你需要换个角度看问题"

**解题步骤**:

```
1. 用Audacity打开文件
2. 切换到频谱图视图
3. 调整参数:
   - 窗口大小: 4096
   - 颜色方案: Inverse grayscale
4. 在高频区域发现文字: "FLAG{SP3CTR0GRAM_1S_FUN}"
```

**关键点**:

- 频谱图是最常见的视觉隐写
- 通常在高频区域(人耳听不到)
- 需要调整窗口大小才能看清

**脚本解法**:

```python
from scipy.io import wavfile
from scipy import signal
import matplotlib.pyplot as plt

rate, data = wavfile.read('challenge.wav')
f, t, Sxx = signal.spectrogram(data[:, 0], rate, nperseg=4096)

plt.figure(figsize=(15, 8))
plt.pcolormesh(t, f, 10 * np.log10(Sxx), shading='gouraud')
plt.ylabel('Frequency [Hz]')
plt.xlabel('Time [sec]')
plt.ylim(10000, 20000)  # 只看高频
plt.savefig('flag_spectrum.png', dpi=300)
```

### 案例2: LSB隐藏ZIP文件

**题目描述**:
一个正常的音乐文件,但文件大小异常大

**解题步骤**:

```bash
# 1. 提取LSB
python extract_lsb.py audio.wav

# 2. 检查提取的数据
file lsb_1bit.bin
# 输出: lsb_1bit.bin: Zip archive data

# 3. 解压
unzip lsb_1bit.bin
# 或
mv lsb_1bit.bin hidden.zip
unzip hidden.zip

# 4. 查看解压的文件
cat flag.txt
# FLAG{LSB_H1DD3N_Z1P}
```

**Python脚本**:

```python
import wave
import struct
import zipfile

def extract_and_unzip(wav_file):
    # 提取LSB
    wav = wave.open(wav_file, 'rb')
    frames = wav.readframes(wav.getnframes())
    samples = struct.unpack(f'{len(frames)//2}h', frames)
    wav.close()
    
    bits = [(s & 1) for s in samples]
    
    bytes_data = bytearray()
    for i in range(0, len(bits), 8):
        byte = sum(bits[i+j] << j for j in range(8) if i+j < len(bits))
        bytes_data.append(byte)
    
    # 查找ZIP文件头 (PK\x03\x04)
    zip_start = bytes_data.find(b'PK\x03\x04')
    if zip_start != -1:
        print(f"[+] 在偏移 {zip_start} 找到ZIP文件头")
        zip_data = bytes_data[zip_start:]
        
        # 保存并解压
        with open('hidden.zip', 'wb') as f:
            f.write(zip_data)
        
        with zipfile.ZipFile('hidden.zip', 'r') as z:
            z.extractall('extracted')
            print(f"[+] 解压完成,文件列表:")
            for name in z.namelist():
                print(f"    - {name}")

extract_and_unzip('challenge.wav')
```

### 案例3: 摩尔斯电码

**题目描述**:
音频中有规律的嘀嘀声

**解题步骤**:

```
1. 播放音频,确认是摩尔斯电码
2. 方法1: 人工识别
   - 短音 = .
   - 长音 = -
   - 记录下来: ... --- ...
   - 查表: SOS

3. 方法2: 使用在线工具
   - 上传到 https://morsecode.world/international/decoder/audio-decoder-adaptive.html
   - 自动识别

4. 方法3: Audacity手动分析
   - 放大波形
   - 测量音调长度
   - 手动转换
```

**完整摩尔斯字典**:

```
A .-      B -...    C -.-.    D -..     E .
F ..-.    G --.     H ....    I ..      J .---
K -.-     L .-..    M --      N -.      O ---
P .--.    Q --.-    R .-.     S ...     T -
U ..-     V ...-    W .--     X -..-    Y -.--
Z --..

0 -----   1 .----   2 ..---   3 ...--   4 ....-
5 .....   6 -....   7 --...   8 ---..   9 ----.
```

### 案例4: DTMF隐藏电话号码

**题目描述**:
音频听起来像电话拨号音

**解题步骤**:

```bash
# 使用multimon-ng
multimon-ng -t wav -a DTMF challenge.wav

# 输出:
# DTMF: 3
# DTMF: 1
# DTMF: 4
# DTMF: 1
# DTMF: 5
# DTMF: 9

# 得到数字序列: 314159
# 可能是密码或flag的一部分
```

**DTMF频率表**:

```
按键  低频(Hz)  高频(Hz)
1     697       1209
2     697       1336
3     697       1477
4     770       1209
5     770       1336
6     770       1477
7     852       1209
8     852       1336
9     852       1477
0     941       1336
```

### 案例5: 立体声声道隐藏

**题目描述**:
一个立体声音频文件,左右声道似乎不同

**解题步骤**:

```
Audacity步骤:
1. 打开文件
2. 点击轨道名称 → "分离立体声为单声道"
3. 单独分析每个声道
4. 发现左声道是正常音乐,右声道是噪音
5. 对右声道:
   - 切换到频谱图
   - 发现隐藏的二维码
6. 截图保存
7. 用手机扫描二维码
8. 得到flag
```

**Python脚本分析**:

```python
from scipy.io import wavfile
import matplotlib.pyplot as plt

rate, data = wavfile.read('stereo_challenge.wav')

left = data[:, 0]
right = data[:, 1]

# 绘制两个声道的频谱图
fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(15, 10))

from scipy import signal

# 左声道
f1, t1, Sxx1 = signal.spectrogram(left, rate, nperseg=2048)
ax1.pcolormesh(t1, f1, 10 * np.log10(Sxx1), shading='gouraud')
ax1.set_title('Left Channel')
ax1.set_ylabel('Frequency [Hz]')

# 右声道
f2, t2, Sxx2 = signal.spectrogram(right, rate, nperseg=2048)
ax2.pcolormesh(t2, f2, 10 * np.log10(Sxx2), shading='gouraud')
ax2.set_title('Right Channel - QR Code Here')
ax2.set_ylabel('Frequency [Hz]')
ax2.set_xlabel('Time [sec]')

plt.tight_layout()
plt.savefig('stereo_analysis.png', dpi=300)
```

### 案例6: 文件末尾追加数据

**题目描述**:
WAV文件大小异常,但音频播放正常

**解题步骤**:

```bash
# 1. 解析WAV头部
hexdump -C challenge.wav | head -n 3
# 找到data chunk的大小

# 假设输出:
# 00000000  52 49 46 46 24 00 01 00  57 41 56 45 66 6d 74 20  |RIFF$...WAVEfmt |
# 00000010  10 00 00 00 01 00 02 00  44 ac 00 00 10 b1 02 00  |........D.......|
# 00000020  04 00 10 00 64 61 74 61  00 00 01 00 ...          |....data....|
#                                     ^^^^^^^^^^
# data chunk大小 = 0x00010000 = 65536字节

# 2. 计算偏移
# 偏移 = 0x2C (44字节header) + 0x10000 = 0x1002C

# 3. 提取额外数据
dd if=challenge.wav of=extra.bin bs=1 skip=$((0x1002C))

# 4. 分析
file extra.bin
# 输出: extra.bin: PNG image data

# 5. 查看图片
mv extra.bin hidden.png
xdg-open hidden.png
# 图片中有flag
```

### 案例7: Steghide密码爆破

**题目描述**:
怀疑使用了steghide,但不知道密码

**解题步骤**:

```bash
# 1. 确认有隐藏数据
steghide info challenge.wav
# 提示输入密码

# 2. 创建密码字典
# 常见CTF密码
cat > passwords.txt << EOF
password
123456
admin
ctf
flag
challenge
audio
secret
hidden
steghide
EOF

# 也可以从题目描述生成
echo "challenge_title_2024" >> passwords.txt

# 3. 爆破脚本
#!/bin/bash
while IFS= read -r pass; do
    echo "尝试密码: $pass"
    steghide extract -sf challenge.wav -p "$pass" -xf output.txt 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "[+] 成功! 密码是: $pass"
        cat output.txt
        exit 0
    fi
done < passwords.txt

echo "[-] 未找到正确密码"
```

**Python爆破脚本**:

```python
import subprocess
import sys

passwords = [
    "", "password", "123456", "admin", "ctf",
    "flag", "challenge", "audio", "secret", "hidden"
]

def try_steghide(wav_file, password):
    cmd = [
        "steghide", "extract",
        "-sf", wav_file,
        "-p", password,
        "-xf", f"output_{password}.txt",
        "-f"
    ]
    
    result = subprocess.run(
        cmd,
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE
    )
    
    return result.returncode == 0

if len(sys.argv) < 2:
    print("用法: python steghide_crack.py <file.wav>")
    sys.exit(1)

wav_file = sys.argv[1]

for pwd in passwords:
    print(f"[*] 尝试密码: '{pwd}'")
    if try_steghide(wav_file, pwd):
        print(f"[+] 成功! 密码是: '{pwd}'")
        with open(f"output_{pwd}.txt", 'r') as f:
            print(f.read())
        break
else:
    print("[-] 未找到正确密码")
```

### 案例8: 多层隐写

**题目描述**:
复杂的多层隐写,需要多个步骤

**解题流程**:

```
层次1: 频谱图
1. Audacity打开,查看频谱图
2. 发现提示: "LSB 2 bits"

层次2: LSB提取
3. 提取2位LSB
   python extract_lsb.py challenge.wav 2
4. 得到一个ZIP文件

层次3: 压缩包
5. 解压ZIP,需要密码
6. 回到频谱图,仔细查看,发现密码: "pass123"
7. 解压得到一个PNG图片

层次4: 图片隐写
8. 查看图片,看起来正常
9. 使用zsteg或stegsolve分析
   zsteg hidden.png
10. 在图片的LSB中发现最终flag

Flag: FLAG{MULT1_L4Y3R_ST3G0}
```

**自动化脚本**:

```python
#!/usr/bin/env python3
import subprocess
import zipfile
import os

def solve_multilayer(wav_file):
    print("[*] 阶段1: 提取LSB")
    # 提取2位LSB (根据频谱图提示)
    lsb_data = extract_lsb(wav_file, num_lsb=2)
    
    print("[*] 阶段2: 保存为ZIP")
    with open('layer1.zip', 'wb') as f:
        f.write(lsb_data)
    
    print("[*] 阶段3: 尝试解压ZIP")
    passwords = ['pass123', 'password', '123456']  # 从频谱图得到
    
    for pwd in passwords:
        try:
            with zipfile.ZipFile('layer1.zip', 'r') as z:
                z.extractall('layer2', pwd=pwd.encode())
            print(f"[+] ZIP密码: {pwd}")
            break
        except:
            continue
    
    print("[*] 阶段4: 分析图片")
    # 假设解压出hidden.png
    result = subprocess.run(
        ['zsteg', 'layer2/hidden.png'],
        capture_output=True,
        text=True
    )
    
    print("[+] 最终flag:")
    print(result.stdout)

solve_multilayer('challenge.wav')
```

## 常用工具详解

### 1. Audacity

#### 简介

Audacity是一款免费开源的跨平台音频编辑软件,功能强大且易于使用,是CTF音频隐写分析的首选工具之一。

#### 安装

**Windows**:

```
1. 访问 https://www.audacityteam.org/
2. 下载 Windows 安装程序
3. 运行安装程序并按提示操作
```

**Linux**:

```bash
sudo apt-get update
sudo apt-get install audacity

# 或从源码编译
git clone https://github.com/audacity/audacity.git
cd audacity
cmake -S . -B build
cmake --build build
```

**macOS**:

```bash
brew install audacity
```

#### 核心功能详解

**1. 频谱图分析**

操作步骤:

```
1. 文件 → 打开 → 选择WAV文件
2. 点击音轨名称左侧的下拉箭头
3. 选择 "频谱图"
4. 菜单栏: 查看 → 频谱图设置
   - 窗口大小: 建议2048-8192
   - 窗口类型: Hanning (最常用)
   - 零填充因子: 1
   - 颜色方案: 尝试不同方案
```

频谱图参数说明:

- **窗口大小**: 越大频率分辨率越高,但时间分辨率越低
- **零填充**: 提高显示平滑度
- **颜色方案**: 根据对比度选择,推荐试试"Inverse grayscale"

**2. 声道分离**

```
菜单: 音轨 → 立体声音轨转换为单声道
或
点击音轨名称 → 分离立体声为单声道
```

分离后可以:

- 单独分析左右声道
- 删除一个声道查看另一个
- 对比两个声道的差异

**3. 反相处理**

```
选中音轨 → 效果 → 反相
```

应用场景:

- 消除相同部分,保留差异
- 与另一个音轨混合以提取隐藏信息

**4. 速度/音调调整**

```
效果 → 改变速度 (保持音调)
效果 → 改变音调 (保持速度)
效果 → 改变速度和音调
```

用途:

- 识别变速隐藏的摩尔斯电码
- 调整音调以识别DTMF音
- 慢放以听清快速变化

**5. 降噪**

```
1. 选择一段纯噪音
2. 效果 → 噪音消除 → 获取噪音配置文件
3. 选择整个音轨
4. 效果 → 噪音消除 → 确定
```

**6. 导出选区**

```
选中特定区域 → 文件 → 导出 → 导出选中部分
```

#### 高级技巧

**查看样本数据**:

```
查看 → 显示剪辑信息
可以看到采样率、位深度等信息
```

**绘制波形图**:

```
分析 → 绘制频谱
可以生成更详细的频谱分析
```

### 2. Sonic Visualiser

#### 简介

Sonic Visualiser是专业的音频分析工具,提供多种可视化层和插件,特别适合深度频谱分析。

#### 安装

```
官网: https://www.sonicvisualiser.org/
支持: Windows, macOS, Linux
下载对应平台的安装包
```

#### 核心功能

**1. 多层可视化**

```
Layer → Add Spectrogram
Layer → Add Melodic Range Spectrogram  
Layer → Add Peak Frequency Spectrogram
```

每层可以独立配置:

- 颜色方案
- 频率范围
- 窗口大小

**2. 时间标记**

```
Layer → Add Time Instants
手动标记重要时间点
用于分析节奏或模式
```

**3. 插件系统**

Sonic Visualiser支持Vamp插件:

```
Transform → Vamp Plugins
常用插件:
- Beat Tracker: 节奏检测
- Onset Detector: 起始点检测
- DTMF Detector: DTMF解码
```

**4. 导出数据**

```
File → Export Annotation Layer
可以导出标记、频率数据等
```

### 3. DeepSound

#### 简介

DeepSound是Windows上的图形化音频隐写工具,支持在音频文件中嵌入和提取文件。

#### 下载与安装

```
官网: http://jpinsoft.net/deepsound/
仅支持Windows
下载后直接运行,无需安装
```

#### 使用方法

**提取隐藏文件**:

```
1. 运行DeepSound.exe
2. 点击 "Open carrier files"
3. 选择可疑的WAV文件
4. 点击 "Extract secret files"
5. 如果需要密码:
   - 尝试常见密码: password, 123456, admin
   - 题目描述中的关键词
   - 文件名或元数据中的提示
6. 选择输出目录
7. 提取完成后查看文件
```

**查看信息**:

```
打开文件后,界面会显示:
- 文件是否包含隐藏数据
- 使用的加密方式
- 数据大小估计
```

#### 支持的格式

- 载体: WAV, FLAC, APE, MP3
- 隐藏: 任意文件类型

#### 加密选项

- AES 128/192/256
- 可选密码保护

### 4. Steghide

#### 简介

Steghide是功能强大的命令行隐写工具,支持JPEG、BMP、WAV、AU等格式。

#### 安装

**Linux**:

```bash
sudo apt-get install steghide
```

**macOS**:

```bash
brew install steghide
```

**Windows**:

```
下载预编译版本:
https://steghide.sourceforge.net/
解压到PATH目录
```

#### 命令详解

**提取数据**:

```bash
steghide extract -sf audio.wav

# 参数说明:
# -sf: specify file (指定载体文件)
# -p: passphrase (密码)
# -xf: extract file (提取文件名)
# -v: verbose (详细输出)

# 有密码时:
steghide extract -sf audio.wav -p "password"

# 指定输出文件名:
steghide extract -sf audio.wav -xf output.txt
```

**查看文件信息**:

```bash
steghide info audio.wav

# 输出示例:
# "audio.wav":
#   format: wave audio, PCM encoding
#   capacity: 2.1 KB
# Try to get information about embedded data ? (y/n) y
# Enter passphrase:
# embedded data:
#   size: 157.0 Byte
#   encrypted: rijndael-128, cbc
#   compressed: yes
```

**嵌入数据** (制作题目用):

```bash
steghide embed -cf audio.wav -ef secret.txt

# 参数:
# -cf: cover file (载体文件)
# -ef: embed file (要隐藏的文件)
# -p: 设置密码
# -e: 加密算法 (rijndael-128, rijndael-192, rijndael-256等)
# -z: 压缩级别 (1-9)

# 完整示例:
steghide embed -cf audio.wav -ef flag.txt -p "ctf2024" -e rijndael-256 -z 9
```

#### 支持的加密算法

- none (无加密)
- rijndael-128 (AES-128)
- rijndael-192 (AES-192)
- rijndael-256 (AES-256)

#### 常见错误

**错误1**: "could not extract any data"

```
原因: 文件中没有隐藏数据,或密码错误
解决: 尝试不同密码,或文件使用了其他隐写方法
```

**错误2**: "the file format is not supported"

```
原因: WAV文件格式不符合要求
解决: 确认是PCM编码的WAV文件
```

### 5. SilentEye

#### 简介

SilentEye是跨平台的图形化隐写工具,支持图像和音频文件。

#### 安装

```
官网: https://silenteye.v1kings.io/
支持: Windows, Linux, macOS
下载对应平台的安装包
```

#### 使用方法

**解码**:

```
1. 启动SilentEye
2. 点击 "Decode"
3. 选择WAV文件
4. 如果需要密码,输入密码
5. 选择输出位置
6. 点击 "Decode"
```

**选项**:

- 格式选择: WAV, BMP, JPEG
- 加密: AES
- 压缩: GZIP

### 6. WavSteg (Python)

#### 简介

WavSteg是Python实现的LSB隐写工具,可以自定义和扩展。

#### 安装

```bash
pip install stego-lsb
# 或
pip install stepic
```

#### 使用示例

**使用stego-lsb库**:

```python
from stego_lsb import LSBSteg

# 提取数据
steg = LSBSteg()
data = steg.decode_binary('audio.wav')

# 保存为文件
with open('extracted.bin', 'wb') as f:
    f.write(data)

# 如果是文本
text = data.decode('utf-8')
print(text)
```