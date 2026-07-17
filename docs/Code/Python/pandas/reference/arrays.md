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

## 注意事项

`Series.array` 尽量保留扩展数组语义，`to_numpy` 可能转换 dtype 或复制。不要依赖扩展数组的内部存储；使用公开方法。某些第三方库只接受 NumPy 数组，转换时要明确空值替代和精度。自定义 ExtensionArray 属于高级扩展点，需要完整实现接口并测试兼容性。
