# Java 常用类库

## 标准库常用包

| 包 | 用途 |
| -- | ---- |
| `java.lang` | 基础类，默认导入 |
| `java.util` | 集合、日期、工具类 |
| `java.io` | 传统 IO |
| `java.nio` | 新 IO、Buffer、Path、Files |
| `java.net` | 网络编程 |
| `java.time` | 日期时间 |
| `java.util.concurrent` | 并发工具 |
| `java.util.regex` | 正则表达式 |

## 常用第三方库

| 类库 | 用途 |
| ---- | ---- |
| JUnit | 单元测试 |
| SLF4J / Logback | 日志 |
| Jackson | JSON 序列化 |
| Gson | JSON 序列化 |
| Apache Commons | 通用工具集合 |
| Guava | Google 工具库 |
| OkHttp | HTTP 客户端 |
| Spring Framework | 企业级开发框架 |
| MyBatis | 数据库持久层 |
| Netty | 网络通信框架 |

## Maven 依赖示例

```xml
<dependency>
  <groupId>com.fasterxml.jackson.core</groupId>
  <artifactId>jackson-databind</artifactId>
  <version>2.17.0</version>
</dependency>
```

## 安全建议

- 固定依赖版本并定期升级。
- 不使用来源不明的 jar。
- 注意反序列化、模板注入、表达式注入等 Java 常见安全风险。
- 不把数据库密码、Token、私钥提交到仓库。
