# 真实数据接入系统

## 🚀 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装

```bash
# 克隆仓库
git clone https://github.com/yourusername/dude-database.git
cd dude-database

# 安装依赖
npm install
```

### 配置API Key

1. 注册高德开发者账号: https://lbs.amap.com/
2. 创建应用，获取Web服务API Key
3. 设置环境变量:

```bash
export AMAP_KEY="your-amap-key-here"
```

或在项目根目录创建 `.env` 文件:

```
AMAP_KEY=your-amap-key-here
```

### 运行数据抓取

```bash
# 抓取杭州SPA数据（试点）
npm run test:hz:spa

# 或完整命令
node scripts/data-pipeline/fetch.js --city=hangzhou --category=spa
```

### 生成Markdown

```bash
# 生成杭州SPA的Markdown
node scripts/data-pipeline/generate.js --city=hangzhou --category=spa
```

### 查看结果

```bash
# 查看生成的数据
cat data/venues/hangzhou_spa.json

# 查看生成的Markdown
cat hangzhou/hangzhou-spa.md
```

---

## 📊 系统架构

```
┌────────────────────────────────────────────────────────────┐
│                        数据源层                             │
├─────────────┬─────────────┬────────────────────────────────┤
│  高德地图   │  大众点评   │        小红书                  │
│    API      │   爬虫      │        爬虫                    │
└──────┬──────┴──────┬──────┴────────┬───────────────────────┘
       │             │               │
       └─────────────┴───────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────┐
│                    数据处理层                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  数据抓取    │  │  数据清洗    │  │  Markdown生成    │ │
│  │  - 缓存机制  │  │  - 去重验证  │  │  - EJS模板       │ │
│  │  - 限流控制  │  │  - 可信度评分│  │  - 自动格式化    │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└────────────────────────────────────────────────────────────┘
                     │
                     ▼
┌────────────────────────────────────────────────────────────┐
│                      输出层                                 │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │  JSON数据    │  │  Markdown    │  │  GitHub Pages    │ │
│  │  data/venues │  │  city/*.md   │  │  自动部署        │ │
│  └──────────────┘  └──────────────┘  └──────────────────┘ │
└────────────────────────────────────────────────────────────┘
```

---

## 🗺️ 覆盖范围

### 国内城市（高德API）

| 城市 | 状态 | 数据量估算 |
|-----|------|-----------|
| 杭州 | 🔄 试点中 | ~500条/类别 |
| 上海 | ⏳ 待启动 | ~800条/类别 |
| 深圳 | ⏳ 待启动 | ~600条/类别 |
| 香港 | ⏳ 待启动 | ~400条/类别 |

### 国际城市

| 城市 | 方案 | 状态 |
|-----|------|------|
| 泰国 | Google Places API | ⏳ 待规划 |
| 莫斯科 | Google Places API | ⏳ 待规划 |
| 圣彼得堡 | Google Places API | ⏳ 待规划 |
| 纽约 | Google Places API | ⏳ 待规划 |

---

## 🛠️ 开发指南

### 添加新城市

1. 编辑 `scripts/data-pipeline/config/cities.json`:

```json
{
  "id": "chengdu",
  "name": "成都",
  "nameEn": "Chengdu",
  "adcode": "510100",
  "amapCityCode": "028",
  "region": "china"
}
```

2. 获取城市adcode: https://lbs.amap.com/api/webservice/download

### 添加新类别

1. 编辑 `scripts/data-pipeline/config/categories.json`:

```json
{
  "teahouse": {
    "name": "茶馆",
    "keywords": ["茶馆", "茶楼", "茶艺"],
    "amapTypes": ["050500"],
    "priority": 3
  }
}
```

2. 查找高德POI类型编码: https://lbs.amap.com/api/webservice/download

### 自定义模板

编辑 `scripts/data-pipeline/templates/city-category.md.ejs`

可用变量:
- `city`: 城市信息
- `category`: 类别信息
- `venues`: 场所数组

---

## 🔄 自动化流程

### GitHub Actions

已配置自动工作流:

1. **每周自动更新** (`.github/workflows/data-update.yml`)
   - 每周日凌晨2点自动抓取数据
   - 生成Markdown
   - 创建Pull Request

2. **数据验证** (`.github/workflows/validate-data.yml`)
   - PR时自动验证数据格式
   - 检查Markdown语法

### 手动触发

在GitHub仓库页面:
1. 进入 Actions 标签
2. 选择 "Data Pipeline"
3. 点击 "Run workflow"
4. 可选择指定城市和类别

---

## ⚠️ 注意事项

### 高德API限制

- 免费额度: 5000次/天
- 个人开发者可提升至1万次/天
- 超出后需付费: 500元/百万次

### 大众点评爬虫

⚠️ **高风险警告**:
- 可能违反服务条款
- 需要持续维护对抗反爬
- 建议使用代理IP

### 数据质量

- API数据仅供参考
- 建议人工审核关键信息
- 鼓励用户通过Issue提交更正

---

## 📈 成本估算

### 国内4城

| 项目 | 费用 |
|-----|------|
| 高德API | ~25元/月 |
| GitHub Actions | 免费 |
| **总计** | **~25元/月** |

### 全量8城（含国际）

| 项目 | 费用 |
|-----|------|
| 高德API | ~25元/月 |
| Google Places API | ~$150/月 |
| **总计** | **~1100元/月** |

---

## 🤝 贡献

### 数据贡献

发现错误或有新数据？请提交Issue:

```markdown
**城市**: 杭州
**类别**: SPA
**问题**: 某店已关闭
**更正**: 新地址为xxx
```

### 代码贡献

1. Fork 本仓库
2. 创建特性分支: `git checkout -b feature/xxx`
3. 提交更改: `git commit -am 'Add xxx'`
4. 推送分支: `git push origin feature/xxx`
5. 提交Pull Request

---

## 📜 许可证

MIT License - 详见 [LICENSE](LICENSE)

---

## 🙏 致谢

- [高德地图开放平台](https://lbs.amap.com/)
- [Puppeteer](https://pptr.dev/)
- [EJS](https://ejs.co/)
