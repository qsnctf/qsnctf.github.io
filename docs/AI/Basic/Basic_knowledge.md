机器学习是一门研究如何使计算机系统通过经验自动改进性能的学科。其核心在于通过数据驱动的方式，学习从输入空间到输出空间的映射函数，而非依赖显式编程。

## 1 基本概念

### 1.1 训练集（Training Set）

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

### 1.2 测试集（Test Set）

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

### 1.3 验证集（Validation Set）

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

### 1.4 特征（Features）

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

### 1.5 标签（Labels）

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

**平方Hinge损失：**

$\mathcal{L}_{\text{SqHinge}}(z, y) = \max(0, 1 - yz)^2$

在 $yz = 1$ 处可微。

4. **指数损失（用于AdaBoost）：**

$\mathcal{L}_{\text{exp}}(z, y) = e^{-yz}$

性质：

- 可微、凸
- 对误分类样本惩罚呈指数增长
- 对异常值非常敏感

**损失函数的比较：**

对于二分类问题 $y \in \{-1, +1\}$，各损失函数关于 $yz$ 的图像：

- 0-1损失：阶跃函数，$yz < 0$ 时为1
- Logistic损失：$\log(1 + e^{-yz})$，光滑
- Hinge损失：$\max(0, 1-yz)$，分段线性
- 指数损失：$e^{-yz}$，指数增长

所有凸损失都是0-1损失的上界（凸松弛）。

#### 正则化（Regularization）

为防止过拟合，在损失函数中加入正则化项：

$J(\boldsymbol{\theta}) = R_{\text{emp}}(\boldsymbol{\theta}) + \lambda \Omega(\boldsymbol{\theta})$

其中：

- $R_{\text{emp}}$ 是经验风险（数据拟合项）
- $\Omega(\boldsymbol{\theta})$ 是正则化项（复杂度惩罚）
- $\lambda > 0$ 是正则化系数，控制两项的权衡

**常用正则化方法：**

1. **L2正则化（Ridge/权重衰减）：**

$\Omega(\boldsymbol{\theta}) = \frac{1}{2}\|\boldsymbol{\theta}\|_2^2 = \frac{1}{2}\sum_{j=1}^{d} \theta_j^2$

优化目标：

$\min_{\boldsymbol{\theta}} \frac{1}{n}\sum_{i=1}^{n} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}), y_i) + \frac{\lambda}{2}\|\boldsymbol{\theta}\|_2^2$

效果：

- 参数值趋向于较小但非零
- 解是稠密的（所有参数都非零）
- 对应贝叶斯观点下参数的高斯先验：$\boldsymbol{\theta} \sim \mathcal{N}(\mathbf{0}, \frac{1}{\lambda}\mathbf{I})$

梯度：

$\nabla_{\boldsymbol{\theta}} J = \nabla_{\boldsymbol{\theta}} R_{\text{emp}} + \lambda\boldsymbol{\theta}$

2. **L1正则化（Lasso）：**

$\Omega(\boldsymbol{\theta}) = \|\boldsymbol{\theta}\|_1 = \sum_{j=1}^{d} |\theta_j|$

优化目标：

$\min_{\boldsymbol{\theta}} \frac{1}{n}\sum_{i=1}^{n} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}), y_i) + \lambda\|\boldsymbol{\theta}\|_1$

效果：

- 产生稀疏解（许多参数恰好为0）
- 可用于特征选择
- 对应拉普拉斯先验：$\boldsymbol{\theta} \sim \text{Laplace}(0, \frac{1}{\lambda})$

次梯度：

$\partial_{\boldsymbol{\theta}} J \in \partial_{\boldsymbol{\theta}} R_{\text{emp}} + \lambda \cdot \text{sign}(\boldsymbol{\theta})$

其中 $\text{sign}(\theta_j) \in \{-1, +1\}$ 当 $\theta_j \neq 0$，$\text{sign}(0) \in [-1, +1]$。

3. **弹性网络（Elastic Net）：**

结合L1和L2正则化：

$\Omega(\boldsymbol{\theta}) = \alpha\|\boldsymbol{\theta}\|_1 + \frac{1-\alpha}{2}\|\boldsymbol{\theta}\|_2^2$

其中 $\alpha \in [0, 1]$ 控制L1和L2的比例。

优点：

- 结合L1的稀疏性和L2的稳定性
- 当特征高度相关时，L2有助于选择相关特征组

**L1 vs L2的几何解释：**

约束优化形式：

$\min_{\boldsymbol{\theta}} R_{\text{emp}}(\boldsymbol{\theta}) \quad \text{s.t. } \|\boldsymbol{\theta}\|_p \leq t$

- L1正则化：约束区域是菱形（在2D）或超立方体
- L2正则化：约束区域是圆形（在2D）或超球体

L1的尖角使得最优解更可能在坐标轴上（稀疏解）。

**其他正则化方法：**

1. **Dropout（神经网络）：**

训练时随机丢弃（设为0）一部分神经元：

$$\mathbf{h}_{\text{dropout}} = \mathbf{m} \odot \mathbf{h}$$

其中 $\mathbf{m} \in \{0, 1\}^{n_l}$ 是掩码向量，每个元素独立地以概率 $p$ 为1：

$$m_i \sim \text{Bernoulli}(p)$$

测试时使用期望：

$$\mathbf{h}_{\text{test}} = p \cdot \mathbf{h}$$

效果：

- 防止神经元共适应（co-adaptation）
- 相当于训练指数级数量的子网络集成
- 隐式正则化，减少过拟合

2. **Early Stopping（早停）：**

监控验证集误差，当验证误差不再下降时停止训练：

$$t^* = \arg\min_{t} \epsilon_{\text{val}}(t)$$

原理：

- 限制优化迭代次数等价于限制模型复杂度
- 防止在训练集上过度优化

3. **数据增强（Data Augmentation）：**

通过变换生成新的训练样本：

$$\mathcal{D}_{\text{aug}} = \mathcal{D} \cup \{(T(\mathbf{x}_i), y_i) | (\mathbf{x}_i, y_i) \in \mathcal{D}, T \in \mathcal{T}\}$$

其中 $\mathcal{T}$ 是保持标签不变的变换集合。

常见变换（图像）：

- 旋转、翻转、裁剪
- 颜色抖动、噪声注入
- Mixup：$\tilde{\mathbf{x}} = \lambda\mathbf{x}_i + (1-\lambda)\mathbf{x}_j$

4. **批归一化（Batch Normalization）：**

对每个mini-batch进行归一化：

$$\hat{z}_i = \frac{z_i - \mu_{\mathcal{B}}}{\sqrt{\sigma_{\mathcal{B}}^2 + \epsilon}}$$

$$y_i = \gamma\hat{z}_i + \beta$$

其中：

- $\mu_{\mathcal{B}} = \frac{1}{m}\sum_{i=1}^{m} z_i$ 是batch均值
- $\sigma_{\mathcal{B}}^2 = \frac{1}{m}\sum_{i=1}^{m} (z_i - \mu_{\mathcal{B}})^2$ 是batch方差
- $\gamma, \beta$ 是可学习的缩放和平移参数
- $\epsilon$ 是小常数（数值稳定性）

效果：

- 减少内部协变量偏移
- 允许更高的学习率
- 具有正则化效果

### 2.3 优化算法（Optimization Algorithm）

**定义：**

优化算法用于求解学习准则定义的优化问题：

$$\boldsymbol{\theta}^* = \arg\min_{\boldsymbol{\theta} \in \Theta} J(\boldsymbol{\theta})$$

其中 $J(\boldsymbol{\theta})$ 是目标函数（损失+正则化）。

#### 梯度下降法（Gradient Descent）

**批量梯度下降（Batch Gradient Descent, BGD）：**

使用全部训练数据计算梯度：

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)})$$

其中：

- $\eta > 0$ 是学习率（步长）
- $\nabla_{\boldsymbol{\theta}} J = \frac{1}{n}\sum_{i=1}^{n} \nabla_{\boldsymbol{\theta}} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}), y_i) + \lambda\nabla_{\boldsymbol{\theta}}\Omega(\boldsymbol{\theta})$

**收敛性分析：**

对于凸函数且 $L$-光滑（Lipschitz连续梯度），选择学习率 $\eta \leq \frac{1}{L}$：

$$J(\boldsymbol{\theta}^{(t)}) - J(\boldsymbol{\theta}^*) \leq \frac{\|\boldsymbol{\theta}^{(0)} - \boldsymbol{\theta}^*\|^2}{2\eta t}$$

收敛速度为 $O(1/t)$（次线性）。

对于强凸函数（存在 $\mu > 0$ 使得 $\nabla^2 J \succeq \mu I$）：

$$\|\boldsymbol{\theta}^{(t)} - \boldsymbol{\theta}^*\| \leq \left(1 - \frac{\mu}{L}\right)^t \|\boldsymbol{\theta}^{(0)} - \boldsymbol{\theta}^*\|$$

收敛速度为 $O(e^{-t})$（线性收敛/指数衰减）。

**优缺点：**

优点：

- 稳定，收敛到全局最优（凸问题）
- 梯度估计无噪声

缺点：

- 计算成本高（每次迭代 $O(nd)$）
- 对于大数据集不可行
- 无法进行在线学习

#### 随机梯度下降（Stochastic Gradient Descent, SGD）

每次迭代随机选择单个样本计算梯度：

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta_t \nabla_{\boldsymbol{\theta}} \mathcal{L}(f(\mathbf{x}_{i_t}; \boldsymbol{\theta}^{(t)}), y_{i_t})$$

其中 $i_t$ 是随机选择的样本索引。

**梯度估计：**

单样本梯度是全梯度的无偏估计：

$$\mathbb{E}_{i \sim \text{Uniform}(1,n)}[\nabla_{\boldsymbol{\theta}} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}), y_i)] = \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta})$$

但方差较大：

$$\text{Var}[\nabla_{\boldsymbol{\theta}} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}), y_i)] = \sigma^2 > 0$$

**学习率调度：**

为保证收敛，学习率需满足Robbins-Monro条件：

$$\sum_{t=1}^{\infty} \eta_t = \infty, \quad \sum_{t=1}^{\infty} \eta_t^2 < \infty$$

常用学习率衰减策略：

1. $\eta_t = \frac{\eta_0}{1 + kt}$（逆时间衰减）
2. $\eta_t = \eta_0 \alpha^t$（指数衰减）
3. $\eta_t = \frac{\eta_0}{\sqrt{t}}$

**优缺点：**

优点：

- 计算高效（每次迭代 $O(d)$）
- 可在线学习
- 可能逃离鞍点
- 对大数据集友好

缺点：

- 收敛不稳定（梯度噪声大）
- 需要仔细调整学习率
- 可能在最优点附近震荡

#### Mini-batch梯度下降

折中方案，使用小批量样本：

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta \frac{1}{|\mathcal{B}_t|}\sum_{i \in \mathcal{B}_t} \nabla_{\boldsymbol{\theta}} \mathcal{L}(f(\mathbf{x}_i; \boldsymbol{\theta}^{(t)}), y_i)$$

其中 $\mathcal{B}_t$ 是大小为 $b$ 的mini-batch（通常 $b = 32, 64, 128, 256$）。

**方差减少：**

$$\text{Var}[\nabla_{\mathcal{B}}] = \frac{\sigma^2}{b}$$

batch size越大，梯度估计越准确，但计算成本越高。

**优点：**

- 平衡计算效率和稳定性
- 利用向量化加速（GPU并行）
- 梯度噪声适中

#### 动量方法（Momentum）

引入历史梯度的指数加权移动平均：

$$\mathbf{v}^{(t+1)} = \beta\mathbf{v}^{(t)} + (1-\beta)\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)})$$

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta\mathbf{v}^{(t+1)}$$

其中：

- $\mathbf{v}^{(t)}$ 是速度向量
- $\beta \in [0, 1)$ 是动量系数（通常0.9）

**Nesterov加速梯度（NAG）：**

在未来位置计算梯度：

$$\mathbf{v}^{(t+1)} = \beta\mathbf{v}^{(t)} + (1-\beta)\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)} - \eta\beta\mathbf{v}^{(t)})$$

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta\mathbf{v}^{(t+1)}$$

**效果：**

- 加速收敛（尤其在相关方向）
- 减少震荡
- 帮助逃离局部最优和鞍点

#### 自适应学习率方法

**AdaGrad：**

为每个参数维护累积梯度平方：

$$\mathbf{g}^{(t)} = \mathbf{g}^{(t-1)} + (\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)}))^2$$

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \frac{\eta}{\sqrt{\mathbf{g}^{(t)} + \epsilon}} \odot \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)})$$

其中 $\odot$ 表示逐元素乘法，$\epsilon$ 是小常数（如 $10^{-8}$）。

效果：

- 频繁更新的参数学习率降低
- 稀疏参数获得更大更新
- 适合稀疏数据

缺点：

- 学习率单调递减，可能过早停止

**RMSprop：**

使用指数加权移动平均替代累积和：

$$\mathbf{s}^{(t)} = \beta\mathbf{s}^{(t-1)} + (1-\beta)(\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)}))^2$$

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \frac{\eta}{\sqrt{\mathbf{s}^{(t)} + \epsilon}} \odot \nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)})$$

通常 $\beta = 0.9$。

效果：解决AdaGrad学习率过度衰减问题。

**Adam（Adaptive Moment Estimation）：**

结合动量和自适应学习率：

$$\mathbf{m}^{(t)} = \beta_1\mathbf{m}^{(t-1)} + (1-\beta_1)\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)})$$

$$\mathbf{v}^{(t)} = \beta_2\mathbf{v}^{(t-1)} + (1-\beta_2)(\nabla_{\boldsymbol{\theta}} J(\boldsymbol{\theta}^{(t)}))^2$$

偏差修正：

$$\hat{\mathbf{m}}^{(t)} = \frac{\mathbf{m}^{(t)}}{1 - \beta_1^t}, \quad \hat{\mathbf{v}}^{(t)} = \frac{\mathbf{v}^{(t)}}{1 - \beta_2^t}$$

更新：

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \frac{\eta}{\sqrt{\hat{\mathbf{v}}^{(t)} + \epsilon}} \hat{\mathbf{m}}^{(t)}$$

默认超参数：$\beta_1 = 0.9$，$\beta_2 = 0.999$，$\epsilon = 10^{-8}$。

**Adam的优势：**

- 结合动量和自适应学习率的优点
- 对超参数不敏感
- 在实践中广泛使用，效果优异

**其他变体：**

- AdaMax：使用无穷范数
- Nadam：Nesterov + Adam
- AMSGrad：修正Adam的收敛性问题

#### 二阶优化方法

**牛顿法（Newton's Method）：**

使用二阶信息（Hessian矩阵）：

$$\boldsymbol{\theta}^{(t+1)} = \boldsymbol{\theta}^{(t)} - \eta[\nabla^2 J(\boldsymbol{\theta}^{(t)})]^{-1}\nabla J(\boldsymbol{\theta}^{(t)})$$

其中 $\nabla^2 J = \mathbf{H}$ 是Hessian矩阵：

$$H_{ij} = \frac{\partial^2 J}{\partial\theta_i\partial\theta_j}$$

**收敛性：**

对于强凸函数，牛顿法具有二次收敛速度：

$$\|\boldsymbol{\theta}^{(t+1)} - \boldsymbol{\theta}^*\| \leq C\|\boldsymbol{\theta}^{(t)} - \boldsymbol{\theta}^*\|^2$$

**缺点：**

- 计算和存储Hessian矩阵成本高：$O(d^2)$ 存储，$O(d^3)$ 求逆
- 对于大规模问题不可行

**拟牛顿法（Quasi-Newton）：**

使用近似Hessian或其逆：

- BFGS：近似Hessian逆矩阵
- L-BFGS：Limited-memory BFGS，只存储最近 $m$ 次迭代信息

---

## 3 机器学习的简单示例：线性回归

线性回归是最基础的机器学习模型，用于建模输入特征与连续输出之间的线性关系。

### 3.1 问题设定

**目标：**

给定训练数据 $\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^{n}$，其中 $\mathbf{x}_i \in \mathbb{R}^d$，$y_i \in \mathbb{R}$，学习线性函数：

$$f(\mathbf{x}) = \mathbf{w}^T\mathbf{x} + b$$

使得能够预测新样本的输出。

### 3.2 最小二乘法（Least Squares）

**损失函数：**

均方误差（MSE）：

$$J(\mathbf{w}, b) = \frac{1}{2n}\sum_{i=1}^{n}(f(\mathbf{x}_i) - y_i)^2 = \frac{1}{2n}\sum_{i=1}^{n}(\mathbf{w}^T\mathbf{x}_i + b - y_i)^2$$

**矩阵形式：**

引入设计矩阵 $\mathbf{X} \in \mathbb{R}^{n \times d}$ 和增广形式：

$$\tilde{\mathbf{X}} = [\mathbf{1}, \mathbf{X}] = \begin{bmatrix} 1 & \mathbf{x}_1^T \\ 1 & \mathbf{x}_2^T \\ \vdots & \vdots \\ 1 & \mathbf{x}_n^T \end{bmatrix} \in \mathbb{R}^{n \times (d+1)}$$

$$\tilde{\mathbf{w}} = \begin{bmatrix} b \\ \mathbf{w} \end{bmatrix} \in \mathbb{R}^{d+1}, \quad \mathbf{y} = \begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_n \end{bmatrix} \in \mathbb{R}^n$$

损失函数变为：

$$J(\tilde{\mathbf{w}}) = \frac{1}{2n}\|\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y}\|^2 = \frac{1}{2n}(\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y})^T(\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y})$$

**解析解（Normal Equation）：**

对 $\tilde{\mathbf{w}}$ 求导并令其为0：

$$\nabla_{\tilde{\mathbf{w}}} J = \frac{1}{n}\tilde{\mathbf{X}}^T(\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y}) = \mathbf{0}$$

$$\tilde{\mathbf{X}}^T\tilde{\mathbf{X}}\tilde{\mathbf{w}} = \tilde{\mathbf{X}}^T\mathbf{y}$$

若 $\tilde{\mathbf{X}}^T\tilde{\mathbf{X}}$ 可逆，则：

$$\tilde{\mathbf{w}}^* = (\tilde{\mathbf{X}}^T\tilde{\mathbf{X}})^{-1}\tilde{\mathbf{X}}^T\mathbf{y}$$

**几何解释：**

$\tilde{\mathbf{X}}\tilde{\mathbf{w}}^*$ 是 $\mathbf{y}$ 在 $\tilde{\mathbf{X}}$ 的列空间上的正交投影。

**计算复杂度：**

- 直接求逆：$O(d^3 + nd^2)$
- 对于 $n \gg d$ 的情况较高效
- 对于 $d$ 很大时不可行

**数值稳定性：**

当 $\tilde{\mathbf{X}}^T\tilde{\mathbf{X}}$ 接近奇异（特征高度相关）时，直接求逆数值不稳定。

解决方案：

1. 使用QR分解或SVD
2. 添加正则化（Ridge回归）

### 3.3 Ridge回归（L2正则化）

**优化目标：**

$$J(\tilde{\mathbf{w}}) = \frac{1}{2n}\|\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y}\|^2 + \frac{\lambda}{2}\|\mathbf{w}\|^2$$

注意：通常不对偏置项 $b$ 正则化。

**解析解：**

$$\tilde{\mathbf{w}}^*_{\text{ridge}} = (\tilde{\mathbf{X}}^T\tilde{\mathbf{X}} + n\lambda\mathbf{I})^{-1}\tilde{\mathbf{X}}^T\mathbf{y}$$

其中 $\mathbf{I}$ 是单位矩阵（对应于 $\mathbf{w}$ 的维度，不包括偏置）。

**效果：**

- $\lambda > 0$ 保证矩阵可逆
- 减小参数值，防止过拟合
- 对共线性问题更鲁棒

### 3.4 梯度下降求解

**梯度计算：**

$$\nabla_{\tilde{\mathbf{w}}} J = \frac{1}{n}\tilde{\mathbf{X}}^T(\tilde{\mathbf{X}}\tilde{\mathbf{w}} - \mathbf{y}) + \lambda\tilde{\mathbf{w}}$$

**更新规则：**

$$\tilde{\mathbf{w}}^{(t+1)} = \tilde{\mathbf{w}}^{(t)} - \eta\nabla_{\tilde{\mathbf{w}}} J(\tilde{\mathbf{w}}^{(t)})$$

$$= \tilde{\mathbf{w}}^{(t)} - \frac{\eta}{n}\tilde{\mathbf{X}}^T(\tilde{\mathbf{X}}\tilde{\mathbf{w}}^{(t)} - \mathbf{y}) - \eta\lambda\tilde{\mathbf{w}}^{(t)}$$

$$= (1 - \eta\lambda)\tilde{\mathbf{w}}^{(t)} - \frac{\eta}{n}\tilde{\mathbf{X}}^T(\tilde{\mathbf{X}}\tilde{\mathbf{w}}^{(t)} - \mathbf{y})$$

### 3.5 概率视角

**假设：**

噪声模型：

$$y_i = \mathbf{w}^T\mathbf{x}_i + b + \epsilon_i, \quad \epsilon_i \sim \mathcal{N}(0, \sigma^2)$$

即：

$$P(y_i|\mathbf{x}_i, \mathbf{w}, b) = \mathcal{N}(y_i | \mathbf{w}^T\mathbf{x}_i + b, \sigma^2)$$

**似然函数：**

$$P(\mathbf{y}|\mathbf{X}, \mathbf{w}, b) = \prod_{i=1}^{n} \mathcal{N}(y_i | \mathbf{w}^T\mathbf{x}_i + b, \sigma^2)$$

**对数似然：**

$$\log P(\mathbf{y}|\mathbf{X}, \mathbf{w}, b) = -\frac{n}{2}\log(2\pi\sigma^2) - \frac{1}{2\sigma^2}\sum_{i=1}^{n}(y_i - \mathbf{w}^T\mathbf{x}_i - b)^2$$

**最大似然估计（MLE）：**

$$(\mathbf{w}^*, b^*) = \arg\max_{\mathbf{w}, b} \log P(\mathbf{y}|\mathbf{X}, \mathbf{w}, b)$$

等价于最小化MSE。

**最大后验估计（MAP）：**

引入参数先验 $\mathbf{w} \sim \mathcal{N}(\mathbf{0}, \frac{1}{\lambda}\mathbf{I})$：

$$P(\mathbf{w}|\mathbf{y}, \mathbf{X}) \propto P(\mathbf{y}|\mathbf{X}, \mathbf{w})P(\mathbf{w})$$

$$\log P(\mathbf{w}|\mathbf{y}, \mathbf{X}) = \log P(\mathbf{y}|\mathbf{X}, \mathbf{w}) + \log P(\mathbf{w}) + \text{const}$$

$$= -\frac{1}{2\sigma^2}\sum_{i=1}^{n}(y_i - \mathbf{w}^T\mathbf{x}_i - b)^2 - \frac{\lambda}{2}\|\mathbf{w}\|^2 + \text{const}$$

最大化MAP等价于Ridge回归。

---

## 4 偏差-方差分解

偏差-方差分解（Bias-Variance Decomposition）是理解模型泛化误差来源的重要工具。

### 4.1 问题设定

考虑回归问题，真实关系为：

$$y = f^*(\mathbf{x}) + \epsilon, \quad \epsilon \sim \mathcal{N}(0, \sigma^2)$$

其中 $f^*(\mathbf{x}) = \mathbb{E}[y|\mathbf{x}]$ 是真实函数（贝叶斯最优预测）。

给定训练集 $\mathcal{D}$，学习得到模型 $\hat{f}(\mathbf{x}; \mathcal{D})$。

### 4.2 期望泛化误差分解

对于新样本 $(\mathbf{x}, y)$，预测的期望平方误差：

$$\mathbb{E}_{\mathcal{D}, y}[(y - \hat{f}(\mathbf{x}; \mathcal{D}))^2]$$

期望是对所有可能的训练集 $\mathcal{D}$ 和噪声 $\epsilon$ 取的。

**分解步骤：**

记 $\bar{f}(\mathbf{x}) = \mathbb{E}_{\mathcal{D}}[\hat{f}(\mathbf{x}; \mathcal{D})]$ 为模型的期望预测。

$$\begin{align}
\mathbb{E}_{\mathcal{D}, y}[(y - \hat{f}(\mathbf{x}; \mathcal{D}))^2] &= \mathbb{E}_{\mathcal{D}, y}[(y - f^*(\mathbf{x}) + f^*(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2] \\
&= \mathbb{E}_{\mathcal{D}, y}[(y - f^*(\mathbf{x}))^2] + \mathbb{E}_{\mathcal{D}}[(f^*(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2] \\
&\quad + 2\mathbb{E}_{\mathcal{D}, y}[(y - f^*(\mathbf{x}))(f^*(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))]
\end{align}$$

交叉项为0（因为 $\mathbb{E}[y - f^*(\mathbf{x})] = 0$）。

继续分解第二项：

$$\begin{align}
\mathbb{E}_{\mathcal{D}}[(f^*(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2] &= \mathbb{E}_{\mathcal{D}}[(f^*(\mathbf{x}) - \bar{f}(\mathbf{x}) + \bar{f}(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2] \\
&= (f^*(\mathbf{x}) - \bar{f}(\mathbf{x}))^2 + \mathbb{E}_{\mathcal{D}}[(\bar{f}(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2]
\end{align}$$

**最终分解：**

$\mathbb{E}_{\mathcal{D}, y}[(y - \hat{f}(\mathbf{x}; \mathcal{D}))^2] = \underbrace{\sigma^2}_{\text{Noise}} + \underbrace{(f^*(\mathbf{x}) - \bar{f}(\mathbf{x}))^2}_{\text{Bias}^2} + \underbrace{\mathbb{E}_{\mathcal{D}}[(\bar{f}(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2]}_{\text{Variance}}$

### 4.3 三个组成部分

**1. 噪声（Irreducible Error）：**

$\text{Noise} = \sigma^2 = \mathbb{E}[(y - f^*(\mathbf{x}))^2|\mathbf{x}]$

- 数据本身的随机性，无法通过学习消除
- 代表问题的固有不确定性
- 贝叶斯误差的下界

**2. 偏差（Bias）：**

$\text{Bias}(\mathbf{x}) = f^*(\mathbf{x}) - \bar{f}(\mathbf{x}) = f^*(\mathbf{x}) - \mathbb{E}_{\mathcal{D}}[\hat{f}(\mathbf{x}; \mathcal{D})]$

- 模型的期望预测与真实函数的差距
- 衡量模型的表达能力是否足够
- 高偏差表示欠拟合（underfitting）

原因：

- 模型过于简单，无法捕捉数据的真实模式
- 假设空间不包含真实函数
- 例：用线性模型拟合非线性数据

**3. 方差（Variance）：**

$\text{Variance}(\mathbf{x}) = \mathbb{E}_{\mathcal{D}}[(\bar{f}(\mathbf{x}) - \hat{f}(\mathbf{x}; \mathcal{D}))^2]$

- 模型在不同训练集上预测的变化程度
- 衡量模型对训练数据的敏感性
- 高方差表示过拟合（overfitting）

原因：

- 模型过于复杂，学习了训练数据的噪声
- 训练数据不足
- 例：高阶多项式拟合少量数据点

### 4.4 偏差-方差权衡（Bias-Variance Tradeoff）

**核心矛盾：**

降低偏差通常会增加方差，反之亦然。

$\text{Total Error} = \text{Bias}^2 + \text{Variance} + \text{Noise}$

**模型复杂度的影响：**

- **简单模型**（低复杂度）：
  - 高偏差，低方差
  - 对训练数据不敏感，但表达能力有限
  - 欠拟合

- **复杂模型**（高复杂度）：
  - 低偏差，高方差
  - 能够拟合复杂模式，但对训练数据过度敏感
  - 过拟合

**最优复杂度：**

存在最优的模型复杂度使总误差最小：

$\text{Complexity}^* = \arg\min_{\text{Complexity}} [\text{Bias}^2(\text{Complexity}) + \text{Variance}(\text{Complexity})]$

### 4.5 示例：多项式回归

考虑用 $d$ 阶多项式拟合数据：

$\hat{f}(\mathbf{x}) = \sum_{j=0}^{d} w_j x^j$

- $d = 1$（线性）：高偏差，低方差
- $d = 10$（高阶多项式）：低偏差，高方差
- 最优 $d$ 取决于数据复杂度和样本量

### 4.6 如何平衡偏差和方差

**减少偏差：**

1. 增加模型复杂度（更多参数、更深网络）
2. 减少正则化强度
3. 增加特征（特征工程）
4. 训练更长时间

**减少方差：**

1. 增加训练数据
2. 使用正则化（L1/L2、Dropout）
3. 降低模型复杂度
4. 集成方法（Bagging、随机森林）
5. Early stopping
6. 数据增强

**诊断工具：**

- **训练误差 vs 验证误差：**
  - 训练误差高 → 高偏差（欠拟合）
  - 训练误差低但验证误差高 → 高方差（过拟合）
  - 两者都低 → 拟合良好

**学习曲线（Learning Curve）：**

绘制误差随训练样本数的变化：

- 高偏差：训练和验证误差都高，且接近
- 高方差：训练误差低，验证误差高，差距大
- 增加数据对高方差问题更有效

---

## 5 机器学习算法的类型

根据学习方式和可用信息的不同，机器学习算法可分为多种类型。

### 5.1 监督学习（Supervised Learning）

**定义：**

从标注数据中学习输入到输出的映射关系。

训练数据：$\mathcal{D} = \{(\mathbf{x}_i, y_i)\}_{i=1}^{n}$

目标：学习函数 $f: \mathcal{X} \rightarrow \mathcal{Y}$

**分类（Classification）：**

输出空间是离散的类别：$\mathcal{Y} = \{c_1, c_2, \ldots, c_C\}$

**常见算法：**

- 逻辑回归（Logistic Regression）
- 支持向量机（SVM）
- 决策树（Decision Trees）
- 随机森林（Random Forests）
- 梯度提升树（Gradient Boosting）
- 神经网络（Neural Networks）
- K近邻（K-Nearest Neighbors）
- 朴素贝叶斯（Naive Bayes）

**应用：**

- 图像分类（猫狗识别、手写数字识别）
- 文本分类（垃圾邮件检测、情感分析）
- 医学诊断
- 欺诈检测

**回归（Regression）：**

输出空间是连续值：$\mathcal{Y} = \mathbb{R}$ 或 $\mathbb{R}^m$

**常见算法：**

- 线性回归（Linear Regression）
- Ridge/Lasso回归
- 支持向量回归（SVR）
- 决策树回归
- 神经网络回归
- 高斯过程回归

**应用：**

- 房价预测
- 股票价格预测
- 气温预测
- 销量预测

### 5.2 无监督学习（Unsupervised Learning）

**定义：**

从无标注数据中学习数据的内在结构和模式。

训练数据：$\mathcal{D} = \{\mathbf{x}_i\}_{i=1}^{n}$（只有输入，无标签）

**聚类（Clustering）：**

将数据分组，使组内相似度高，组间相似度低。

**K-Means算法：**

目标函数：

$\min_{\{\mathcal{C}_k\}_{k=1}^{K}} \sum_{k=1}^{K} \sum_{\mathbf{x}_i \in \mathcal{C}_k} \|\mathbf{x}_i - \boldsymbol{\mu}_k\|^2$

其中 $\boldsymbol{\mu}_k = \frac{1}{|\mathcal{C}_k|}\sum_{\mathbf{x}_i \in \mathcal{C}_k} \mathbf{x}_i$ 是第 $k$ 个簇的中心。

**算法步骤：**

1. 随机初始化 $K$ 个簇中心
2. 分配：将每个样本分配到最近的簇中心
3. 更新：重新计算每个簇的中心
4. 重复2-3直到收敛

**其他聚类算法：**

- 层次聚类（Hierarchical Clustering）
- DBSCAN（基于密度）
- 高斯混合模型（GMM）
- 谱聚类（Spectral Clustering）

**应用：**

- 客户细分
- 图像分割
- 基因序列分析
- 推荐系统

**降维（Dimensionality Reduction）：**

将高维数据映射到低维空间，保留重要信息。

**主成分分析（PCA）：**

寻找方差最大的正交方向。

$\max_{\mathbf{w}} \mathbf{w}^T\mathbf{\Sigma}\mathbf{w} \quad \text{s.t. } \|\mathbf{w}\| = 1$

其中 $\mathbf{\Sigma} = \frac{1}{n}\sum_{i=1}^{n}(\mathbf{x}_i - \bar{\mathbf{x}})(\mathbf{x}_i - \bar{\mathbf{x}})^T$ 是协方差矩阵。

解：$\mathbf{\Sigma}$ 的前 $k$ 个最大特征值对应的特征向量。

投影：$\mathbf{z}_i = \mathbf{W}^T(\mathbf{x}_i - \bar{\mathbf{x}})$，其中 $\mathbf{W} = [\mathbf{w}_1, \ldots, \mathbf{w}_k]$

**其他降维方法：**

- t-SNE（t-distributed Stochastic Neighbor Embedding）
- UMAP（Uniform Manifold Approximation and Projection）
- 自编码器（Autoencoders）
- LDA（Linear Discriminant Analysis，监督降维）

**应用：**

- 数据可视化
- 噪声消除
- 特征提取
- 加速后续学习

**密度估计（Density Estimation）：**

估计数据的概率分布 $P(\mathbf{x})$。

**方法：**

- 核密度估计（KDE）
- 高斯混合模型（GMM）
- 变分自编码器（VAE）
- 生成对抗网络（GAN）

### 5.3 半监督学习（Semi-Supervised Learning）

**定义：**

结合少量标注数据和大量无标注数据进行学习。

训练数据：

- 标注数据：$\mathcal{D}_L = \{(\mathbf{x}_i, y_i)\}_{i=1}^{n_L}$
- 无标注数据：$\mathcal{D}_U = \{\mathbf{x}_j\}_{j=1}^{n_U}$

通常 $n_U \gg n_L$。

**基本假设：**

1. **平滑性假设（Smoothness Assumption）：**
   相近的样本倾向于有相同的标签。

2. **聚类假设（Cluster Assumption）：**
   数据形成离散的簇，同一簇内的样本有相同标签。

3. **流形假设（Manifold Assumption）：**
   高维数据位于低维流形上。

**方法：**

**自训练（Self-Training）：**

1. 在标注数据上训练初始模型
2. 用模型预测无标注数据
3. 选择高置信度的预测加入训练集
4. 重新训练模型
5. 重复2-4

**协同训练（Co-Training）：**
使用两个不同的视角（特征子集）训练两个模型，互相为对方提供伪标签。

**图半监督学习：**
构建样本图，标签通过图传播：

$\min_{\mathbf{f}} \sum_{i \in L}(f_i - y_i)^2 + \lambda\sum_{i,j} w_{ij}(f_i - f_j)^2$

其中 $w_{ij}$ 是样本 $i$ 和 $j$ 的相似度。

**应用：**

- 网页分类（少量标注，大量网页）
- 语音识别（标注成本高）
- 医学图像分析

### 5.4 强化学习（Reinforcement Learning）

**定义：**

通过与环境交互，学习策略以最大化累积奖励。

**核心要素：**

- **智能体（Agent）**：决策者
- **环境（Environment）**：智能体交互的外部系统
- **状态（State）** $s \in \mathcal{S}$：环境的描述
- **动作（Action）** $a \in \mathcal{A}$：智能体的决策
- **奖励（Reward）** $r \in \mathbb{R}$：即时反馈信号
- **策略（Policy）** $\pi: \mathcal{S} \rightarrow \mathcal{A}$：从状态到动作的映射

**马尔可夫决策过程（MDP）：**

环境由五元组 $(\mathcal{S}, \mathcal{A}, P, R, \gamma)$ 描述：

- $P(s'|s, a)$：状态转移概率
- $R(s, a, s')$：奖励函数
- $\gamma \in [0, 1)$：折扣因子

**目标：**

最大化累积折扣奖励：

$G_t = \sum_{k=0}^{\infty} \gamma^k r_{t+k+1}$

学习最优策略：

$\pi^* = \arg\max_{\pi} \mathbb{E}_{\pi}[G_t]$

**值函数：**

状态值函数：

$V^{\pi}(s) = \mathbb{E}_{\pi}[G_t | s_t = s]$

动作值函数（Q函数）：

$Q^{\pi}(s, a) = \mathbb{E}_{\pi}[G_t | s_t = s, a_t = a]$

**Bellman方程：**

$V^{\pi}(s) = \sum_{a} \pi(a|s) \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V^{\pi}(s')]$

$Q^{\pi}(s, a) = \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma \sum_{a'} \pi(a'|s')Q^{\pi}(s', a')]$

**最优Bellman方程：**

$V^*(s) = \max_{a} \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V^*(s')]$

$Q^*(s, a) = \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma \max_{a'} Q^*(s', a')]$

**主要算法：**

**值迭代：**

$V_{k+1}(s) = \max_{a} \sum_{s'} P(s'|s,a)[R(s,a,s') + \gamma V_k(s')]$

**Q-Learning（无模型）：**

$Q(s_t, a_t) \leftarrow Q(s_t, a_t) + \alpha[r_{t+1} + \gamma \max_{a'} Q(s_{t+1}, a') - Q(s_t, a_t)]$

**策略梯度：**

直接优化策略参数 $\theta$：

$\nabla_{\theta} J(\theta) = \mathbb{E}_{\pi_{\theta}}[\nabla_{\theta} \log \pi_{\theta}(a|s) Q^{\pi_{\theta}}(s, a)]$

**应用：**

- 游戏AI（AlphaGo、Dota 2）
- 机器人控制
- 自动驾驶
- 推荐系统
- 资源分配

### 5.5 其他学习范式

**迁移学习（Transfer Learning）：**

将从源任务学到的知识应用到目标任务。

形式化：

- 源域：$\mathcal{D}_S = \{(\mathbf{x}_i^S, y_i^S)\}$
- 目标域：$\mathcal{D}_T = \{(\mathbf{x}_i^T, y_i^T)\}$
- 目标：利用 $\mathcal{D}_S$ 改善在 $\mathcal{D}_T$ 上的性能

**方法：**

- 特征提取：使用预训练模型的特征表示
- 微调（Fine-tuning）：在目标数据上继续训练
- 域适应（Domain Adaptation）：减少源域和目标域的分布差异

**多任务学习（Multi-Task Learning）：**

同时学习多个相关任务，共享表示。

$\min_{\boldsymbol{\theta}_{\text{shared}}, \{\boldsymbol{\theta}_k\}_{k=1}^{K}} \sum_{k=1}^{K} \mathcal{L}_k(\boldsymbol{\theta}_{\text{shared}}, \boldsymbol{\theta}_k)$

**在线学习（Online Learning）：**

数据流式到达，模型实时更新。

每次收到新样本 $(\mathbf{x}_t, y_t)$：

$\boldsymbol{\theta}_{t+1} = \boldsymbol{\theta}_t - \eta_t \nabla \mathcal{L}(f(\mathbf{x}_t; \boldsymbol{\theta}_t), y_t)$

**主动学习（Active Learning）：**

智能选择最有价值的样本进行标注。

策略：

- 不确定性采样：选择模型最不确定的样本
- 查询委员会：多个模型意见分歧最大的样本
- 期望模型变化：标注后对模型影响最大的样本

---

## 6 数据的特点

理解数据的特性对选择合适的算法和预处理方法至关重要。

### 6.1 数据维度

**维度灾难（Curse of Dimensionality）：**

随着特征维度 $d$ 增加，问题的难度指数级增长。

**表现：**

1. **样本稀疏性：**

在 $d$ 维空间中，填满空间所需的样本数随 $d$ 指数增长。

若要保持相同的样本密度，所需样本数：

$n \propto \rho^{-d}$

其中 $\rho$ 是每维的采样密度。

2. **距离集中：**

高维空间中，所有点对之间的距离趋于相同。

考虑 $d$ 维超立方体中的均匀分布，最远距离和最近距离之比：

$\lim_{d \rightarrow \infty} \frac{D_{\max} - D_{\min}}{D_{\min}} \rightarrow 0$

这使得基于距离的方法（如KNN）在高维失效。

3. **体积集中：**

高维球体的体积几乎全部集中在表面附近。

半径为 $r$ 的球体，厚度为 $\epsilon$ 的外壳体积占比：

$\frac{V(r) - V(r-\epsilon)}{V(r)} = 1 - \left(1 - \frac{\epsilon}{r}\right)^d \rightarrow 1 \text{ as } d \rightarrow \infty$

**应对策略：**

1. **特征选择：**

   选择最相关的特征子集。

   **方法：**

   - 过滤法（Filter）：基于统计指标（相关系数、互信息）
   - 包装法（Wrapper）：基于模型性能（前向选择、后向消除）
   - 嵌入法（Embedded）：在训练过程中选择（Lasso、树的特征重要性）

2. **降维：**

   使用PCA、t-SNE等方法减少维度。

3. **正则化：**

   L1正则化产生稀疏解，隐式进行特征选择。

4. **特征工程：**

   构造更有意义的低维特征。

### 6.2 数据分布

**平衡 vs 不平衡：**

**类别不平衡（Class Imbalance）：**

不同类别的样本数量差异巨大。

$\frac{n_{\text{minority}}}{n_{\text{majority}}} \ll 1$

**问题：**

- 模型倾向于预测多数类
- 评估指标（准确率）可能误导

**解决方法：**

1. **重采样：**

   - 过采样（Over-sampling）：复制少数类样本
   - 欠采样（Under-sampling）：删除多数类样本
   - SMOTE：合成少数类样本

2. **代价敏感学习：**

   $J(\boldsymbol{\theta}) = \sum_{i=1}^{n} C(y_i) \cdot \mathcal{L}(f(\mathbf{x}_i), y_i)$

   其中 $C(y_i)$ 是类别权重，少数类权重更大。

3. **集成方法：**

   - EasyEnsemble：多次欠采样训练多个模型
   - BalanceCascade：级联训练

4. **评估指标调整：**
   使用F1-score、AUC-ROC等对不平衡更敏感的指标。

**数据噪声：**

**特征噪声：**

$\mathbf{x}_{\text{obs}} = \mathbf{x}_{\text{true}} + \boldsymbol{\epsilon}_x, \quad \boldsymbol{\epsilon}_x \sim \mathcal{N}(\mathbf{0}, \sigma_x^2\mathbf{I})$

**标签噪声：**

$P(\tilde{y}|y) = (1-\eta)\mathbb{I}[\tilde{y} = y] + \eta P_{\text{noise}}(\tilde{y})$

其中 $\tilde{y}$ 是观测标签，$y$ 是真实标签，$\eta$ 是噪声率。

**鲁棒性策略：**

- 使用鲁棒损失函数（MAE、Huber）
- 数据清洗和异常值检测
- 正则化防止过拟合噪声
- 集成方法平滑噪声影响

### 6.3 数据类型

**结构化数据 vs 非结构化数据：**

**结构化数据：**

表格形式，特征明确定义。

示例：

| ID   | 年龄 | 收入 | 教育 | 类别 |
| ---- | ---- | ---- | ---- | ---- |
| 1    | 25   | 50K  | 本科 | A    |
| 2    | 35   | 80K  | 硕士 | B    |

**处理方法：**

- 特征工程
- 传统机器学习算法（逻辑回归、树模型）
- 注意类别特征编码

**非结构化数据：**

无固定格式，需要提取特征。

**文本数据：**

表示方法：

1. **词袋模型（Bag of Words）：**

   $\mathbf{x} = [c_1, c_2, \ldots, c_{|V|}]^T$

   其中 $c_i$ 是词 $i$ 的计数，$|V|$ 是词汇表大小。

2. **TF-IDF：**

   $\text{TF-IDF}(t, d) = \text{TF}(t, d) \times \text{IDF}(t)$

   $\text{TF}(t, d) = \frac{f_{t,d}}{\sum_{t' \in d} f_{t',d}}$

   $\text{IDF}(t) = \log\frac{N}{|\{d: t \in d\}|}$

3. **词嵌入（Word Embeddings）：**

   将词映射到稠密向量：

   $\phi: \text{word} \rightarrow \mathbb{R}^d$

   例：Word2Vec、GloVe、BERT

**图像数据：**

表示：

- 原始像素：$\mathbf{x} \in \mathbb{R}^{H \times W \times C}$（高度×宽度×通道）
- 卷积神经网络（CNN）自动学习特征

**时间序列数据：**

$\mathbf{x} = [x_1, x_2, \ldots, x_T]$

**特点：**

- 时间依赖性
- 趋势、季节性、周期性

**模型：**

- ARIMA
- 循环神经网络（RNN、LSTM、GRU）
- Transformer

### 6.4 缺失数据

**缺失机制：**

1. **完全随机缺失（MCAR）：**

   $P(\text{missing}|\mathbf{x}_{\text{obs}}, \mathbf{x}_{\text{miss}}) = P(\text{missing})$

   缺失与任何变量无关。

2. **随机缺失（MAR）：**

   $P(\text{missing}|\mathbf{x}_{\text{obs}}, \mathbf{x}_{\text{miss}}) = P(\text{missing}|\mathbf{x}_{\text{obs}})$

   缺失仅依赖于观测值。

3. **非随机缺失（MNAR）：**

   缺失依赖于缺失值本身。

**处理方法：**

**删除法：**

- 列删除：删除缺失比例高的特征
- 行删除：删除有缺失的样本

风险：丢失信息，可能引入偏差。

**填充法（Imputation）：**

1. **简单填充：**

   - 均值/中位数填充（数值特征）
   - 众数填充（类别特征）
   - 常数填充（如0或特殊值）

2. **模型填充：**

   - KNN填充：用最近邻样本的值
   - 回归填充：用其他特征预测缺失值
   - 矩阵分解：协同填充多个缺失值

3. **多重填充（Multiple Imputation）：**

   生成多个填充版本，每个都进行分析，最后合并结果。

4. **深度学习：**

   使用自编码器或生成模型学习填充。

**建模时处理：**

- 决策树算法可以直接处理缺失值
- 添加指示变量标记缺失

---

## 7 评价指标

评价指标用于量化模型性能，选择合适的指标对模型选择和优化至关重要。

### 7.1 分类问题评价指标

**混淆矩阵（Confusion Matrix）：**

对于二分类问题（正类/负类）：

|              | 预测为正 | 预测为负 |
| ------------ | -------- | -------- |
| **实际为正** | TP       | FN       |
| **实际为负** | FP       | TN       |

其中：

- TP（True Positive）：真正例
- TN（True Negative）：真负例
- FP（False Positive）：假正例（Type I Error）
- FN（False Negative）：假负例（Type II Error）

**基本指标：**

1. **准确率（Accuracy）：**

$\text{Accuracy} = \frac{TP + TN}{TP + TN + FP + FN} = \frac{\text{正确预测数}}{\text{总样本数}}$

优点：直观易懂
缺点：在类别不平衡时误导

2. **精确率（Precision）：**

$\text{Precision} = \frac{TP}{TP + FP} = \frac{\text{预测为正且正确}}{\text{所有预测为正}}$

含义：预测为正例中真正是正例的比例。

3. **召回率（Recall/Sensitivity/True Positive Rate）：**

$\text{Recall} = \frac{TP}{TP + FN} = \frac{\text{预测为正且正确}}{\text{所有实际为正}}$

含义：实际正例中被正确识别的比例。

4. **特异度（Specificity/True Negative Rate）：**

$\text{Specificity} = \frac{TN}{TN + FP}$

含义：实际负例中被正确识别的比例。

5. **F1分数（F1-Score）：**

精确率和召回率的调和平均：

$F1 = \frac{2 \cdot \text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}} = \frac{2TP}{2TP + FP + FN}$

**$F_{\beta}$分数：**

$F_{\beta} = (1 + \beta^2) \cdot \frac{\text{Precision} \cdot \text{Recall}}{\beta^2 \cdot \text{Precision} + \text{Recall}}$

- $\beta = 1$：F1，平等权衡
- $\beta < 1$：更重视精确率
- $\beta > 1$：更重视召回率（如 $F_2$）

**ROC曲线与AUC：**

**ROC曲线（Receiver Operating Characteristic）：**

以假正例率（FPR）为横轴，真正例率（TPR）为纵轴的曲线。

$\text{FPR} = \frac{FP}{FP + TN} = 1 - \text{Specificity}$

$\text{TPR} = \text{Recall} = \frac{TP}{TP + FN}$

通过改变分类阈值 $\tau$：

$\hat{y} = \begin{cases} 1 & \text{if } P(y=1|\mathbf{x}) \geq \tau \\ 0 & \text{otherwise} \end{cases}$

得到不同的(FPR, TPR)点，连成曲线。

**AUC（Area Under the Curve）：**

ROC曲线下的面积：

$\text{AUC} = \int_0^1 \text{TPR}(t) \, d\text{FPR}(t)$

**解释：**

- AUC = 1：完美分类器
- AUC = 0.5：随机猜测
- AUC < 0.5：比随机还差（可能预测反了）

**概率意义：**

$\text{AUC} = P(\text{score}(x^+) > \text{score}(x^-))$

即随机抽取一个正例和一个负例，正例得分高于负例的概率。

**优点：**

- 对类别不平衡不敏感
- 评估模型排序能力
- 不依赖于具体阈值

**PR曲线（Precision-Recall Curve）：**

以召回率为横轴，精确率为纵轴。

**AP（Average Precision）：**

$\text{AP} = \sum_{k=1}^{n} P(k) \Delta R(k)$

其中 $P(k)$ 和 $R(k)$ 是在第 $k$ 个阈值的精确率和召回率。

**mAP（Mean Average Precision）：**

多类别情况下，各类别AP的平均。

**多分类指标：**

**宏平均（Macro-Average）：**

先计算每个类别的指标，再取平均：

$\text{Macro-F1} = \frac{1}{C}\sum_{c=1}^{C} F1_c$

特点：每个类别权重相同，适合类别平衡。

**微平均（Micro-Average）：**

先累加所有类别的TP、FP、FN，再计算指标：

$\text{Micro-Precision} = \frac{\sum_{c=1}^{C} TP_c}{\sum_{c=1}^{C} (TP_c + FP_c)}$

特点：大类别影响更大，适合类别不平衡。

**加权平均（Weighted-Average）：**

按各类别样本数加权：

$\text{Weighted-F1} = \frac{1}{n}\sum_{c=1}^{C} n_c \cdot F1_c$

### 7.2 回归问题评价指标

1. **均方误差（MSE）：**

$\text{MSE} = \frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2$

**均方根误差（RMSE）：**

$\text{RMSE} = \sqrt{\text{MSE}} = \sqrt{\frac{1}{n}\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}$

优点：与目标变量同单位，直观
缺点：对异常值敏感

2. **平均绝对误差（MAE）：**

$\text{MAE} = \frac{1}{n}\sum_{i=1}^{n}|y_i - \hat{y}_i|$

优点：对异常值更鲁棒
缺点：不可微（在0点）

3. **决定系数（$R^2$ Score）：**

$R^2 = 1 - \frac{\sum_{i=1}^{n}(y_i - \hat{y}_i)^2}{\sum_{i=1}^{n}(y_i - \bar{y})^2} = 1 - \frac{\text{RSS}}{\text{TSS}}$

其中：

- RSS（Residual Sum of Squares）：残差平方和
- TSS（Total Sum of Squares）：总平方和
- $\bar{y} = \frac{1}{n}\sum_{i=1}^{n} y_i$

**解释：**

- $R^2 = 1$：完美预测
- $R^2 = 0$：预测与均值相当
- $R^2 < 0$：预测比均值还差

**调整$R^2$（Adjusted $R^2$）：**

$R^2_{\text{adj}} = 1 - \frac{(1-R^2)(n-1)}{n-p-1}$

其中 $p$ 是特征数。调整后惩罚过多的特征。

4. **平均绝对百分比误差（MAPE）：**

$\text{MAPE} = \frac{100\%}{n}\sum_{i=1}^{n}\left|\frac{y_i - \hat{y}_i}{y_i}\right|$

优点：无量纲，便于比较不同规模的问题
缺点：当 $y_i \approx 0$ 时不稳定

5. **对数损失（Log Loss for Regression）：**

对于预测分布 $P(\hat{y}|\mathbf{x})$：

$\text{NLL} = -\frac{1}{n}\sum_{i=1}^{n} \log P(y_i|\mathbf{x}_i)$

### 7.3 聚类评价指标

**外部指标（需要真实标签）：**

1. **调整兰德指数（ARI）：**

$\text{ARI} = \frac{\text{RI} - \mathbb{E}[\text{RI}]}{\max(\text{RI}) - \mathbb{E}[\text{RI}]}$

其中RI是兰德指数，衡量聚类结果与真实标签的一致性。

范围：$[-1, 1]$，1表示完全一致。

2. **归一化互信息（NMI）：**

$\text{NMI} = \frac{MI(Y, C)}{\sqrt{H(Y)H(C)}}$

其中 $Y$ 是真实标签，$C$ 是聚类结果，$MI$ 是互信息，$H$ 是熵。

范围：$[0, 1]$，1表示完全相关。

**内部指标（不需要真实标签）：**

1. **轮廓系数（Silhouette Coefficient）：**

对于样本 $i$：

$s_i = \frac{b_i - a_i}{\max(a_i, b_i)}$

其中：

- $a_i$：样本 $i$ 到同簇其他样本的平均距离
- $b_i$：样本 $i$ 到最近其他簇样本的平均距离

范围：$[-1, 1]$，值越大越好。

整体轮廓系数：

$\text{Silhouette} = \frac{1}{n}\sum_{i=1}^{n} s_i$

2. **Davies-Bouldin指数（DBI）：**

$\text{DBI} = \frac{1}{K}\sum_{k=1}^{K} \max_{k' \neq k} \frac{\sigma_k + \sigma_{k'}}{d(c_k, c_{k'})}$

其中 $\sigma_k$ 是簇 $k$ 内样本到中心的平均距离，$d(c_k, c_{k'})$ 是簇中心距离。

值越小越好。

3. **Calinski-Harabasz指数（CH指数）：**

$\text{CH} = \frac{\text{tr}(B_K)}{\text{tr}(W_K)} \times \frac{n - K}{K - 1}$

其中 $B_K$ 是簇间协方差矩阵，$W_K$ 是簇内协方差矩阵。

值越大越好。

---

## 8 理论和定理

机器学习的理论基础提供了对学习算法性能的理解和保证。

### 8.1 PAC学习理论

**PAC（Probably Approximately Correct）学习：**

**定义：**

假设空间 $\mathcal{H}$ 是PAC可学习的，如果存在算法 $A$ 和多项式函数 $poly(\cdot)$，使得对于任意：

- 分布 $\mathcal{D}$ 在 $\mathcal{X}$ 上
- $0 < \epsilon, \delta < 1$（精度和置信度参数）
- 目标概念 $c \in \mathcal{C}$

算法 $A$ 在样本数 $n \geq poly(1/\epsilon, 1/\delta, d, \text{size}(c))$ 时，以至少 $1-\delta$ 的概率输出假设 $h \in \mathcal{H}$ 满足：

$P_{\mathcal{D}}[h(\mathbf{x}) \neq c(\mathbf{x})] \leq \epsilon$

即误差小于 $\epsilon$ 的概率至少为 $1-\delta$。

**样本复杂度（Sample Complexity）：**

达到 $(\epsilon, \delta)$-PAC学习所需的最少样本数。

### 8.2 VC维理论

**VC维（Vapnik-Chervonenkis Dimension）：**

**打散（Shatter）：**

假设空间 $\mathcal{H}$ 能打散样本集 $S = \{\mathbf{x}_1, \ldots, \mathbf{x}_m\}$，如果对于 $S$ 的所有 $2^m$ 种标注方式，都存在 $h \in \mathcal{H}$ 能够完全分对。

**VC维定义：**

$\text{VC}(\mathcal{H}) = \max\{m : \exists S, |S|=m, \mathcal{H} \text{ 打散 } S\}$

即 $\mathcal{H}$ 能打散的最大样本集大小。

**示例：**

1. **线性分类器在 $\mathbb{R}^d$：**

   $\text{VC} = d + 1$

   即 $d$ 维线性分类器的VC维是 $d+1$。

2. **感知机：**

   $\text{VC} = d + 1$

3. **神经网络：**

   对于 $W$ 个参数的网络：

   $\text{VC} = O(W \log W)$

**泛化误差界：**

根据VC理论，以至少 $1-\delta$ 的概率：

$R(h) \leq R_{\text{emp}}(h) + \sqrt{\frac{d(\log(2n/d) + 1) + \log(4/\delta)}{n}}$

其中 $d = \text{VC}(\mathcal{H})$。

**样本复杂度：**

为达到误差 $\epsilon$，所需样本数：

$n = O\left(\frac{d + \log(1/\delta)}{\epsilon^2}\right)$

### 8.3 Rademacher复杂度

**经验Rademacher复杂度：**

$\hat{\mathcal{R}}_n(\mathcal{F}) = \mathbb{E}_{\boldsymbol{\sigma}}\left[\sup_{f \in \mathcal{F}} \frac{1}{n}\sum_{i=1}^{n} \sigma_i f(\mathbf{x}_i)\right]$

其中 $\sigma_i \in \{-1, +1\}$ 是独立的Rademacher随机变量（均匀分布）。

**泛化误差界：**

以至少 $1-\delta$ 的概率：

$R(f) \leq R_{\text{emp}}(f) + 2\mathcal{R}_n(\mathcal{F}) + \sqrt{\frac{\log(1/\delta)}{2n}}$

### 8.4 No Free Lunch定理

**定理：**

对于所有可能的问题分布，任何两个学习算法的平均性能相同。

形式化：设 $\mathcal{A}_1, \mathcal{A}_2$ 是两个学习算法，对所有问题的误差求平均：

$\mathbb{E}_{\mathcal{D}}[E(\mathcal{A}_1)] = \mathbb{E}_{\mathcal{D}}[E(\mathcal{A}_2)]$

**含义：**

- 没有普适的最优算法
- 算法性能依赖于问题的先验假设
- 需要根据具体问题选择合适的算法

**实践意义：**

虽然理论上没有免费午餐，但在实践中：

- 真实问题有结构和规律
- 某些算法在特定问题类上表现更好
- 归纳偏置（Inductive Bias）很重要

### 8.5 贝叶斯误差

**定义：**

在给定数据分布下，理论上可达到的最小误差。

$\epsilon_{\text{Bayes}} = \min_f \mathbb{E}_{(\mathbf{x}, y) \sim P}[\mathbb{I}[f(\mathbf{x}) \neq y]]$

**贝叶斯最优分类器：**

$f^*(\mathbf{x}) = \arg\max_c P(y=c|\mathbf{x})$

即选择后验概率最大的类别。

**贝叶斯误差：**

$\epsilon_{\text{Bayes}} = \mathbb{E}_{\mathbf{x}}[1 - \max_c P(y=c|\mathbf{x})]$

**误差分解：**

$\text{Total Error} = \epsilon_{\text{Bayes}} + \text{Estimation Error} + \text{Optimization Error}$

其中：

- $\epsilon_{\text{Bayes}}$：不可约误差
- Estimation Error：有限样本导致的误差
- Optimization Error：优化算法未找到最优解导致的误差

### 8.6 正则化理论

**Tikhonov正则化：**

$\min_{f \in \mathcal{H}} \frac{1}{n}\sum_{i=1}^{n} \mathcal{L}(f(\mathbf{x}_i), y_i) + \lambda\|f\|_{\mathcal{H}}^2$

其中 $\|f\|_{\mathcal{H}}$ 是再生核希尔伯特空间（RKHS）中的范数。

**Representer定理：**

最优解可以表示为训练样本的线性组合：

$f^*(\mathbf{x}) = \sum_{i=1}^{n} \alpha_i K(\mathbf{x}, \mathbf{x}_i)$

其中 $K$ 是核函数。

**岭回归是特例：**

线性模型下，RKHS范数退化为 $\|\mathbf{w}\|^2$。

