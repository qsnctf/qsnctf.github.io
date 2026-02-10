卷积神经网络（Convolutional Neural Network, CNN）是一类专门用于处理具有网格状拓扑结构数据的深度神经网络，在计算机视觉、语音识别、自然语言处理等领域取得了革命性成果。CNN的核心设计理念源于对生物视觉系统的模拟——Hubel和Wiesel（1962）发现猫的视觉皮层中存在对局部感受野（receptive field）敏感的简单细胞和复杂细胞，这一发现直接启发了卷积神经网络的架构设计。与全连接网络相比，CNN通过局部连接、权值共享和空间下采样三大机制，极大地减少了模型参数量，同时赋予网络对输入信号平移不变性的归纳偏置（inductive bias）。

## 1 卷积

卷积（Convolution）是信号处理与泛函分析中的基本运算，构成了卷积神经网络的数学基石。本节从连续域的数学定义出发，系统阐述卷积运算的定义、性质及其在深度学习中的变体。

### 1.1 卷积的定义

**连续卷积**

对于两个定义在实数域上的可积函数 $f$ 和 $g$，其卷积定义为：

$$
(f * g)(t) = \int_{-\infty}^{+\infty} f(\tau) \, g(t - \tau) \, d\tau
$$

直观地说，卷积运算可以理解为：将函数 $g$ 沿时间轴翻转后，以位移量 $t$ 滑动，逐点与 $f$ 相乘并对乘积进行积分。在物理系统中，若 $f(t)$ 为输入信号，$g(t)$ 为系统的脉冲响应函数，则 $(f * g)(t)$ 即为系统在时刻 $t$ 的输出。

**离散卷积**

在数字信号处理和深度学习中，我们处理的是离散信号。对于一维离散序列 $f[n]$ 和 $g[n]$，其卷积定义为：

$$
(f * g)[n] = \sum_{m=-\infty}^{+\infty} f[m] \, g[n - m]
$$

**二维离散卷积**

对于图像等二维数据，二维离散卷积定义为：

$$
(F * G)[i, j] = \sum_{u} \sum_{v} F[u, v] \, G[i - u, j - v]
$$

在卷积神经网络的语境下，$F$ 通常称为输入特征图（input feature map），$G$ 称为卷积核（kernel）或滤波器（filter），卷积运算的输出称为输出特征图（output feature map）。

**多通道卷积**

实际应用中，输入往往具有多个通道（如RGB图像有3个通道）。设输入特征图 $\mathbf{X} \in \mathbb{R}^{C_{in} \times H \times W}$，卷积核 $\mathbf{K} \in \mathbb{R}^{C_{out} \times C_{in} \times k_h \times k_w}$，则第 $c_{out}$ 个输出通道的计算为：

$$
\mathbf{Y}[c_{out}, i, j] = \sum_{c=1}^{C_{in}} \sum_{u=0}^{k_h-1} \sum_{v=0}^{k_w-1} \mathbf{K}[c_{out}, c, u, v] \cdot \mathbf{X}[c, i+u, j+v] + b_{c_{out}}
$$

其中 $b_{c_{out}}$ 为偏置项。每个卷积核在所有输入通道上共享空间权重模式，但各通道的权重值独立。

### 1.2 互相关

严格来说，大多数深度学习框架中实现的"卷积"运算实际上是互相关（Cross-Correlation）运算，它省略了卷积定义中对核函数的翻转操作：

$$
(\text{Corr})(F, G)[i, j] = \sum_{u} \sum_{v} F[i + u, j + v] \, G[u, v]
$$

对比标准卷积，互相关中核函数 $G$ 不进行翻转（即 $G[u, v]$ 而非 $G[-u, -v]$）。在神经网络中，由于卷积核的权重是通过学习获得的，翻转与否不影响网络的表达能力——学习到的核本身就会自适应调整。因此，深度学习社区约定俗成地将互相关运算称为"卷积"，本章亦沿用这一惯例。

需要注意的是，互相关运算不满足结合律，即 $(F \star G) \star H \neq F \star (G \star H)$，这与严格数学意义上的卷积不同。然而，这一差异在实践中并不构成问题，因为神经网络的层级结构并不依赖于运算的结合律。

### 1.3 卷积的变种

为适应不同的应用需求，标准卷积运算衍生出若干重要变种。

**带步长的卷积（Strided Convolution）**

标准卷积中，滤波器每次移动一个像素位置（步长 $s = 1$）。引入步长 $s > 1$ 后，滤波器以更大间隔在输入上滑动，输出特征图的空间分辨率相应降低：

$$
\mathbf{Y}[i, j] = \sum_{u} \sum_{v} \mathbf{X}[si + u, sj + v] \cdot \mathbf{K}[u, v]
$$

输出特征图的空间尺寸为：

$$
H_{out} = \left\lfloor \frac{H_{in} - k_h + 2p}{s} \right\rfloor + 1, \quad W_{out} = \left\lfloor \frac{W_{in} - k_w + 2p}{s} \right\rfloor + 1
$$

其中 $p$ 为填充（padding）大小。步长卷积可以在特征提取的同时实现空间下采样，在某些架构中可替代池化层。

**零填充（Zero Padding）**

为控制输出特征图的空间尺寸，通常在输入的边界填充零值。常见的填充策略包括：

- **无填充（Valid Convolution）**：$p = 0$，输出尺寸缩小，边界信息逐层丢失
- **同尺寸填充（Same Convolution）**：$p = \lfloor k/2 \rfloor$（当 $s = 1$），输出与输入保持相同的空间尺寸
- **全填充（Full Convolution）**：$p = k - 1$，输出尺寸大于输入，确保每个输入元素对输出的每个位置都有贡献

**分组卷积（Grouped Convolution）**

分组卷积将输入通道和卷积核均分为 $G$ 组，每组独立执行卷积运算，最后沿通道维度拼接输出。设输入通道数为 $C_{in}$，输出通道数为 $C_{out}$，则每组的输入通道数为 $C_{in}/G$，输出通道数为 $C_{out}/G$。分组卷积的参数量为标准卷积的 $1/G$，最初由Krizhevsky等人（2012）在AlexNet中出于GPU显存限制而引入，后在ResNeXt（Xie et al., 2017）等架构中被证明具有正则化效果。当 $G = C_{in} = C_{out}$ 时，退化为深度可分离卷积（Depthwise Separable Convolution）的深度卷积部分。

### 1.4 卷积的数学性质

卷积运算具有若干重要的代数性质，这些性质在网络设计和分析中具有理论意义。

**交换律**：$f * g = g * f$。这意味着在严格的卷积定义下，对输入和核的角色可以互换。

**结合律**：$(f * g) * h = f * (g * h)$。这一性质意味着多层卷积在理论上可以合并为一层卷积，但由于中间层的非线性激活函数的存在，多层结构仍能提供远超单层的表达能力。

**分配律**：$f * (g + h) = f * g + f * h$。

**平移等变性（Translation Equivariance）**：设 $T_\tau$ 为平移算子，即 $T_\tau f(t) = f(t - \tau)$，则 $T_\tau(f * g) = (T_\tau f) * g = f * (T_\tau g)$。这一性质保证了卷积网络对输入的空间平移具有天然的等变性——当输入图像中的目标发生平移时，输出特征图也相应平移，而不改变特征响应的模式。平移等变性是CNN在视觉任务中成功的关键归纳偏置之一。

**频域表示**：根据卷积定理（Convolution Theorem），时域中的卷积等价于频域中的逐点乘积：

$$
\mathcal{F}\{f * g\} = \mathcal{F}\{f\} \cdot \mathcal{F}\{g\}
$$

其中 $\mathcal{F}$ 表示傅里叶变换。这一性质为基于快速傅里叶变换（FFT）加速大核卷积提供了理论基础。

## 2 卷积神经网络

### 2.1 用卷积来代替全连接

全连接层将输入向量的每个元素与输出向量的每个元素相连，参数量为 $O(n_{in} \cdot n_{out})$。对于高维输入（如 $224 \times 224 \times 3$ 的图像含有150,528个像素值），全连接层将产生巨量参数，不仅导致严重的过拟合风险，还带来了难以承受的计算和存储开销。

卷积层通过两个关键机制解决上述问题：

**局部连接（Local Connectivity）**：每个输出神经元仅与输入的一个局部区域（感受野）相连，而非全部输入。这一设计基于自然图像的局部性假设——相邻像素之间的统计相关性远强于远距离像素。对于核大小为 $k \times k$ 的卷积层，每个输出单元仅有 $k^2 \cdot C_{in}$ 个连接。

**权值共享（Weight Sharing）**：同一卷积核的权重在所有空间位置共享，即无论核应用于输入的哪个位置，其权重参数均相同。这一约束隐式地编码了平移不变性的先验知识，使得参数量与输入尺寸无关，仅取决于核大小和通道数。

以 $32 \times 32$ 的单通道图像为例，使用 $5 \times 5$ 卷积核生成1个输出特征图：全连接层需要 $32 \times 32 \times 28 \times 28 = 802,816$ 个参数（输出为 $28 \times 28$），而卷积层仅需 $5 \times 5 + 1 = 26$ 个参数（含偏置），参数量降低了约4个数量级。

### 2.2 卷积层

卷积层是CNN的核心构建模块，其功能是通过一组可学习的滤波器提取输入的局部特征。

**前向计算**

设第 $l$ 层的输入特征图为 $\mathbf{X}^{(l-1)} \in \mathbb{R}^{C_{in} \times H \times W}$，该层拥有 $C_{out}$ 个卷积核 $\{\mathbf{K}_c\}_{c=1}^{C_{out}}$，每个核的尺寸为 $C_{in} \times k_h \times k_w$。前向计算产生输出特征图 $\mathbf{Y}^{(l)} \in \mathbb{R}^{C_{out} \times H' \times W'}$：

$$
\mathbf{Y}^{(l)}[c, i, j] = f\left(\sum_{c'=1}^{C_{in}} \sum_{u=0}^{k_h-1} \sum_{v=0}^{k_w-1} \mathbf{K}_c[c', u, v] \cdot \mathbf{X}^{(l-1)}[c', si+u, sj+v] + b_c\right)
$$

其中 $f(\cdot)$ 为激活函数（通常为ReLU），$s$ 为步长。

**感受野**

感受野（Receptive Field）是指输出特征图中某个元素在原始输入上所能"看到"的区域大小。对于连续堆叠的卷积层，第 $l$ 层的感受野大小递推计算为：

$$
r_l = r_{l-1} + (k_l - 1) \cdot \prod_{i=1}^{l-1} s_i
$$

其中 $r_0 = 1$，$k_l$ 和 $s_l$ 分别为第 $l$ 层的核大小和步长。例如，3层 $3 \times 3$ 卷积（步长均为1）的感受野为 $7 \times 7$，等效于单层 $7 \times 7$ 卷积的感受野，但参数量仅为后者的 $3 \times 3^2 / 7^2 \approx 55\%$，且多出两层非线性变换。这一观察是VGGNet（Simonyan & Zisserman, 2015）采用小卷积核的理论依据。

**1×1卷积**

核大小为 $1 \times 1$ 的卷积层不改变空间尺寸，仅在通道维度上执行线性组合。其作用相当于对每个空间位置的通道向量施加一个共享的全连接层。$1 \times 1$ 卷积常用于通道数的升降维（如GoogLeNet中的维度压缩）和跨通道信息融合，参数量为 $C_{in} \times C_{out}$。

### 2.3 汇聚层

汇聚层（Pooling Layer），又称池化层或子采样层，对特征图的局部区域进行聚合统计，以实现空间下采样和特征压缩。汇聚操作不含可学习参数。

**最大汇聚（Max Pooling）**

在每个汇聚窗口内取最大值：

$$
\mathbf{Y}[c, i, j] = \max_{(u,v) \in \mathcal{R}_{ij}} \mathbf{X}[c, u, v]
$$

其中 $\mathcal{R}_{ij}$ 为以 $(i, j)$ 为中心的汇聚窗口。最大汇聚保留局部区域中最显著的特征响应，具有一定的平移不变性——当特征在窗口内发生小范围平移时，最大值可能保持不变。

**平均汇聚（Average Pooling）**

在每个汇聚窗口内取均值：

$$
\mathbf{Y}[c, i, j] = \frac{1}{|\mathcal{R}_{ij}|} \sum_{(u,v) \in \mathcal{R}_{ij}} \mathbf{X}[c, u, v]
$$

平均汇聚保留更多的背景信息，在网络末端常用全局平均汇聚（Global Average Pooling, GAP）将整个特征图压缩为单一值（Lin et al., 2014），以替代全连接层来降低参数量。

典型的汇聚窗口大小为 $2 \times 2$，步长为2，将特征图的空间分辨率减半。汇聚层通过引入局部平移不变性和降低后续层的计算量来提升网络的鲁棒性和效率。然而，近年来的研究表明，步长卷积（strided convolution）可以达到与池化相当甚至更优的效果（Springenberg et al., 2015），部分现代架构已逐步减少或取消池化层的使用。

### 2.4 卷积网络的整体结构

典型的卷积神经网络遵循"特征提取+分类决策"的层级结构：

$$
\text{输入} \to [\text{卷积} \to \text{激活} \to \text{汇聚}]^{\times N} \to \text{展平} \to [\text{全连接}]^{\times M} \to \text{输出}
$$

前半部分的卷积-激活-汇聚模块负责逐层提取从低级到高级的层次化特征表示：浅层卷积核学习检测边缘、纹理等局部基元（Zeiler & Fergus, 2014）；中间层组合低级特征形成更复杂的模式（如角点、轮廓）；深层特征则编码语义级别的高级概念（如物体部件、类别相关特征）。

后半部分的全连接层将高维特征映射到输出空间（如分类的类别概率向量）。在现代架构中，全连接层逐渐被全局平均汇聚所替代，以减少参数量并增强泛化能力。

典型的设计范式：随着网络深度增加，特征图的空间分辨率逐渐降低（通过步长卷积或池化），而通道数逐渐增加（更多的滤波器），这体现了从空间细节到语义抽象的信息转换过程。

## 3 参数学习

### 3.1 卷积神经网络的反向传播算法

卷积神经网络的参数学习同样基于反向传播算法，但由于卷积层的权值共享特性，梯度计算具有特殊的结构。

**卷积层的梯度计算**

设损失函数为 $\mathcal{L}$，第 $l$ 层卷积的输出为 $\mathbf{Z}^{(l)} = \mathbf{K}^{(l)} * \mathbf{X}^{(l-1)} + \mathbf{b}^{(l)}$（此处 $*$ 表示互相关运算）。已知从上层反向传播的误差信号 $\frac{\partial \mathcal{L}}{\partial \mathbf{Z}^{(l)}}$，需要计算关于核参数和输入的梯度。

**关于卷积核的梯度**：

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{K}^{(l)}[c_{out}, c_{in}, u, v]} = \sum_{i} \sum_{j} \frac{\partial \mathcal{L}}{\partial \mathbf{Z}^{(l)}[c_{out}, i, j]} \cdot \mathbf{X}^{(l-1)}[c_{in}, si+u, sj+v]
$$

这本质上是误差信号与输入特征图之间的互相关运算。由于权值共享，同一核参数在所有空间位置的梯度贡献需要求和。

**关于输入的梯度**（用于继续向前传播误差）：

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{X}^{(l-1)}} = \text{full-conv}\left(\frac{\partial \mathcal{L}}{\partial \mathbf{Z}^{(l)}}, \, \text{rot}_{180°}(\mathbf{K}^{(l)})\right)
$$

即对误差信号进行零填充后，与旋转180°的卷积核进行卷积。这一操作也被称为转置卷积或反卷积的推导基础。

**关于偏置的梯度**：

$$
\frac{\partial \mathcal{L}}{\partial b_{c_{out}}^{(l)}} = \sum_{i} \sum_{j} \frac{\partial \mathcal{L}}{\partial \mathbf{Z}^{(l)}[c_{out}, i, j]}
$$

**汇聚层的梯度传播**

汇聚层不含可学习参数，但需要将梯度正确传播到前一层。对于最大汇聚，梯度仅传递给汇聚窗口内的最大值位置（其余位置梯度为零）；对于平均汇聚，梯度均匀分配给窗口内所有位置。

## 4 几种典型的卷积神经网络

本节梳理卷积神经网络发展历程中几个里程碑式的架构，它们分别代表了不同阶段的设计理念和技术突破。

### 4.1 LeNet-5

LeNet-5（LeCun et al., 1998）是首个获得商业成功的卷积神经网络，被广泛用于手写数字识别（如银行支票识别系统）。其架构为：

$$
\text{Input}(32 \times 32) \to \text{C1}(6@28 \times 28) \to \text{S2}(6@14 \times 14) \to \text{C3}(16@10 \times 10) \to \text{S4}(16@5 \times 5) \to \text{C5}(120) \to \text{F6}(84) \to \text{Output}(10)
$$

LeNet-5的设计体现了CNN的经典范式：交替的卷积层和下采样层逐步缩小空间尺寸、增加通道数，最终通过全连接层进行分类。该网络共约60,000个参数，使用Sigmoid/Tanh激活函数（ReLU尚未流行），训练采用对角近似的二阶方法。

LeNet-5虽然结构简单，但它确立了CNN的基本设计原则，是后续所有深层CNN架构的思想源头。受限于当时的计算能力和数据规模，CNN在提出后的十余年间未能在大规模视觉任务上展示优势，直到2012年AlexNet的出现才重新点燃了深度学习的研究热潮。

### 4.2 AlexNet

AlexNet（Krizhevsky et al., 2012）在ImageNet大规模视觉识别挑战赛（ILSVRC-2012）上以压倒性优势夺冠（top-5错误率15.3%，远超第二名的26.2%），标志着深度学习时代的正式开启。

**架构设计**：8层网络（5个卷积层 + 3个全连接层），约6000万参数。输入为 $227 \times 227 \times 3$ 的RGB图像，第一个卷积层使用 $11 \times 11$ 的大核（步长为4），后续层逐步缩小核尺寸。

**关键技术创新**：

AlexNet首次在大规模CNN中使用ReLU激活函数替代Sigmoid/Tanh，显著加速了训练收敛（约6倍）。针对过拟合问题，AlexNet引入了Dropout正则化（在全连接层以概率0.5随机置零），并采用了数据增广策略（随机裁剪、水平翻转、颜色扰动等）。由于当时单块GPU（GTX 580, 3GB显存）无法容纳整个网络，AlexNet采用了双GPU并行训练方案，将网络分为两路，仅在特定层进行跨GPU通信，这也是分组卷积在深度学习中的首次应用。此外，AlexNet在卷积层之后引入了局部响应归一化（Local Response Normalization, LRN），通过通道间的竞争抑制来增强泛化能力，但后续研究表明LRN的效果有限，已被Batch Normalization取代。

### 4.3 Inception网络

Inception网络（GoogLeNet / Inception v1, Szegedy et al., 2015）在ILSVRC-2014上获得冠军，其核心创新在于Inception模块——一种多尺度特征融合的计算单元。

**Inception模块**的设计理念是：同一层特征图中，不同区域的最优感受野大小可能不同。因此，Inception模块在同一层并行执行多种尺度的卷积操作：

$$
\mathbf{Y} = \text{Concat}\left[\text{Conv}_{1 \times 1}(\mathbf{X}), \; \text{Conv}_{3 \times 3}(\mathbf{X}), \; \text{Conv}_{5 \times 5}(\mathbf{X}), \; \text{MaxPool}_{3 \times 3}(\mathbf{X})\right]
$$

为控制计算量，Inception在 $3 \times 3$ 和 $5 \times 5$ 卷积之前插入 $1 \times 1$ 卷积进行通道降维（"瓶颈"结构），将计算复杂度降低了约10倍。

GoogLeNet共22层（含9个Inception模块），约500万参数——仅为AlexNet的1/12，但精度更高。网络末端采用全局平均汇聚替代全连接层，大幅减少参数。为缓解深层网络的梯度消失问题，GoogLeNet在中间层引入了两个辅助分类器（auxiliary classifiers），在训练时提供额外的梯度监督。

后续的Inception v2/v3（Szegedy et al., 2016）引入了卷积分解（将 $5 \times 5$ 卷积分解为两个 $3 \times 3$，将 $n \times n$ 卷积分解为 $1 \times n$ 和 $n \times 1$）、Batch Normalization和标签平滑（Label Smoothing）等改进。Inception v4和Inception-ResNet进一步将Inception模块与残差连接结合。

### 4.4 残差网络

残差网络（Residual Network, ResNet, He et al., 2016）是深度学习发展史上最具影响力的架构创新之一，它通过残差连接（skip connection / shortcut connection）成功训练了超过100层甚至1000层的极深网络。

**退化问题（Degradation Problem）**：实验观察到，当网络深度增加到一定程度后，训练误差反而上升——这不是过拟合（过拟合表现为训练误差低但测试误差高），而是优化困难导致的退化。理论上，更深的网络至少不应比浅网络差，因为额外的层可以学习恒等映射。然而，传统网络难以学到恒等映射。

**残差学习**：ResNet的核心思想是让网络学习残差映射 $\mathcal{F}(\mathbf{x}) = \mathcal{H}(\mathbf{x}) - \mathbf{x}$ 而非直接学习目标映射 $\mathcal{H}(\mathbf{x})$：

$$
\mathbf{y} = \mathcal{F}(\mathbf{x}; \{W_i\}) + \mathbf{x}
$$

当最优映射接近恒等时，学习残差 $\mathcal{F} \to 0$ 比学习完整映射 $\mathcal{H} \to \mathbf{x}$ 更加容易。残差连接提供了一条梯度直通路径，使梯度可以不经过非线性变换直接回传到浅层，从根本上缓解了深层网络的梯度消失问题。

**残差块（Residual Block）**的基本结构为：

$$
\mathbf{y} = f\left(\mathbf{W}_2 \cdot f(\mathbf{W}_1 \mathbf{x} + \mathbf{b}_1) + \mathbf{b}_2 + \mathbf{x}\right)
$$

当输入输出维度不一致时，使用 $1 \times 1$ 卷积进行投影：$\mathbf{y} = \mathcal{F}(\mathbf{x}) + \mathbf{W}_s \mathbf{x}$。对于更深的网络（ResNet-50及以上），采用瓶颈结构（Bottleneck）：$1 \times 1$ 降维 → $3 \times 3$ 卷积 → $1 \times 1$ 升维，以降低计算量。

ResNet-152在ILSVRC-2015上以3.57%的top-5错误率首次超越人类水平（约5.1%），具有划时代意义。ResNet的思想影响深远，残差连接已成为现代深度网络（DenseNet、Transformer等）的标准组件。

## 5 其他卷积方式

### 5.1 转置卷积

转置卷积（Transposed Convolution），有时也被不太准确地称为"反卷积"（Deconvolution），是标准卷积的转置操作，用于实现特征图的空间上采样。

**动机**：在语义分割、图像生成、超分辨率等任务中，需要将低分辨率的特征图恢复到高分辨率。转置卷积提供了一种可学习的上采样方式。

**数学定义**：若标准卷积可以表示为矩阵乘法 $\mathbf{y} = \mathbf{C} \mathbf{x}$（其中 $\mathbf{C}$ 为由核权重构成的稀疏矩阵），则转置卷积定义为 $\mathbf{x}' = \mathbf{C}^\top \mathbf{y}$。注意 $\mathbf{C}^\top$ 并非 $\mathbf{C}$ 的逆矩阵，因此转置卷积并不是卷积的逆运算——它不能恢复卷积前的原始数据，而是执行与卷积具有相同连接模式但方向相反的变换。

**等效实现**：转置卷积可等效为在输入元素之间插入零值（zeros insertion），然后对扩展后的输入执行标准卷积。具体地，对于步长为 $s$ 的卷积，其转置等效于先在输入相邻元素间插入 $s-1$ 个零，再用旋转180°的卷积核执行步长为1的卷积。

**棋盘格伪影**：转置卷积的一个常见问题是产生棋盘格（checkerboard）伪影，这是由于当核大小不能被步长整除时，相邻输出位置接收的输入贡献不均匀所致。缓解方法包括：使核大小为步长的整数倍（如核大小4、步长2），或采用"先上采样再卷积"（resize-convolution）的替代方案（Odena et al., 2016）。

### 5.2 空洞卷积

空洞卷积（Dilated Convolution），也称膨胀卷积或带孔卷积（Atrous Convolution），通过在卷积核元素之间引入间隔（空洞/膨胀率 $d$）来扩大感受野而不增加参数量和计算量。

**定义**：空洞率为 $d$ 的二维空洞卷积定义为：

$$
\mathbf{Y}[i, j] = \sum_{u=0}^{k-1} \sum_{v=0}^{k-1} \mathbf{X}[i + d \cdot u, \, j + d \cdot v] \cdot \mathbf{K}[u, v]
$$

当 $d = 1$ 时退化为标准卷积。空洞率为 $d$ 的 $k \times k$ 卷积核的等效感受野大小为 $k + (k-1)(d-1)$。例如，空洞率为2的 $3 \times 3$ 核的等效感受野为 $5 \times 5$，空洞率为4时等效感受野为 $9 \times 9$。

**应用场景**：空洞卷积最初由Yu和Koltun（2016）在语义分割中提出，后被广泛应用于需要大感受野但不希望损失空间分辨率的场景。DeepLab系列（Chen et al., 2018）采用空洞空间金字塔汇聚（Atrous Spatial Pyramid Pooling, ASPP），并行使用多种空洞率的卷积来捕获多尺度上下文信息。WaveNet（van den Oord et al., 2016）在时序建模中采用指数递增的空洞率（$d = 1, 2, 4, 8, \ldots$），以对数级别的层数获得指数级别的感受野。

**网格效应（Gridding Effect）**：当空洞率较大时，卷积核仅采样输入的部分位置，导致相邻输出之间可能缺乏信息交互，产生网格状伪影。解决方案包括：使用混合空洞率（Hybrid Dilated Convolution, HDC），确保连续层的空洞率互质，使得采样位置能够覆盖整个输入区域。s