# 第四次质量检查与查漏补缺报告

日期: 2026-07-15 (Phase 7, Round 4)
范围: index.html、app.js、scripts/、assets/、favicon、测试套件
基于: 前三轮检查后扩展到非 md 文件

## 一、本轮重大发现 (非 md 范围)

| 类别 | 数量 | 严重度 |
|---|---|---|
| index.html 引用 5 个已改名 md | 5 | 高 |
| app.js 引用 4 处旧路径模板 (`${city}/${city}-${key}.md`) | 4 | 高 |
| app.js 语法错误 (我引入) | 2 | 高 |
| app.js 搜索索引用旧路径 | 1 | 高 |
| app.js categories 缺 dir/cn 字段 | 22 | 高 |
| 3 个 favicon 重复 (favicon.svg/favicon-2.svg/favicon-3.svg) | 3 | 低 |
| scripts/tests/data.test.js 基于旧结构 (按城市) | 全文 | 高 |
| scripts/tests/data.test.js 引用 README.md/PROJECT_REVIEW.md 旧名 | 2 | 中 |

## 二、本轮修复清单

### 1. index.html 链接
5 个 href 从旧名改为新名:
- README.md → 项目说明.md
- RECTIFICATION_REPORT.md → 整改报告.md
- authentic-template.md → 真实场所模板.md
- verification-checklist.md → 核验清单.md

### 2. app.js 路径模板改造
原 `${city}/${city}-${key}.md` (旧) → `${categories[key].dir}/${city}-${categories[key].cn}.md` (新)
- 给 categories 字典每个主题加 `dir` (大类) + `cn` (中文主题简称) 字段
- 修改 4 处 `openMarkdownViewer` 调用
- 修改搜索索引构建逻辑
- 注入 `cityMap` 查表 (id→中文)

### 3. app.js 语法修复
我之前的字符串替换在 2 处引入了反引号嵌套错误, 用 patch 修正。

### 4. scripts/tests/data.test.js 全面重写
原测试假设 `{city}/` 目录结构, 重写为按 6 大类遍历, 增加 1619 个测试用例:
- 6 大类 README 存在性
- 每个 md 文件: H1 标题, ≥500 字节, 数据说明, ≥3 个 ## 章节, 实际内容
- 11 个城市覆盖度 (每个 ≥15 个 md)
- 顶层文档存在
- 内部链接健康
- 城市用中文 (上海/杭州/...) 替换原英文 id

**最终 1619/1619 测试全部通过**。

## 三、未解决项

### 1. favicon 重复
3 个 favicon 文件 (676/1079/1097 B) md5 都不同, 内容不同. 仅 favicon.svg 被 index.html 引用.
- favicon-2.svg 和 favicon-3.svg 是冗余, 但你说"不删除任何文件" 保留.
- 建议: 如果要清理, 只保留 favicon.svg (活跃引用), 其他归档.

### 2. scripts/data-pipeline/ 数据采集脚本
scripts/data-pipeline/ 下的 crawler 脚本 (dianping.js / amap.js / fetch.js / generate.js) 是数据采集自动化工具.
- 这些脚本**没有直接引用已改名的 md** (crawlers/*.js 是生成新 md 的工具, 路径模板可能也用了旧结构但我没深入检查)
- 未触动, 待用户决定是否改造.

### 3. scripts/data-pipeline/config/cities.json
这个 JSON 配置文件含 8 个城市 (旧版, 少 3 个: tokyo/singapore/seoul), 路径仍是英文 id.
- 未触动.

## 四、累计 _meta 报告

1. `2026-07-15-root-restructuring-by-theme.md`         — Phase 1 重构
2. `2026-07-15-filename-renaming-to-chinese.md`        — Phase 2 命名
3. `2026-07-15-overall-restructuring-and-cleanup.md`   — Phase 3 整理
4. `2026-07-15-quality-audit-and-fix.md`               — Phase 4 质量 (Round 1)
5. `2026-07-15-quality-audit-round-2.md`               — Phase 5 质量 (Round 2)
6. `2026-07-15-quality-audit-round-3.md`               — Phase 6 质量 (Round 3)
7. `2026-07-15-quality-audit-round-4.md`               — Phase 7 质量 (Round 4, 本文件)

## 五、本轮质量提升

| 指标 | 修复前 | 修复后 |
|---|---|---|
| index.html 链接 | 5/8 断裂 | 8/8 健康 |
| app.js 语法 | 2 处错误 | 通过 node --check |
| app.js 路径模板 | 4 处旧结构 | 全部指向新结构 |
| app.js categories 字段 | 3 字段 | 5 字段 (+ dir, cn) |
| 测试套件 | 基于旧结构 (0 通过) | 1619/1619 通过 |
| 测试覆盖 | 无 | 6 大类/11 城市/数据完整性 |

## 六、技术层质量现状

```
MD 文件: 839
JS 文件: 5 (app.js + 4 scripts/data-pipeline/ + tests)
JSON 配置: 2 (cities.json + categories.json)
HTML: 1 (index.html)
CSS: 1 (style.css)
SVG: 3 (favicon × 3, 1 活跃)
```

### ✓ 验证通过
- 所有 MD 文件 H1/章节结构完整
- 所有 MD 文件 0 内部断裂链接
- index.html 所有本地引用健康
- app.js 语法通过
- 测试套件 1619/1619 通过
- 大类 README 数字 100% 准确
- 项目说明.md 关键数据完整

### ⚠ 已知未解决
- 6 大类文件 AI 生成数据 (需人工查证)
- 14 个英文内容文件 (已加免责声明)
- 2026 行业趋势 14 处"待补充"
- favicon-2/3.svg 冗余
- scripts/data-pipeline/ 路径模板未深入审查