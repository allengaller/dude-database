# 文件名重命名报告 — 中文简称

日期: 2026-07-15
操作: 文件名 mv, **不修改任何 md 文件内容**
范围: 833 → 820 md (-13, 因 adult-industry/README.md / scripts/data-pipeline/README.md 等重复已被步骤合并)

## 一、范围与命名规则

| 类别 | 文件数 | 命名规则 | 状态 |
|---|---|---|---|
| 大类下城市主题 md | 315 | `{城市简称}-{主题简称}.md` | ✓ |
| adult-industry/ | 13 | `{中文简称}.md` | ✓ |
| 顶层散落 md | 13 | `{中文简称}.md` | ✓ |
| gaming/games/ | 456 | `{中文}-{英文原名}.md` | ✓ |

## 二、命名映射表

### 城市 (11)
shanghai→上海 / hangzhou→杭州 / shenzhen→深圳 / hongkong→香港 / newyork→纽约
moscow→莫斯科 / spb→圣彼得堡 / thailand→泰国 / tokyo→东京 / singapore→新加坡 / seoul→首尔

### 主题 (30)
游戏类 (4): board-game→桌游 / escape-room→密室 / jubensha→剧本杀 / amusement→游乐场
娱乐类 (5): ktv→KTV / nightclub→夜店 / bars→酒吧 / coffee→咖啡 / internet-cafe→网吧
景点类 (3): tourism→观光 / park→公园 / hiking→徒步
购物类 (3): anime-merch→二次元 / art→艺术 / medical-beauty→医美
健康类 (7): hospital→医院 / dentist→牙医 / gym→健身 / spa→SPA / psychology→心理 / running→跑步 / cycling→骑行
生活类 (5): dating→约会 / young-women→年轻女性 / coworking→共享办公 / library→图书馆 / internet-famous→网红
身后类 (3): funeral→殡葬 / cemetery→墓地 / nursing-home→养老院

### 顶层散落 md (13)
README.md→项目说明.md / HOMEPAGE_GUIDE.md→主页指南.md / IMPLEMENTATION_SUMMARY.md→实施总结.md
PROJECT_EVALUATION.md→项目评估.md / PROJECT_REVIEW.md→项目审查.md / RECTIFICATION_REPORT.md→整改报告.md
README-DATA-PIPELINE.md→数据管道说明.md / industry-trends-2026.md→2026行业趋势.md
adult-industry-global.md→全球成人产业.md / authentic-template.md→真实场所模板.md
data-source-template.md→数据源模板.md / template.md→模板.md / verification-checklist.md→核验清单.md

### adult-industry/ (13)
overview→概览 / legal→法律 / health-safety→健康安全 / digital-platforms→数字平台
practical-guide→实用指南 / traveler-checklist→旅客清单 / global-itineraries→全球行程
cultural-hubs→文化中心 / events→活动 / asia→亚洲 / europe→欧洲 / north-america→北美
south-america-oceania→南美大洋洲

### gaming/ (456)
按 Wikipedia / Steam 国内通用译名, 示例:
- elden-ring → 艾尔登法环-elden-ring.md
- zelda-tears-of-the-kingdom → 塞尔达传说-王国之泪-zelda-tears-of-the-kingdom.md
- dark-souls → 黑暗之魂-dark-souls.md
- call-of-duty-modern-warfare-2019 → 使命召唤-现代战争-2019-call-of-duty-modern-warfare-2019.md

## 三、gaming/ 已知问题 (未解决, 待后续)

### 1. 重复文件 (75 个, 同一游戏多路径)
- 同一游戏在多个年份目录 + series 目录都有
- 例: `elden-ring` 在 gaming/games/2000s/, gaming/games/2020s/, gaming/games/2022/ 都有
- 例: `god-of-war` 出现 3 次 (2005/2018/2010s)
- 当前所有重复都已被重命名, 文件**保留**, 路径多样
- 下一步建议: dedup (仅保留一个权威版本, 其他归入 _superseded/)

### 2. 文件名拼写错误 (2 个)
- `metal-great-solid-2-2001` 应是 `metal-gear-solid-2-2001` (great→gear 错)
- `pokmon-red-green` 应是 `pokemon-red-green` (少一个 o)
- 当前保留原拼写, 文件名已是 `合金装备2-metal-great-solid-2-2001.md` 和 `宝可梦-红绿-pokmon-red-green.md`

### 3. 重命名后长度
部分文件名变长, 但全部 < 100 字符, 终端可读

## 四、最终统计

| | 数量 |
|---|---|
| 总 md | 820 |
| 顶层散落 md | 13 (全中文) |
| 6 大类 md | 315 (全中文) |
| adult-industry/ md | 13 (全中文) |
| gaming/games/ md | 456 (中文-英文格式) |
| 其他 (scripts / _meta / README) | 23 |
| 根目录空城市目录 | 11 (保留, 不删) |

## 五、未触动

- .qoder/ / .trae/ (工具配置/历史规划, 共 13 md)
- node_modules/ / .git/ (依赖/版本控制)
- 所有 md 文件**内容** (仅改文件名)
- 11 个空城市目录 (shanghai/ tokyo/ 等)
- 根目录 gaming/ / adult-industry/ / scripts/ / assets/ / data/ 文件夹名称