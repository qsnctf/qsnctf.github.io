# 堆

堆是一种满足堆序性质的完全二叉树，常用于实现优先队列。最大堆中父节点不小于子节点，最小堆中父节点不大于子节点。

## 堆的基本存储

堆通常用数组存储，避免显式指针。

若使用 0 基下标：

| 关系 | 下标 |
| --- | --- |
| 父节点 | `(i - 1) / 2` |
| 左孩子 | `2 * i + 1` |
| 右孩子 | `2 * i + 2` |

完全二叉树的结构保证数组紧凑存储，不需要额外链接。

## 堆的 shift up

插入元素时，先放到数组末尾，再不断与父节点比较，必要时上浮。

```text
shift_up(i):
    while i > 0 and heap[parent(i)] < heap[i]:
        swap(heap[parent(i)], heap[i])
        i = parent(i)
```

上浮复杂度为 `O(log n)`。

## 堆的 shift down

删除堆顶时，通常用最后一个元素填到堆顶，再向下调整。

```text
shift_down(i):
    while left(i) < n:
        j = left(i)
        if right(i) < n and heap[right(i)] > heap[j]:
            j = right(i)
        if heap[i] >= heap[j]: break
        swap(heap[i], heap[j])
        i = j
```

下沉复杂度为 `O(log n)`。

## 基础堆排序

基础堆排序可以先把所有元素插入堆，再依次取出堆顶。

```text
for x in array:
    heap.push(x)
while heap not empty:
    output heap.pop()
```

复杂度为 `O(n log n)`，但需要额外堆空间。

## 优化堆排序

原地堆排序先把数组 heapify 成最大堆，再不断把堆顶放到数组末尾。

heapify 可以从最后一个非叶子节点向前执行 `shift_down`，整体复杂度为 `O(n)`。

```text
for i in last_parent down to 0:
    shift_down(i)
for end in n-1 down to 1:
    swap(a[0], a[end])
    shift_down(0, end)
```

堆排序最坏复杂度稳定为 `O(n log n)`，额外空间为 `O(1)`，但通常不稳定。

## 索引堆及其优化

索引堆不直接移动数据，而是维护索引数组。它适合元素较大、需要根据外部编号更新优先级的场景。

常见结构：

- `data[i]` 保存真实数据。
- `indexes[k]` 表示堆中第 `k` 个位置对应的数据下标。
- `reverse[i]` 表示数据下标 `i` 在堆中的位置，便于快速更新。

索引堆常用于图算法中的优先队列优化，例如 Dijkstra 中的 decrease-key。
