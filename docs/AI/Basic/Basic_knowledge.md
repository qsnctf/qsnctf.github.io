机器学习是一门研究如何使计算机系统通过经验自动改进性能的学科。其核心在于通过数据驱动的方式，学习从输入空间到输出空间的映射函数，而非依赖显式编程。

## 1 基本概念

### 训练集（Training Set）

**形式化定义：**

训练集是用于模型参数学习的数据集合，记为：

$$\mathcal{D}_{\text{train}} = \{(\mathbf{x}_1, y_1), (\mathbf{x}_2, y_2), \ldots, (\mathbf{x}_n, y_n)\}$$

其中：

- $\mathbf{x}_i \in \mathcal{X}$ 表示第 $i$ 个输入样本（特征向量）
- $y_i \in \mathcal{Y}$ 表示对应的输出标签
- $n$ 表示训练样本的数量
- $\mathcal{X}$ 是输入空间（通常为 $\mathbb{R}^d$，$d$ 为特征维度）
- $\mathcal{Y}$ 是输出空间（分类问题为离散集合，回归问题为 $\mathbb{R}$）

**统计学假设：**

在经典机器学习理论中，通常假设训练样本独立同分布地从某个未知的联合分布 $P(\mathbf{X}, Y)$ 中采样：

$$(\mathbf{x}_i, y_i) \stackrel{\text{i.i.d.}}{\sim} P(\mathbf{X}, Y)$$

这个假设意味着：

1. **独立性（Independence）**：每个样本的抽取不依赖于其他样本
2. **同分布（Identically Distributed）**：所有样本来自相同的概率分布

**样本复杂度理论：**

根据统计学习理论，训练集大小 $n$ 与泛化误差界之间存在以下关系：

$$\epsilon_{\text{generalization}} \leq \epsilon_{\text{train}} + O\left(\sqrt{\frac{d \log n}{n}}\right)$$

其中：

- $\epsilon_{\text{generalization}}$ 是泛化误差（在整个数据分布上的期望误差）
- $\epsilon_{\text{train}}$ 是训练误差（在训练集上的经验误差）
- $d$ 是模型的VC维或其他复杂度度量
- 第二项表示泛化误差界，随着 $n$ 增大而减小

这表明：训练样本数量越多，模型的泛化能力越好，但收益递减（按 $\sqrt{n}$ 增长）。

**训练集的质量要求：**

1. **充分性（Sufficiency）**：样本量应足以覆盖输入空间的重要区域
   - 对于高维问题，所需样本量随维度指数增长（维度灾难）
   - 经验法则：样本数 $n \geq 10d$（$d$ 为特征维度）

2. **代表性（Representativeness）**：训练分布 $P_{\text{train}}$ 应接近真实分布 $P_{\text{true}}$
   - 分布偏移会导致泛化性能下降
   - 可用Kullback-Leibler散度度量分布差异：$D_{KL}(P_{\text{true}} \| P_{\text{train}})$

3. **标注质量（Label Quality）**：标签噪声率 $\eta$ 应尽可能低
   - 标签噪声模型：$P(y|\mathbf{x}) = (1-\eta)P_{\text{true}}(y|\mathbf{x}) + \eta P_{\text{noise}}(y)$
   - 高噪声率会增加贝叶斯误差下界

### 测试集（Test Set）

**形式化定义：**

测试集是用于评估模型泛化性能的独立数据集：

$$\mathcal{D}_{\text{test}} = \{(\mathbf{x}'_1, y'_1), (\mathbf{x}'_2, y'_2), \ldots, (\mathbf{x}'_m, y'_m)\}$$

其中 $m$ 为测试样本数量。

**关键约束条件：**

$$\mathcal{D}_{\text{train}} \cap \mathcal{D}_{\text{test}} = \emptyset$$

即训练集与测试集必须完全不相交，这是确保泛化性能估计无偏的必要条件。

**泛化误差的估计：**

测试集上的经验误差是泛化误差的无偏估计：

$$\mathbb{E}[\hat{\epsilon}_{\text{test}}] = \epsilon_{\text{true}}$$

其中：

- $\hat{\epsilon}_{\text{test}} = \frac{1}{m}\sum_{i=1}^{m} \mathbb{I}[f(\mathbf{x}'_i) \neq y'_i]$ （分类问题）
- $\epsilon_{\text{true}} = \mathbb{E}_{(\mathbf{x}, y) \sim P}[\mathbb{I}[f(\mathbf{x}) \neq y]]$ （真实泛化误差）

**估计方差分析：**

测试误差估计的方差为：

$$\text{Var}[\hat{\epsilon}_{\text{test}}] = \frac{\epsilon_{\text{true}}(1-\epsilon_{\text{true}})}{m}$$

这表明：

- 测试集越大（$m$ 越大），估计越精确
- 当 $\epsilon_{\text{true}} \approx 0.5$ 时方差最大
- 通过 Hoeffding 不等式，可以得到置信区间

**置信区间（Confidence Interval）：**

以 $1-\delta$ 的概率，真实误差落在以下区间：

$$\epsilon_{\text{true}} \in \left[\hat{\epsilon}_{\text{test}} - \sqrt{\frac{\log(2/\delta)}{2m}}, \hat{\epsilon}_{\text{test}} + \sqrt{\frac{\log(2/\delta)}{2m}}\right]$$

例如，若测试集有1000个样本，$\delta=0.05$，则95%置信区间的半径约为 $\pm 3\%$。

### 验证集（Validation Set）

**形式化定义：**

验证集是从训练数据中划分出的子集，用于超参数调优和模型选择：

$$\mathcal{D}_{\text{val}} = \{(\mathbf{x}''_1, y''_1), (\mathbf{x}''_2, y''_2), \ldots, (\mathbf{x}''_k, y''_k)\}$$

**数据划分策略：**

典型的三分法（Hold-out）：

$$\mathcal{D}_{\text{all}} = \mathcal{D}_{\text{train}} \cup \mathcal{D}_{\text{val}} \cup \mathcal{D}_{\text{test}}$$

常见比例：

- 训练集：60%-80%
- 验证集：10%-20%
- 测试集：10%-20%

**K折交叉验证（K-Fold Cross Validation）：**

将数据集 $\mathcal{D}$ 分成 $K$ 个大小相近的互斥子集 $\mathcal{D}_1, \mathcal{D}_2, \ldots, \mathcal{D}_K$：

$$\mathcal{D} = \bigcup_{i=1}^{K} \mathcal{D}_i, \quad \mathcal{D}_i \cap \mathcal{D}_j = \emptyset \text{ for } i \neq j$$

第 $k$ 轮迭代：

- 训练集：$\mathcal{D}_{\text{train}}^{(k)} = \mathcal{D} \setminus \mathcal{D}_k$
- 验证集：$\mathcal{D}_{\text{val}}^{(k)} = \mathcal{D}_k$

最终验证误差为 $K$ 次验证误差的平均：

$$\epsilon_{\text{CV}} = \frac{1}{K}\sum_{k=1}^{K} \epsilon_{\text{val}}^{(k)}$$

**交叉验证误差的方差：**

$$\text{Var}[\epsilon_{\text{CV}}] \approx \frac{1}{K}\text{Var}[\epsilon_{\text{val}}]$$

这表明 $K$ 越大，估计越稳定，但计算成本也越高。常用 $K=5$ 或 $K=10$。

**留一交叉验证（Leave-One-Out Cross Validation, LOOCV）：**

$K=n$ 的特殊情况，每次只留一个样本作为验证集：

$$\epsilon_{\text{LOOCV}} = \frac{1}{n}\sum_{i=1}^{n} \mathcal{L}(f^{(-i)}(\mathbf{x}_i), y_i)$$

其中 $f^{(-i)}$ 表示在去除第 $i$ 个样本后训练的模型。

优点：几乎无偏估计
缺点：计算成本高（需要训练 $n$ 次）

### 特征（Features）

**形式化定义：**

特征是对原始数据的数学表示，定义了从原始输入空间到特征空间的映射：

$$\phi: \mathcal{X}_{\text{raw}} \rightarrow \mathcal{X} = \mathbb{R}^d$$

其中 $\phi$ 称为特征映射（feature map），$d$ 为特征维度。

**特征向量表示：**

对于样本 $i$，其特征向量为：

$$\mathbf{x}_i = [x_{i1}, x_{i2}, \ldots, x_{id}]^T \in \mathbb{R}^d$$

其中 $x_{ij}$ 表示第 $i$ 个样本的第 $j$ 个特征。

**特征类型的数学表示：**

1. **数值特征（Numerical Features）**

   连续特征：$x_j \in \mathbb{R}$

   离散特征：$x_j \in \mathbb{Z}$ 或 $x_j \in \{v_1, v_2, \ldots, v_m\}$

2. **类别特征（Categorical Features）**

   名义型：$x_j \in \{c_1, c_2, \ldots, c_k\}$（无序）

   有序型：$x_j \in \{c_1 \prec c_2 \prec \cdots \prec c_k\}$（有偏序关系）

**类别特征编码方法：**

**独热编码（One-Hot Encoding）：**

对于有 $k$ 个类别的特征，映射到 $k$ 维向量：

$$\phi_{\text{onehot}}(c_i) = [0, \ldots, 0, \underbrace{1}_{i\text{-th position}}, 0, \ldots, 0]^T \in \{0,1\}^k$$

例如：颜色特征 {红, 绿, 蓝}

$$\text{红} \rightarrow [1, 0, 0]^T, \quad \text{绿} \rightarrow [0, 1, 0]^T, \quad \text{蓝} \rightarrow [0, 0, 1]^T$$

**序数编码（Ordinal Encoding）：**

对于有序类别特征，映射到整数：

$$\phi_{\text{ordinal}}(c_i) = i \in \{1, 2, \ldots, k\}$$

例如：教育程度 {小学=1, 初中=2, 高中=3, 大学=4}

**特征的统计性质：**

1. **均值（Mean）：**

$$\mu_j = \frac{1}{n}\sum_{i=1}^{n} x_{ij}$$

2. **方差（Variance）：**

$$\sigma_j^2 = \frac{1}{n}\sum_{i=1}^{n} (x_{ij} - \mu_j)^2$$

3. **协方差（Covariance）：**

$$\text{Cov}(x_j, x_k) = \frac{1}{n}\sum_{i=1}^{n} (x_{ij} - \mu_j)(x_{ik} - \mu_k)$$

4. **相关系数（Correlation Coefficient）：**

$$\rho_{jk} = \frac{\text{Cov}(x_j, x_k)}{\sigma_j \sigma_k} \in [-1, 1]$$

其中 $\rho_{jk} = 1$ 表示完全正相关，$\rho_{jk} = -1$ 表示完全负相关，$\rho_{jk} = 0$ 表示线性无关。

**特征标准化（Feature Standardization）：**

**Z-score标准化：**

$$x'_{ij} = \frac{x_{ij} - \mu_j}{\sigma_j}$$

标准化后：$\mu'_j = 0$，$\sigma'_j = 1$

**Min-Max归一化：**

$$x'_{ij} = \frac{x_{ij} - \min_i x_{ij}}{\max_i x_{ij} - \min_i x_{ij}}$$

归一化后：$x'_{ij} \in [0, 1]$

### 标签（Labels）

**形式化定义：**

标签是监督学习中的目标输出，定义了从输出空间的取值：

$$y \in \mathcal{Y}$$

其中 $\mathcal{Y}$ 的类型取决于学习任务。

**二分类标签：**

$$y \in \{-1, +1\} \quad \text{或} \quad y \in \{0, 1\}$$

通常使用 $\{-1, +1\}$ 编码有利于某些算法（如SVM）的数学推导。

**多分类标签：**

$$y \in \{1, 2, \ldots, C\}$$

其中 $C$ 为类别总数。

**独热编码形式：**

$$\mathbf{y} = [y_1, y_2, \ldots, y_C]^T \in \{0, 1\}^C$$

其中 $y_c = 1$ 当且仅当样本属于第 $c$ 类，满足约束：

$$\sum_{c=1}^{C} y_c = 1$$

**回归标签：**

$$y \in \mathbb{R} \quad \text{或} \quad y \in \mathbb{R}^m$$

单输出回归：$y$ 是标量
多输出回归：$y$ 是 $m$ 维向量

**概率标签（Soft Labels）：**

在某些情况下，标签可以是概率分布：

$$\mathbf{y} = [p_1, p_2, \ldots, p_C]^T$$

其中 $p_c \in [0, 1]$ 且 $\sum_{c=1}^{C} p_c = 1$，表示样本属于各类别的概率。

这常用于：

- 标签平滑（Label Smoothing）
- 知识蒸馏（Knowledge Distillation）
- 多标注者的标签聚合

**标签噪声模型：**

在实际应用中，标签可能存在噪声。假设真实标签为 $y^*$，观测标签为 $y$，噪声转移矩阵为：

$$T_{ij} = P(y=j | y^*=i)$$

其中 $\sum_{j=1}^{C} T_{ij} = 1$。

对于对称噪声（所有类别噪声率相同）：

$$T = (1-\eta)I + \frac{\eta}{C}\mathbf{1}\mathbf{1}^T$$

其中 $\eta$ 为噪声率，$I$ 为单位矩阵，$\mathbf{1}$ 为全1向量。

---

## 2 机器学习的三个基本要素

机器学习系统由三个核心组件构成：模型（Model）、学习准则（Learning Criterion）和优化算法（Optimization Algorithm）。这三者共同决定了学习系统的表达能力、学习目标和求解效率。

### 2.1 模型（Model）

**定义：**

模型是从输入空间到输出空间的映射函数族，参数化为：

$$\mathcal{F} = \{f(\mathbf{x}; \boldsymbol{\theta}) | \boldsymbol{\theta} \in \Theta\}$$

其中：

- $f: \mathcal{X} \rightarrow \mathcal{Y}$ 是假设函数
- $\boldsymbol{\theta}$ 是模型参数向量
- $\Theta$ 是参数空间

学习的目标是从假设空间 $\mathcal{F}$ 中选择最优的函数 $f^*$。

**模型复杂度：**

模型复杂度度量了假设空间的表达能力，常用指标包括：

1. **参数数量：** $|\boldsymbol{\theta}|$
2. **VC维（Vapnik-Chervonenkis Dimension）**
3. **Rademacher复杂度**

#### 线性模型（Linear Models）

**数学形式：**

线性模型假设输出是输入特征的线性组合：

$$f(\mathbf{x}; \mathbf{w}, b) = \mathbf{w}^T\mathbf{x} + b = \sum_{j=1}^{d} w_j x_j + b$$

其中：

- $\mathbf{w} = [w_1, w_2, \ldots, w_d]^T \in \mathbb{R}^d$ 是权重向量
- $b \in \mathbb{R}$ 是偏置项（bias/intercept）
- $\mathbf{x} = [x_1, x_2, \ldots, x_d]^T \in \mathbb{R}^d$ 是特征向量

**向量化表示：**

引入增广特征向量 $\tilde{\mathbf{x}} = [1, \mathbf{x}^T]^T$ 和增广权重向量 $\tilde{\mathbf{w}} = [b, \mathbf{w}^T]^T$，则：

$$f(\mathbf{x}) = \tilde{\mathbf{w}}^T\tilde{\mathbf{x}}$$

**几何解释：**

在特征空间中，线性模型定义了一个超平面：

$$\mathbf{w}^T\mathbf{x} + b = 0$$

该超平面将空间分为两个半空间，法向量为 $\mathbf{w}$。

**决策边界：**

对于二分类问题，决策函数为：

$$h(\mathbf{x}) = \text{sign}(f(\mathbf{x})) = \text{sign}(\mathbf{w}^T\mathbf{x} + b)$$

**线性回归：**

$$f(\mathbf{x}) = \mathbf{w}^T\mathbf{x} + b, \quad f(\mathbf{x}) \in \mathbb{R}$$

**逻辑回归（Logistic Regression）：**

通过Sigmoid函数将线性输出映射到概率：

$$P(y=1|\mathbf{x}) = \sigma(\mathbf{w}^T\mathbf{x} + b) = \frac{1}{1 + e^{-(\mathbf{w}^T\mathbf{x} + b)}}$$

其中Sigmoid函数定义为：

$$\sigma(z) = \frac{1}{1 + e^{-z}}$$

**性质：**

- $\sigma(z) \in (0, 1)$
- $\sigma(-z) = 1 - \sigma(z)$
- $\sigma'(z) = \sigma(z)(1-\sigma(z))$

**Softmax回归（多分类）：**

对于 $C$ 类分类问题，使用 $C$ 个线性函数：

$$z_c = \mathbf{w}_c^T\mathbf{x} + b_c, \quad c = 1, 2, \ldots, C$$

通过Softmax函数转换为概率分布：

$$P(y=c|\mathbf{x}) = \frac{e^{z_c}}{\sum_{c'=1}^{C} e^{z_{c'}}} = \frac{e^{\mathbf{w}_c^T\mathbf{x} + b_c}}{\sum_{c'=1}^{C} e^{\mathbf{w}_{c'}^T\mathbf{x} + b_{c'}}}$$

**性质：**

- $\sum_{c=1}^{C} P(y=c|\mathbf{x}) = 1$
- $P(y=c|\mathbf{x}) \in (0, 1)$
- Softmax在二分类时退化为Sigmoid

**线性模型的优缺点：**

优点：

1. 计算复杂度低：$O(d)$
2. 可解释性强：权重 $w_j$ 直接反映特征 $x_j$ 的重要性
3. 训练稳定，不易过拟合（相对于非线性模型）
4. 在高维稀疏数据上表现良好

缺点：

1. 表达能力有限，只能建模线性关系
2. 对特征工程依赖强
3. 无法自动学习特征交互

**扩展到非线性：**

通过特征变换 $\phi(\mathbf{x})$ 可以建模非线性关系：

$$f(\mathbf{x}) = \mathbf{w}^T\phi(\mathbf{x}) + b$$

例如，多项式特征：

$$\phi(\mathbf{x}) = [x_1, x_2, x_1^2, x_2^2, x_1x_2, \ldots]^T$$

#### 决策树（Decision Trees）

**定义：**

决策树是一种树状结构的分类或回归模型，通过递归地划分特征空间来进行预测。

**数学表示：**

决策树可以表示为分段常数函数：

$$f(\mathbf{x}) = \sum_{m=1}^{M} c_m \mathbb{I}[\mathbf{x} \in R_m]$$

其中：

- $M$ 是叶节点数量
- $R_m$ 是第 $m$ 个区域（叶节点对应的特征空间划分）
- $c_m$ 是第 $m$ 个区域的预测值
- $\mathbb{I}[\cdot]$ 是指示函数
- $\bigcup_{m=1}^{M} R_m = \mathcal{X}$，且 $R_i \cap R_j = \emptyset$ for $i \neq j$

**节点分裂准则：**

在节点 $t$ 选择特征 $j$ 和阈值 $s$ 进行分裂，目标是最大化信息增益或最小化不纯度。

**分类树的不纯度度量：**

1. **基尼指数（Gini Index）：**

$$\text{Gini}(t) = \sum_{c=1}^{C} p_c(t)(1 - p_c(t)) = 1 - \sum_{c=1}^{C} p_c^2(t)$$

其中 $p_c(t)$ 是节点 $t$ 中类别 $c$ 的比例。

2. **熵（Entropy）：**

$$\text{Entropy}(t) = -\sum_{c=1}^{C} p_c(t) \log_2 p_c(t)$$

3. **误分类率（Misclassification Rate）：**

$$\text{Error}(t) = 1 - \max_c p_c(t)$$

**信息增益：**

选择分裂 $(j, s)$ 使得信息增益最大：

$$\text{IG}(j, s) = \text{Impurity}(t) - \frac{|t_L|}{|t|}\text{Impurity}(t_L) - \frac{|t_R|}{|t|}\text{Impurity}(t_R)$$

其中：

- $t_L = \{(\mathbf{x}_i, y_i) | x_{ij} \leq s\}$ 是左子节点
- $t_R = \{(\mathbf{x}_i, y_i) | x_{ij} > s\}$ 是右子节点
- $|t|$ 表示节点 $t$ 的样本数

**回归树的分裂准则：**

最小化平方误差：

$$\text{MSE}(t) = \frac{1}{|t|}\sum_{i \in t}(y_i - \bar{y}_t)^2$$

其中 $\bar{y}_t = \frac{1}{|t|}\sum_{i \in t} y_i$ 是节点 $t$ 的平均值。

选择分裂最小化加权MSE：

$$\text{Cost}(j, s) = \frac{|t_L|}{|t|}\text{MSE}(t_L) + \frac{|t_R|}{|t|}\text{MSE}(t_R)$$

**决策树的优缺点：**

优点：

1. 易于理解和解释
2. 可以处理数值和类别特征
3. 不需要特征标准化
4. 可以捕捉非线性关系和特征交互
5. 可以处理缺失值

缺点：

1. 容易过拟合（需要剪枝或限制深度）
2. 不稳定，数据微小变化可能导致树结构大变
3. 预测函数不光滑（分段常数）
4. 难以捕捉线性关系（需要多次分裂）
5. 对于不平衡数据偏向多数类

**集成方法：**

为克服单棵树的缺点，常用集成方法：

1. **Bagging（随机森林）：**

$$f(\mathbf{x}) = \frac{1}{B}\sum_{b=1}^{B} f_b(\mathbf{x})$$

其中 $f_b$ 是第 $b$ 棵树，通过自助采样（Bootstrap）训练。

2. **Boosting（梯度提升树）：**

$$f(\mathbf{x}) = \sum_{b=1}^{B} \alpha_b f_b(\mathbf{x})$$

其中树是顺序训练的，每棵树关注前面树的错误。

#### 神经网络（Neural Networks）

**定义：**

神经网络是由多层神经元组成的非线性模型，通过组合简单的非线性函数来逼近复杂函数。

**多层感知机（MLP）数学形式：**

考虑 $L$ 层神经网络：

$$\mathbf{h}^{(0)} = \mathbf{x}$$

$\mathbf{z}^{(l)} = \mathbf{W}^{(l)}\mathbf{h}^{(l-1)} + \mathbf{b}^{(l)}$

$\mathbf{h}^{(l)} = \sigma^{(l)}(\mathbf{z}^{(l)})$

$f(\mathbf{x}) = \mathbf{h}^{(L)}$

其中：

- $l = 1, 2, \ldots, L$ 表示层索引
- $\mathbf{h}^{(l)} \in \mathbb{R}^{n_l}$ 是第 $l$ 层的激活值（隐藏层表示）
- $\mathbf{W}^{(l)} \in \mathbb{R}^{n_l \times n_{l-1}}$ 是第 $l$ 层的权重矩阵
- $\mathbf{b}^{(l)} \in \mathbb{R}^{n_l}$ 是第 $l$ 层的偏置向量
- $\sigma^{(l)}(\cdot)$ 是第 $l$ 层的激活函数（逐元素应用）
- $n_l$ 是第 $l$ 层的神经元数量

**单个神经元的计算：**

第 $l$ 层的第 $i$ 个神经元：

$h_i^{(l)} = \sigma\left(\sum_{j=1}^{n_{l-1}} w_{ij}^{(l)} h_j^{(l-1)} + b_i^{(l)}\right)$

**常用激活函数：**

1. **Sigmoid函数：**

$\sigma(z) = \frac{1}{1 + e^{-z}}$

导数：

$\sigma'(z) = \sigma(z)(1 - \sigma(z))$

特点：

- 输出范围 $(0, 1)$
- 饱和区域梯度接近0（梯度消失问题）
- 输出不以0为中心

2. **双曲正切函数（Tanh）：**

$\tanh(z) = \frac{e^z - e^{-z}}{e^z + e^{-z}} = 2\sigma(2z) - 1$

导数：

$\tanh'(z) = 1 - \tanh^2(z)$

特点：

- 输出范围 $(-1, 1)$
- 输出以0为中心
- 仍存在梯度消失问题

3. **ReLU（Rectified Linear Unit）：**

$\text{ReLU}(z) = \max(0, z) = \begin{cases} z & \text{if } z > 0 \\ 0 & \text{if } z \leq 0 \end{cases}$

导数：

$\text{ReLU}'(z) = \begin{cases} 1 & \text{if } z > 0 \\ 0 & \text{if } z \leq 0 \end{cases}$

特点：

- 计算简单高效
- 缓解梯度消失
- 可能出现"神经元死亡"（输出恒为0）

4. **Leaky ReLU：**

$\text{LeakyReLU}(z) = \begin{cases} z & \text{if } z > 0 \\ \alpha z & \text{if } z \leq 0 \end{cases}$

其中 $\alpha$ 是小的正数（通常0.01），避免神经元死亡。

5. **ELU（Exponential Linear Unit）：**

$\text{ELU}(z) = \begin{cases} z & \text{if } z > 0 \\ \alpha(e^z - 1) & \text{if } z \leq 0 \end{cases}$

6. **GELU（Gaussian Error Linear Unit）：**

$\text{GELU}(z) = z \cdot \Phi(z) = z \cdot P(Z \leq z), \quad Z \sim \mathcal{N}(0, 1)$

近似形式：

$\text{GELU}(z) \approx 0.5z\left(1 + \tanh\left[\sqrt{\frac{2}{\pi}}\left(z + 0.044715z^3\right)\right]\right)$

**通用逼近定理（Universal Approximation Theorem）：**

对于单隐层神经网络，若隐藏层有足够多的神经元，且使用非线性激活函数，则可以以任意精度逼近任何连续函数。

形式化表述：对于任意连续函数 $f: \mathbb{R}^d \rightarrow \mathbb{R}$ 和任意 $\epsilon > 0$，存在单隐层网络：

$\hat{f}(\mathbf{x}) = \sum_{i=1}^{n} v_i \sigma(\mathbf{w}_i^T\mathbf{x} + b_i)$

使得：

$\sup_{\mathbf{x} \in K} |f(\mathbf{x}) - \hat{f}(\mathbf{x})| < \epsilon$

其中 $K$ 是紧集。

**深度神经网络的优势：**

虽然单隐层网络理论上可以逼近任意函数，但深度网络可以用更少的参数更高效地表示某些函数：

$\text{参数数量（深度网络）} \ll \text{参数数量（单隐层网络）}$

这与函数的组合性质有关，深度网络通过层次化表示可以指数级地减少所需参数。

**神经网络的表达能力：**

$L$ 层网络的总参数数量：

$|\boldsymbol{\theta}| = \sum_{l=1}^{L} (n_l \times n_{l-1} + n_l) = \sum_{l=1}^{L} n_l(n_{l-1} + 1)$

**神经网络的优缺点：**

优点：

1. 强大的非线性建模能力
2. 端到端学习，自动学习特征
3. 通用逼近能力
4. 在大规模数据上表现优异
5. 可以处理多种类型的数据（图像、文本、语音等）

缺点：

1. 训练复杂度高，需要大量计算资源
2. 需要大量标注数据
3. 容易过拟合（尤其在小数据集上）
4. 可解释性差（黑盒模型）
5. 超参数调优困难
6. 对初始化和优化算法敏感

#### 支持向量机（Support Vector Machine, SVM）

**线性SVM：**

对于线性可分的二分类问题，SVM寻找最大间隔超平面。

**间隔最大化问题：**

给定超平面 $\mathbf{w}^T\mathbf{x} + b = 0$，样本 $(\mathbf{x}_i, y_i)$ 到超平面的函数间隔为：

$\gamma_i = y_i(\mathbf{w}^T\mathbf{x}_i + b)$

几何间隔为：

$\tilde{\gamma}_i = \frac{y_i(\mathbf{w}^T\mathbf{x}_i + b)}{\|\mathbf{w}\|} = \frac{\gamma_i}{\|\mathbf{w}\|}$

**原始优化问题：**

最大化最小几何间隔：

$\max_{\mathbf{w}, b} \frac{1}{\|\mathbf{w}\|} \min_i y_i(\mathbf{w}^T\mathbf{x}_i + b)$

$\text{s.t. } y_i(\mathbf{w}^T\mathbf{x}_i + b) \geq 1, \quad i = 1, 2, \ldots, n$

等价于：

$\min_{\mathbf{w}, b} \frac{1}{2}\|\mathbf{w}\|^2$

$\text{s.t. } y_i(\mathbf{w}^T\mathbf{x}_i + b) \geq 1, \quad i = 1, 2, \ldots, n$

这是一个凸二次规划问题。

**软间隔SVM（处理非线性可分情况）：**

引入松弛变量 $\xi_i \geq 0$：

$\min_{\mathbf{w}, b, \boldsymbol{\xi}} \frac{1}{2}\|\mathbf{w}\|^2 + C\sum_{i=1}^{n} \xi_i$

$\text{s.t. } y_i(\mathbf{w}^T\mathbf{x}_i + b) \geq 1 - \xi_i, \quad \xi_i \geq 0, \quad i = 1, 2, \ldots, n$

其中 $C > 0$ 是惩罚参数，控制间隔最大化和误分类惩罚之间的权衡。

**对偶形式：**

通过拉格朗日对偶性，原问题等价于：

$\max_{\boldsymbol{\alpha}} \sum_{i=1}^{n} \alpha_i - \frac{1}{2}\sum_{i=1}^{n}\sum_{j=1}^{n} \alpha_i\alpha_j y_i y_j \mathbf{x}_i^T\mathbf{x}_j$

$\text{s.t. } \sum_{i=1}^{n} \alpha_i y_i = 0, \quad 0 \leq \alpha_i \leq C, \quad i = 1, 2, \ldots, n$

其中 $\alpha_i$ 是拉格朗日乘子。

**KKT条件：**

最优解满足：

$\alpha_i[y_i(\mathbf{w}^T\mathbf{x}_i + b) - 1 + \xi_i] = 0$

$\xi_i(\alpha_i - C) = 0$

**支持向量：**

满足 $\alpha_i > 0$ 的样本称为支持向量，它们位于间隔边界上或被错分。

决策函数可以表示为支持向量的线性组合：

$f(\mathbf{x}) = \sum_{i \in SV} \alpha_i y_i \mathbf{x}_i^T\mathbf{x} + b$

其中 $SV$ 是支持向量的索引集合。

**核技巧（Kernel Trick）：**

对于非线性问题，通过核函数隐式地将数据映射到高维空间：

$K(\mathbf{x}_i, \mathbf{x}_j) = \phi(\mathbf{x}_i)^T\phi(\mathbf{x}_j)$

对偶问题变为：

$\max_{\boldsymbol{\alpha}} \sum_{i=1}^{n} \alpha_i - \frac{1}{2}\sum_{i=1}^{n}\sum_{j=1}^{n} \alpha_i\alpha_j y_i y_j K(\mathbf{x}_i, \mathbf{x}_j)$

**常用核函数：**

1. **线性核：**

$K(\mathbf{x}_i, \mathbf{x}_j) = \mathbf{x}_i^T\mathbf{x}_j$

2. **多项式核：**

$K(\mathbf{x}_i, \mathbf{x}_j) = (\mathbf{x}_i^T\mathbf{x}_j + c)^d$

其中 $d$ 是多项式次数，$c \geq 0$ 是常数。

3. **径向基函数核（RBF/Gaussian核）：**

$K(\mathbf{x}_i, \mathbf{x}_j) = \exp\left(-\frac{\|\mathbf{x}_i - \mathbf{x}_j\|^2}{2\sigma^2}\right) = \exp(-\gamma\|\mathbf{x}_i - \mathbf{x}_j\|^2)$

其中 $\sigma$ 是带宽参数，$\gamma = \frac{1}{2\sigma^2}$。

4. **Sigmoid核：**

$K(\mathbf{x}_i, \mathbf{x}_j) = \tanh(\alpha\mathbf{x}_i^T\mathbf{x}_j + c)$

**核函数的性质：**

有效的核函数必须满足Mercer定理：核矩阵 $\mathbf{K}$ 必须是半正定的：

$\mathbf{K} = [K(\mathbf{x}_i, \mathbf{x}_j)]_{n \times n} \succeq 0$

即对于任意 $\mathbf{c} \in \mathbb{R}^n$：

$\mathbf{c}^T\mathbf{K}\mathbf{c} = \sum_{i=1}^{n}\sum_{j=1}^{n} c_i c_j K(\mathbf{x}_i, \mathbf{x}_j) \geq 0$

**SVM的优缺点：**

优点：

1. 在高维空间中有效
2. 泛化能力强（最大化间隔）
3. 核技巧可以处理非线性问题
4. 对于小到中等规模数据集效果好
5. 理论基础坚实

缺点：

1. 对大规模数据训练慢（$O(n^2)$ 到 $O(n^3)$）
2. 对核函数和参数选择敏感
3. 多分类需要特殊处理
4. 难以处理缺失值
5. 模型解释性较差

### 2.2 学习准则（Learning Criterion）

**定义：**

学习准则定义了模型优化的目标，通常通过损失函数（Loss Function）或代价函数（Cost Function）来量化。

**经验风险最小化（Empirical Risk Minimization, ERM）：**

给定训练集 $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^{n}$，经验风险定义为：

$R_{\text{emp}}(f) = \frac{1}{n}\sum_{i=1}^{n} \mathcal{L}(f(\mathbf{x}_i), y_i)$

其中 $\mathcal{L}(\hat{y}, y)$ 是损失函数，度量预测值 $\hat{y}$ 与真实值 $y$ 之间的差异。

学习目标是找到最小化经验风险的函数：

$f^* = \arg\min_{f \in \mathcal{F}} R_{\text{emp}}(f)$

**期望风险（Expected Risk）：**

真正关心的是在整个数据分布上的期望风险：

$R(f) = \mathbb{E}_{(\mathbf{x}, y) \sim P}[\mathcal{L}(f(\mathbf{x}), y)] = \int \mathcal{L}(f(\mathbf{x}), y) dP(\mathbf{x}, y)$

由于真实分布 $P$ 未知，只能通过经验风险来近似。

**泛化误差界：**

根据统计学习理论，经验风险与期望风险之间的差距可以界定：

$R(f) \leq R_{\text{emp}}(f) + \sqrt{\frac{\text{Complexity}(\mathcal{F}) + \log(1/\delta)}{2n}}$

以至少 $1-\delta$ 的概率成立。

#### 损失函数（Loss Functions）

**回归问题的损失函数：**

1. **均方误差（Mean Squared Error, MSE）：**

$\mathcal{L}_{\text{MSE}}(\hat{y}, y) = (\hat{y} - y)^2$

经验风险：

$R_{\text{emp}} = \frac{1}{n}\sum_{i=1}^{n} (\hat{y}_i - y_i)^2 = \frac{1}{n}\sum_{i=1}^{n} (f(\mathbf{x}_i) - y_i)^2$

性质：

- 可微，便于优化
- 对异常值敏感（由于平方项）
- 最优预测是条件期望：$f^*(\mathbf{x}) = \mathbb{E}[Y|\mathbf{x}]$

推导最优预测：

$\min_{\hat{y}} \mathbb{E}[(Y - \hat{y})^2|\mathbf{x}] = \min_{\hat{y}} \mathbb{E}[Y^2|\mathbf{x}] - 2\hat{y}\mathbb{E}[Y|\mathbf{x}] + \hat{y}^2$

对 $\hat{y}$ 求导并令其为0：

$-2\mathbb{E}[Y|\mathbf{x}] + 2\hat{y} = 0 \Rightarrow \hat{y}^* = \mathbb{E}[Y|\mathbf{x}]$

2. **平均绝对误差（Mean Absolute Error, MAE）：**

$\mathcal{L}_{\text{MAE}}(\hat{y}, y) = |\hat{y} - y|$

经验风险：

$R_{\text{emp}} = \frac{1}{n}\sum_{i=1}^{n} |\hat{y}_i - y_i|$

性质：

- 对异常值更鲁棒
- 在0点不可微（需要特殊处理）
- 最优预测是条件中位数：$f^*(\mathbf{x}) = \text{Median}(Y|\mathbf{x})$

3. **Huber损失：**

结合MSE和MAE的优点：

$\mathcal{L}_{\text{Huber}}(\hat{y}, y) = \begin{cases} \frac{1}{2}(\hat{y} - y)^2 & \text{if } |\hat{y} - y| \leq \delta \\ \delta|\hat{y} - y| - \frac{1}{2}\delta^2 & \text{if } |\hat{y} - y| > \delta \end{cases}$

其中 $\delta$ 是阈值参数。

性质：

- 在 $|\hat{y} - y| \leq \delta$ 时类似MSE（平滑、可微）
- 在 $|\hat{y} - y| > \delta$ 时类似MAE（对异常值鲁棒）

4. **分位数损失（Quantile Loss）：**

用于预测条件分位数：

$\mathcal{L}_{\tau}(\hat{y}, y) = \begin{cases} \tau(\hat{y} - y) & \text{if } y \leq \hat{y} \\ (1-\tau)(y - \hat{y}) & \text{if } y > \hat{y} \end{cases}$

其中 $\tau \in (0, 1)$ 是分位数水平。当 $\tau = 0.5$ 时退化为MAE。

**分类问题的损失函数：**

1. **0-1损失（Zero-One Loss）：**

$\mathcal{L}_{0-1}(\hat{y}, y) = \mathbb{I}[\hat{y} \neq y] = \begin{cases} 0 & \text{if } \hat{y} = y \\ 1 & \text{if } \hat{y} \neq y \end{cases}$

性质：

- 直接对应分类错误率
- 非凸、不连续，难以优化
- 通常用作评估指标而非训练目标

2. **交叉熵损失（Cross-Entropy Loss）：**

**二分类交叉熵：**

对于二分类问题，$y \in \{0, 1\}$，模型输出概率 $\hat{y} = P(y=1|\mathbf{x}) \in (0, 1)$：

$\mathcal{L}_{\text{CE}}(\hat{y}, y) = -[y\log\hat{y} + (1-y)\log(1-\hat{y})]$

也可以写成：

$\mathcal{L}_{\text{CE}}(\hat{y}, y) = -\log P(y|\mathbf{x})$

对于 $y \in \{-1, +1\}$ 的编码，使用logistic损失：

$\mathcal{L}_{\text{logistic}}(z, y) = \log(1 + e^{-yz})$

其中 $z = f(\mathbf{x})$ 是未经Sigmoid的输出。

**多分类交叉熵：**

对于 $C$ 类分类问题，真实标签 $\mathbf{y} = [y_1, y_2, \ldots, y_C]^T$ 是独热向量，预测概率 $\hat{\mathbf{y}} = [\hat{y}_1, \hat{y}_2, \ldots, \hat{y}_C]^T$：

$\mathcal{L}_{\text{CE}}(\hat{\mathbf{y}}, \mathbf{y}) = -\sum_{c=1}^{C} y_c \log \hat{y}_c$

由于 $\mathbf{y}$ 是独热向量，只有一项非零：

$\mathcal{L}_{\text{CE}}(\hat{\mathbf{y}}, \mathbf{y}) = -\log \hat{y}_{c^*}$

其中 $c^*$ 是真实类别。

**信息论解释：**

交叉熵度量两个概率分布之间的差异。给定真实分布 $P$ 和模型分布 $Q$：

$H(P, Q) = -\sum_{c} P(c) \log Q(c)$

在分类中，$P$ 是真实标签的分布（独热），$Q$ 是模型预测的分布。

**与KL散度的关系：**

$D_{KL}(P \| Q) = H(P, Q) - H(P)$

由于 $H(P) = 0$（独热分布的熵为0），最小化交叉熵等价于最小化KL散度。

3. **Hinge损失（用于SVM）：**

$\mathcal{L}_{\text{Hinge}}(z, y) = \max(0, 1 - yz)$

其中 $z = f(\mathbf{x})$ 是未经符号函数的输出，$y \in \{-1, +1\}$。

性质：

- 当 $yz \geq 1$ 时损失为0（正确分类且在间隔外）
- 当 $yz < 1$ 时线性增长
- 鼓励函数间隔至少为1
- 凸函数但不可微（在 $yz = 1$ 处）

