# C 排序算法与项目工程结构

## C 排序算法

### 冒泡排序

```c
void bubble_sort(int a[], int n) {
    for (int i = 0; i < n - 1; ++i) {
        for (int j = 0; j < n - 1 - i; ++j) {
            if (a[j] > a[j + 1]) {
                int tmp = a[j];
                a[j] = a[j + 1];
                a[j + 1] = tmp;
            }
        }
    }
}
```

### 选择排序

```c
void selection_sort(int a[], int n) {
    for (int i = 0; i < n; ++i) {
        int min_index = i;
        for (int j = i + 1; j < n; ++j) {
            if (a[j] < a[min_index]) {
                min_index = j;
            }
        }
        int tmp = a[i];
        a[i] = a[min_index];
        a[min_index] = tmp;
    }
}
```

### qsort

标准库提供 `qsort`：

```c
#include <stdlib.h>

int cmp_int(const void *a, const void *b) {
    int x = *(const int *)a;
    int y = *(const int *)b;
    return (x > y) - (x < y);
}

qsort(arr, n, sizeof arr[0], cmp_int);
```

比较函数不要直接 `return x - y;`，因为可能整数溢出。

## C 项目工程结构

小型 C 项目常见结构：

```text
project/
├── include/
│   └── math_utils.h
├── src/
│   ├── main.c
│   └── math_utils.c
├── tests/
│   └── test_math_utils.c
├── Makefile
└── README.md
```

## Makefile 示例

```makefile
CC = cc
CFLAGS = -std=c17 -Wall -Wextra -Wpedantic -Iinclude

app: src/main.o src/math_utils.o
	$(CC) $(CFLAGS) $^ -o $@

clean:
	rm -f src/*.o app
```

## 工程建议

- 头文件放声明，源文件放定义。
- 每个模块职责尽量单一。
- 编译时开启警告。
- 提交前运行测试和格式化。
- 不要提交构建产物、临时文件和密钥。
