# Archived: Empty City Directories (迁移轨迹)

**归档日期**: 2026-07-26
**触发**: Phase 1 (工程卫生) · 任务 P1.1d
**关联计划**: `/Users/allengaller/.claude/plans/zesty-spinning-map.md`

## 为什么归档

2026-07-15 的主题化重构（见 `_meta/2026-07-15-root-restructuring-by-theme.md`）将所有
内容从「按城市」改为「按主题」组织后，根目录下 11 个 `{city}/` 目录变成了仅含
`.gitkeep` 的空壳。它们的结构意义已不存在——主题目录里的 `上海-SPA.md` 已经把
城市前缀编码进了文件名。

继续保留它们会：
1. 增加认知噪音（新人分不清 `shanghai/` 与 `游戏/上海-X.md` 的关系）
2. 让 Phase 4 的 `generate.js` 输出路径修复（从 `hangzhou/` 改为 `健康/`）有
   "幽灵目标路径"干扰

## 归档内容

| 目录 ID | 中文名 | 归档前位置 |
|---------|--------|------------|
| shanghai | 上海 | `/shanghai/.gitkeep` |
| hangzhou | 杭州 | `/hangzhou/.gitkeep` |
| shenzhen | 深圳 | `/shenzhen/.gitkeep` |
| hongkong | 香港 | `/hongkong/.gitkeep` |
| tokyo | 东京 | `/tokyo/.gitkeep` |
| singapore | 新加坡 | `/singapore/.gitkeep` |
| seoul | 首尔 | `/seoul/.gitkeep` |
| thailand | 泰国 | `/thailand/.gitkeep` |
| moscow | 莫斯科 | `/moscow/.gitkeep` |
| spb | 圣彼得堡 | `/spb/.gitkeep` |
| newyork | 纽约 | `/newyork/.gitkeep` |

## 注意事项

- **Phase 4 将修复 `scripts/data-pipeline/generate.js` 的输出路径**，从根目录 `{cityId}/` 改为
  主题目录 `健康/`、`娱乐/` 等。届时不需要这些空目录作为落点。
- **前端 `assets/app.js` 的 `cities[]` 数组**当前包含 8 城（与 `index.html` 硬编码的 8 张
  城市卡片对齐）；Phase 3 会扩展为 11 城以匹配主题 MD 实际覆盖。
- 如果某个工具/脚本仍引用 `hangzhou/` `shanghai/` 等路径，会在 Phase 4 的管道修复中被一并消除。

## 还原方法

如果需要回滚（不推荐）：

```bash
for d in shanghai hangzhou shenzhen hongkong tokyo singapore seoul thailand moscow spb newyork; do
  mkdir -p "$d"
  mv "_meta/empty-city-archives/$d/.gitkeep" "$d/.gitkeep"
done
```