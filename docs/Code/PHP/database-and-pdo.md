# 数据库与 PDO
本篇使用 PHP 8.1+ 的 PDO 介绍连接、参数化查询、事务、异常和数据边界。
示例以通用关系型数据库概念为主，具体 DSN 和 SQL 语法应按驱动调整。
## 为什么选择 PDO
PDO 提供统一的连接、预处理、事务和结果读取接口。
它不消除数据库之间的 SQL 方言、类型、锁和错误码差异。
`mysqli` 也是 MySQL 的有效接口，但项目应统一一种数据访问方式。
旧的 `mysql_*` 扩展早已移除，不应出现在现代代码中。
## 连接配置
秘密通过部署配置注入，不写入源码：
```php
$dsn = 'mysql:host=127.0.0.1;port=3306;dbname=app;charset=utf8mb4';
$pdo = new PDO($dsn, $dbUser, $dbPassword, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES => false,
]);
```
MySQL 明确使用 `utf8mb4`，并保证连接、表和字段字符集策略一致。
驱动不支持原生预处理或特定语句时，模拟预处理行为可能不同，应按驱动测试。
生产账户遵循最小权限，应用读写账户不应拥有建库、授权或文件系统权限。
## SQLite 示例连接
本地学习可使用固定路径的 SQLite：
```php
$databasePath = __DIR__ . '/data/app.sqlite';
$pdo = new PDO('sqlite:' . $databasePath, null, null, [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]);
```
目录权限必须限制，数据库文件不能放在可直接下载的 Web 根目录。
不要让查询参数决定数据库文件路径。
## 参数化查询
外部值只能作为数据参数绑定：
```php
$statement = $pdo->prepare(
    'SELECT id, email FROM users WHERE email = :email AND active = :active'
);
$statement->execute([
    'email' => $email,
    'active' => 1,
]);
$user = $statement->fetch();
```
参数值不会被解释为 SQL 结构，这是防止 SQL 注入的核心边界。
仍应验证邮箱长度和业务格式，因为参数化不负责业务正确性。
## 命名参数与位置参数
```php
$statement = $pdo->prepare('SELECT name FROM users WHERE id = ?');
$statement->execute([$id]);
```
同一语句统一使用命名或位置参数，不要混合。
部分驱动不允许同一个命名参数重复出现，稳妥做法是使用不同占位符。
不要手工给参数添加引号，SQL 中占位符周围也不写字符串引号。
## 绑定类型
```php
$statement = $pdo->prepare('SELECT id FROM users WHERE id = :id');
$statement->bindValue(':id', $id, PDO::PARAM_INT);
$statement->execute();
```
`bindValue()` 绑定当前值，`bindParam()` 按引用绑定变量并在执行时取值。
多数一次性查询使用 `execute()` 数组或 `bindValue()` 更直观。
布尔、空值和大整数的转换因驱动而异，关键字段应做集成测试。
## 插入与主键
```php
$statement = $pdo->prepare(
    'INSERT INTO users (email, display_name) VALUES (:email, :display_name)'
);
$statement->execute([
    'email' => $email,
    'display_name' => $displayName,
]);
$id = $pdo->lastInsertId();
```
`lastInsertId()` 的语义依赖驱动和数据库，不应假设总是整数或总是可用。
唯一约束冲突应作为正常业务竞争处理，而不是只靠“先查再插”。
## 更新与受影响行数
```php
$statement = $pdo->prepare(
    'UPDATE users SET display_name = :name WHERE id = :id'
);
$statement->execute(['name' => $name, 'id' => $id]);
$changed = $statement->rowCount();
```
`rowCount()` 对 `SELECT` 的语义不可移植；查询结果数量应按数据库策略计算。
更新前必须执行对象级授权，不能只因为用户知道某个 `id` 就允许修改。
受影响行数为零可能表示记录不存在，也可能表示值未变化，需按驱动与业务判断。
## 读取结果
```php
$row = $statement->fetch();
if ($row === false) {
    // 未找到
}
$rows = $statement->fetchAll();
```
大结果集不要无上限 `fetchAll()`，应分页或逐行处理。
数据库返回值常以字符串表示，领域层应明确转换并检查范围。
不要直接把整行数据库结果原样输出给 API，避免泄露内部字段。
## 动态 IN 列表
占位符只能代表一个值，不能把数组绑定到单个参数：
```php
if ($ids === []) {
    return [];
}
$placeholders = implode(', ', array_fill(0, count($ids), '?'));
$statement = $pdo->prepare("SELECT id, name FROM users WHERE id IN ($placeholders)");
$statement->execute($ids);
```
先验证每个 ID 的类型并限制列表长度。
SQL 结构片段由应用根据元素数量生成，实际值仍全部绑定。
## 动态列名与排序
参数不能替代表名、列名、方向或 SQL 关键字。
这些结构必须来自代码中的允许列表：
```php
$sortColumns = ['name' => 'display_name', 'created' => 'created_at'];
$sortColumn = $sortColumns[$requestedSort] ?? 'created_at';
$direction = $requestedDirection === 'asc' ? 'ASC' : 'DESC';
$sql = "SELECT id, display_name FROM users ORDER BY $sortColumn $direction";
```
这里只拼接应用自己选出的固定片段，不拼接原始请求值。
表名多租户方案尤其危险，优先使用数据模型和权限机制而不是动态表名。
## LIMIT 与分页
页码和每页数量先转换、检查范围，再按驱动支持方式绑定：
```php
$limit = max(1, min($limit, 100));
$offset = max(0, $offset);
$statement = $pdo->prepare(
    'SELECT id, name FROM users ORDER BY id LIMIT :limit OFFSET :offset'
);
$statement->bindValue(':limit', $limit, PDO::PARAM_INT);
$statement->bindValue(':offset', $offset, PDO::PARAM_INT);
$statement->execute();
```
超大偏移分页性能较差，大数据可使用基于稳定游标的分页。
排序必须稳定，否则并发写入时可能重复或遗漏记录。
## 事务
需要原子完成多个写操作时使用事务：
```php
$pdo->beginTransaction();
try {
    debit($pdo, $fromId, $amount);
    credit($pdo, $toId, $amount);
    $pdo->commit();
} catch (Throwable $exception) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    throw $exception;
}
```
事务边界应尽量短，不在事务中等待用户输入或调用慢速外部服务。
隔离级别、锁行为、DDL 是否提交以及嵌套事务支持均依赖数据库。
应用必须准备处理死锁和序列化失败，并只对可安全重试的整体操作重试。
## 并发与一致性
“先查询再更新”可能在两个请求并发时失效。
使用唯一约束、外键、检查约束、原子更新和适当锁保证数据库不变量。
乐观锁可在 `WHERE` 中加入版本号，并检查受影响行数。
不要把输入验证当作数据库约束的替代，两者处于不同边界。
## 异常处理
`PDO::ERRMODE_EXCEPTION` 让数据库错误抛出 `PDOException`。
```php
try {
    $statement->execute($parameters);
} catch (PDOException $exception) {
    $logger->error('数据库操作失败', ['exception' => $exception]);
    throw new RuntimeException('暂时无法完成请求', 0, $exception);
}
```
日志应避免记录密码、完整 SQL 参数、个人信息和敏感令牌。
客户端只接收稳定、无内部细节的错误消息和适当状态码。
不要把所有数据库错误都误报为“未找到”。
## 查询封装
数据访问函数接收已验证的领域值并返回明确结构：
```php
function findUserById(PDO $pdo, int $id): ?array
{
    $statement = $pdo->prepare(
        'SELECT id, email, display_name FROM users WHERE id = :id'
    );
    $statement->execute(['id' => $id]);
    $row = $statement->fetch();
    return $row === false ? null : $row;
}
```
不要让控制器到处拼 SQL；集中数据边界更便于测试、授权审计和迁移。
ORM 和查询构造器仍可能接受原始表达式，使用它们不自动消除注入风险。
## 资源与性能
连接在脚本结束时通常释放，也可将 PDO 变量设为 `null` 提前断开。
持久连接会改变事务、临时表和会话状态的生命周期，只有理解驱动行为后才启用。
为数据库设置连接与查询超时，避免请求无限等待。
只选择需要的列，建立与查询匹配的索引，并用执行计划验证性能假设。
性能优化不能牺牲参数化、授权或一致性约束。
## 安全检查清单
- 凭据不在源码、日志、异常页面或版本库中。
- 账户最小权限，生产库不使用管理员账户。
- 每个外部值都通过参数绑定，不手工转义 SQL。
- 动态标识符和排序只来自固定允许列表。
- 列表长度、分页大小和查询范围有上限。
- 对象读取和修改均执行服务端授权。
- 事务覆盖完整不变量，并正确回滚异常路径。
- 数据库约束与应用验证共同保证一致性。
- 错误对外隐藏内部细节，对内保留可审计上下文。
## 小结
PDO 的安全核心是把 SQL 结构固定在代码中，把数据值交给参数绑定。
事务、约束、授权和异常策略解决的是参数化查询之外的一致性与保密问题。
下一篇将从防御角度分析 PHP 常见漏洞与授权 CTF 学习方法。
