# 根目录重构报告 — 按主题横向分类

日期: 2026-07-15
操作: mv 315 个 md (不删除任何 md)
范围: 11 个城市目录下的 {城市}-{主题}.md

## 一、重构前 vs 重构后

| | 重构前 | 重构后 |
|---|---|---|
| 维度 | 按城市 (shanghai/, tokyo/...) | 按主题 (游戏/, 健康/, 景点/...) |
| 文件数 (城市生活类) | 315 md 分散 11 目录 | 315 md 集中 6 大类 |
| 路径示例 | shanghai/shanghai-park.md | 景点/shanghai-park.md |
| 查找方式 | 先选城市 → 再选主题 | 先选主题 → 看所有城市 |

## 二、6 大类映射表

| 大类目录 | 主题 | 文件数 |
|---|---|---|
| 游戏 | board-game, escape-room, jubensha, amusement | 35 |
| 娱乐 | ktv, nightclub, bars, coffee, internet-cafe | 52 |
| 景点 | tourism, park, hiking | 33 |
| 购物 | anime-merch, art, medical-beauty | 30 |
| 健康 | hospital, dentist, gym, spa, psychology, running, cycling | 77 |
| 生活 | dating, young-women, coworking, library, internet-famous | 55 |
| 身后 | funeral, cemetery, nursing-home | 33 |
| **合计** | **30 个主题** | **315 md** |

## 三、保留原位目录 (不动)

| 目录 | 内容 | 处理 |
|---|---|---|
| gaming/ | 单机游戏 100+ md (gta / elden-ring / zelda) | 不动 (跟城市 board-game 不同概念) |
| adult-industry/ | 跨城市成人主题 16+ md | 不动 (已经是聚合目录) |
| assets/ data/ scripts/ | 资源/脚本 | 不动 |
| shanghai/ hangzhou/ hongkong/ moscow/ newyork/ shenzhen/ spb/ thailand/ tokyo/ singapore/ seoul/ | 现已为空 | 保留 (符合"不删任何 md"原则; 空目录无害) |

## 四、根目录最终布局

```
dude-database/
├── 游戏/        35 md  (桌游/密室/剧本杀/游乐场)
├── 娱乐/        52 md  (KTV/夜店/酒吧/咖啡/网吧)
├── 景点/        33 md  (观光/公园/徒步)
├── 购物/        30 md  (二次元周边/艺术/医美)
├── 健康/        77 md  (医院/牙医/健身/SPA/心理/跑步/骑行)
├── 生活/        55 md  (约会/年轻女性/共享办公/图书馆/网红)
├── 身后/        33 md  (殡葬/墓地/养老院)
├── gaming/      单机游戏聚合 (原位)
├── adult-industry/  成人主题聚合 (原位)
├── [11 个空城市目录]  (保留)
├── README.md / HOMEPAGE_GUIDE.md / IMPLEMENTATION_SUMMARY.md ...  文档
└── assets/ data/ scripts/  资源
```

## 五、统计验证

- mv 操作: 315/315 成功, 0 跳过, 0 冲突
- 总 md 数: 825 (重构前 = 重构后, 无增减)
- 空目录数: 11 (原城市目录, 全部保留)
- 新增根目录: 7 (含游戏娱乐合并的 6 大类 + 备查)