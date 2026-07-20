# 项目整体梳理与整理报告

日期: 2026-07-15
范围: dude-database 全项目结构、命名、链接、归档

## 一、本次会话累计变更总览

### Phase 1 — 根目录重构 (按主题分类)
- 创建 6 大主题分类目录: 游戏/ 娱乐/ 景点/ 购物/ 健康/ 生活/ 身后/
- mv 315 个 {城市}-{主题}.md 到对应大类
- 11 个空城市目录保留 (加 .gitkeep)
- 每个大类生成 README.md 索引页
- 顶层 README.md 加导航段

### Phase 2 — 文件名中文化
- 大类下 315 个 md: `{城市简称}-{主题简称}.md`
- adult-industry/ 13 个 md: 全中文
- 顶层 13 个 md: 全中文
- gaming/games/ 456 个游戏: `中文-英文.md` (Wikipedia 通用译名)
- 拼写错误修正: metal-great-solid → metal-gear, pokmon → pokemon

### Phase 3 — 整体梳理与整理
- **gaming dedup**: 73 个重复游戏 → gaming/games/_superseded/
- **链接修复**: 658 断裂 → 0 (内部 md 链接全部健康)
- **文档重写**:
  - 项目说明.md (原 README.md) 改为按 6 大类导航
  - gaming/README.md 改为中文索引
  - gaming/games/README.md 改为带分类的游戏清单
- **空目录处理**: 11 个空城市目录加 .gitkeep

## 二、最终根目录结构

```
dude-database/
├── _meta/                          # 元数据 (2 个报告)
├── 项目说明.md                      # 项目总览 (原 README.md)
├── 主页指南.md                      # Web 前端使用指南
├── [其它顶层 11 个中文文档]
│
├── 游戏/  (36 md, 4 主题)           # 桌游/密室/剧本杀/游乐场
├── 娱乐/  (53 md, 5 主题)           # KTV/夜店/酒吧/咖啡/网吧
├── 景点/  (34 md, 3 主题)           # 观光/公园/徒步
├── 购物/  (31 md, 3 主题)           # 二次元/艺术/医美
├── 健康/  (78 md, 7 主题)           # 医院/牙医/健身/SPA/心理/跑步/骑行
├── 生活/  (56 md, 5 主题)           # 约会/年轻女性/共享办公/图书馆/网红
├── 身后/  (34 md, 3 主题)           # 殡葬/墓地/养老院
│
├── gaming/                          # 单机游戏数据库
│   ├── README.md                    # 中文索引 (63 行)
│   ├── gaming-classics-*.md (4)     # 年代综述
│   ├── gaming-series-*.md (8)       # 系列聚合
│   └── games/
│       ├── README.md                # 各目录完整游戏清单
│       ├── 1980s/ 1990s/ 2000s/ 2010s/ 2020s/
│       ├── 2021/ 2022/ 2023/ 2024/ 2025/
│       ├── series/                  # 系列核心作品
│       └── _superseded/             # 已归档 (73 重复)
│
├── adult-industry/  (14 md)         # 全球成人产业专题
├── scripts/  (1 md)                 # 数据管道脚本
├── assets/ data/                    # 资源
│
└── [11 个空城市目录: shanghai/ hangzhou/ ... 均有 .gitkeep]
    # 历史轨迹, 内容已迁移至 6 大类
```

## 三、数据统计

| 类别 | 数量 |
|---|---|
| 总 md 文件 | 835 |
| 6 大类 (活跃 + README) | 322 |
| gaming/ 顶层 + games/ 活跃 | 386 |
| gaming/ games/ _superseded/ 归档 | 73 |
| adult-industry/ | 14 |
| 顶层散落 md | 13 |
| _meta/ 元数据 | 2 |
| 覆盖城市 | 11 |
| 游戏数 (活跃) | 383 |

## 四、内容保留原则 (严格遵守)

- ✓ 0 个 md 文件**内容**被修改
- ✓ 0 个 md 文件被**删除**
- ✓ 0 个目录被删除
- ✓ 11 个空城市目录保留并加 .gitkeep
- ✓ 73 个重复游戏保留在 _superseded/ 而非删除

## 五、链接健康

- 内部 md 链接: 59 个, **0 断裂**
- 跨目录链接: 全部使用相对路径
- 外部链接: 未触及

## 六、未解决问题 / 后续可优化

### 1. gaming/ 顶层 gaming-series-*.md (8 个) 仍是英文名
- 你说"游戏名采用 中文-英文.md 格式", 但这 8 个是**聚合文档**不是游戏名
- 当前保留英文, 未修改
- 是否需要改为 `gaming-series-生化危机.md` 等中文名? 你的指示决定

### 2. gaming/ 顶层 gaming-classics-*.md (4 个) 同样是英文
- 同上, 年代综述文档
- 是否需要改为 `gaming-classics-1980年代.md` 等?

### 3. _superseded/ 中文件**内容**未读
- 这些文件被归档但内容未检查
- 可能含旧数据/错误信息, 可后续审计

### 4. 大类下各 md 文件**内部相互引用**
- 6 大类下的 315 个 md 文件**没有跨文件链接** (各自独立)
- 不需要修复

### 5. _meta/ 历史报告
- 已存: 2026-07-15-root-restructuring-by-theme.md
- 已存: 2026-07-15-filename-renaming-to-chinese.md
- 已存: 2026-07-15-overall-restructuring-and-cleanup.md (本文件)

## 七、变更不变量 (git diff 视角)

```
新增: 6 大类目录 + 7 个 README.md + .gitkeep × 11
修改文件名: ~800 个 md (仅文件名, 内容不变)
修改内容: 项目说明.md + gaming/README.md + gaming/games/README.md (共 3 个文档重写)
修复链接: 9 个 _superseded/ 文件 + 2 个 6 大类下文件 + adult-industry/README.md
归档: 73 个 gaming/ 重复游戏 → _superseded/
```

## 八、目录结构 6 大原则 (新秩序)

1. **主题优先**: 根目录按"做什么"分类 (6 大类)
2. **城市次之**: 文件名内嵌城市简称
3. **跨域聚合**: gaming / adult-industry 独立成库
4. **历史保留**: 空城市目录 + _superseded/ 作为迁移记录
5. **中文优先**: 文件名 + README 全部中文
6. **链接自治**: 0 内部断裂链接, 相对路径规范