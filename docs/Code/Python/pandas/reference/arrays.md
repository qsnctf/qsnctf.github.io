# Pandas 数组

## 概念与用途

Pandas 数组层包括 NumPy `ndarray` 和扩展数组 `ExtensionArray`。扩展 dtype 为可空整数、字符串、类别、时区日期、区间、周期和 Arrow 数据提供一致接口。

## 核心 API

`pd.array`、`Series.array`、`Series.to_numpy`、`pd.api.extensions.ExtensionArray`、`IntegerArray`、`BooleanArray`、`StringArray`、`Categorical`、`DatetimeArray`、`PeriodArray`、`IntervalArray`。

## 可运行示例

```python
import pandas as pd

values = pd.array([1, None, 3], dtype="Int64")
s = pd.Series(values, name="count")
print(s.array)
print(s.to_numpy(dtype="float64", na_value=float("nan")))
```

## 示例二：Arrow-backed 数组

```python
import pandas as pd

try:
    s = pd.Series(["alpha", None, "beta"], dtype="string[pyarrow]")
except ImportError:
    s = pd.Series(["alpha", None, "beta"], dtype="string")
print(s.array)
print(s.dtype)
```

`string[pyarrow]` 需要可选依赖 `pyarrow`。Arrow-backed dtype 可改善部分字符串内存与互操作，但并非所有第三方库和 Pandas 操作都保持同一后端。

## 示例三：数组对齐发生在 Series 层

```python
import pandas as pd

left = pd.Series(pd.array([1, 2], dtype="Int64"), index=["a", "b"])
right = pd.Series(pd.array([10, 20], dtype="Int64"), index=["b", "c"])
print(left + right)
```

ExtensionArray 本身没有 Series 标签；按索引对齐是 Series 层语义。直接提取 `.array` 或 NumPy 数组后，运算通常只按位置进行。

## 返回与复制语义

`pd.array` 返回 ExtensionArray，`Series.array` 暴露其数组接口，`to_numpy` 返回 NumPy 数组。转换是否复制取决于 dtype 和请求参数，不能依赖 `copy=False` 实现跨库共享可变内存。需要稳定隔离时显式复制并测试。

## 注意事项

`Series.array` 尽量保留扩展数组语义，`to_numpy` 可能转换 dtype 或复制。不要依赖扩展数组的内部存储；使用公开方法。某些第三方库只接受 NumPy 数组，转换时要明确空值替代和精度。自定义 ExtensionArray 属于高级扩展点，需要完整实现接口并测试兼容性。
