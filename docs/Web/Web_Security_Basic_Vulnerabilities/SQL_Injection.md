# SQL 注入原理、分析与防护

SQL 注入的本质是：应用把不可信数据拼进 SQL 文本，导致数据越过原本的参数边界，被数据库解析为 SQL 语法。它不是“输入中出现了单引号”这么简单，而是**数据与代码没有分离**。

!!! warning "仅限本地与授权环境"

    本章中的片段只用于下文的本地 SQLite 示例、课程靶场和明确授权的 CTF。不要扫描、枚举或利用公共系统，也不要把自动化工具指向未获授权的地址。

## 一、从数据流理解 SQL 注入

一个危险查询可能是：

```php
$sql = "SELECT id, username FROM users WHERE id = " . $_GET['id'];
```

开发者希望 `id` 只是一个数值，但数据库最终看到的是拼接后的完整 SQL。若本地输入为：

```text
1 OR 1=1
```

最终语句会变成：

```sql
SELECT id, username FROM users WHERE id = 1 OR 1=1
```

这里 `OR 1=1` 已成为语法。正确方向是让 SQL 结构固定、输入只作为参数发送：

```php
$stmt = $pdo->prepare('SELECT id, username FROM users WHERE id = :id');
$stmt->execute(['id' => $id]);
```

参数化查询解决的是“数据被当作 SQL 语法”的问题。认证、授权、结果最小化和业务校验仍需分别实现。

## 二、先发现上下文

同一片段在不同位置可能完全无效。授权分析首先要回答：输入被放进 SQL 的哪里？

```sql
-- 数字上下文
SELECT * FROM products WHERE id = 10

-- 字符串上下文
SELECT * FROM users WHERE name = 'alice'

-- LIKE 模式
SELECT * FROM products WHERE name LIKE '%phone%'

-- 排序表达式
SELECT * FROM products ORDER BY price DESC

-- JSON 表达式或路径
SELECT json_extract(profile, '$.role') FROM users
```

还要记录数据库类型、驱动、错误是否显示、页面是否有稳定差异、请求是否经过缓存，以及输入经过了 URL 解码、JSON 解码还是其他规范化。

### 2.1 使用最小探针

本地或授权靶场可从不会修改数据的片段开始：

| 目的 | 本地输入片段 | 观察点 |
| --- | --- | --- |
| 数字表达式是否成立 | `1 AND 1=1` 与 `1 AND 1=2` | 行数、状态码、页面字段是否稳定不同 |
| 字符串边界是否存在 | `'` | 是否出现可重复的语法错误 |
| 字符串布尔差异 | `' AND '1'='1' -- ` 与 `' AND '1'='2' -- ` | 两次响应是否稳定不同 |
| 排序项是否可控 | `price ASC` 与 `price DESC` | 结果顺序是否改变 |

注释规则依数据库而异。MySQL 的 `-- ` 后需要空白；`#` 是 MySQL 常见行注释，但不是通用 SQL。把这些片段放在 URL 时还需经过正常 URL 编码，否则 `#` 会被浏览器当作片段标识而不发送。

一次只改变一个条件，并重复请求排除缓存、随机内容和网络抖动。单个 500 响应不能证明存在 SQL 注入。

## 三、常见语法上下文

### 3.1 数字上下文

数字位置通常不需要先闭合引号：

```text
1 AND 1=1
1 AND 1=2
```

但“应用验证为数字”与“强制转换为数字”不同。正确做法仍是先验证范围，再绑定参数，不能依赖数据库替应用解释 `1abc`。

### 3.2 字符串上下文

字符串位置需要理解引号和后续语句。教学片段：

```text
' AND '1'='1' --%20
' AND '1'='2' --%20
```

不同数据库对引号、反斜杠、字符集和注释的处理不同。尝试“转义单引号”不是通用修复，参数化查询才是默认方案。

### 3.3 `LIKE` 上下文

参数绑定能防止输入变成 SQL 语法，但 `%` 和 `_` 仍是 `LIKE` 的业务通配符。若产品需要“按字面包含搜索”，还要转义通配符：

```php
$term = strtr($term, ['\\' => '\\\\', '%' => '\\%', '_' => '\\_']);
$stmt = $pdo->prepare(
    "SELECT id, name FROM products WHERE name LIKE :pattern ESCAPE '\\'"
);
$stmt->execute(['pattern' => '%' . $term . '%']);
```

若产品本来就允许用户输入通配模式，则应明确限制长度和查询成本，避免仅凭参数化查询误判为没有资源消耗风险。

### 3.4 `ORDER BY`、列名与方向

占位符通常只能表示**值**，不能表示列名、表名、关键字或 `ASC`/`DESC`：

```php
// 错误思路：ORDER BY :column 不会把参数变成标识符
$pdo->prepare('SELECT * FROM products ORDER BY :column');
```

这类动态结构应使用允许列表映射：

```php
$columns = ['name' => 'name', 'price' => 'price', 'newest' => 'created_at'];
$directions = ['asc' => 'ASC', 'desc' => 'DESC'];

$sort = $_GET['sort'] ?? 'name';
$direction = strtolower($_GET['direction'] ?? 'asc');
if (!isset($columns[$sort], $directions[$direction])) {
    http_response_code(400);
    exit('invalid sort');
}

$sql = 'SELECT id, name, price FROM products ORDER BY '
     . $columns[$sort] . ' ' . $directions[$direction];
$rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);
```

CTF 中的 `ORDER BY` 注入可能无法直接使用普通布尔条件，但排序表达式本身仍可造成可观察差异。防御重点是不允许输入成为任意表达式。

### 3.5 JSON 上下文

“请求体是 JSON”不代表查询安全。风险可能出现在：

1. JSON 字段值被拼进普通 SQL。
2. 用户控制 JSON 路径，如 `$.profile.role`。
3. 用户控制 PostgreSQL 的 JSON 运算符、MySQL 的 JSON path 或 SQL Server 的 JSON path。
4. 应用从 JSON 生成动态字段名、排序项或过滤表达式。

JSON 值继续使用绑定参数；JSON 路径和字段名应从允许列表映射。还要验证解码后的实际类型，拒绝本应为字符串却收到数组或对象的情况。

## 四、主要发现技术

以下分类描述的是在授权环境中确认数据流和影响的方法。应优先使用低影响、只读且请求数量有限的验证。

### 4.1 报错型

报错型注入利用数据库错误作为信息通道。最初的单引号可能暴露 SQL 语法、驱动或表名；进一步的类型转换错误可能回显表达式内容。

本地 PostgreSQL 教学中，类似下面的表达式会产生类型转换错误：

```sql
CAST(current_user AS integer)
```

它是否回显用户名取决于错误包装方式。生产环境应关闭面向用户的详细数据库错误，但**隐藏错误不能修复注入**；内部日志仍应保留受控诊断信息。

### 4.2 联合查询型

`UNION` 会把两个结果集合并，通常要求列数兼容、对应列类型可兼容。授权靶场中的典型学习顺序是：

1. 确认原查询列数。
2. 用 `NULL` 作为兼容性较高的占位值。
3. 找到会显示在页面中的列。
4. 只读取题目规定的数据，完成后停止。

本地教学片段：

```text
-1 UNION SELECT NULL, 'lab' --%20
```

这只在原查询恰好返回两列、当前位置允许联合查询且数据库语法匹配时成立。`ORDER BY 1`、`ORDER BY 2` 可在某些靶场帮助理解列序号，但不应对公共服务进行枚举。

### 4.3 布尔盲注

页面不显示错误或查询数据时，真假条件仍可能改变“有结果/无结果”等行为：

```text
1 AND 1=1
1 AND 1=2
```

可靠判断应比较稳定信号，例如固定 DOM 节点、记录数量或明确状态码，而不是只看响应长度。真实应用中的个性化、广告、时间戳和压缩都会制造噪声。

### 4.4 时间盲注

当真假响应外观相同，数据库延迟函数可能形成时间通道。不同数据库的常见能力不同：

| 数据库 | 授权实验中常见延迟方式 |
| --- | --- |
| MySQL | `SLEEP(seconds)` |
| PostgreSQL | `pg_sleep(seconds)` |
| SQL Server | `WAITFOR DELAY '00:00:01'` |
| SQLite | 没有内置 `sleep`，通常只能构造昂贵运算，不建议用于验证 |

时间测试会占用连接和工作线程。授权实验应使用很短延迟、少量重复和严格速率限制，并与无延迟基线比较。网络变慢本身不是漏洞证据。

### 4.5 堆叠查询

堆叠查询是一次调用中执行多条语句，例如概念形式：

```sql
SELECT ...; SELECT ...;
```

是否可用取决于数据库、驱动 API、连接选项和调用方式。PDO 驱动之间也不一致；有的默认拒绝多语句，有的配置可能允许。由于第二条语句可修改数据，确认语法能力时也应在可丢弃的本地数据库中使用只读语句。生产中应关闭不需要的多语句能力，并使用最小权限账户。

### 4.6 二阶注入

二阶注入不是在首次提交时立即执行。应用先把看似普通的输入安全存入数据库，之后另一个功能取出该值并拼接到新 SQL 中，风险才被触发。

```text
请求输入 -> 参数化 INSERT -> 数据库存储
数据库值 -> 字符串拼接 UPDATE/SELECT -> 第二次解析为 SQL
```

因此“数据来自数据库”不等于可信。每一个 SQL 调用点都应参数化，不论数据最初来自请求、数据库、消息队列还是配置中心。

### 4.7 带外通道

带外（Out-of-Band，OOB）是数据库通过另一个网络协议产生可观察交互，例如 DNS 或 HTTP。它依赖数据库功能、操作系统、网络出口和高权限，风险明显高于页面内验证。

本章不提供可直接触发外部回连的函数和载荷。授权课程若确需演示，应使用完全隔离的容器网络和自有接收端，不传输真实数据。生产防护包括数据库出站网络默认拒绝、撤销不必要扩展与文件/网络权限、监控异常 DNS 和 HTTP 流量。

## 五、数据库差异速查

先识别数据库，再验证语法。把 MySQL 片段直接套到 PostgreSQL 或 SQLite，常会得到错误结论。

| 特性 | MySQL | PostgreSQL | SQL Server | SQLite |
| --- | --- | --- | --- | --- |
| 常见字符串连接 | `CONCAT(a,b)` | `a || b` | `a + b` 或 `CONCAT` | `a || b` |
| 行数限制 | `LIMIT n` | `LIMIT n` | `TOP (n)` 或 `OFFSET ... FETCH` | `LIMIT n` |
| 当前数据库 | `DATABASE()` | `current_database()` | `DB_NAME()` | 单文件/附加库，无同义函数 |
| 元数据 | `information_schema` | `information_schema`、`pg_catalog` | `information_schema`、`sys` | `sqlite_schema` |
| 时间延迟 | `SLEEP()` | `pg_sleep()` | `WAITFOR DELAY` | 无内置 sleep |
| 行注释 | `-- `、`#` | `--` | `--` | `--` |
| 标识符引用 | 反引号，部分模式支持双引号 | 双引号 | 方括号或双引号 | 双引号，也兼容部分其他形式 |

其他重要差异：

- MySQL 的 SQL mode 会影响双引号、反斜杠转义和类型转换。
- PostgreSQL 类型系统通常更严格，`UNION` 两侧不兼容类型更容易报错。
- SQL Server 常通过 TDS 驱动访问，堆叠语句和错误表现取决于 API。
- SQLite 运行在应用进程中，没有独立数据库用户体系；文件权限就是重要边界。
- PDO 不是一种数据库。实际行为由 `pdo_mysql`、`pdo_pgsql`、`pdo_sqlsrv`、`pdo_sqlite` 等驱动决定。

## 六、本地 PHP/PDO 对照实验

下面示例使用 SQLite，数据只存在本地 `lab.sqlite`。启动前确认所在目录可写，然后执行：

```powershell
php -S 127.0.0.1:8000
```

把以下代码作为本地实验页时，数据库会自动创建。先访问 `http://127.0.0.1:8000/lab.php?id=1`，再仅在这个本地实例中比较 `id=1 AND 1=1` 与 `id=1 AND 1=2`。

### 6.1 有漏洞的版本

```php
<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:' . __DIR__ . '/lab.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);
$pdo->exec('CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY,
    username TEXT NOT NULL
)');
$pdo->exec("INSERT OR IGNORE INTO users (id, username) VALUES
    (1, 'alice'), (2, 'bob')");

$id = $_GET['id'] ?? '1';
if (!is_string($id)) {
    http_response_code(400);
    exit('id must be a string');
}

// 仅供本地靶场观察：输入被拼进 SQL 结构。
$sql = 'SELECT id, username FROM users WHERE id = ' . $id;
$rows = $pdo->query($sql)->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
```

问题发生在 `$id` 与 SQL 文本拼接。即使页面不显示 `$sql`，数据库仍会把拼接结果重新解析为语法。

### 6.2 修复版本

```php
<?php
declare(strict_types=1);

$pdo = new PDO('sqlite:' . __DIR__ . '/lab.sqlite', null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
]);

$rawId = $_GET['id'] ?? null;
$id = filter_var($rawId, FILTER_VALIDATE_INT, [
    'options' => ['min_range' => 1],
]);
if ($id === false) {
    http_response_code(400);
    exit('invalid id');
}

$stmt = $pdo->prepare(
    'SELECT id, username FROM users WHERE id = :id'
);
$stmt->bindValue(':id', $id, PDO::PARAM_INT);
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json; charset=utf-8');
echo json_encode($rows, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
```

修复包含两层：

1. `FILTER_VALIDATE_INT` 表达业务要求并限制类型与范围。
2. 预处理语句把 SQL 结构和参数分开发送。

只做第一层会让当前 `id` 场景较难注入，但其他字符串字段仍可能出问题；只做第二层能阻止 SQL 注入，却不会自动拒绝业务无效值。两层解决不同问题。

对 MySQL PDO，建议在连接配置中关闭模拟预处理，并仍使用参数化查询：

```php
$pdo = new PDO($dsn, $user, $password, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
```

这不是允许手工拼接的理由。还应确保服务器与客户端字符集一致，例如在 DSN 中明确 `charset=utf8mb4`。

## 七、授权 CTF 的分析方法

一套可复现、低影响的方法比无目的地堆载荷更有效：

### 7.1 建立基线

记录正常请求的：

- HTTP 方法、参数来源、Cookie 和 Content-Type。
- 状态码、稳定文本、记录数量和平均响应时间。
- 是否存在缓存、登录状态变化、速率限制和一次性令牌。

### 7.2 识别输入上下文

根据源码、题目附件或最小输入差异判断数字、字符串、`LIKE`、排序、JSON 路径等位置。优先阅读源码；黑盒猜测只作为授权题目的补充。

### 7.3 形成并验证单一假设

例如：“`id` 位于数字条件，真假条件会改变结果数量”。只用一对真假片段验证，至少重复一次。不要同时改变引号、注释、编码和布尔条件，否则无法知道哪个因素产生影响。

### 7.4 识别数据库和通道

从源码、驱动错误或题目说明确认数据库。再根据页面是否回显数据选择报错、联合或布尔方式；时间通道仅在没有稳定内容差异时使用。

### 7.5 控制影响并保留证据

- 使用只读查询和题目提供的数据范围。
- 限制请求频率、并发和延迟，不执行删除、写文件或外连操作。
- 保存最小请求、响应差异、数据库版本依据和复现步骤。
- 达到题目目标后停止，不继续枚举无关数据。

自动化工具会快速放大流量和影响。只有比赛规则明确允许、目标范围已核对且人工最小验证完成后，才考虑对本地或授权靶场使用，并设置请求上限、线程数和超时。公共系统不属于默认授权范围。

## 八、常见错误防御

### 8.1 手工转义或删除关键字

替换单引号、空格、`UNION` 或注释符无法覆盖不同编码、大小写、数据库语法和非字符串上下文，还可能破坏合法数据。过滤可作为业务校验，不能替代参数绑定。

### 8.2 只使用存储过程或 ORM

存储过程内部若拼接动态 SQL，仍然可注入。ORM 的普通查询 API 通常参数化，但 raw query、动态排序、字段名和手写条件仍需审计。

### 8.3 只隐藏错误

关闭错误回显会减少信息泄漏，却不能阻止布尔、时间、联合或二阶注入。应修复查询构造方式，同时保留受控服务端日志。

### 8.4 只部署 WAF

WAF 可提供监控和缓解，但可能与应用存在解码及重复参数解析差异。它无法理解全部业务动态 SQL，也不能代替代码修复。

## 九、防御检查清单

- [ ] 所有值使用预处理语句和绑定参数，不通过字符串拼接生成值。
- [ ] 表名、列名、排序方向和 JSON 路径使用服务端允许列表映射。
- [ ] 按业务模型验证类型、长度、字符集、枚举和数值范围。
- [ ] `LIKE` 查询按产品语义处理 `%`、`_` 和转义字符。
- [ ] 二次使用数据库值时仍参数化，防止二阶注入。
- [ ] 禁用不需要的多语句、文件、扩展和网络访问能力。
- [ ] 数据库账户使用最小权限，读写职责分离，不使用管理员账户运行应用。
- [ ] SQLite 数据库文件和目录设置最小文件系统权限，不放在可下载的 Web 目录。
- [ ] 生产环境不返回 SQL、堆栈和连接信息，内部日志避免记录密码和完整令牌。
- [ ] 为查询设置合理超时、结果上限和资源限制。
- [ ] 在代码审查中搜索 raw query、动态 SQL、存储过程拼接和 ORM 逃生接口。
- [ ] 测试数字、字符串、数组、重复参数、JSON 类型、排序和二阶数据流。
- [ ] 保持数据库、驱动、框架和 ORM 更新，并在实际支持的版本矩阵上测试。
- [ ] 对数据库出站流量采取默认拒绝策略，监控异常 DNS、HTTP 和长时间查询。

判断 SQL 注入时，关键问题始终是：**某段不可信数据是否有机会成为数据库解析的语法**。防御也应围绕这个边界展开，用参数化查询固定结构，用允许列表处理无法参数化的标识符，再以最小权限和监控限制剩余影响。
