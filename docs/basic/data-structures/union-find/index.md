# 并查集

并查集（Union-Find / Disjoint Set Union）用于维护不相交集合，支持查询两个元素是否属于同一集合，以及合并两个集合。

## 并查集基础

核心操作：

- `find(x)`：找到元素所属集合的代表。
- `union(a, b)`：合并两个元素所在集合。
- `isConnected(a, b)`：判断两个元素是否连通。

常见用途：连通性判断、最小生成树 Kruskal、动态合并集合。

## 并查集快速查找

Quick Find 使用数组 `id[i]` 表示元素 `i` 所属集合编号。

查找很快：

```text
find(i) = id[i]
```

合并较慢，需要扫描所有元素，把一个集合编号改成另一个集合编号，复杂度为 `O(n)`。

## 并查集快速合并

Quick Union 把每个集合组织成树，`parent[i]` 指向父节点，根节点代表集合。

```text
find(i):
    while i != parent[i]:
        i = parent[i]
    return i
```

合并时把一棵树的根挂到另一棵树的根上。若不优化，树可能很高。

## 并查集 size 的优化

按 size 优化时，把节点数量少的树挂到节点数量多的树下。

```text
if size[rootA] < size[rootB]:
    parent[rootA] = rootB
else:
    parent[rootB] = rootA
```

这样可以控制树高增长。

## 并查集 rank 的优化

Rank 近似表示树的高度。合并时把 rank 小的树挂到 rank 大的树下。

当两个根 rank 相同时，任选一个作为新根，并让新根 rank 加一。

Rank 不一定等于真实高度，特别是在路径压缩后，但它仍是有效的合并启发式。

## 并查集路径压缩

路径压缩在 `find` 时把沿途节点直接指向根节点。

```text
find(x):
    if x != parent[x]:
        parent[x] = find(parent[x])
    return parent[x]
```

路径压缩配合 rank 或 size 后，单次操作的摊还复杂度接近常数。

## 实战提醒

并查集只适合处理“合并后不拆分”的连通性问题。如果需要删除边、撤销合并或维护路径信息，需要更复杂的数据结构或离线算法。
