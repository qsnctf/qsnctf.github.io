# 二分搜索树

二分搜索树（Binary Search Tree, BST）是一种有序二叉树。对任意节点，左子树所有值小于节点值，右子树所有值大于节点值。

## 二分搜索树

BST 支持查找、插入、删除和有序遍历。若树高为 `h`，这些操作复杂度通常是 `O(h)`。

平衡时 `h = O(log n)`；退化成链表时 `h = O(n)`。

## 二分搜索树节点的插入

插入时从根节点开始比较：

```text
insert(node, x):
    if node is null: return new Node(x)
    if x < node.value: node.left = insert(node.left, x)
    if x > node.value: node.right = insert(node.right, x)
    return node
```

重复元素可以选择忽略、计数或统一放到某一侧，规则必须保持一致。

## 二分搜索树节点的查找

查找利用有序性：

```text
contains(node, x):
    if node is null: return false
    if x == node.value: return true
    if x < node.value: return contains(node.left, x)
    return contains(node.right, x)
```

每次比较都能排除一棵子树。

## 二分搜索树深度优先遍历

常见 DFS 遍历：

- 前序遍历：节点、左子树、右子树。
- 中序遍历：左子树、节点、右子树。
- 后序遍历：左子树、右子树、节点。

BST 的中序遍历会得到递增序列，这是它最重要的性质之一。

## 二分搜索树层序遍历

层序遍历使用队列，从根节点开始逐层访问。

```text
queue.push(root)
while queue not empty:
    node = queue.pop()
    visit(node)
    push node.left and node.right if exists
```

层序遍历常用于按层输出、计算宽度和观察树形结构。

## 二分搜索树节点删除

删除节点分三种情况：

1. 叶子节点：直接删除。
2. 只有一个子节点：用子节点替代当前节点。
3. 有两个子节点：用后继或前驱替代当前节点。

后继通常是右子树中的最小节点。替换后要在原位置删除该后继节点。

## 二分搜索树的特性

优点：

- 实现直观。
- 中序遍历天然有序。
- 支持范围查询和有序集合操作。

缺点：

- 插入顺序会影响树高。
- 已排序输入会让普通 BST 退化为链表。
- 工程中常用 AVL 树、红黑树等平衡搜索树避免退化。

学习普通 BST 的价值在于理解有序树的基本递归结构。
