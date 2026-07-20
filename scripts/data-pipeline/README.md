# 数据管道系统

## 概述

本系统用于自动从高德地图API抓取真实数据，并生成Markdown格式的城市生活指南。

## 系统架构

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  高德API    │───▶│  数据处理   │───▶│  Markdown   │
│  大众点评   │    │  去重/验证  │    │  生成器     │
└─────────────┘    └─────────────┘    └─────────────┘
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置API Key

```bash
export AMAP_KEY="你的高德地图API Key"
```

获取方式: https://lbs.amap.com/

### 3. 抓取数据

```bash
# 抓取所有国内城市所有类别
npm run fetch:china

# 抓取特定城市
npm run fetch -- --city=hangzhou

# 抓取特定类别
npm run fetch -- --city=hangzhou --category=spa
```

### 4. 生成Markdown

```bash
# 生成所有Markdown
npm run generate

# 生成特定城市
npm run generate -- --city=hangzhou

# 生成特定类别
npm run generate -- --city=hangzhou --category=spa
```

### 5. 完整流程

```bash
npm run pipeline
```

## 目录结构

```
scripts/data-pipeline/
├── config/
│   ├── cities.json          # 城市配置
│   └── categories.json      # 类别配置
├── sources/
│   └── amap.js              # 高德API封装
├── crawlers/
│   └── dianping.js          # 大众点评爬虫
├── processors/
│   ├── deduplicate.js       # 去重算法
│   ├── validate.js          # 数据验证
│   └── merge.js             # 多源合并
├── templates/
│   └── city-category.md.ejs # Markdown模板
├── fetch.js                 # 数据抓取入口
├── generate.js              # Markdown生成器
└── README.md                # 本文件
```

## 配置文件

### 城市配置 (config/cities.json)

```json
{
  "cities": [
    {
      "id": "hangzhou",
      "name": "杭州",
      "adcode": "330100",
      "amapCityCode": "0571",
      "region": "china"
    }
  ]
}
```

### 类别配置 (config/categories.json)

```json
{
  "categories": {
    "spa": {
      "name": "SPA",
      "keywords": ["SPA", "按摩", "养生"],
      "amapTypes": ["080000", "080100"],
      "priority": 1
    }
  }
}
```

高德POI类型编码参考: https://lbs.amap.com/api/webservice/download

## 数据流程

1. **抓取** (`fetch.js`)
   - 读取城市和类别配置
   - 调用高德API搜索POI
   - 缓存结果到 `data/venues/{city}_{category}.json`

2. **处理** (`processors/`)
   - 去重: 基于POI ID去重
   - 验证: 检查数据完整性
   - 合并: 多源数据合并

3. **生成** (`generate.js`)
   - 读取JSON数据
   - 渲染EJS模板
   - 输出Markdown到 `{city}/{city}-{category}.md`

## GitHub Actions 自动化

已配置两个工作流:

1. **Data Update** (`.github/workflows/data-update.yml`)
   - 每周日凌晨自动运行
   - 抓取最新数据
   - 创建Pull Request

2. **Validate Data** (`.github/workflows/validate-data.yml`)
   - PR时自动验证数据
   - 检查Markdown语法

## 使用建议

### 首次运行

建议先单个城市单个类别测试:

```bash
export AMAP_KEY="your-key"
npm run test:hz:spa
```

### 数据缓存

API响应会缓存到 `.cache/` 目录，有效期7天。如需强制刷新:

```bash
rm -rf scripts/.cache
npm run fetch
```

### 大众点评爬虫

⚠️ 警告: 大众点评有严格的反爬机制

使用前需要:
1. 准备代理IP池
2. 准备Cookie/登录态
3. 降低请求频率

```bash
node scripts/data-pipeline/crawlers/dianping.js 杭州 SPA
```

## 故障排除

### API限流

错误: `DAILY_QUERY_OVER_LIMIT`

解决:
- 等待次日配额重置
- 申请更高配额
- 使用多个Key轮换

### 数据为空

检查:
1. API Key是否有效
2. 城市adcode是否正确
3. 类别amapTypes是否存在

### 爬虫被拦截

大众点评:
- 使用代理IP
- 增加请求间隔
- 更新页面选择器

## 贡献

添加新城市:
1. 在 `config/cities.json` 添加城市信息
2. 获取城市adcode: https://lbs.amap.com/api/webservice/download

添加新类别:
1. 在 `config/categories.json` 添加类别
2. 查找对应高德POI类型编码
3. 更新模板

## 许可证

MIT
