线性模型（Linear Model）是机器学习和统计学习中最基础、最重要的一类模型。尽管其形式相对简单，但线性模型在理论研究和实际应用中都占有举足轻重的地位。

## 1 线性判别函数和决策边界

线性判别函数是线性分类模型的核心概念。本节将从二分类问题入手，逐步扩展到多分类问题，深入探讨线性分类的几何意义和数学性质。

### 1.1 二分类

二分类（Binary Classification）是最基本的分类问题，目标是将输入样本划分为两个互斥的类别。

#### 线性判别函数的定义

给定$D$维输入空间$\mathcal{X} = \mathbb{R}^D$，线性判别函数是一个从$\mathcal{X}$到$\mathbb{R}$的仿射映射：

$$
f: \mathbb{R}^D \rightarrow \mathbb{R}, \quad f(\boldsymbol{x}) = \boldsymbol{w}^{\top}\boldsymbol{x} + b
$$

其中：

- $\boldsymbol{x} = [x_1, x_2, \ldots, x_D]^{\top} \in \mathbb{R}^D$ 是输入特征向量
- $\boldsymbol{w} = [w_1, w_2, \ldots, w_D]^{\top} \in \mathbb{R}^D$ 是权重向量（weight vector）
- $b \in \mathbb{R}$ 是偏置项（bias term），也称为截距（intercept）

**展开形式**：

$$
f(\boldsymbol{x}) = w_1 x_1 + w_2 x_2 + \cdots + w_D x_D + b = \sum_{d=1}^{D} w_d x_d + b
$$

**几何解释**：

- 权重向量$\boldsymbol{w}$决定了决策超平面的**法向量方向**
- 偏置项$b$决定了超平面相对于原点的**位置（平移量）**
- $\|\boldsymbol{w}\|$（权重向量的模）影响判别函数值的**尺度**

设$D=2$，$\boldsymbol{w} = [2, 1]^{\top}$，$b = -3$，则判别函数为：

$$
f(x_1, x_2) = 2x_1 + x_2 - 3
$$

对于点$(2, 1)$：$f(2, 1) = 2 \times 2 + 1 - 3 = 2 > 0$，属于正类。
对于点$(0, 0)$：$f(0, 0) = -3 < 0$，属于负类。

#### 增广表示

为了简化数学表达，我们通常采用增广表示（Augmented Representation）。

定义增广权重向量和增广特征向量：

$$
\hat{\boldsymbol{w}} = \begin{bmatrix} \boldsymbol{w} \\ b \end{bmatrix} = \begin{bmatrix} w_1 \\ w_2 \\ \vdots \\ w_D \\ b \end{bmatrix} \in \mathbb{R}^{D+1}
$$

$$
\hat{\boldsymbol{x}} = \begin{bmatrix} \boldsymbol{x} \\ 1 \end{bmatrix} = \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_D \\ 1 \end{bmatrix} \in \mathbb{R}^{D+1}
$$

则线性判别函数可简写为：

$$
f(\boldsymbol{x}) = \hat{\boldsymbol{w}}^{\top}\hat{\boldsymbol{x}}
$$

**验证**：

$$
\hat{\boldsymbol{w}}^{\top}\hat{\boldsymbol{x}} = [w_1, w_2, \ldots, w_D, b] \begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_D \\ 1 \end{bmatrix} = \sum_{d=1}^{D} w_d x_d + b = \boldsymbol{w}^{\top}\boldsymbol{x} + b
$$

**增广表示的优点**：

1. 将仿射函数转化为线性函数，简化数学推导
2. 便于矩阵运算和向量化实现
3. 统一处理权重和偏置，代码实现更简洁

#### 决策规则

基于线性判别函数，我们定义分类决策规则。

线性分类器的决策规则：

**情形一**：标签$y \in \{-1, +1\}$
$$
h(\boldsymbol{x}) = \text{sign}(f(\boldsymbol{x})) = \text{sign}(\boldsymbol{w}^{\top}\boldsymbol{x} + b)
$$

其中符号函数（sign function）定义为：

$$
\text{sign}(z) = \begin{cases}
+1, & \text{if } z > 0 \\
0, & \text{if } z = 0 \\
-1, & \text{if } z < 0
\end{cases}
$$

或者简化为（将$z=0$归为正类）：

$$
\text{sign}(z) = \begin{cases}
+1, & \text{if } z \geq 0 \\
-1, & \text{if } z < 0
\end{cases}
$$

**情形二**：标签$y \in \{0, 1\}$

$$
h(\boldsymbol{x}) = \mathbb{I}(f(\boldsymbol{x}) \geq 0) = \begin{cases}
1, & \text{if } \boldsymbol{w}^{\top}\boldsymbol{x} + b \geq 0 \\
0, & \text{if } \boldsymbol{w}^{\top}\boldsymbol{x} + b < 0
\end{cases}
$$

其中$\mathbb{I}(\cdot)$是指示函数（indicator function）。

**两种标签表示的转换**：

- 从$\{0, 1\}$到$\{-1, +1\}$：$y' = 2y - 1$
- 从$\{-1, +1\}$到$\{0, 1\}$：$y' = (y + 1)/2$

#### 决策边界与决策区域

决策边界：决策边界（Decision Boundary）是使判别函数值为零的所有点构成的集合：

$$
\mathcal{B} = \{\boldsymbol{x} \in \mathbb{R}^D \mid f(\boldsymbol{x}) = 0\} = \{\boldsymbol{x} \in \mathbb{R}^D \mid \boldsymbol{w}^{\top}\boldsymbol{x} + b = 0\}
$$

**几何性质**：

- 在$D$维空间中，决策边界是一个$(D-1)$维的**超平面**（hyperplane）
- 当$D=2$时，决策边界是一条**直线**
- 当$D=3$时，决策边界是一个**平面**
- 超平面将$\mathbb{R}^D$分成两个**半空间**

决策区域：决策边界将特征空间划分为两个决策区域：

**正类区域**：
$$
\mathcal{R}_{+1} = \{\boldsymbol{x} \in \mathbb{R}^D \mid f(\boldsymbol{x}) > 0\}
$$

**负类区域**：
$$
\mathcal{R}_{-1} = \{\boldsymbol{x} \in \mathbb{R}^D \mid f(\boldsymbol{x}) < 0\}
$$

决策区域的凸性：线性分类器的决策区域是凸集（convex set）。

**证明**：设$\boldsymbol{x}_1, \boldsymbol{x}_2 \in \mathcal{R}_{+1}$，则$f(\boldsymbol{x}_1) > 0$且$f(\boldsymbol{x}_2) > 0$。

对于任意$\lambda \in [0, 1]$，考虑凸组合$\boldsymbol{x}_\lambda = \lambda \boldsymbol{x}_1 + (1-\lambda) \boldsymbol{x}_2$：

$$
f(\boldsymbol{x}_\lambda) = \boldsymbol{w}^{\top}(\lambda \boldsymbol{x}_1 + (1-\lambda) \boldsymbol{x}_2) + b
$$

$$
= \lambda(\boldsymbol{w}^{\top}\boldsymbol{x}_1 + b) + (1-\lambda)(\boldsymbol{w}^{\top}\boldsymbol{x}_2 + b)
$$

$$
= \lambda f(\boldsymbol{x}_1) + (1-\lambda) f(\boldsymbol{x}_2)
$$

由于$\lambda \geq 0$，$(1-\lambda) \geq 0$，$f(\boldsymbol{x}_1) > 0$，$f(\boldsymbol{x}_2) > 0$，所以：

$$
f(\boldsymbol{x}_\lambda) = \lambda f(\boldsymbol{x}_1) + (1-\lambda) f(\boldsymbol{x}_2) > 0
$$

因此$\boldsymbol{x}_\lambda \in \mathcal{R}_{+1}$，证明$\mathcal{R}_{+1}$是凸集。同理可证$\mathcal{R}_{-1}$也是凸集。$\square$

**凸性的意义**：

- 凸决策区域意味着不存在"孤岛"，同一类别的样本在特征空间中是"连通"的
- 这是线性分类器的局限性：无法处理类别区域非凸的情况（如XOR问题）

#### 权重向量的几何意义

权重向量$\boldsymbol{w}$是决策超平面的法向量，指向正类区域。

**证明**：设$\boldsymbol{x}_1, \boldsymbol{x}_2$是决策边界上的任意两点，则：

$$
\boldsymbol{w}^{\top}\boldsymbol{x}_1 + b = 0
$$

$$
\boldsymbol{w}^{\top}\boldsymbol{x}_2 + b = 0
$$

两式相减得：

$$
\boldsymbol{w}^{\top}(\boldsymbol{x}_1 - \boldsymbol{x}_2) = 0
$$

这说明$\boldsymbol{w}$与决策边界上任意方向向量$(\boldsymbol{x}_1 - \boldsymbol{x}_2)$正交，因此$\boldsymbol{w}$是**法向量**。

对于$f(\boldsymbol{x}) > 0$的点，有$\boldsymbol{w}^{\top}\boldsymbol{x} > -b$，说明$\boldsymbol{x}$在沿$\boldsymbol{w}$方向上位于超平面的正侧。因此$\boldsymbol{w}$**指向正类区域**。$\square$

**几何直观**：

- 想象站在决策边界上，面朝$\boldsymbol{w}$方向
- 前方是正类区域，后方是负类区域
- $\boldsymbol{w}$的模$\|\boldsymbol{w}\|$不影响决策边界的方向，只影响判别函数值的尺度

#### 样本点到决策边界的距离

点到超平面的距离公式：任意点$\boldsymbol{x}_0 \in \mathbb{R}^D$到超平面$\boldsymbol{w}^{\top}\boldsymbol{x} + b = 0$的距离为：

**有符号距离**：
$$
d_{\text{signed}}(\boldsymbol{x}_0) = \frac{\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b}{\|\boldsymbol{w}\|_2}
$$

**无符号距离（绝对距离）**：
$$
d(\boldsymbol{x}_0) = \frac{|\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b|}{\|\boldsymbol{w}\|_2}
$$

其中$\|\boldsymbol{w}\|_2 = \sqrt{\sum_{d=1}^{D} w_d^2}$是权重向量的$L_2$范数（欧几里得范数）。

**详细证明**：

**方法一：投影法**

设$\boldsymbol{x}_p$是$\boldsymbol{x}_0$在超平面上的投影点（即最近点），则$\boldsymbol{x}_p$满足两个条件：

1. $\boldsymbol{x}_p$在超平面上：$\boldsymbol{w}^{\top}\boldsymbol{x}_p + b = 0$
2. $\boldsymbol{x}_0 - \boldsymbol{x}_p$与超平面垂直，即平行于法向量$\boldsymbol{w}$

由条件2，存在$\lambda \in \mathbb{R}$使得：
$$
\boldsymbol{x}_0 - \boldsymbol{x}_p = \lambda \boldsymbol{w}
$$

即：
$$
\boldsymbol{x}_p = \boldsymbol{x}_0 - \lambda \boldsymbol{w}
$$

将$\boldsymbol{x}_p$代入条件1：
$$
\boldsymbol{w}^{\top}(\boldsymbol{x}_0 - \lambda \boldsymbol{w}) + b = 0
$$

$$
\boldsymbol{w}^{\top}\boldsymbol{x}_0 - \lambda \boldsymbol{w}^{\top}\boldsymbol{w} + b = 0
$$

$$
\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b = \lambda \|\boldsymbol{w}\|_2^2
$$

$$
\lambda = \frac{\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b}{\|\boldsymbol{w}\|_2^2}
$$

$\boldsymbol{x}_0$到超平面的距离为：
$$
d = \|\boldsymbol{x}_0 - \boldsymbol{x}_p\|_2 = \|\lambda \boldsymbol{w}\|_2 = |\lambda| \cdot \|\boldsymbol{w}\|_2
$$

$$
= \left|\frac{\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b}{\|\boldsymbol{w}\|_2^2}\right| \cdot \|\boldsymbol{w}\|_2 = \frac{|\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b|}{\|\boldsymbol{w}\|_2}
$$

$\square$

**方法二：解析几何法**

超平面上任取一点$\boldsymbol{x}^*$，满足$\boldsymbol{w}^{\top}\boldsymbol{x}^* + b = 0$。

$\boldsymbol{x}_0$到超平面的距离等于向量$(\boldsymbol{x}_0 - \boldsymbol{x}^*)$在法向量方向上的投影长度：

$$
d = \left|\frac{\boldsymbol{w}^{\top}(\boldsymbol{x}_0 - \boldsymbol{x}^*)}{\|\boldsymbol{w}\|_2}\right| = \left|\frac{\boldsymbol{w}^{\top}\boldsymbol{x}_0 - \boldsymbol{w}^{\top}\boldsymbol{x}^*}{\|\boldsymbol{w}\|_2}\right|
$$

由于$\boldsymbol{w}^{\top}\boldsymbol{x}^* = -b$：

$$
d = \left|\frac{\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b}{\|\boldsymbol{w}\|_2}\right| = \frac{|\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b|}{\|\boldsymbol{w}\|_2}
$$

$\square$

**推论 3.1**：原点到超平面$\boldsymbol{w}^{\top}\boldsymbol{x} + b = 0$的距离为：
$$
d_{\text{origin}} = \frac{|b|}{\|\boldsymbol{w}\|_2}
$$

**推论 3.2**：如果$\|\boldsymbol{w}\|_2 = 1$（单位法向量），则：
$$
d(\boldsymbol{x}_0) = |\boldsymbol{w}^{\top}\boldsymbol{x}_0 + b|
$$

即判别函数值的绝对值直接等于距离。

**例 3.2**：考虑二维空间中的超平面$2x_1 + x_2 - 2 = 0$。

- 权重向量：$\boldsymbol{w} = [2, 1]^{\top}$
- 偏置：$b = -2$
- 法向量的模：$\|\boldsymbol{w}\|_2 = \sqrt{4 + 1} = \sqrt{5}$
- 单位法向量：$\hat{\boldsymbol{w}} = \frac{1}{\sqrt{5}}[2, 1]^{\top}$

计算各点到超平面的距离：

| 点       | $f(\boldsymbol{x})$ | 距离                                                        | 类别   |
| -------- | ------------------- | ----------------------------------------------------------- | ------ |
| $(0, 0)$ | $-2$                | $\frac{|-2|}{\sqrt{5}} = \frac{2\sqrt{5}}{5} \approx 0.894$ | 负类   |
| $(1, 1)$ | $1$                 | $\frac{|1|}{\sqrt{5}} = \frac{\sqrt{5}}{5} \approx 0.447$   | 正类   |
| $(1, 0)$ | $0$                 | $0$                                                         | 边界上 |
| $(2, 2)$ | $4$                 | $\frac{4}{\sqrt{5}} = \frac{4\sqrt{5}}{5} \approx 1.789$    | 正类   |

#### 函数间隔与几何间隔

在分类问题中，我们不仅关心样本是否被正确分类，还关心分类的**置信度**。

函数间隔：给定超平面$(\boldsymbol{w}, b)$和样本点$(\boldsymbol{x}, y)$，其中$y \in \{-1, +1\}$，定义**函数间隔**（functional margin）为：

$$
\hat{\gamma} = y \cdot f(\boldsymbol{x}) = y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)
$$

**函数间隔的性质**：

- 当$\hat{\gamma} > 0$时，样本被**正确分类**
- 当$\hat{\gamma} < 0$时，样本被**错误分类**
- 当$\hat{\gamma} = 0$时，样本在**决策边界上**
- $|\hat{\gamma}|$越大，分类的**置信度越高**

**函数间隔的问题**：函数间隔依赖于$\boldsymbol{w}$的尺度。如果将$\boldsymbol{w}$和$b$同时乘以常数$k > 0$：

- 超平面不变（决策边界相同）
- 但函数间隔变为$k\hat{\gamma}$

这意味着我们可以通过简单的缩放使函数间隔任意大，因此函数间隔不是一个好的度量。

几何间隔：定义**几何间隔**（geometric margin）为：

$$
\gamma = \frac{y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}{\|\boldsymbol{w}\|_2} = \frac{\hat{\gamma}}{\|\boldsymbol{w}\|_2}
$$

**几何间隔的性质**：

- 几何间隔等于样本点到超平面的**有符号距离**（带正负号）
- 几何间隔**不随$\boldsymbol{w}$的尺度变化**而变化
- 几何间隔具有明确的**物理意义**：正确分类时为正的距离，错误分类时为负的距离

**验证尺度不变性**：将$(\boldsymbol{w}, b)$替换为$(k\boldsymbol{w}, kb)$，$k > 0$：

$$
\gamma' = \frac{y(k\boldsymbol{w}^{\top}\boldsymbol{x} + kb)}{\|k\boldsymbol{w}\|_2} = \frac{k \cdot y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}{|k| \cdot \|\boldsymbol{w}\|_2} = \frac{y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}{\|\boldsymbol{w}\|_2} = \gamma
$$

数据集的间隔：给定数据集$\mathcal{D} = \{(\boldsymbol{x}^{(n)}, y^{(n)})\}_{n=1}^N$，定义数据集相对于超平面$(\boldsymbol{w}, b)$的**间隔**为所有样本几何间隔的最小值：

$$
\gamma_{\mathcal{D}} = \min_{n=1,\ldots,N} \gamma^{(n)} = \min_{n=1,\ldots,N} \frac{y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b)}{\|\boldsymbol{w}\|_2}
$$

**解释**：数据集的间隔表示**最难分类的样本**（离决策边界最近的样本）到决策边界的距离。如果$\gamma_{\mathcal{D}} > 0$，则所有样本都被正确分类。

#### 线性可分性

线性可分：给定数据集$\mathcal{D} = \{(\boldsymbol{x}^{(n)}, y^{(n)})\}_{n=1}^N$，其中$y^{(n)} \in \{-1, +1\}$。如果存在超平面$(\boldsymbol{w}, b)$使得：

$$
y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) > 0, \quad \forall n = 1, \ldots, N
$$

则称数据集是**线性可分**（linearly separable）的。

**等价表述**：

- 存在超平面能够将正类样本和负类样本完全分开
- 数据集的间隔$\gamma_{\mathcal{D}} > 0$

凸包：点集$\mathcal{S} = \{\boldsymbol{x}^{(1)}, \ldots, \boldsymbol{x}^{(m)}\}$的**凸包**（convex hull）定义为：

$$
\text{conv}(\mathcal{S}) = \left\{ \sum_{i=1}^{m} \lambda_i \boldsymbol{x}^{(i)} \mid \lambda_i \geq 0, \sum_{i=1}^{m} \lambda_i = 1 \right\}
$$

即所有点的凸组合构成的集合。

线性可分的几何刻画：数据集$\mathcal{D}$线性可分，当且仅当正类样本集合的凸包与负类样本集合的凸包**不相交**。

$$
\text{conv}(\{\boldsymbol{x}^{(n)} \mid y^{(n)} = +1\}) \cap \text{conv}(\{\boldsymbol{x}^{(n)} \mid y^{(n)} = -1\}) = \emptyset
$$

线性不可分的例子——XOR问题：

考虑以下四个样本：

- $(0, 0), y = -1$
- $(1, 1), y = -1$
- $(0, 1), y = +1$
- $(1, 0), y = +1$

正类凸包是连接$(0,1)$和$(1,0)$的线段。
负类凸包是连接$(0,0)$和$(1,1)$的线段。
这两条线段在点$(0.5, 0.5)$相交，因此数据线性不可分。

这就是著名的**XOR问题**，它说明了单层感知器的局限性，也是促使多层神经网络发展的重要动力。

### 1.2 多分类

当类别数$C > 2$时，我们需要将二分类方法扩展到多分类问题。

####  多分类问题的形式化

**问题设定**：给定输入$\boldsymbol{x} \in \mathbb{R}^D$，预测其类别标签$y \in \{1, 2, \ldots, C\}$。

**方法分类**：

1. **分解法**：将多分类问题分解为多个二分类问题
2. **直接法**：直接建立多类判别函数

#### 一对其余（One-vs-Rest, OvR）

**又称**：One-vs-All (OvA)

**基本思想**：为每个类别$c$训练一个二分类器，判断样本是否属于类别$c$。

**具体方法**：

对于类别$c = 1, 2, \ldots, C$，构建训练集：

- **正类**：所有标签为$c$的样本，标记为$+1$
- **负类**：所有标签不为$c$的样本，标记为$-1$

训练得到$C$个二分类器：
$$
f_c(\boldsymbol{x}) = \boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c, \quad c = 1, 2, \ldots, C
$$

**预测规则**：
$$
\hat{y} = \arg\max_{c \in \{1, 2, \ldots, C\}} f_c(\boldsymbol{x})
$$

**算法 3.1**：OvR多分类

```
训练阶段：
for c = 1 to C do
    构建二分类数据集：
        正类：{x^(n) | y^(n) = c}
        负类：{x^(n) | y^(n) ≠ c}
    训练二分类器 f_c(x) = w_c^T x + b_c
end for

预测阶段：
输入：新样本 x
输出：ŷ = argmax_c f_c(x)
```

**优点**：

- 实现简单
- 只需训练$C$个分类器，复杂度较低
- 每个分类器可以独立训练，便于并行化

**缺点**：

- **类别不平衡**：每个二分类器中负类样本远多于正类（比例约为$(C-1):1$）
- **分数不可比**：不同分类器的输出可能不具有可比性
- **模糊区域**：可能存在多个分类器都给出正预测或都给出负预测的情况

**处理类别不平衡**：

- 对负类进行下采样
- 对正类进行上采样
- 使用类别权重调整损失函数

#### 一对一（One-vs-One, OvO）

**基本思想**：为每两个类别训练一个二分类器。

**具体方法**：

对于类别对$(i, j)$，其中$1 \leq i < j \leq C$，构建训练集：

- **正类**：所有标签为$i$的样本
- **负类**：所有标签为$j$的样本

共训练：
$$
\binom{C}{2} = \frac{C(C-1)}{2}
$$
个二分类器。

**预测规则（投票法）**：

对于新样本$\boldsymbol{x}$，每个分类器$f_{ij}$投票给预测的类别：

- 如果$f_{ij}(\boldsymbol{x}) > 0$，类别$i$获得一票
- 如果$f_{ij}(\boldsymbol{x}) < 0$，类别$j$获得一票

最终预测：
$$
\hat{y} = \arg\max_{c \in \{1, 2, \ldots, C\}} \text{votes}(c)
$$

**算法 3.2**：OvO多分类

```
训练阶段：
for i = 1 to C-1 do
    for j = i+1 to C do
        构建二分类数据集：
            正类：{x^(n) | y^(n) = i}
            负类：{x^(n) | y^(n) = j}
        训练二分类器 f_{ij}(x)
    end for
end for

预测阶段：
输入：新样本 x
初始化：votes[1..C] = 0
for i = 1 to C-1 do
    for j = i+1 to C do
        if f_{ij}(x) > 0 then
            votes[i] += 1
        else
            votes[j] += 1
        end if
    end for
end for
输出：ŷ = argmax_c votes[c]
```

**优点**：

- 每个分类器只使用两个类别的数据，**训练更快**
- 类别**平衡性较好**
- 对于某些算法（如SVM），OvO的总训练时间可能比OvR更短

**缺点**：

- 需要训练$O(C^2)$个分类器，类别数多时**存储开销大**
- 预测时需要运行$O(C^2)$个分类器，**预测较慢**
- 投票可能产生**平局**

**处理平局**：

- 随机选择一个得票最多的类别
- 使用分类器输出的绝对值作为置信度进行加权投票
- 引入额外的规则打破平局

#### 多类线性判别函数（直接法）

**基本思想**：直接定义$C$个线性判别函数，每个类别一个。

**模型定义**：

$$
f_c(\boldsymbol{x}) = \boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c, \quad c = 1, 2, \ldots, C
$$

**矩阵形式**：设：

$$
\boldsymbol{W} = [\boldsymbol{w}_1, \boldsymbol{w}_2, \ldots, \boldsymbol{w}_C] \in \mathbb{R}^{D \times C}
$$

$$
\boldsymbol{b} = [b_1, b_2, \ldots, b_C]^{\top} \in \mathbb{R}^C
$$

则所有判别函数值可以表示为：

$$
\boldsymbol{f}(\boldsymbol{x}) = \boldsymbol{W}^{\top}\boldsymbol{x} + \boldsymbol{b} \in \mathbb{R}^C
$$

**预测规则**：

$$
\hat{y} = \arg\max_{c \in \{1, 2, \ldots, C\}} f_c(\boldsymbol{x})
$$

#### 多类决策边界分析

类别$i$和类别$j$之间的决策边界是满足$f_i(\boldsymbol{x}) = f_j(\boldsymbol{x})$的点的集合：

$$
\mathcal{B}_{ij} = \{\boldsymbol{x} \mid f_i(\boldsymbol{x}) = f_j(\boldsymbol{x})\}
$$

$$
= \{\boldsymbol{x} \mid (\boldsymbol{w}_i - \boldsymbol{w}_j)^{\top}\boldsymbol{x} + (b_i - b_j) = 0\}
$$

这仍然是一个**超平面**，法向量为$\boldsymbol{w}_i - \boldsymbol{w}_j$。

**推论**：多类线性分类器的所有决策边界都是超平面，共有$\binom{C}{2}$个成对边界。

决策区域：类别$c$的决策区域为：

$$
\mathcal{R}_c = \{\boldsymbol{x} \mid f_c(\boldsymbol{x}) > f_j(\boldsymbol{x}), \forall j \neq c\}
$$

$$
= \bigcap_{j \neq c} \{\boldsymbol{x} \mid (\boldsymbol{w}_c - \boldsymbol{w}_j)^{\top}\boldsymbol{x} + (b_c - b_j) > 0\}
$$

多类线性分类器的决策区域$\mathcal{R}_c$是**凸多面体**（convex polytope）。

**证明**：每个决策区域$\mathcal{R}_c$是$C-1$个半空间的交集：

$$
\mathcal{R}_c = \bigcap_{j \neq c} H_{cj}^{+}
$$

其中$H_{cj}^{+} = \{\boldsymbol{x} \mid (\boldsymbol{w}_c - \boldsymbol{w}_j)^{\top}\boldsymbol{x} + (b_c - b_j) > 0\}$是一个开半空间。

半空间是凸集，凸集的交集仍是凸集，因此$\mathcal{R}_c$是凸集。

具体地，它是由有限个半空间界定的凸多面体。$\square$

**几何直观**：

- 每个类别的决策区域是一个"楔形"或"锥形"区域
- 所有决策区域的并集覆盖整个特征空间
- 决策区域两两之间只通过边界相邻

#### 参数冗余性

**观察**：在多类线性判别函数中，存在参数冗余。

平移不变性：如果将所有权重向量和偏置同时加上相同的量：

$$
\tilde{\boldsymbol{w}}_c = \boldsymbol{w}_c + \boldsymbol{v}, \quad \tilde{b}_c = b_c + \beta, \quad \forall c
$$

则分类决策不变。

**证明**：

$$
\tilde{f}_c(\boldsymbol{x}) = \tilde{\boldsymbol{w}}_c^{\top}\boldsymbol{x} + \tilde{b}_c
$$

$$
= (\boldsymbol{w}_c + \boldsymbol{v})^{\top}\boldsymbol{x} + (b_c + \beta)
$$

$$
= \boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c + \boldsymbol{v}^{\top}\boldsymbol{x} + \beta
$$

$$
= f_c(\boldsymbol{x}) + (\boldsymbol{v}^{\top}\boldsymbol{x} + \beta)
$$

由于$\boldsymbol{v}^{\top}\boldsymbol{x} + \beta$对所有类别$c$相同，因此：

$$
\arg\max_c \tilde{f}_c(\boldsymbol{x}) = \arg\max_c [f_c(\boldsymbol{x}) + (\boldsymbol{v}^{\top}\boldsymbol{x} + \beta)] = \arg\max_c f_c(\boldsymbol{x})
$$

**消除冗余的方法**：

**方法一**：设置某一类（通常是最后一类$C$）的参数为零：
$$
\boldsymbol{w}_C = \boldsymbol{0}, \quad b_C = 0
$$

这样只需学习$C-1$个权重向量和偏置，总参数量从$C(D+1)$减少到$(C-1)(D+1)$。

**方法二**：添加约束条件：
$$
\sum_{c=1}^{C} \boldsymbol{w}_c = \boldsymbol{0}, \quad \sum_{c=1}^{C} b_c = 0
$$

**在Softmax回归中的应用**：Softmax回归中常用方法一，将最后一类的参数设为零作为参考类别。

## 2 Logistic回归

Logistic回归（Logistic Regression）是一种广泛使用的线性分类模型。尽管名称中包含"回归"，但它实际上是一种**分类方法**。Logistic回归的核心思想是使用Sigmoid函数将线性判别函数的输出转换为概率值，从而实现概率化的分类预测。



#### 为什么不能直接用线性函数分类？

考虑二分类问题，标签$y \in \{0, 1\}$。如果直接使用线性函数$f(\boldsymbol{x}) = \boldsymbol{w}^{\top}\boldsymbol{x} + b$预测$y$，存在以下问题：

**问题一：输出范围不受限**

- 线性函数$f(\boldsymbol{x})$可以是任意实数$(-\infty, +\infty)$
- 但标签$y$只能是$0$或$1$
- 无法直接将线性输出解释为类别

**问题二：无法给出概率解释**

- 我们希望模型输出"样本属于某类的概率"
- 概率值必须在$[0, 1]$范围内
- 线性函数无法满足这一要求

**问题三：对离群点敏感**

- 如果使用最小二乘法拟合
- 远离决策边界的点会对决策边界产生过大影响
- 导致分类效果不佳

**解决方案**：引入一个将$\mathbb{R}$映射到$(0, 1)$的**激活函数**，将线性输出转换为概率。

#### 激活函数的选择

理想的激活函数$\sigma: \mathbb{R} \rightarrow (0, 1)$应满足：

1. **值域为$(0, 1)$**：输出可解释为概率
2. **单调递增**：输入越大，正类概率越高
3. **平滑可微**：便于使用梯度优化方法
4. **计算简单**：便于实际应用

Sigmoid函数完美满足这些要求。

### 2.1 Sigmoid函数

#### 定义与基本形式

Sigmoid函数：Sigmoid函数，也称为**Logistic函数**或**S形函数**，定义为：

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

**等价形式**：

$$
\sigma(z) = \frac{e^z}{1 + e^z} = \frac{e^z}{e^z + 1}
$$

**验证等价性**：
$$
\frac{1}{1 + e^{-z}} = \frac{1}{1 + e^{-z}} \cdot \frac{e^z}{e^z} = \frac{e^z}{e^z + 1}
$$

#### 图像特征

Sigmoid函数的图像呈**S形曲线**：

| 特征          | 描述                                 |
| ------------- | ------------------------------------ |
| 定义域        | $(-\infty, +\infty)$                 |
| 值域          | $(0, 1)$（开区间，不包含0和1）       |
| 单调性        | 严格单调递增                         |
| 对称中心      | 点$(0, 0.5)$                         |
| $z = 0$处的值 | $\sigma(0) = 0.5$                    |
| 左极限        | $\lim_{z \to -\infty} \sigma(z) = 0$ |
| 右极限        | $\lim_{z \to +\infty} \sigma(z) = 1$ |
| 拐点          | $z = 0$，此处曲率最大                |

#### 重要性质

对称性/互补性：

$$
\sigma(-z) = 1 - \sigma(z)
$$

**详细证明**：
$$
\sigma(-z) = \frac{1}{1 + e^{-(-z)}} = \frac{1}{1 + e^{z}}
$$

$$
1 - \sigma(z) = 1 - \frac{1}{1 + e^{-z}} = \frac{1 + e^{-z} - 1}{1 + e^{-z}} = \frac{e^{-z}}{1 + e^{-z}}
$$

$$
= \frac{e^{-z}}{1 + e^{-z}} \cdot \frac{e^z}{e^z} = \frac{1}{e^z + 1} = \frac{1}{1 + e^z}
$$

因此$\sigma(-z) = 1 - \sigma(z)$。

**几何意义**：Sigmoid曲线关于点$(0, 0.5)$中心对称。

导数的优美形式：
$$
\sigma'(z) = \sigma(z)(1 - \sigma(z))
$$

**详细证明**：

使用商法则，设$u = 1$，$v = 1 + e^{-z}$：

$$
\sigma'(z) = \frac{d}{dz}\left(\frac{1}{1 + e^{-z}}\right) = -\frac{1}{(1 + e^{-z})^2} \cdot \frac{d}{dz}(1 + e^{-z})
$$

$$
= -\frac{1}{(1 + e^{-z})^2} \cdot (-e^{-z}) = \frac{e^{-z}}{(1 + e^{-z})^2}
$$

将其改写为$\sigma(z)$和$1-\sigma(z)$的乘积：

$$
\sigma(z) = \frac{1}{1 + e^{-z}}
$$

$$
1 - \sigma(z) = \frac{e^{-z}}{1 + e^{-z}}
$$

$$
\sigma(z)(1 - \sigma(z)) = \frac{1}{1 + e^{-z}} \cdot \frac{e^{-z}}{1 + e^{-z}} = \frac{e^{-z}}{(1 + e^{-z})^2}
$$

因此$\sigma'(z) = \sigma(z)(1 - \sigma(z))$。

**导数的性质**：

- $\sigma'(z) > 0$对所有$z$成立（单调递增）
- $\sigma'(z)$的最大值在$z = 0$处取得：$\sigma'(0) = 0.5 \times 0.5 = 0.25$
- 当$|z|$很大时，$\sigma'(z) \approx 0$（**梯度消失**）

逆函数——logit函数：

Sigmoid函数的逆函数称为**logit函数**：

$$
\sigma^{-1}(p) = \text{logit}(p) = \log\frac{p}{1-p}
$$

其中$p \in (0, 1)$。

**验证**：设$p = \sigma(z)$，则：
$$
\frac{p}{1-p} = \frac{\sigma(z)}{1-\sigma(z)} = \frac{\frac{1}{1+e^{-z}}}{\frac{e^{-z}}{1+e^{-z}}} = \frac{1}{e^{-z}} = e^z
$$

$$
\log\frac{p}{1-p} = \log e^z = z
$$

因此$\text{logit}(\sigma(z)) = z$。$\square$

与双曲正切函数的关系：

$$
\sigma(z) = \frac{1 + \tanh(z/2)}{2}
$$

或等价地：

$$
\tanh(z) = 2\sigma(2z) - 1
$$

### 2.2 Logistic回归模型

#### 模型定义

Logistic回归模型：Logistic回归模型定义样本$\boldsymbol{x}$属于**类别1**的条件概率为：

$$
P(y = 1 \mid \boldsymbol{x}; \boldsymbol{w}, b) = \sigma(\boldsymbol{w}^{\top}\boldsymbol{x} + b) = \frac{1}{1 + e^{-(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}}
$$

相应地，属于**类别0**的概率为：

$$
P(y = 0 \mid \boldsymbol{x}; \boldsymbol{w}, b) = 1 - \sigma(\boldsymbol{w}^{\top}\boldsymbol{x} + b) = \frac{e^{-(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}}{1 + e^{-(\boldsymbol{w}^{\top}\boldsymbol{x} + b)}}
$$

**统一表达式**（伯努利分布形式）：

$$
P(y \mid \boldsymbol{x}; \boldsymbol{w}, b) = \sigma(\boldsymbol{w}^{\top}\boldsymbol{x} + b)^y \cdot (1 - \sigma(\boldsymbol{w}^{\top}\boldsymbol{x} + b))^{1-y}
$$

其中$y \in \{0, 1\}$。

**简化记号**：令$\hat{y} = \sigma(\boldsymbol{w}^{\top}\boldsymbol{x} + b)$表示预测的正类概率，令$z = \boldsymbol{w}^{\top}\boldsymbol{x} + b$，则：

$$
\hat{y} = \sigma(z) = P(y = 1 \mid \boldsymbol{x})
$$

$$
P(y \mid \boldsymbol{x}) = \hat{y}^y (1 - \hat{y})^{1-y}
$$

#### 决策规则

**概率阈值决策**：

$$
\hat{y}_{\text{class}} = \begin{cases}
1, & \text{if } P(y = 1 \mid \boldsymbol{x}) \geq \theta \\
0, & \text{if } P(y = 1 \mid \boldsymbol{x}) < \theta
\end{cases}
$$

其中$\theta \in (0, 1)$是决策阈值，通常取$\theta = 0.5$。

**当$\theta = 0.5$时**：

$$
P(y = 1 \mid \boldsymbol{x}) \geq 0.5 \Leftrightarrow \sigma(z) \geq 0.5 \Leftrightarrow z \geq 0 \Leftrightarrow \boldsymbol{w}^{\top}\boldsymbol{x} + b \geq 0
$$

因此决策规则等价于：

$$
\hat{y}_{\text{class}} = \mathbb{I}(\boldsymbol{w}^{\top}\boldsymbol{x} + b \geq 0)
$$

这与线性分类器的决策规则一致。

### 2.3 对数几率（Log-Odds）解释

Logistic回归有一个非常优雅的概率解释，揭示了模型的本质。

#### 几率与对数几率

几率：事件发生的**几率**（odds）定义为该事件发生概率与不发生概率之比：

$$
\text{odds} = \frac{P(y = 1 \mid \boldsymbol{x})}{P(y = 0 \mid \boldsymbol{x})} = \frac{P(y = 1 \mid \boldsymbol{x})}{1 - P(y = 1 \mid \boldsymbol{x})}
$$

**几率的直观理解**：

- $\text{odds} = 1$：正负类等可能
- $\text{odds} = 2$：正类概率是负类的2倍（正类概率$\frac{2}{3}$）
- $\text{odds} = 9$：正类概率是负类的9倍（正类概率$\frac{9}{10}$）

对数几率：**对数几率**（log-odds），也称为**logit**，是几率的自然对数：

$$
\text{logit}(p) = \log \frac{p}{1-p}
$$

其中$p = P(y = 1 \mid \boldsymbol{x})$。

#### 核心定理

Logistic回归的对数几率线性性：在Logistic回归模型中，对数几率是输入特征的**线性函数**：

$$
\log \frac{P(y = 1 \mid \boldsymbol{x})}{P(y = 0 \mid \boldsymbol{x})} = \boldsymbol{w}^{\top}\boldsymbol{x} + b
$$

**详细证明**：

设$p = P(y = 1 \mid \boldsymbol{x}) = \sigma(z)$，其中$z = \boldsymbol{w}^{\top}\boldsymbol{x} + b$。

$$
\log \frac{p}{1-p} = \log \frac{\sigma(z)}{1 - \sigma(z)}
$$

代入$\sigma(z) = \frac{1}{1+e^{-z}}$和$1 - \sigma(z) = \frac{e^{-z}}{1+e^{-z}}$：

$$
= \log \frac{\frac{1}{1+e^{-z}}}{\frac{e^{-z}}{1+e^{-z}}} = \log \frac{1}{e^{-z}} = \log e^z = z = \boldsymbol{w}^{\top}\boldsymbol{x} + b
$$



#### 参数的解释

**定理 3.9**（权重的对数几率解释）：权重$w_d$表示特征$x_d$**增加一个单位**时，**对数几率的变化量**。

**证明**：设$\boldsymbol{x}' = \boldsymbol{x} + \boldsymbol{e}_d$，其中$\boldsymbol{e}_d$是第$d$个坐标为1、其余为0的单位向量。则：

$$
\log \frac{P(y=1 \mid \boldsymbol{x}')}{P(y=0 \mid \boldsymbol{x}')} - \log \frac{P(y=1 \mid \boldsymbol{x})}{P(y=0 \mid \boldsymbol{x})}
$$

$$
= (\boldsymbol{w}^{\top}\boldsymbol{x}' + b) - (\boldsymbol{w}^{\top}\boldsymbol{x} + b) = \boldsymbol{w}^{\top}(\boldsymbol{x}' - \boldsymbol{x}) = \boldsymbol{w}^{\top}\boldsymbol{e}_d = w_d
$$



几率比解释：特征$x_d$增加一个单位时，几率变为原来的$e^{w_d}$倍。

**证明**：
$$
\frac{\text{odds}'}{\text{odds}} = \exp\left(\log \text{odds}' - \log \text{odds}\right) = \exp(w_d) = e^{w_d}
$$


医学诊断：假设Logistic回归模型预测患病概率，特征$x_1$表示年龄（岁），对应权重$w_1 = 0.05$。

- **对数几率解释**：年龄每增加1岁，患病的对数几率增加0.05
- **几率比解释**：年龄每增加1岁，患病几率变为原来的$e^{0.05} \approx 1.051$倍，即增加约5.1%
- **10年效应**：年龄增加10岁，几率变为原来的$e^{0.5} \approx 1.649$倍，即增加约65%

### 2.4 广义线性模型视角

Logistic回归可以从**广义线性模型**（Generalized Linear Model, GLM）的框架来理解。

#### GLM的三要素

广义线性模型由三个部分组成：

**1. 随机成分（Random Component）**：响应变量$y$服从指数族分布。

**2. 系统成分（Systematic Component）**：线性预测子$\eta = \boldsymbol{w}^{\top}\boldsymbol{x} + b$。

**3. 连接函数（Link Function）**：将期望$\mu = E[y \mid \boldsymbol{x}]$与线性预测子联系起来：$g(\mu) = \eta$。

#### Logistic回归作为GLM

对于Logistic回归：

**随机成分**：$y \mid \boldsymbol{x} \sim \text{Bernoulli}(p)$，即伯努利分布，其中$p = P(y = 1 \mid \boldsymbol{x})$。

伯努利分布的概率质量函数：
$$
P(y \mid p) = p^y (1-p)^{1-y}, \quad y \in \{0, 1\}
$$

可以写成指数族形式：
$$
P(y \mid p) = \exp\left(y \log\frac{p}{1-p} + \log(1-p)\right)
$$

**系统成分**：$\eta = \boldsymbol{w}^{\top}\boldsymbol{x} + b$

**连接函数**：logit连接
$$
g(\mu) = \text{logit}(\mu) = \log\frac{\mu}{1-\mu}
$$

由于$\mu = E[y] = p$，连接函数将概率$p$映射到线性预测子$\eta$。

**典则连接**：logit是伯努利分布的**典则连接函数**（canonical link function），这使得Logistic回归具有一些优良的统计性质。

### 2.5 参数学习

#### 最大似然估计框架

给定训练数据集$\mathcal{D} = \{(\boldsymbol{x}^{(n)}, y^{(n)})\}_{n=1}^{N}$，其中$y^{(n)} \in \{0, 1\}$，我们使用**最大似然估计**（Maximum Likelihood Estimation, MLE）来学习参数$(\boldsymbol{w}, b)$。

**假设**：样本独立同分布（i.i.d.）。

#### 似然函数的推导

似然函数：参数的似然函数定义为观测数据出现的概率：

$$
L(\boldsymbol{w}, b) = P(\mathcal{D} \mid \boldsymbol{w}, b) = \prod_{n=1}^{N} P(y^{(n)} \mid \boldsymbol{x}^{(n)}; \boldsymbol{w}, b)
$$

代入Logistic回归的概率模型：

$$
L(\boldsymbol{w}, b) = \prod_{n=1}^{N} \hat{y}^{(n)^{y^{(n)}}} (1 - \hat{y}^{(n)})^{1 - y^{(n)}}
$$

其中$\hat{y}^{(n)} = \sigma(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b)$。

**展开形式**：

$$
L(\boldsymbol{w}, b) = \prod_{n: y^{(n)}=1} \hat{y}^{(n)} \cdot \prod_{n: y^{(n)}=0} (1 - \hat{y}^{(n)})
$$

#### 对数似然函数

取对数得到**对数似然函数**（log-likelihood）：

$$
\ell(\boldsymbol{w}, b) = \log L(\boldsymbol{w}, b)
$$

$$
= \sum_{n=1}^{N} \left[ y^{(n)} \log \hat{y}^{(n)} + (1 - y^{(n)}) \log(1 - \hat{y}^{(n)}) \right]
$$

**记号简化**：令$z^{(n)} = \boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b$，则$\hat{y}^{(n)} = \sigma(z^{(n)})$。

利用$\log \sigma(z) = z - \log(1 + e^z) = -\log(1 + e^{-z})$和$\log(1 - \sigma(z)) = -\log(1 + e^z)$：

$$
\ell(\boldsymbol{w}, b) = \sum_{n=1}^{N} \left[ -y^{(n)} \log(1 + e^{-z^{(n)}}) - (1 - y^{(n)}) \log(1 + e^{z^{(n)}}) \right]
$$

**进一步简化**：注意$\log(1 + e^z) = z + \log(1 + e^{-z})$，可得：

$$
\ell(\boldsymbol{w}, b) = \sum_{n=1}^{N} \left[ y^{(n)} z^{(n)} - \log(1 + e^{z^{(n)}}) \right]
$$

#### 交叉熵损失函数

交叉熵：对于两个概率分布$p$（真实分布）和$q$（预测分布），它们的**交叉熵**（cross-entropy）定义为：

$$
H(p, q) = -\sum_x p(x) \log q(x) = -E_{p}[\log q]
$$

对于二分类问题：

- 真实分布$p$：$P(y=1) = y$，$P(y=0) = 1-y$（one-hot编码）
- 预测分布$q$：$P(y=1) = \hat{y}$，$P(y=0) = 1-\hat{y}$

二元交叉熵损失：单个样本的**二元交叉熵损失**（Binary Cross-Entropy Loss，BCE）定义为：

$$
\mathcal{L}_{\text{BCE}}(\hat{y}, y) = -[y \log \hat{y} + (1-y) \log(1-\hat{y})]
$$

**数据集上的平均损失**：

$$
\mathcal{L}(\boldsymbol{w}, b) = \frac{1}{N} \sum_{n=1}^{N} \mathcal{L}_{\text{BCE}}(\hat{y}^{(n)}, y^{(n)})
$$

$$
= -\frac{1}{N} \sum_{n=1}^{N} \left[ y^{(n)} \log \hat{y}^{(n)} + (1 - y^{(n)}) \log(1 - \hat{y}^{(n)}) \right]
$$

**关系**：

$$
\mathcal{L}(\boldsymbol{w}, b) = -\frac{1}{N} \ell(\boldsymbol{w}, b)
$$

因此：
$$
\arg\max_{\boldsymbol{w}, b} \ell(\boldsymbol{w}, b) = \arg\min_{\boldsymbol{w}, b} \mathcal{L}(\boldsymbol{w}, b)
$$

**最大化对数似然 $\Leftrightarrow$ 最小化交叉熵损失**

#### 梯度的详细推导

为了使用梯度下降法优化参数，我们需要计算损失函数（或对数似然函数）关于参数的梯度。

设$z = \boldsymbol{w}^{\top}\boldsymbol{x} + b$，$\hat{y} = \sigma(z)$，则：

$$
\frac{\partial \hat{y}}{\partial z} = \hat{y}(1 - \hat{y})
$$

$$
\frac{\partial z}{\partial \boldsymbol{w}} = \boldsymbol{x}, \quad \frac{\partial z}{\partial b} = 1
$$

对数似然函数关于参数的梯度为：

$$
\frac{\partial \ell}{\partial \boldsymbol{w}} = \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
\frac{\partial \ell}{\partial b} = \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)})
$$

**详细证明**：

对于单个样本$(\boldsymbol{x}, y)$，其对数似然为：

$$
\ell = y \log \hat{y} + (1-y) \log(1-\hat{y})
$$

**Step 1**：计算$\frac{\partial \ell}{\partial \hat{y}}$

$$
\frac{\partial \ell}{\partial \hat{y}} = \frac{y}{\hat{y}} - \frac{1-y}{1-\hat{y}}
$$

通分：
$$
= \frac{y(1-\hat{y}) - (1-y)\hat{y}}{\hat{y}(1-\hat{y})} = \frac{y - y\hat{y} - \hat{y} + y\hat{y}}{\hat{y}(1-\hat{y})} = \frac{y - \hat{y}}{\hat{y}(1-\hat{y})}
$$

**Step 2**：计算$\frac{\partial \hat{y}}{\partial z}$

由Sigmoid函数的导数性质：
$$
\frac{\partial \hat{y}}{\partial z} = \sigma'(z) = \sigma(z)(1-\sigma(z)) = \hat{y}(1-\hat{y})
$$

**Step 3**：应用链式法则计算$\frac{\partial \ell}{\partial z}$

$$
\frac{\partial \ell}{\partial z} = \frac{\partial \ell}{\partial \hat{y}} \cdot \frac{\partial \hat{y}}{\partial z} = \frac{y - \hat{y}}{\hat{y}(1-\hat{y})} \cdot \hat{y}(1-\hat{y}) = y - \hat{y}
$$

**关键观察**：梯度形式非常简洁！$\frac{\partial \ell}{\partial z} = y - \hat{y}$，即**真实标签与预测概率之差**。

**Step 4**：计算$\frac{\partial \ell}{\partial \boldsymbol{w}}$和$\frac{\partial \ell}{\partial b}$

$$
\frac{\partial \ell}{\partial \boldsymbol{w}} = \frac{\partial \ell}{\partial z} \cdot \frac{\partial z}{\partial \boldsymbol{w}} = (y - \hat{y}) \boldsymbol{x}
$$

$$
\frac{\partial \ell}{\partial b} = \frac{\partial \ell}{\partial z} \cdot \frac{\partial z}{\partial b} = (y - \hat{y}) \cdot 1 = y - \hat{y}
$$

**Step 5**：对所有样本求和

$$
\frac{\partial \ell}{\partial \boldsymbol{w}} = \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
\frac{\partial \ell}{\partial b} = \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)})
$$



交叉熵损失函数的梯度为（带负号和$1/N$因子）：

$$
\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} = -\frac{1}{N}\sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)} = \frac{1}{N}\sum_{n=1}^{N} (\hat{y}^{(n)} - y^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
\frac{\partial \mathcal{L}}{\partial b} = \frac{1}{N}\sum_{n=1}^{N} (\hat{y}^{(n)} - y^{(n)})
$$

**向量化形式**：设$\boldsymbol{X} \in \mathbb{R}^{N \times D}$为数据矩阵，$\boldsymbol{y} \in \mathbb{R}^N$为标签向量，$\hat{\boldsymbol{y}} \in \mathbb{R}^N$为预测概率向量，则：

$$
\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} = \frac{1}{N} \boldsymbol{X}^{\top}(\hat{\boldsymbol{y}} - \boldsymbol{y})
$$

#### 梯度下降算法

**批量梯度下降（Batch Gradient Descent, BGD）**：

每次使用全部样本计算梯度并更新参数。

**更新规则**（最大化对数似然）：
$$
\boldsymbol{w} \leftarrow \boldsymbol{w} + \eta \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
b \leftarrow b + \eta \sum_{n=1}^{N} (y^{(n)} - \hat{y}^{(n)})
$$

其中$\eta > 0$是学习率。

Logistic回归的批量梯度下降

```
输入：训练集 D = {(x^(n), y^(n))}_{n=1}^N
      学习率 η > 0
      最大迭代次数 T
      收敛阈值 ε > 0
输出：参数 w, b

1.  初始化：w ← 0 ∈ R^D，b ← 0
2.  for t = 1 to T do
3.      // 前向传播：计算预测概率
4.      for n = 1 to N do
5.          z^(n) ← w^T x^(n) + b
6.          ŷ^(n) ← σ(z^(n)) = 1/(1 + exp(-z^(n)))
7.      end for
8.
9.      // 计算梯度
10.     g_w ← Σ_{n=1}^N (y^(n) - ŷ^(n)) x^(n)
11.     g_b ← Σ_{n=1}^N (y^(n) - ŷ^(n))
12.
13.     // 更新参数（梯度上升，最大化对数似然）
14.     w ← w + η · g_w
15.     b ← b + η · g_b
16.
17.     // 检查收敛
18.     if ||g_w||_2 < ε and |g_b| < ε then
19.         break
20.     end if
21. end for
22. return w, b
```

**随机梯度下降（Stochastic Gradient Descent, SGD）**：

每次只使用一个随机样本更新参数。

$$
\boldsymbol{w} \leftarrow \boldsymbol{w} + \eta (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
b \leftarrow b + \eta (y^{(n)} - \hat{y}^{(n)})
$$

**优点**：

- 每次更新计算量小，$O(D)$
- 可以处理大规模数据
- 引入噪声有助于跳出局部最优

**缺点**：

- 收敛不稳定，需要精心调节学习率
- 难以利用向量化加速

**小批量梯度下降（Mini-batch Gradient Descent）**：

折中方案，每次使用一小批样本（batch）。

设批量大小为$B$，第$t$次迭代选取的小批量索引集合为$\mathcal{B}_t$：

$$
\boldsymbol{w} \leftarrow \boldsymbol{w} + \frac{\eta}{B} \sum_{n \in \mathcal{B}_t} (y^{(n)} - \hat{y}^{(n)}) \boldsymbol{x}^{(n)}
$$

**典型批量大小**：32, 64, 128, 256

#### 牛顿法与IRLS

由于Logistic回归的损失函数是凸的且二阶可微，可以使用**牛顿法**（Newton's Method）加速收敛。

**Hessian矩阵**：

对数似然函数关于$\boldsymbol{w}$的Hessian矩阵为：

$$
\boldsymbol{H} = \frac{\partial^2 \ell}{\partial \boldsymbol{w} \partial \boldsymbol{w}^{\top}} = -\sum_{n=1}^{N} \hat{y}^{(n)}(1 - \hat{y}^{(n)}) \boldsymbol{x}^{(n)} \boldsymbol{x}^{(n)\top}
$$

**推导**：
$$
\frac{\partial}{\partial w_j}\left(\frac{\partial \ell}{\partial w_i}\right) = \frac{\partial}{\partial w_j}\left(\sum_n (y^{(n)} - \hat{y}^{(n)}) x_i^{(n)}\right)
$$

$$
= -\sum_n x_i^{(n)} \frac{\partial \hat{y}^{(n)}}{\partial w_j} = -\sum_n x_i^{(n)} \hat{y}^{(n)}(1-\hat{y}^{(n)}) x_j^{(n)}
$$

**矩阵形式**：

$$
\boldsymbol{H} = -\boldsymbol{X}^{\top} \boldsymbol{S} \boldsymbol{X}
$$

其中$\boldsymbol{S} = \text{diag}(\hat{y}^{(1)}(1-\hat{y}^{(1)}), \ldots, \hat{y}^{(N)}(1-\hat{y}^{(N)}))$是对角矩阵。

**牛顿更新**：

$$
\boldsymbol{w} \leftarrow \boldsymbol{w} - \boldsymbol{H}^{-1} \nabla_{\boldsymbol{w}} \ell
$$

$$
= \boldsymbol{w} + (\boldsymbol{X}^{\top} \boldsymbol{S} \boldsymbol{X})^{-1} \boldsymbol{X}^{\top}(\boldsymbol{y} - \hat{\boldsymbol{y}})
$$

**IRLS算法**：**迭代重加权最小二乘**（Iteratively Reweighted Least Squares）是牛顿法在Logistic回归中的具体实现形式。

定义加权响应变量：
$$
\boldsymbol{z} = \boldsymbol{X}\boldsymbol{w} + \boldsymbol{S}^{-1}(\boldsymbol{y} - \hat{\boldsymbol{y}})
$$

则牛顿更新等价于求解加权最小二乘问题：
$$
\boldsymbol{w}^{\text{new}} = (\boldsymbol{X}^{\top}\boldsymbol{S}\boldsymbol{X})^{-1}\boldsymbol{X}^{\top}\boldsymbol{S}\boldsymbol{z}
$$

**收敛性**：牛顿法通常具有**二次收敛**速度，比梯度下降快得多，但每步计算量更大。

### 2.6 正则化

为了防止过拟合，通常在损失函数中加入正则化项。

#### L2正则化（Ridge）

**定义**：L2正则化在损失函数中加入权重的平方和：
$$
\mathcal{L}_{\text{reg}}(\boldsymbol{w}, b) = \mathcal{L}(\boldsymbol{w}, b) + \frac{\lambda}{2} \|\boldsymbol{w}\|_2^2
$$

$$
= -\frac{1}{N}\sum_{n=1}^{N} \left[ y^{(n)} \log \hat{y}^{(n)} + (1 - y^{(n)}) \log(1 - \hat{y}^{(n)}) \right] + \frac{\lambda}{2} \sum_{d=1}^{D} w_d^2
$$

其中$\lambda > 0$是正则化系数（超参数）。

**梯度**：

$$
\frac{\partial \mathcal{L}_{\text{reg}}}{\partial \boldsymbol{w}} = \frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} + \lambda \boldsymbol{w}
$$

**更新规则**：

$$
\boldsymbol{w} \leftarrow \boldsymbol{w} - \eta\left(\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} + \lambda \boldsymbol{w}\right) = \boldsymbol{w}(1 - \eta\lambda) - \eta\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}}
$$

注意因子$(1 - \eta\lambda)$，这就是**权重衰减**（weight decay）。

**效果**：

- 倾向于使权重较小
- 防止某些特征的权重过大
- 提高模型的泛化能力

#### L1正则化（Lasso）

**定义**：

$$
\mathcal{L}_{\text{reg}}(\boldsymbol{w}, b) = \mathcal{L}(\boldsymbol{w}, b) + \lambda \|\boldsymbol{w}\|_1 = \mathcal{L}(\boldsymbol{w}, b) + \lambda \sum_{d=1}^{D} |w_d|
$$

**效果**：

- 产生**稀疏解**，部分权重恰好为零
- 实现自动**特征选择**
- 在$w_d = 0$处不可微，需要使用次梯度或坐标下降

#### 弹性网（Elastic Net）

**定义**：结合L1和L2正则化：

$$
\mathcal{L}_{\text{reg}}(\boldsymbol{w}, b) = \mathcal{L}(\boldsymbol{w}, b) + \lambda_1 \|\boldsymbol{w}\|_1 + \frac{\lambda_2}{2} \|\boldsymbol{w}\|_2^2
$$

**优点**：

- 兼具L1的稀疏性和L2的稳定性
- 当特征高度相关时表现更好

### 2.7 Logistic回归的理论性质

#### 凸性

Logistic回归的交叉熵损失函数是关于参数$(\boldsymbol{w}, b)$的**凸函数**。

**证明**：只需证明Hessian矩阵是半正定的。

$$
\boldsymbol{H} = \frac{\partial^2 \mathcal{L}}{\partial \boldsymbol{w} \partial \boldsymbol{w}^{\top}} = \frac{1}{N} \sum_{n=1}^{N} \hat{y}^{(n)}(1 - \hat{y}^{(n)}) \boldsymbol{x}^{(n)} \boldsymbol{x}^{(n)\top}
$$

对任意向量$\boldsymbol{v} \in \mathbb{R}^D$：

$$
\boldsymbol{v}^{\top}\boldsymbol{H}\boldsymbol{v} = \frac{1}{N} \sum_{n=1}^{N} \hat{y}^{(n)}(1 - \hat{y}^{(n)}) (\boldsymbol{v}^{\top}\boldsymbol{x}^{(n)})^2
$$

由于：

- $\hat{y}^{(n)} \in (0, 1)$
- 因此$\hat{y}^{(n)}(1 - \hat{y}^{(n)}) > 0$
- $(\boldsymbol{v}^{\top}\boldsymbol{x}^{(n)})^2 \geq 0$

所以$\boldsymbol{v}^{\top}\boldsymbol{H}\boldsymbol{v} \geq 0$，Hessian矩阵半正定，损失函数是凸函数。

1. 局部最优解就是全局最优解
2. 梯度下降法保证收敛到全局最优

#### 解的唯一性

如果数据矩阵$\boldsymbol{X}$列满秩（即特征之间线性无关），则加了L2正则化的Logistic回归的最优解唯一。

**注意**：不加正则化时，如果数据线性可分，最优解可能不唯一（参数可以无限增大）。

## 3 Softmax回归

Softmax回归（Softmax Regression），又称**多项Logistic回归**（Multinomial Logistic Regression）或**多类Logistic回归**，是Logistic回归在多分类问题上的自然推广。

### 3.1 从二分类到多分类

#### 问题设定

**多分类问题**：给定输入$\boldsymbol{x} \in \mathbb{R}^D$，预测其类别标签$y \in \{1, 2, \ldots, C\}$，其中$C > 2$是类别数。

**目标**：学习一个模型，输出样本属于每个类别的概率分布：
$$
P(y = c \mid \boldsymbol{x}), \quad c = 1, 2, \ldots, C
$$

**约束**：输出必须是有效的概率分布

- $P(y = c \mid \boldsymbol{x}) \geq 0, \quad \forall c$
- $\sum_{c=1}^{C} P(y = c \mid \boldsymbol{x}) = 1$

#### 推广思路

在Logistic回归中，我们使用Sigmoid函数将单个线性输出转换为概率。对于多分类：

- 需要$C$个线性函数，每个类别一个
- 需要一个函数将$C$个实数转换为概率分布

**Softmax函数**正是这样的函数。

### 3.2 Softmax函数

#### 定义

Softmax函数：Softmax函数将$C$维向量$\boldsymbol{z} = [z_1, z_2, \ldots, z_C]^{\top} \in \mathbb{R}^C$映射为概率分布：

$$
\text{softmax}(\boldsymbol{z})_c = \frac{\exp(z_c)}{\sum_{j=1}^{C} \exp(z_j)}, \quad c = 1, 2, \ldots, C
$$

**向量形式**：
$$
\text{softmax}(\boldsymbol{z}) = \frac{\exp(\boldsymbol{z})}{\mathbf{1}^{\top}\exp(\boldsymbol{z})} = \frac{1}{\sum_{j=1}^{C} e^{z_j}} \begin{bmatrix} e^{z_1} \\ e^{z_2} \\ \vdots \\ e^{z_C} \end{bmatrix}
$$

其中$\exp(\boldsymbol{z})$表示逐元素指数运算。

#### 重要性质

概率分布性：Softmax的输出是有效的概率分布。

**证明**：

1. 非负性：$\exp(z_c) > 0$，且分母$\sum_j \exp(z_j) > 0$，因此$\text{softmax}(\boldsymbol{z})_c > 0$
2. 归一化：$\sum_{c=1}^{C} \text{softmax}(\boldsymbol{z})_c = \sum_{c=1}^{C} \frac{\exp(z_c)}{\sum_{j=1}^{C} \exp(z_j)} = \frac{\sum_{c=1}^{C} \exp(z_c)}{\sum_{j=1}^{C} \exp(z_j)} = 1$



平移不变性：对任意常数$a \in \mathbb{R}$：
$$
\text{softmax}(\boldsymbol{z} + a\mathbf{1}) = \text{softmax}(\boldsymbol{z})
$$

**证明**：
$$
\text{softmax}(\boldsymbol{z} + a\mathbf{1})_c = \frac{\exp(z_c + a)}{\sum_{j=1}^{C} \exp(z_j + a)} = \frac{e^a \exp(z_c)}{e^a \sum_{j=1}^{C} \exp(z_j)} = \frac{\exp(z_c)}{\sum_{j=1}^{C} \exp(z_j)}
$$


**应用**：在数值计算中，为避免指数溢出，通常减去最大值：
$$
\text{softmax}(\boldsymbol{z}) = \text{softmax}(\boldsymbol{z} - \max_j z_j \cdot \mathbf{1})
$$

与argmax的关系：
$$
\arg\max_c \text{softmax}(\boldsymbol{z})_c = \arg\max_c z_c
$$

Softmax保持了元素的相对大小关系。

温度参数：带温度参数$T > 0$的Softmax：

$$
\text{softmax}(\boldsymbol{z}/T)_c = \frac{\exp(z_c/T)}{\sum_{j=1}^{C} \exp(z_j/T)}
$$

- 当$T \to 0^+$时，Softmax趋近于**argmax**（硬选择）
- 当$T \to +\infty$时，Softmax趋近于**均匀分布**
- $T = 1$是标准Softmax

#### Softmax的导数

Softmax的Jacobian矩阵：设$\boldsymbol{p} = \text{softmax}(\boldsymbol{z})$，则：

$$
\frac{\partial p_i}{\partial z_j} = \begin{cases}
p_i(1 - p_i), & \text{if } i = j \\
-p_i p_j, & \text{if } i \neq j
\end{cases}
$$

**矩阵形式**：
$$
\frac{\partial \boldsymbol{p}}{\partial \boldsymbol{z}} = \text{diag}(\boldsymbol{p}) - \boldsymbol{p}\boldsymbol{p}^{\top}
$$

**证明**：

当$i = j$时：
$$
\frac{\partial p_i}{\partial z_i} = \frac{\partial}{\partial z_i}\left(\frac{e^{z_i}}{\sum_k e^{z_k}}\right)
$$

使用商法则：
$$
= \frac{e^{z_i} \cdot \sum_k e^{z_k} - e^{z_i} \cdot e^{z_i}}{(\sum_k e^{z_k})^2} = \frac{e^{z_i}}{\sum_k e^{z_k}} - \frac{e^{2z_i}}{(\sum_k e^{z_k})^2}
$$

$$
= p_i - p_i^2 = p_i(1 - p_i)
$$

当$i \neq j$时：
$$
\frac{\partial p_i}{\partial z_j} = \frac{\partial}{\partial z_j}\left(\frac{e^{z_i}}{\sum_k e^{z_k}}\right) = \frac{0 - e^{z_i} \cdot e^{z_j}}{(\sum_k e^{z_k})^2} = -p_i p_j
$$



### 3.3 Softmax回归模型

#### 模型定义

Softmax回归模型：Softmax回归为每个类别定义一个线性函数：

$$
z_c = \boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c, \quad c = 1, 2, \ldots, C
$$

然后通过Softmax函数转换为概率：

$$
P(y = c \mid \boldsymbol{x}; \boldsymbol{W}, \boldsymbol{b}) = \text{softmax}(\boldsymbol{z})_c = \frac{\exp(\boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c)}{\sum_{j=1}^{C} \exp(\boldsymbol{w}_j^{\top}\boldsymbol{x} + b_j)}
$$

**参数**：

- 权重矩阵：$\boldsymbol{W} = [\boldsymbol{w}_1, \boldsymbol{w}_2, \ldots, \boldsymbol{w}_C] \in \mathbb{R}^{D \times C}$
- 偏置向量：$\boldsymbol{b} = [b_1, b_2, \ldots, b_C]^{\top} \in \mathbb{R}^C$
- 总参数数量：$(D + 1) \times C$

**矩阵形式**：
$$
\boldsymbol{z} = \boldsymbol{W}^{\top}\boldsymbol{x} + \boldsymbol{b} \in \mathbb{R}^C
$$

$$
\boldsymbol{p} = \text{softmax}(\boldsymbol{z}) \in \mathbb{R}^C
$$

#### 3.3.3.2 参数冗余与消除

由于Softmax的平移不变性，参数存在冗余。

**消除冗余**：设$\boldsymbol{w}_C = \boldsymbol{0}$，$b_C = 0$（以第$C$类为参考类）。

则：
$$
P(y = c \mid \boldsymbol{x}) = \frac{\exp(\boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c)}{1 + \sum_{j=1}^{C-1} \exp(\boldsymbol{w}_j^{\top}\boldsymbol{x} + b_j)}, \quad c = 1, \ldots, C-1
$$

$$
P(y = C \mid \boldsymbol{x}) = \frac{1}{1 + \sum_{j=1}^{C-1} \exp(\boldsymbol{w}_j^{\top}\boldsymbol{x} + b_j)}
$$

参数数量减少为$(D + 1) \times (C - 1)$。

**与Logistic回归的关系**：当$C = 2$时，消除冗余后的Softmax回归退化为Logistic回归：
$$
P(y = 1 \mid \boldsymbol{x}) = \frac{\exp(\boldsymbol{w}_1^{\top}\boldsymbol{x} + b_1)}{1 + \exp(\boldsymbol{w}_1^{\top}\boldsymbol{x} + b_1)} = \sigma(\boldsymbol{w}_1^{\top}\boldsymbol{x} + b_1)
$$

### 3.4 参数学习

#### 标签编码

**One-hot编码**：将类别标签$y \in \{1, 2, \ldots, C\}$编码为向量$\boldsymbol{y} \in \{0, 1\}^C$：

$$
\boldsymbol{y} = [y_1, y_2, \ldots, y_C]^{\top}, \quad y_c = \begin{cases}
1, & \text{if } y = c \\
0, & \text{otherwise}
\end{cases}
$$

**例如**：对于3分类问题，类别2的one-hot编码为$\boldsymbol{y} = [0, 1, 0]^{\top}$。

#### 交叉熵损失函数

多类交叉熵损失：单个样本的交叉熵损失：

$$
\mathcal{L}(\boldsymbol{p}, \boldsymbol{y}) = -\sum_{c=1}^{C} y_c \log p_c = -\boldsymbol{y}^{\top} \log \boldsymbol{p}
$$

由于$\boldsymbol{y}$是one-hot向量，只有一个分量为1（设为第$c^*$类），因此：
$$
\mathcal{L}(\boldsymbol{p}, \boldsymbol{y}) = -\log p_{c^*} = -\log P(y = c^* \mid \boldsymbol{x})
$$

这就是**负对数似然**（Negative Log-Likelihood, NLL）。

**数据集上的平均损失**：

$$
\mathcal{L}(\boldsymbol{W}, \boldsymbol{b}) = -\frac{1}{N}\sum_{n=1}^{N}\sum_{c=1}^{C} y_c^{(n)} \log p_c^{(n)}
$$

$$
= -\frac{1}{N}\sum_{n=1}^{N} \log P(y = c^{(n)} \mid \boldsymbol{x}^{(n)})
$$

其中$c^{(n)}$是第$n$个样本的真实类别。

#### 梯度推导

交叉熵损失关于参数的梯度为：

$$
\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}_c} = \frac{1}{N}\sum_{n=1}^{N} (p_c^{(n)} - y_c^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
\frac{\partial \mathcal{L}}{\partial b_c} = \frac{1}{N}\sum_{n=1}^{N} (p_c^{(n)} - y_c^{(n)})
$$

**简洁形式**：对所有类别：
$$
\frac{\partial \mathcal{L}}{\partial \boldsymbol{W}} = \frac{1}{N} \boldsymbol{X}^{\top}(\boldsymbol{P} - \boldsymbol{Y})
$$

其中$\boldsymbol{X} \in \mathbb{R}^{N \times D}$是数据矩阵，$\boldsymbol{P}, \boldsymbol{Y} \in \mathbb{R}^{N \times C}$分别是预测概率矩阵和标签矩阵。

**证明**（单样本情况）：

设$\ell = -\sum_c y_c \log p_c$，$p_c = \text{softmax}(\boldsymbol{z})_c$，$z_c = \boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c$。

**Step 1**：计算$\frac{\partial \ell}{\partial z_k}$

$$
\frac{\partial \ell}{\partial z_k} = -\sum_c y_c \frac{1}{p_c} \frac{\partial p_c}{\partial z_k}
$$

利用Softmax的导数：
$$
\frac{\partial p_c}{\partial z_k} = p_c(\delta_{ck} - p_k)
$$

其中$\delta_{ck}$是Kronecker delta。

$$
\frac{\partial \ell}{\partial z_k} = -\sum_c y_c \frac{p_c(\delta_{ck} - p_k)}{p_c} = -\sum_c y_c(\delta_{ck} - p_k)
$$

$$
= -y_k + p_k \sum_c y_c = -y_k + p_k \cdot 1 = p_k - y_k
$$

**Step 2**：计算$\frac{\partial \ell}{\partial \boldsymbol{w}_c}$和$\frac{\partial \ell}{\partial b_c}$

$$
\frac{\partial \ell}{\partial \boldsymbol{w}_c} = \frac{\partial \ell}{\partial z_c} \cdot \frac{\partial z_c}{\partial \boldsymbol{w}_c} = (p_c - y_c) \boldsymbol{x}
$$

$$
\frac{\partial \ell}{\partial b_c} = \frac{\partial \ell}{\partial z_c} \cdot \frac{\partial z_c}{\partial b_c} = p_c - y_c
$$



**观察**：梯度形式与Logistic回归完全一致！这体现了两者的统一性。

#### 梯度下降更新

$$
\boldsymbol{w}_c \leftarrow \boldsymbol{w}_c - \frac{\eta}{N}\sum_{n=1}^{N} (p_c^{(n)} - y_c^{(n)}) \boldsymbol{x}^{(n)}
$$

$$
b_c \leftarrow b_c - \frac{\eta}{N}\sum_{n=1}^{N} (p_c^{(n)} - y_c^{(n)})
$$

## 4 感知器

感知器（Perceptron）是由Frank Rosenblatt于1958年提出的一种最简单的神经网络模型，是神经网络和深度学习的历史起点。

### 4.1 感知器模型

#### 模型定义

感知器：感知器是一个二分类模型，其决策函数为：

$$
h(\boldsymbol{x}) = \text{sign}(f(\boldsymbol{x})) = \text{sign}(\boldsymbol{w}^{\top}\boldsymbol{x} + b)
$$

其中：

- $\boldsymbol{w} \in \mathbb{R}^D$是权重向量
- $b \in \mathbb{R}$是偏置
- 标签$y \in \{-1, +1\}$

**神经元视角**：感知器可以看作一个人工神经元

- 输入：$\boldsymbol{x} = [x_1, \ldots, x_D]^{\top}$
- 加权求和：$z = \sum_{d=1}^{D} w_d x_d + b$
- 激活函数：$h = \text{sign}(z)$
- 输出：$h \in \{-1, +1\}$

#### 几何解释

感知器定义了一个超平面$\boldsymbol{w}^{\top}\boldsymbol{x} + b = 0$：

- 超平面一侧的点被分为正类
- 另一侧的点被分为负类
- 权重向量$\boldsymbol{w}$是超平面的法向量，指向正类区域

### 4.2 感知器学习算法

#### 损失函数

感知器使用的损失函数是**感知器损失**：

$$
\mathcal{L}(\boldsymbol{w}, b) = -\sum_{\boldsymbol{x}^{(n)} \in \mathcal{M}} y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b)
$$

其中$\mathcal{M}$是所有被**错误分类**的样本集合。

**性质分析**：

- 对于正确分类的样本：$y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) > 0$，不计入损失
- 对于错误分类的样本：$y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) < 0$，损失为正
- 损失函数非负，且仅当所有样本被正确分类时为零

#### 梯度计算

对于单个错误分类样本$(\boldsymbol{x}, y)$，损失为$-y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)$。

$$
\frac{\partial \mathcal{L}}{\partial \boldsymbol{w}} = -y\boldsymbol{x}
$$

$$
\frac{\partial \mathcal{L}}{\partial b} = -y
$$

#### 感知器学习算法

**算法 3.4**：感知器学习算法（原始形式）

```
输入：训练集 D = {(x^(n), y^(n))}_{n=1}^N，其中 y^(n) ∈ {-1, +1}
      学习率 η > 0（通常取 η = 1）
      最大迭代轮数 T_max
输出：参数 w, b

1.  初始化：w ← 0 ∈ R^D，b ← 0
2.  for epoch = 1 to T_max do
3.      误分类样本数 ← 0
4.      for n = 1 to N do
5.          if y^(n)(w^T x^(n) + b) ≤ 0 then    // 样本被错误分类
6.              w ← w + η y^(n) x^(n)            // 更新权重
7.              b ← b + η y^(n)                  // 更新偏置
8.              误分类样本数 ← 误分类样本数 + 1
9.          end if
10.     end for
11.     if 误分类样本数 = 0 then
12.         break    // 所有样本正确分类，算法收敛
13.     end if
14. end for
15. return w, b
```

**更新规则的直观理解**：

当样本$(\boldsymbol{x}, y)$被错误分类时：

**情况1**：$y = +1$但$\boldsymbol{w}^{\top}\boldsymbol{x} + b < 0$（正类样本被误判为负类）

- 更新：$\boldsymbol{w} \leftarrow \boldsymbol{w} + \boldsymbol{x}$
- 效果：使$\boldsymbol{w}^{\top}\boldsymbol{x}$增大，推动决策边界使该样本落入正类区域

**情况2**：$y = -1$但$\boldsymbol{w}^{\top}\boldsymbol{x} + b > 0$（负类样本被误判为正类）

- 更新：$\boldsymbol{w} \leftarrow \boldsymbol{w} - \boldsymbol{x}$
- 效果：使$\boldsymbol{w}^{\top}\boldsymbol{x}$减小，推动决策边界使该样本落入负类区域

### 4.3 感知器的收敛性

感知器收敛定理是感知器算法最重要的理论结果。

#### 收敛定理

感知器收敛定理，Novikoff, 1962：设训练数据集$\mathcal{D}$是线性可分的，存在超平面$\boldsymbol{w}^* \cdot \boldsymbol{x} + b^* = 0$能够将正负样本完全分开。设：

$$
R = \max_{n} \|\hat{\boldsymbol{x}}^{(n)}\|_2
$$

是增广样本向量的最大模长，

$$
\gamma = \min_{n} \frac{y^{(n)}(\boldsymbol{w}^{*\top}\boldsymbol{x}^{(n)} + b^*)}{\|\hat{\boldsymbol{w}}^*\|_2}
$$

是数据集的几何间隔。

则感知器算法的**误分类更新次数**$k$满足：

$$
k \leq \left(\frac{R}{\gamma}\right)^2
$$

#### 详细证明

为简化证明，使用增广表示：$\hat{\boldsymbol{w}} = [\boldsymbol{w}; b]$，$\hat{\boldsymbol{x}} = [\boldsymbol{x}; 1]$。

设$\hat{\boldsymbol{w}}^*$是使数据线性可分的最优增广权重向量，且$\|\hat{\boldsymbol{w}}^*\|_2 = 1$。

设$\gamma = \min_n y^{(n)} \hat{\boldsymbol{w}}^{*\top} \hat{\boldsymbol{x}}^{(n)} > 0$（归一化的几何间隔）。

设$R = \max_n \|\hat{\boldsymbol{x}}^{(n)}\|_2$。

设算法在第$k$次更新后的参数为$\hat{\boldsymbol{w}}^{(k)}$，初始$\hat{\boldsymbol{w}}^{(0)} = \boldsymbol{0}$。

**Step 1：分析$\hat{\boldsymbol{w}}^{(k)\top}\hat{\boldsymbol{w}}^*$的下界**

每次更新时，设当前误分类样本为$(\hat{\boldsymbol{x}}^{(n)}, y^{(n)})$：

$$
\hat{\boldsymbol{w}}^{(k)} = \hat{\boldsymbol{w}}^{(k-1)} + y^{(n)}\hat{\boldsymbol{x}}^{(n)}
$$

计算与$\hat{\boldsymbol{w}}^*$的内积：

$$
\hat{\boldsymbol{w}}^{(k)\top}\hat{\boldsymbol{w}}^* = \hat{\boldsymbol{w}}^{(k-1)\top}\hat{\boldsymbol{w}}^* + y^{(n)}\hat{\boldsymbol{x}}^{(n)\top}\hat{\boldsymbol{w}}^*
$$

$$
\geq \hat{\boldsymbol{w}}^{(k-1)\top}\hat{\boldsymbol{w}}^* + \gamma
$$

递推得：

$$
\hat{\boldsymbol{w}}^{(k)\top}\hat{\boldsymbol{w}}^* \geq k\gamma
$$

**Step 2：分析$\|\hat{\boldsymbol{w}}^{(k)}\|_2^2$的上界**

$$
\|\hat{\boldsymbol{w}}^{(k)}\|_2^2 = \|\hat{\boldsymbol{w}}^{(k-1)} + y^{(n)}\hat{\boldsymbol{x}}^{(n)}\|_2^2
$$

$$
= \|\hat{\boldsymbol{w}}^{(k-1)}\|_2^2 + 2y^{(n)}\hat{\boldsymbol{w}}^{(k-1)\top}\hat{\boldsymbol{x}}^{(n)} + \|\hat{\boldsymbol{x}}^{(n)}\|_2^2
$$

由于样本被误分类：$y^{(n)}\hat{\boldsymbol{w}}^{(k-1)\top}\hat{\boldsymbol{x}}^{(n)} \leq 0$

$$
\|\hat{\boldsymbol{w}}^{(k)}\|_2^2 \leq \|\hat{\boldsymbol{w}}^{(k-1)}\|_2^2 + R^2
$$

递推得：

$$
\|\hat{\boldsymbol{w}}^{(k)}\|_2^2 \leq kR^2
$$

**Step 3：综合两个不等式**

由Cauchy-Schwarz不等式：

$$
\hat{\boldsymbol{w}}^{(k)\top}\hat{\boldsymbol{w}}^* \leq \|\hat{\boldsymbol{w}}^{(k)}\|_2 \cdot \|\hat{\boldsymbol{w}}^*\|_2 = \|\hat{\boldsymbol{w}}^{(k)}\|_2
$$

结合Step 1和Step 2：

$$
k\gamma \leq \hat{\boldsymbol{w}}^{(k)\top}\hat{\boldsymbol{w}}^* \leq \|\hat{\boldsymbol{w}}^{(k)}\|_2 \leq \sqrt{kR^2} = \sqrt{k}R
$$

$$
k\gamma \leq \sqrt{k}R
$$

$$
k \leq \left(\frac{R}{\gamma}\right)^2
$$



#### 收敛性的意义与局限

**意义**：

1. 对于线性可分数据，算法**保证在有限步内收敛**
2. 收敛速度与数据的**间隔**$\gamma$成反比：间隔越大，收敛越快
3. 收敛速度与样本的**范围**$R$成正比：样本范围越大，收敛越慢

**局限**：

1. **线性不可分**：算法无法收敛，会在不同解之间震荡
2. **解不唯一**：最终解依赖于样本的遍历顺序和初始化
3. **无法输出概率**：只能给出硬分类结果

### 4.4 参数平均感知器

为了提高感知器的泛化能力，Collins (2002) 提出了平均感知器算法。

#### 基本思想

不使用最后一轮迭代的参数，而是使用训练过程中**所有参数的平均值**：

$$
\bar{\boldsymbol{w}} = \frac{1}{T}\sum_{t=1}^{T}\boldsymbol{w}^{(t)}
$$

$$
\bar{b} = \frac{1}{T}\sum_{t=1}^{T}b^{(t)}
$$

其中$T$是总的参数状态数（或更新次数）。

**直观理解**：平均化相当于对参数进行**投票**，减少了对单个误分类样本的过度响应，提高了模型的稳定性。

#### 高效实现

直接计算平均值需要存储所有中间参数，空间复杂度为$O(TD)$。

**累积技巧**：维护一个累积向量$\boldsymbol{w}_{\text{sum}}$：

每次更新后：
$$
\boldsymbol{w}_{\text{sum}} \leftarrow \boldsymbol{w}_{\text{sum}} + \boldsymbol{w}
$$

最后：
$$
\bar{\boldsymbol{w}} = \frac{\boldsymbol{w}_{\text{sum}}}{T}
$$

**更高效的实现**：考虑参数在多次迭代中保持不变的情况。

### 4.5 多分类感知器

#### 模型定义

对于$C$类分类问题，定义$C$个权重向量$\boldsymbol{w}_1, \boldsymbol{w}_2, \ldots, \boldsymbol{w}_C$。

**预测规则**：
$$
\hat{y} = \arg\max_{c \in \{1, \ldots, C\}} (\boldsymbol{w}_c^{\top}\boldsymbol{x} + b_c)
$$

#### 更新规则

当样本$(\boldsymbol{x}, y)$被错误分类为$\hat{y} \neq y$时：

$$
\boldsymbol{w}_y \leftarrow \boldsymbol{w}_y + \eta \boldsymbol{x} \quad \text{（增加正确类别的得分）}
$$

$$
\boldsymbol{w}_{\hat{y}} \leftarrow \boldsymbol{w}_{\hat{y}} - \eta \boldsymbol{x} \quad \text{（减少错误预测类别的得分）}
$$

## 5 支持向量机

支持向量机（Support Vector Machine, SVM）是由Vapnik等人在1990年代提出的一种强大的监督学习算法。SVM的核心思想是寻找具有**最大间隔**的分类超平面，并通过**核技巧**处理非线性可分问题。

### 5.1 最大间隔分类器

#### 动机

对于线性可分数据，存在无穷多个超平面能够正确分类所有样本。哪个超平面最好？

**直观想法**：选择"最中间"的超平面，即离最近样本点**距离最大**的超平面。

**原因**：

1. 最大间隔超平面对**噪声更鲁棒**
2. 具有更好的**泛化能力**（由统计学习理论保证）

#### 间隔的定义

回顾前面的定义：

**几何间隔**：样本$(\boldsymbol{x}^{(n)}, y^{(n)})$到超平面$(\boldsymbol{w}, b)$的几何间隔：
$$
\gamma^{(n)} = \frac{y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b)}{\|\boldsymbol{w}\|_2}
$$

**数据集的间隔**：
$$
\gamma = \min_{n} \gamma^{(n)}
$$

#### 最大间隔优化问题

**原始问题**：

$$
\max_{\boldsymbol{w}, b} \gamma
$$

$$
\text{s.t.} \quad \frac{y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b)}{\|\boldsymbol{w}\|_2} \geq \gamma, \quad n = 1, \ldots, N
$$

**标准化**：由于$\boldsymbol{w}$的尺度是自由的，我们可以设$\hat{\gamma} = \gamma \|\boldsymbol{w}\|_2 = 1$（函数间隔为1）。

则$\gamma = \frac{1}{\|\boldsymbol{w}\|_2}$，最大化$\gamma$等价于最小化$\|\boldsymbol{w}\|_2$。

**标准形式**：

$$
\min_{\boldsymbol{w}, b} \frac{1}{2}\|\boldsymbol{w}\|_2^2
$$

$$
\text{s.t.} \quad y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) \geq 1, \quad n = 1, \ldots, N
$$

这是一个**凸二次规划**（Convex Quadratic Programming, QP）问题：

- 目标函数是凸二次函数
- 约束是线性不等式
- 存在唯一的全局最优解

### 5.2 对偶问题与支持向量

#### 拉格朗日函数

引入拉格朗日乘子$\alpha_n \geq 0$，$n = 1, \ldots, N$：

$$
L(\boldsymbol{w}, b, \boldsymbol{\alpha}) = \frac{1}{2}\|\boldsymbol{w}\|_2^2 - \sum_{n=1}^{N}\alpha_n\left[y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) - 1\right]
$$

原始问题等价于：
$$
\min_{\boldsymbol{w}, b} \max_{\boldsymbol{\alpha} \geq 0} L(\boldsymbol{w}, b, \boldsymbol{\alpha})
$$

#### 对偶问题推导

**Step 1**：对$\boldsymbol{w}$求偏导并令其为0

$$
\frac{\partial L}{\partial \boldsymbol{w}} = \boldsymbol{w} - \sum_{n=1}^{N}\alpha_n y^{(n)} \boldsymbol{x}^{(n)} = 0
$$

$$
\Rightarrow \boldsymbol{w} = \sum_{n=1}^{N}\alpha_n y^{(n)} \boldsymbol{x}^{(n)}
$$

**Step 2**：对$b$求偏导并令其为0

$$
\frac{\partial L}{\partial b} = -\sum_{n=1}^{N}\alpha_n y^{(n)} = 0
$$

$$
\Rightarrow \sum_{n=1}^{N}\alpha_n y^{(n)} = 0
$$

**Step 3**：代入拉格朗日函数

将$\boldsymbol{w} = \sum_n \alpha_n y^{(n)} \boldsymbol{x}^{(n)}$代入：

$$
L = \frac{1}{2}\left\|\sum_n \alpha_n y^{(n)} \boldsymbol{x}^{(n)}\right\|^2 - \sum_n \alpha_n y^{(n)} \boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} - b\sum_n \alpha_n y^{(n)} + \sum_n \alpha_n
$$

由于$\sum_n \alpha_n y^{(n)} = 0$，$b$项消失。

展开第一项：
$$
\frac{1}{2}\sum_n \sum_m \alpha_n \alpha_m y^{(n)} y^{(m)} \boldsymbol{x}^{(n)\top}\boldsymbol{x}^{(m)}
$$

第二项：
$$
\sum_n \alpha_n y^{(n)} \left(\sum_m \alpha_m y^{(m)} \boldsymbol{x}^{(m)}\right)^{\top}\boldsymbol{x}^{(n)} = \sum_n \sum_m \alpha_n \alpha_m y^{(n)} y^{(m)} \boldsymbol{x}^{(n)\top}\boldsymbol{x}^{(m)}
$$

因此：
$$
L = \sum_n \alpha_n - \frac{1}{2}\sum_n \sum_m \alpha_n \alpha_m y^{(n)} y^{(m)} \boldsymbol{x}^{(n)\top}\boldsymbol{x}^{(m)}
$$

**对偶问题**：

$$
\max_{\boldsymbol{\alpha}} \sum_{n=1}^{N}\alpha_n - \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y^{(n)}y^{(m)}\boldsymbol{x}^{(n)\top}\boldsymbol{x}^{(m)}
$$

$$
\text{s.t.} \quad \alpha_n \geq 0, \quad n = 1, \ldots, N
$$

$$
\sum_{n=1}^{N}\alpha_n y^{(n)} = 0
$$

#### KKT条件

最优解必须满足**Karush-Kuhn-Tucker (KKT) 条件**：

1. **原始可行性**：$y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) \geq 1$

2. **对偶可行性**：$\alpha_n \geq 0$

3. **互补松弛条件**：

$$
\alpha_n\left[y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) - 1\right] = 0
$$

**互补松弛条件的含义**：对于每个样本$n$：

- 要么$\alpha_n = 0$
- 要么$y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) = 1$（样本恰好落在间隔边界上）

#### 支持向量

支持向量：满足$\alpha_n > 0$的样本称为**支持向量**（Support Vector）。

由KKT条件，支持向量满足：
$$
y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) = 1
$$

即支持向量恰好落在**间隔边界**上（距离超平面的距离为$1/\|\boldsymbol{w}\|$）。

**重要性质**：

1. 最优超平面**完全由支持向量决定**
2. 非支持向量对决策边界**没有影响**
3. 支持向量通常只占所有样本的**一小部分**

**决策函数**：

$$
f(\boldsymbol{x}) = \boldsymbol{w}^{\top}\boldsymbol{x} + b = \sum_{n=1}^{N}\alpha_n y^{(n)} \boldsymbol{x}^{(n)\top}\boldsymbol{x} + b
$$

由于非支持向量的$\alpha_n = 0$：

$$
f(\boldsymbol{x}) = \sum_{n \in \mathcal{SV}}\alpha_n y^{(n)} \boldsymbol{x}^{(n)\top}\boldsymbol{x} + b
$$

其中$\mathcal{SV} = \{n \mid \alpha_n > 0\}$是支持向量的索引集合。

### 5.3 核函数与核技巧

#### 非线性可分问题

当数据在原始空间中线性不可分时，可以通过**特征映射**将数据映射到高维空间，使其在高维空间中线性可分。

**特征映射**：$\phi: \mathbb{R}^D \rightarrow \mathcal{H}$

其中$\mathcal{H}$是高维（可能无限维）的**特征空间**或**希尔伯特空间**。

**例子**：二维到六维的映射：
$$
\boldsymbol{x} = [x_1, x_2]^{\top} \mapsto \phi(\boldsymbol{x}) = [1, \sqrt{2}x_1, \sqrt{2}x_2, x_1^2, x_2^2, \sqrt{2}x_1x_2]^{\top}
$$

在高维空间中，SVM的对偶问题变为：

$$
\max_{\boldsymbol{\alpha}} \sum_{n=1}^{N}\alpha_n - \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y^{(n)}y^{(m)}\phi(\boldsymbol{x}^{(n)})^{\top}\phi(\boldsymbol{x}^{(m)})
$$

#### 核技巧

**核心观察**：对偶问题只涉及样本之间的**内积**$\phi(\boldsymbol{x})^{\top}\phi(\boldsymbol{x}')$。

核函数：核函数$\kappa: \mathbb{R}^D \times \mathbb{R}^D \rightarrow \mathbb{R}$定义为特征空间中的内积：

$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = \phi(\boldsymbol{x})^{\top}\phi(\boldsymbol{x}')
$$

**核技巧**（Kernel Trick）：如果我们能够直接计算$\kappa(\boldsymbol{x}, \boldsymbol{x}')$，而无需显式计算$\phi(\boldsymbol{x})$，就可以**避免在高维空间中的显式计算**。

**例子**：多项式核
$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = (\boldsymbol{x}^{\top}\boldsymbol{x}' + 1)^2
$$

展开验证（$D = 2$）：
$$
(\boldsymbol{x}^{\top}\boldsymbol{x}' + 1)^2 = (x_1x_1' + x_2x_2' + 1)^2
$$

$$
= 1 + 2x_1x_1' + 2x_2x_2' + x_1^2x_1'^2 + x_2^2x_2'^2 + 2x_1x_2x_1'x_2'
$$

$$
= [1, \sqrt{2}x_1, \sqrt{2}x_2, x_1^2, x_2^2, \sqrt{2}x_1x_2] \cdot [1, \sqrt{2}x_1', \sqrt{2}x_2', x_1'^2, x_2'^2, \sqrt{2}x_1'x_2']^{\top}
$$

$$
= \phi(\boldsymbol{x})^{\top}\phi(\boldsymbol{x}')
$$

计算复杂度：

- 显式计算$\phi(\boldsymbol{x})^{\top}\phi(\boldsymbol{x}')$：$O(D^2)$
- 使用核函数：$O(D)$

#### 常用核函数

**1. 线性核**（Linear Kernel）：

$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = \boldsymbol{x}^{\top}\boldsymbol{x}'
$$

对应恒等映射$\phi(\boldsymbol{x}) = \boldsymbol{x}$，即原始空间中的线性SVM。

**2. 多项式核**（Polynomial Kernel）：

$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = (\boldsymbol{x}^{\top}\boldsymbol{x}' + c)^d
$$

其中$c \geq 0$是常数，$d \in \mathbb{N}$是多项式次数。

- $d = 1$, $c = 0$：线性核
- $d = 2$：二次核，能够捕捉二阶特征交互

**3. 高斯核/RBF核**（Gaussian/Radial Basis Function Kernel）：

$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = \exp\left(-\frac{\|\boldsymbol{x} - \boldsymbol{x}'\|^2}{2\sigma^2}\right) = \exp\left(-\gamma\|\boldsymbol{x} - \boldsymbol{x}'\|^2\right)
$$

其中$\sigma > 0$是带宽参数，$\gamma = \frac{1}{2\sigma^2}$。

**重要性质**：高斯核对应**无限维**的特征空间。

**证明（简略）**：利用Taylor展开：
$$
\exp\left(-\frac{\|\boldsymbol{x} - \boldsymbol{x}'\|^2}{2\sigma^2}\right) = \exp\left(-\frac{\|\boldsymbol{x}\|^2}{2\sigma^2}\right)\exp\left(-\frac{\|\boldsymbol{x}'\|^2}{2\sigma^2}\right)\exp\left(\frac{\boldsymbol{x}^{\top}\boldsymbol{x}'}{\sigma^2}\right)
$$

将$\exp\left(\frac{\boldsymbol{x}^{\top}\boldsymbol{x}'}{\sigma^2}\right)$展开为无穷级数，可以得到无限维的特征映射。

**4. Sigmoid核**（Sigmoid Kernel）：

$$
\kappa(\boldsymbol{x}, \boldsymbol{x}') = \tanh(\beta\boldsymbol{x}^{\top}\boldsymbol{x}' + \theta)
$$

其中$\beta > 0$，$\theta < 0$。

**注意**：Sigmoid核在某些参数下不满足Mercer条件。

#### Mercer条件

Mercer定理：一个函数$\kappa(\cdot, \cdot)$是有效的核函数（即存在对应的特征映射$\phi$），当且仅当对任意样本集$\{\boldsymbol{x}^{(1)}, \ldots, \boldsymbol{x}^{(N)}\}$，核矩阵$\boldsymbol{K}$是**半正定**的：

$$
K_{nm} = \kappa(\boldsymbol{x}^{(n)}, \boldsymbol{x}^{(m)})
$$

$$
\boldsymbol{K} \succeq 0
$$

### 5.4 软间隔SVM

#### 动机

在实际应用中，数据往往不是严格线性可分的：

- 可能存在**噪声**和**异常值**
- 硬间隔SVM会试图拟合所有样本，容易**过拟合**

**软间隔**（Soft Margin）允许一些样本违反间隔约束。

#### 松弛变量

引入**松弛变量**（slack variable）$\xi_n \geq 0$：

$$
y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) \geq 1 - \xi_n
$$

**松弛变量的含义**：

- $\xi_n = 0$：样本在间隔边界上或外部（正确分类且满足间隔约束）
- $0 < \xi_n < 1$：样本在间隔内但被正确分类
- $\xi_n = 1$：样本恰好在决策边界上
- $\xi_n > 1$：样本被错误分类

#### 软间隔SVM优化问题

$$
\min_{\boldsymbol{w}, b, \boldsymbol{\xi}} \frac{1}{2}\|\boldsymbol{w}\|_2^2 + C\sum_{n=1}^{N}\xi_n
$$

$$
\text{s.t.} \quad y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b) \geq 1 - \xi_n, \quad n = 1, \ldots, N
$$

$$
\xi_n \geq 0, \quad n = 1, \ldots, N
$$

**参数$C$的作用**：

- $C$是**正则化参数**，控制间隔最大化与错误分类惩罚之间的权衡
- $C$大：更不容忍错误，间隔小，可能过拟合
- $C$小：更容忍错误，间隔大，可能欠拟合

#### 对偶问题

软间隔SVM的对偶问题为：

$$
\max_{\boldsymbol{\alpha}} \sum_{n=1}^{N}\alpha_n - \frac{1}{2}\sum_{n=1}^{N}\sum_{m=1}^{N}\alpha_n\alpha_m y^{(n)}y^{(m)}\kappa(\boldsymbol{x}^{(n)}, \boldsymbol{x}^{(m)})
$$

$$
\text{s.t.} \quad 0 \leq \alpha_n \leq C, \quad n = 1, \ldots, N
$$

$$
\sum_{n=1}^{N}\alpha_n y^{(n)} = 0
$$

与硬间隔SVM相比，唯一的区别是$\alpha_n$有了**上界$C$**（box constraint）。

**KKT条件分析**：

- $\alpha_n = 0$：样本在间隔外，不是支持向量
- $0 < \alpha_n < C$：样本在间隔边界上，$\xi_n = 0$
- $\alpha_n = C$：样本在间隔内或被错误分类，$\xi_n > 0$

#### Hinge损失

软间隔SVM等价于最小化正则化的**Hinge损失**：

$$
\min_{\boldsymbol{w}, b} \frac{1}{2}\|\boldsymbol{w}\|_2^2 + C\sum_{n=1}^{N}\max(0, 1 - y^{(n)}(\boldsymbol{w}^{\top}\boldsymbol{x}^{(n)} + b))
$$

**Hinge损失**定义为：

$$
\ell_{\text{hinge}}(y, f(\boldsymbol{x})) = \max(0, 1 - yf(\boldsymbol{x})) = [1 - yf(\boldsymbol{x})]_+
$$

其中$[z]_+ = \max(0, z)$是**ReLU函数**。

## 6 损失函数对比

不同的线性分类模型采用了不同的损失函数。本节系统比较这些损失函数的性质。

### 6.1 统一框架

设$z = y \cdot f(\boldsymbol{x}) = y(\boldsymbol{w}^{\top}\boldsymbol{x} + b)$为样本的**函数间隔**。

各种损失函数都可以写成$\ell(z)$的形式。

### 6.2 常见损失函数详解

#### 损失

$$
\ell_{0-1}(z) = \mathbb{I}(z \leq 0) = \begin{cases}
1, & \text{if } z \leq 0 \\
0, & \text{if } z > 0
\end{cases}
$$

**性质**：

- 直接度量分类错误
- 非凸、不连续、不可微
- **NP难**优化问题
- 实际中用其他损失函数作为代理（surrogate）

#### 感知器损失

$$
\ell_{\text{perceptron}}(z) = \max(0, -z) = [-z]_+
$$

**性质**：

- 凸函数
- 连续但在$z = 0$处不可微
- 只惩罚错误分类的样本
- 是0-1损失的**松弛**

#### Hinge损失（SVM）

$$
\ell_{\text{hinge}}(z) = \max(0, 1 - z) = [1 - z]_+
$$

**性质**：

- 凸函数
- 连续但在$z = 1$处不可微
- 不仅要求正确分类，还要求有**间隔**（$z \geq 1$）
- 是0-1损失的**紧致凸上界**

#### Logistic损失

$$
\ell_{\text{logistic}}(z) = \log(1 + e^{-z})
$$

**性质**：

- 凸函数
- **处处光滑可微**
- 渐近行为：
  - $z \to +\infty$：$\ell \to 0$
  - $z \to -\infty$：$\ell \approx -z$（线性增长）

#### 指数损失（AdaBoost）

$$
\ell_{\text{exp}}(z) = e^{-z}
$$

**性质**：

- 凸函数
- 处处光滑可微
- 对离群点**非常敏感**（指数增长）
- 是AdaBoost算法对应的损失函数

### 6.3 损失函数比较表

| 损失函数     | 公式                   | 凸性 | 光滑性 | 离群点敏感度 | 对应模型     |
| ------------ | ---------------------- | ---- | ------ | ------------ | ------------ |
| 0-1损失      | $\mathbb{I}(z \leq 0)$ | 非凸 | 不连续 | 低           | 理想分类器   |
| 感知器损失   | $[-z]_+$               | 凸   | 非光滑 | 低           | 感知器       |
| Hinge损失    | $[1-z]_+$              | 凸   | 非光滑 | 中等         | SVM          |
| Logistic损失 | $\log(1+e^{-z})$       | 凸   | 光滑   | 中等         | Logistic回归 |
| 指数损失     | $e^{-z}$               | 凸   | 光滑   | 高           | AdaBoost     |

### 6.4 损失函数的关系

1. **感知器损失**是**Hinge损失**向左平移1个单位的结果

2. 当$z \to +\infty$时（正确分类且置信度高）：
   - Hinge损失和感知器损失都趋近于0
   - Logistic损失和指数损失也趋近于0

3. 当$z \to -\infty$时（错误分类且置信度高）：
   - Hinge损失和感知器损失线性增长
   - Logistic损失也线性增长
   - 指数损失**指数增长**（对离群点非常敏感）

4. **凸上界关系**：
   - Hinge损失、Logistic损失、指数损失都是0-1损失的凸上界
   - 最小化这些代理损失可以间接最小化0-1损失