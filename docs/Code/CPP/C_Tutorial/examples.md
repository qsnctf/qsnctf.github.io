# C 语言实例

## 求两个数之和

```c
#include <stdio.h>

int main(void) {
    int a;
    int b;
    scanf("%d%d", &a, &b);
    printf("%d\n", a + b);
    return 0;
}
```

## 统计字符串长度

```c
#include <stdio.h>
#include <string.h>

int main(void) {
    char s[128];
    if (fgets(s, sizeof s, stdin) != NULL) {
        s[strcspn(s, "\n")] = '\0';
        printf("%zu\n", strlen(s));
    }
}
```

## 交换两个整数

```c
void swap(int *a, int *b) {
    int tmp = *a;
    *a = *b;
    *b = tmp;
}
```

## 读取文件

```c
#include <stdio.h>

int main(void) {
    FILE *fp = fopen("input.txt", "r");
    if (fp == NULL) {
        perror("fopen");
        return 1;
    }

    char line[256];
    while (fgets(line, sizeof line, fp) != NULL) {
        fputs(line, stdout);
    }

    fclose(fp);
}
```

## 动态数组

```c
#include <stdio.h>
#include <stdlib.h>

int main(void) {
    size_t n = 10;
    int *arr = malloc(n * sizeof *arr);
    if (arr == NULL) {
        return 1;
    }

    for (size_t i = 0; i < n; ++i) {
        arr[i] = (int)i;
    }

    free(arr);
}
```
