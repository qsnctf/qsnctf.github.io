循环神经网络（Recurrent Neural Network, RNN）是一类专门用于处理序列数据的神经网络架构。与前馈神经网络不同，RNN在其隐藏层中引入了自反馈连接（recurrent connection），使网络具备了对历史信息的记忆能力。这一特性使得RNN天然适用于自然语言处理、语音识别、时间序列预测、音乐生成等涉及时序依赖关系的任务。从动力系统（dynamical system）的视角来看，RNN可以被视为一类离散时间非线性动力系统，其隐藏状态的演化轨迹编码了输入序列的历史信息。

## 1 给网络增加记忆能力

前馈神经网络的一个根本局限在于：它假设输入样本之间彼此独立，无法显式建模数据中的时序依赖关系。然而，现实世界中的大量数据本质上是序列化的——语言中词语的含义依赖于上下文，股票价格受历史走势影响，语音信号的当前帧与前后帧紧密关联。为使网络具备处理此类数据的能力，需要引入记忆机制。

### 1.1 延时神经网络

延时神经网络（Time-Delay Neural Network, TDNN）由Waibel等人（1989）提出，是最早将时间结构引入前馈网络的尝试之一。其核心思想是在输入层或隐藏层中引入延时单元（delay units），将当前时刻及过去若干时刻的输入信号同时作为网络的输入：

$$
\mathbf{x}_t^{(\text{aug})} = [\mathbf{x}_t, \mathbf{x}_{t-1}, \mathbf{x}_{t-2}, \ldots, \mathbf{x}_{t-K}]
$$

其中 $K$ 为延时窗口大小。网络在此增广输入上执行标准的前馈计算。TDNN本质上是在时间维度上的一维卷积操作——同一组权重在不同时间位置上共享，使得网络能够检测与时间位置无关的局部时序模式。

TDNN的主要局限在于其记忆容量受限于固定的延时窗口 $K$。对于需要捕捉超出窗口范围的长程依赖关系，TDNN无能为力。此外，随着 $K$ 的增大，输入维度线性增长，参数量和计算开销也随之增加。

### 1.2 有外部输入的非线性自回归模型

有外部输入的非线性自回归模型（Nonlinear Autoregressive with Exogenous Inputs, NARX）是经典自回归模型的非线性推广：

$$
y_t = f\left(y_{t-1}, y_{t-2}, \ldots, y_{t-p}, \; \mathbf{x}_t, \mathbf{x}_{t-1}, \ldots, \mathbf{x}_{t-q}\right)
$$

其中 $f(\cdot)$ 为非线性映射函数（可用神经网络参数化），$p$ 和 $q$ 分别为输出反馈和外部输入的延迟阶数。NARX模型将过去 $p$ 个时刻的输出值反馈作为当前输入的一部分，从而构建了一种显式的自回归记忆机制。

NARX网络可以展开为一个深层前馈网络进行训练。Lin等人（1996）的理论分析表明，NARX网络在学习长程依赖方面优于标准RNN，因为输出反馈通路提供了更短的梯度传播路径。然而，NARX同样受限于固定的延迟阶数，且输出反馈可能导致训练不稳定。

### 1.3 循环神经网络

循环神经网络通过在隐藏层引入自反馈连接，提供了一种更优雅和通用的记忆机制。在每个时间步 $t$，RNN根据当前输入 $\mathbf{x}_t$ 和前一时刻的隐藏状态 $\mathbf{h}_{t-1}$ 来更新隐藏状态：

$$
\mathbf{h}_t = f(\mathbf{W}_h \mathbf{h}_{t-1} + \mathbf{W}_x \mathbf{x}_t + \mathbf{b})
$$

其中 $\mathbf{W}_h \in \mathbb{R}^{d_h \times d_h}$ 为隐藏状态到隐藏状态的循环权重矩阵，$\mathbf{W}_x \in \mathbb{R}^{d_h \times d_x}$ 为输入到隐藏状态的权重矩阵，$\mathbf{b}$ 为偏置向量，$f(\cdot)$ 为激活函数（通常为Tanh或ReLU）。

与TDNN和NARX的固定窗口不同，RNN的隐藏状态 $\mathbf{h}_t$ 理论上可以编码从初始时刻到当前时刻的全部历史信息，因此具有不定长的动态记忆能力。这种通过状态递推实现的隐式记忆机制，是RNN相比其他序列建模方法的核心优势。

## 2 简单循环网络

简单循环网络（Simple Recurrent Network, SRN），也称Elman网络（Elman, 1990），是最基本的RNN架构。其完整的前向计算过程为：

$$
\mathbf{z}_t = \mathbf{W}_h \mathbf{h}_{t-1} + \mathbf{W}_x \mathbf{x}_t + \mathbf{b}_h
$$

$$
\mathbf{h}_t = f(\mathbf{z}_t)
$$

$$
\hat{\mathbf{y}}_t = g(\mathbf{W}_o \mathbf{h}_t + \mathbf{b}_o)
$$

其中 $g(\cdot)$ 为输出层激活函数（分类任务通常为Softmax，回归任务为恒等映射）。网络在所有时间步共享参数 $\{\mathbf{W}_h, \mathbf{W}_x, \mathbf{W}_o, \mathbf{b}_h, \mathbf{b}_o\}$，这种权值共享不仅大幅减少了参数量，还使网络能够泛化到训练中未见过的序列长度。

### 2.1 循环神经网络的计算能力

循环神经网络的计算能力与其动力学性质密切相关，这方面的理论研究揭示了RNN强大的形式化计算能力。

**图灵完备性**：Siegelmann和Sontag（1995）证明了一个关键理论结果——具有Sigmoid激活函数和有理数权重的有限大小RNN是图灵完备的（Turing complete），即它可以模拟任意图灵机的计算。这意味着RNN在理论上可以执行任何可计算的算法，其计算能力不亚于通用计算机。

这一结论的直观理解是：RNN的隐藏状态可以充当图灵机的"纸带"（存储信息），循环连接实现了"读写头"的功能（根据当前状态和输入更新存储内容），而网络的非线性变换则对应图灵机的"状态转移函数"。

**与有限状态自动机的关系**：对于离散输入和离散隐藏状态的RNN，其行为等价于有限状态自动机（Finite State Automaton, FSA）。特别是，具有硬阈值激活函数的RNN可以精确实现任意有限状态自动机。Giles等人（1992）的实验表明，RNN可以从正负样本中学习正则语言（regular language）对应的有限状态自动机。

**实际计算能力的局限**：尽管理论上具有强大的计算能力，实际中RNN的计算能力受到有限精度浮点运算、有限训练时间以及梯度消失/爆炸等优化困难的严重制约。特别是，标准RNN在学习长程依赖时的困难（详见6.5节）意味着其实际可利用的记忆容量远小于理论上限。

## 3 应用到机器学习

RNN的灵活性使其能够适应多种不同的输入-输出模式。根据输入和输出序列的长度关系，可以将RNN的典型应用模式分为以下几类。

### 3.1 序列到类别模式

序列到类别（Sequence-to-Class）模式处理输入为变长序列、输出为单一类别标签的任务，如文本分类、情感分析和语音指令识别。

网络逐时间步处理输入序列 $\mathbf{x}_1, \mathbf{x}_2, \ldots, \mathbf{x}_T$，生成隐藏状态序列 $\mathbf{h}_1, \mathbf{h}_2, \ldots, \mathbf{h}_T$，然后将序列信息聚合为固定长度的向量进行分类。常见的聚合策略包括：

**末状态法**：直接使用最后一个时间步的隐藏状态 $\mathbf{h}_T$ 作为整个序列的表示：

$$
\hat{y} = g(\mathbf{W}_o \mathbf{h}_T + \mathbf{b}_o)
$$

这种方法简单直接，但可能导致序列前端信息的丢失，尤其是当序列较长时。

**均值汇聚法**：对所有时间步的隐藏状态取平均：

$$
\bar{\mathbf{h}} = \frac{1}{T} \sum_{t=1}^{T} \mathbf{h}_t, \quad \hat{y} = g(\mathbf{W}_o \bar{\mathbf{h}} + \mathbf{b}_o)
$$

均值汇聚赋予每个时间步相同的权重，可能不是最优选择。更先进的方法是引入注意力机制（Attention Mechanism），自适应地为不同时间步分配不同权重（详见后续章节）。

### 3.2 同步的序列到序列模式

同步的序列到序列（Synchronous Sequence-to-Sequence）模式要求输入和输出序列具有相同的长度，且在每个时间步都产生一个输出。典型应用包括词性标注（POS tagging）、命名实体识别（NER）和逐帧的视频标注。

在此模式下，网络在每个时间步 $t$ 同时产生输出：

$$
\hat{\mathbf{y}}_t = g(\mathbf{W}_o \mathbf{h}_t + \mathbf{b}_o), \quad t = 1, 2, \ldots, T
$$

训练时，总损失为所有时间步损失之和（或平均）：

$$
\mathcal{L} = \sum_{t=1}^{T} \mathcal{L}_t(\hat{\mathbf{y}}_t, \mathbf{y}_t)
$$

条件随机场（CRF）可以叠加在RNN输出之上以建模标签之间的转移依赖关系（如BiLSTM-CRF模型），这在序列标注任务中往往能够带来显著的性能提升。

### 3.3 异步的序列到序列模式

异步的序列到序列（Asynchronous Sequence-to-Sequence）模式处理输入和输出长度不同的任务，如机器翻译、文本摘要和对话生成。这一模式通常采用编码器-解码器（Encoder-Decoder）框架（Cho et al., 2014; Sutskever et al., 2014）：

**编码器**（Encoder）逐步读入输入序列 $\mathbf{x}_1, \ldots, \mathbf{x}_{T_x}$，将整个序列压缩为一个固定维度的上下文向量 $\mathbf{c}$（通常取编码器最后一个隐藏状态 $\mathbf{h}_{T_x}^{\text{enc}}$）：

$$
\mathbf{h}_t^{\text{enc}} = f(\mathbf{W}_h^{\text{enc}} \mathbf{h}_{t-1}^{\text{enc}} + \mathbf{W}_x^{\text{enc}} \mathbf{x}_t + \mathbf{b}^{\text{enc}})
$$

$$
\mathbf{c} = \mathbf{h}_{T_x}^{\text{enc}}
$$

**解码器**（Decoder）以上下文向量 $\mathbf{c}$ 为初始条件，自回归地生成输出序列 $\hat{\mathbf{y}}_1, \ldots, \hat{\mathbf{y}}_{T_y}$：

$$
\mathbf{h}_t^{\text{dec}} = f(\mathbf{W}_h^{\text{dec}} \mathbf{h}_{t-1}^{\text{dec}} + \mathbf{W}_y^{\text{dec}} \hat{\mathbf{y}}_{t-1} + \mathbf{b}^{\text{dec}})
$$

$$
\hat{\mathbf{y}}_t = g(\mathbf{W}_o \mathbf{h}_t^{\text{dec}} + \mathbf{b}_o)
$$

其中 $\mathbf{h}_0^{\text{dec}} = \mathbf{c}$。训练时使用教师强制（Teacher Forcing），即将真实标签 $\mathbf{y}_{t-1}$ 而非模型预测 $\hat{\mathbf{y}}_{t-1}$ 作为解码器的输入，以加速收敛和稳定训练。推理时则使用自回归解码——将模型自身的预测作为下一步输入。

编码器-解码器框架的一个根本瓶颈在于信息瓶颈——无论输入序列多长，所有信息都必须被压缩到固定维度的上下文向量 $\mathbf{c}$ 中。注意力机制（Bahdanau et al., 2015）通过允许解码器在每个生成步动态地关注编码器不同位置的信息来解决这一问题。

## 4 参数学习

RNN的参数学习比前馈网络更为复杂，因为参数在时间步之间共享，梯度需要沿时间维度反向传播。

### 4.1 随时间反向传播算法

随时间反向传播算法（Backpropagation Through Time, BPTT）是训练RNN的标准方法。其基本思想是将RNN沿时间轴展开为一个等效的深层前馈网络，然后对展开后的网络应用标准的反向传播算法。

对于展开 $T$ 个时间步的RNN，总损失为 $\mathcal{L} = \sum_{t=1}^{T} \mathcal{L}_t$。关于循环权重 $\mathbf{W}_h$ 的梯度需要对所有时间步的贡献求和：

$$
\frac{\partial \mathcal{L}}{\partial \mathbf{W}_h} = \sum_{t=1}^{T} \frac{\partial \mathcal{L}_t}{\partial \mathbf{W}_h}
$$

每个时间步的梯度贡献涉及从时刻 $t$ 回溯到初始时刻的链式求导：

$$
\frac{\partial \mathcal{L}_t}{\partial \mathbf{W}_h} = \sum_{k=1}^{t} \frac{\partial \mathcal{L}_t}{\partial \mathbf{h}_t} \left(\prod_{j=k+1}^{t} \frac{\partial \mathbf{h}_j}{\partial \mathbf{h}_{j-1}}\right) \frac{\partial \mathbf{h}_k}{\partial \mathbf{W}_h}
$$

其中 $\frac{\partial \mathbf{h}_j}{\partial \mathbf{h}_{j-1}} = \text{diag}(f'(\mathbf{z}_j)) \cdot \mathbf{W}_h$ 为雅可比矩阵。这一连乘结构是导致梯度消失/爆炸的根本原因（详见6.5节）。

**截断BPTT**（Truncated BPTT）是BPTT的实用近似：将长序列分割为固定长度 $\tau$ 的片段，每个片段独立执行反向传播，仅保留隐藏状态的前向传递。这种方法牺牲了对超出 $\tau$ 步的长程依赖的建模能力，但显著降低了内存消耗和计算复杂度，使得RNN能够处理极长序列。

### 4.2 实时循环学习算法

实时循环学习算法（Real-Time Recurrent Learning, RTRL）（Williams & Zipser, 1989）是BPTT的一种在线替代方案。与BPTT的反向时间传播不同，RTRL沿前向方向实时地计算梯度。

RTRL维护一个"灵敏度矩阵"（sensitivity matrix）$\frac{\partial \mathbf{h}_t}{\partial \boldsymbol{\theta}}$，在每个时间步递推更新：

$$
\frac{\partial \mathbf{h}_t}{\partial \boldsymbol{\theta}} = f'(\mathbf{z}_t) \left(\mathbf{W}_h \frac{\partial \mathbf{h}_{t-1}}{\partial \boldsymbol{\theta}} + \frac{\partial \mathbf{z}_t}{\partial \boldsymbol{\theta}}\right)
$$

RTRL的优势在于：无需存储完整的前向计算历史，可在在线（逐样本）模式下即时更新参数，适用于无法批量处理的实时应用场景。

然而，RTRL的计算复杂度为 $O(d_h^4)$（其中 $d_h$ 为隐藏层维度），远高于BPTT的 $O(d_h^2 \cdot T)$。对于隐藏层维度较大的网络，这一开销是难以接受的。因此，在实践中BPTT仍是主流选择，而RTRL主要具有理论意义或用于极小规模的网络。近年来，一些工作尝试通过低秩近似和随机投影来降低RTRL的计算复杂度（Tallec & Ollivier, 2018），但尚未成为实用的训练方法。

## 5 长程依赖问题

长程依赖问题（Long-Range Dependency Problem）是标准RNN面临的核心挑战。当序列中相关信息之间的间隔（时间跨度）较大时，RNN难以有效地传递和利用这些远距离的依赖关系。

从BPTT的梯度公式可以看出，时间步 $t$ 的损失对 $k$ 步之前状态的梯度依赖于雅可比矩阵的连乘：

$$
\prod_{j=k+1}^{t} \frac{\partial \mathbf{h}_j}{\partial \mathbf{h}_{j-1}} = \prod_{j=k+1}^{t} \text{diag}(f'(\mathbf{z}_j)) \cdot \mathbf{W}_h
$$

设 $\mathbf{W}_h$ 的特征值分解为 $\mathbf{W}_h = \mathbf{Q} \mathbf{\Lambda} \mathbf{Q}^{-1}$，则上述连乘的行为主要由 $\mathbf{\Lambda}$ 的幂次决定：

- 当 $\|\mathbf{W}_h\|$ 的谱半径 $\rho < 1$ 时，$\left\|\prod_{j} \frac{\partial \mathbf{h}_j}{\partial \mathbf{h}_{j-1}}\right\| \to 0$（指数衰减），导致**梯度消失**——远距离的梯度信号无法有效传递到浅层，网络丧失学习长程依赖的能力。
- 当谱半径 $\rho > 1$ 时，梯度将指数增长，导致**梯度爆炸**——参数更新变得极不稳定，训练发散。

Bengio等人（1994）对这一问题给出了严格的理论分析，证明了标准RNN中长程依赖的学习难度随时间间隔呈指数增长。

### 5.1 改进方案

针对长程依赖问题，研究者从不同角度提出了多种改进方案：

**梯度裁剪（Gradient Clipping）**（Pascanu et al., 2013）：当梯度范数超过预设阈值 $\theta$ 时，对梯度进行缩放：

$$
\mathbf{g} \leftarrow \frac{\theta}{\|\mathbf{g}\|} \mathbf{g}, \quad \text{if } \|\mathbf{g}\| > \theta
$$

梯度裁剪有效防止了梯度爆炸，但无法解决梯度消失问题。该技术已成为训练RNN的标准实践。

**权重正则化**：通过约束 $\mathbf{W}_h$ 的谱范数（spectral norm）使其接近1，可以缓解梯度消失和爆炸。正交初始化（Saxe et al., 2014）将 $\mathbf{W}_h$ 初始化为正交矩阵（所有特征值的模为1），使得梯度在初始阶段既不衰减也不爆炸。正交RNN（Arjovsky et al., 2016）进一步约束 $\mathbf{W}_h$ 在整个训练过程中保持酉矩阵。

**改进激活函数**：使用ReLU替代Tanh可以在正区间避免梯度饱和（$f'(z) = 1$），但可能导致隐藏状态数值不稳定。Le等人（2015）提出的IRNN（Identity RNN）结合ReLU激活与单位矩阵初始化，在一些长序列任务上取得了不错的效果。

**门控机制**：这是最成功的改进方向，通过引入可学习的门控单元来动态控制信息的流入、保留和遗忘，从根本上改变了梯度的传播路径。LSTM和GRU（详见6.6节）是门控机制的两个经典实例。

## 6 基于门控的循环神经网络

门控机制（Gating Mechanism）是解决RNN长程依赖问题最有效的方法。其核心思想是：引入由Sigmoid函数控制的门控信号（取值在 $(0, 1)$ 之间），通过逐元素乘法动态地调节信息流。当门值接近1时，信息畅通传递；当门值接近0时，信息被阻断。

### 6.1 长短期记忆网络

长短期记忆网络（Long Short-Term Memory, LSTM）由Hochreiter和Schmidhuber（1997）提出，是深度学习历史上最重要的架构创新之一。LSTM在标准RNN的基础上引入了记忆单元（memory cell）$\mathbf{c}_t$ 和三个门控机制——遗忘门、输入门和输出门——来精细地控制信息的长期存储与访问。

**遗忘门（Forget Gate）**决定记忆单元中哪些信息应被丢弃：

$$
\mathbf{f}_t = \sigma(\mathbf{W}_f [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_f)
$$

**输入门（Input Gate）**决定哪些新信息应被写入记忆单元：

$$
\mathbf{i}_t = \sigma(\mathbf{W}_i [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_i)
$$

**候选记忆（Candidate Memory）**：

$$
\tilde{\mathbf{c}}_t = \tanh(\mathbf{W}_c [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_c)
$$

**记忆单元更新**：

$$
\mathbf{c}_t = \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t
$$

**输出门（Output Gate）**决定记忆单元中哪些信息应被输出为隐藏状态：

$$
\mathbf{o}_t = \sigma(\mathbf{W}_o [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_o)
$$

$$
\mathbf{h}_t = \mathbf{o}_t \odot \tanh(\mathbf{c}_t)
$$

其中 $\sigma(\cdot)$ 为Logistic函数，$\odot$ 为逐元素乘积，$[\cdot, \cdot]$ 表示向量拼接。

**LSTM解决长程依赖的关键机制**：记忆单元 $\mathbf{c}_t$ 的更新规则 $\mathbf{c}_t = \mathbf{f}_t \odot \mathbf{c}_{t-1} + \mathbf{i}_t \odot \tilde{\mathbf{c}}_t$ 是一个线性自更新方程。当遗忘门 $\mathbf{f}_t \approx 1$ 且输入门 $\mathbf{i}_t \approx 0$ 时，$\mathbf{c}_t \approx \mathbf{c}_{t-1}$，信息可以不经任何非线性变换地在时间维度上长距离传递。相应地，梯度沿记忆单元反向传播时可以近似保持不衰减：

$$
\frac{\partial \mathbf{c}_t}{\partial \mathbf{c}_{t-1}} = \mathbf{f}_t
$$

当遗忘门接近1时，梯度乘子接近1，有效地缓解了梯度消失问题。这与ResNet中的残差连接具有异曲同工之妙——都是通过线性直通路径来维持梯度流。

### 6.2 LSTM网络的各种变体

自LSTM提出以来，研究者探索了大量变体以改进其性能或降低复杂度。

**窥视孔连接（Peephole Connections）**（Gers & Schmidhuber, 2000）：允许门控信号直接访问记忆单元状态 $\mathbf{c}_{t-1}$：

$$
\mathbf{f}_t = \sigma(\mathbf{W}_f [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{w}_{cf} \odot \mathbf{c}_{t-1} + \mathbf{b}_f)
$$

其中 $\mathbf{w}_{cf}$ 为窥视孔权重向量。窥视孔连接使得门控决策能够直接基于记忆单元中存储的信息，在需要精确计时的任务中可能有所帮助。

**耦合遗忘门和输入门**：将遗忘门和输入门耦合为互补关系 $\mathbf{i}_t = 1 - \mathbf{f}_t$，减少一个门的参数，同时保证记忆单元的新旧信息之间形成直接的权衡关系。

**无遗忘门LSTM**：Hochreiter和Schmidhuber（1997）的原始LSTM不包含遗忘门（等价于 $\mathbf{f}_t = 1$），记忆单元只增不减。Gers等人（2000）后来引入遗忘门以允许网络主动清除过时信息，极大地增强了LSTM的实用性。

Greff等人（2017）对LSTM的八种常见变体进行了大规模的系统性比较实验，得出结论：标准LSTM在大多数任务上表现稳健，各种变体之间的性能差异不显著；遗忘门和输出门是最关键的组件；窥视孔连接和耦合门的改进效果有限。

### 6.3 门控循环单元网络

门控循环单元（Gated Recurrent Unit, GRU）由Cho等人（2014）提出，是LSTM的一种简化变体。GRU将遗忘门和输入门合并为单一的更新门（update gate），同时取消了独立的记忆单元，直接使用隐藏状态存储信息。

**重置门（Reset Gate）**控制前一时刻隐藏状态对候选激活值的影响程度：

$$
\mathbf{r}_t = \sigma(\mathbf{W}_r [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_r)
$$

**更新门（Update Gate）**控制前一时刻信息的保留比例：

$$
\mathbf{z}_t = \sigma(\mathbf{W}_z [\mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_z)
$$

**候选隐藏状态**：

$$
\tilde{\mathbf{h}}_t = \tanh(\mathbf{W}_h [\mathbf{r}_t \odot \mathbf{h}_{t-1}, \mathbf{x}_t] + \mathbf{b}_h)
$$

**隐藏状态更新**：
$$
\mathbf{h}_t = \mathbf{z}_t \odot \mathbf{h}_{t-1} + (1 - \mathbf{z}_t) \odot \tilde{\mathbf{h}}_t
$$

GRU的更新门 $\mathbf{z}_t$ 同时扮演了LSTM中遗忘门和输入门的角色，且两者之间形成互补约束（$\mathbf{z}_t$ 和 $1 - \mathbf{z}_t$），确保了新旧信息之间的直接权衡。

**LSTM vs GRU**：GRU的参数量约为LSTM的75%（2个门 vs 3个门，无独立记忆单元），在训练速度和计算效率上具有优势。Chung等人（2014）的实验表明，GRU在多数任务上的表现与LSTM相当，在某些小规模数据集上甚至更优（得益于更少的参数带来的正则化效果）。然而，对于需要精细控制信息读写的复杂任务（如长文本生成、程序合成），LSTM的额外容量可能提供优势。选择LSTM还是GRU更多是一个经验性问题，通常需要根据具体任务通过实验确定。

## 7 深层循环神经网络

单层RNN的表达能力可能不足以建模复杂的序列变换。正如前馈网络通过增加深度来提升函数逼近能力一样，深层循环神经网络通过在多个维度上增加深度来增强序列建模能力。

### 7.1 堆叠循环神经网络

堆叠循环神经网络（Stacked RNN），也称多层RNN或深层RNN，将多个RNN层垂直堆叠，上一层的隐藏状态序列作为下一层的输入序列：

$$
\mathbf{h}_t^{(l)} = f\left(\mathbf{W}_h^{(l)} \mathbf{h}_{t-1}^{(l)} + \mathbf{W}_x^{(l)} \mathbf{h}_t^{(l-1)} + \mathbf{b}^{(l)}\right)
$$

其中 $\mathbf{h}_t^{(0)} = \mathbf{x}_t$，$l = 1, 2, \ldots, L$ 表示层索引。

堆叠RNN的直觉是：不同层可以学习不同抽象层次的时序特征。浅层可能捕捉局部的词法或声学模式，而深层则编码更抽象的语义或长程依赖关系。Hermans和Schrauwen（2013）的研究表明，深层RNN在语音识别和语言建模任务上显著优于同等参数量的单层RNN。

在实践中，堆叠LSTM通常使用2-4层。Google的神经机器翻译系统（Wu et al., 2016）采用了8层LSTM编码器和8层LSTM解码器。随着层数增加，残差连接和层归一化（Layer Normalization）变得至关重要，以确保梯度的有效传播和训练的稳定性。

### 7.2 双向循环神经网络

双向循环神经网络（Bidirectional RNN, BiRNN）（Schuster & Paliwal, 1997）同时从两个方向处理序列——前向RNN从左到右、后向RNN从右到左——从而在每个时间步同时利用过去和未来的上下文信息：

**前向隐藏状态**：

$$
\overrightarrow{\mathbf{h}}_t = f(\mathbf{W}_{\overrightarrow{h}} \overrightarrow{\mathbf{h}}_{t-1} + \mathbf{W}_{\overrightarrow{x}} \mathbf{x}_t + \mathbf{b}_{\overrightarrow{h}})
$$

**后向隐藏状态**：

$$
\overleftarrow{\mathbf{h}}_t = f(\mathbf{W}_{\overleftarrow{h}} \overleftarrow{\mathbf{h}}_{t+1} + \mathbf{W}_{\overleftarrow{x}} \mathbf{x}_t + \mathbf{b}_{\overleftarrow{h}})
$$

**组合表示**：

$$
\mathbf{h}_t = [\overrightarrow{\mathbf{h}}_t ; \overleftarrow{\mathbf{h}}_t]
$$

其中 $[;]$ 表示拼接操作。前向和后向RNN各自拥有独立的参数集。

BiRNN特别适用于可以获取完整输入序列的任务。在自然语言处理中，词义通常依赖于左右两侧的上下文（如"bank"的含义取决于其在句中的语境），BiRNN可以同时捕捉这两个方向的依赖关系。BiLSTM在命名实体识别、情感分析、机器阅读理解等任务中已成为标准组件。ELMo（Peters et al., 2018）通过大规模预训练的深层BiLSTM学习上下文相关的词向量，标志着预训练语言模型时代的开端。

需要注意的是，BiRNN不适用于需要实时逐步生成的任务（如自回归语言模型、实时语音合成），因为后向方向需要访问未来的输入。

## 8 扩展到图结构

标准RNN处理的是线性链式序列结构。当数据具有更复杂的树状或图状拓扑时，需要将RNN的计算范式推广到更一般的结构上。

### 8.1 递归神经网络

递归神经网络（Recursive Neural Network, RecNN）将RNN从线性序列推广到树结构上（注意区分recursive与recurrent）。给定一棵树（如自然语言的句法分析树），RecNN按照自底向上的顺序递归地组合子节点的表示以得到父节点的表示：

$$
\mathbf{h}_p = f\left(\mathbf{W} [\mathbf{h}_{c_1} ; \mathbf{h}_{c_2}] + \mathbf{b}\right)
$$

其中 $\mathbf{h}_{c_1}$ 和 $\mathbf{h}_{c_2}$ 分别为左右子节点的表示，$\mathbf{h}_p$ 为父节点的表示。叶节点的表示通常通过词嵌入获得。根节点的最终表示 $\mathbf{h}_{\text{root}}$ 编码了整棵树（如整个句子）的语义信息。

Socher等人（2013）提出的递归神经张量网络（Recursive Neural Tensor Network, RNTN）进一步引入了张量交互项以捕捉更丰富的组合语义：

$$
\mathbf{h}_p = f\left(\mathbf{h}_{c_1}^\top \mathbf{T}^{[1:d]} \mathbf{h}_{c_2} + \mathbf{W} [\mathbf{h}_{c_1} ; \mathbf{h}_{c_2}] + \mathbf{b}\right)
$$

其中 $\mathbf{T}^{[1:d]}$ 为三阶交互张量。

Tree-LSTM（Tai et al., 2015）将LSTM的门控机制推广到树结构上，为每个子节点引入独立的遗忘门，使得网络可以选择性地保留或遗忘不同子树传递的信息。Tree-LSTM在语义相似度判定和情感分析任务中展示了优于线性LSTM的性能。

递归神经网络的主要局限在于需要预先给定输入数据的树结构（如依赖于外部的句法分析器），且树结构的质量直接影响模型性能。此外，树结构的不规则性给批量并行计算带来了挑战。

### 8.2 图神经网络

当数据结构从树进一步推广到任意有向或无向图时，需要图神经网络（Graph Neural Network, GNN）来处理。在RNN的框架下，图上的信息传播可以通过迭代消息传递来实现。

Gated Graph Neural Network（GG-NN）（Li et al., 2016）将GRU的门控机制扩展到图结构上。对于图中的每个节点 $v$，其隐藏状态通过聚合邻居信息来更新：

$$
\mathbf{m}_v^{(t)} = \sum_{u \in \mathcal{N}(v)} \mathbf{W}_e \mathbf{h}_u^{(t-1)}
$$

$$
\mathbf{h}_v^{(t)} = \text{GRU}\left(\mathbf{h}_v^{(t-1)}, \mathbf{m}_v^{(t)}\right)
$$

其中 $\mathcal{N}(v)$ 是节点 $v$ 的邻居集合，$\mathbf{W}_e$ 为边权重矩阵（可根据边类型区分）。经过 $T$ 步消息传递后，节点的隐藏状态融合了其 $T$-跳邻域内的结构信息。

图级别的任务（如图分类）需要将所有节点的表示聚合为图的全局表示。常用的读出（readout）操作包括：

$$
\mathbf{h}_G = \text{Readout}\left(\{\mathbf{h}_v^{(T)} \mid v \in \mathcal{V}\}\right)
$$

其中 Readout 可以是求和、均值、注意力加权汇聚或层次化聚合。

GNN在分子性质预测（Gilmer et al., 2017）、程序分析（Allamanis et al., 2018）、组合优化（Khalil et al., 2017）和知识图谱推理（Schlichtkrull et al., 2018）等领域展示了强大的能力。随着Transformer等注意力机制在序列建模中取代RNN，基于注意力的图网络（如Graph Attention Network, GAT）也逐渐成为主流，但基于RNN的图网络在需要捕捉多步推理路径的任务中仍具有独特优势。

