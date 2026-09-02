#!/usr/bin/env node
/**
 * 数据抓取主入口
 * 用法: node fetch.js [--city=hangzhou] [--category=spa] [--region=china|international]
 */

const fs = require('fs').promises;
const path = require('path');
const AmapAPI = require('./sources/amap');
const citiesConfig = require('./config/cities.json');
const categoriesConfig = require('./config/categories.json');

// 命令行参数解析
function parseArgs() {
  const args = process.argv.slice(2);
  const options = {};
  
  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.slice(2).split('=');
      options[key] = value || true;
    }
  }
  
  return options;
}

// 确保数据目录存在
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// 保存数据
async function saveData(cityId, categoryId, data) {
  const outputDir = path.join(__dirname, '../../data/venues');
  await ensureDir(outputDir);
  
  const filename = path.join(outputDir, `${cityId}_${categoryId}.json`);
  const metadata = {
    city: cityId,
    category: categoryId,
    fetched_at: new Date().toISOString(),
    count: data.length,
    source: 'amap'
  };
  
  await fs.writeFile(filename, JSON.stringify({
    metadata,
    venues: data
  }, null, 2));
  
  console.log(`💾 已保存: ${filename}`);
}

// 抓取单个城市单个类别
async function fetchCityCategory(amap, city, category, maxResults = 50) {
  try {
    const results = await amap.searchCategory(city, category, maxResults);
    await saveData(city.id, Object.keys(categoriesConfig.categories).find(
      k => categoriesConfig.categories[k].name === category.name
    ), results);
    return results.length;
  } catch (error) {
    console.error(`❌ ${city.name} ${category.name} 失败:`, error.message);
    return 0;
  }
}

// 主函数
async function main() {
  const args = parseArgs();
  
  // 检查API Key
  const AMAP_KEY = process.env.AMAP_KEY;
  if (!AMAP_KEY) {
    console.error('❌ 错误: 请设置环境变量 AMAP_KEY');
    console.error('   获取方式: https://lbs.amap.com/');
    process.exit(1);
  }

  const amap = new AmapAPI(AMAP_KEY);
  const cities = citiesConfig.cities;
  const categories = categoriesConfig.categories;

  console.log('🚀 开始数据抓取...\n');
  console.log(`API Key: ${AMAP_KEY.slice(0, 8)}...`);

  // 过滤城市和类别
  let targetCities = cities;
  let targetCategories = Object.entries(categories);

  if (args.city) {
    targetCities = cities.filter(c => c.id === args.city);
    if (targetCities.length === 0) {
      console.error(`❌ 未知城市: ${args.city}`);
      process.exit(1);
    }
  }

  if (args.category) {
    targetCategories = targetCategories.filter(([k, v]) => 
      k === args.category || v.name === args.category
    );
    if (targetCategories.length === 0) {
      console.error(`❌ 未知类别: ${args.category}`);
      process.exit(1);
    }
  }

  if (args.region) {
    targetCities = targetCities.filter(c => c.region === args.region);
  }

  // 只处理国内城市（高德）
  targetCities = targetCities.filter(c => c.region === 'china');

  console.log(`\n📍 目标城市: ${targetCities.map(c => c.name).join(', ')}`);
  console.log(`📂 目标类别: ${targetCategories.length} 个`);
  console.log('');

  // 统计
  let totalVenues = 0;
  const stats = [];

  // 开始抓取
  for (const city of targetCities) {
    console.log(`\n🏙️  ${city.name}`);
    console.log('='.repeat(50));

    for (const [catKey, catConfig] of targetCategories) {
      // 只处理有amapTypes的类别
      if (!catConfig.amapTypes || catConfig.amapTypes.length === 0) {
        console.log(`⏭️  ${catConfig.name}: 跳过（无高德类型映射）`);
        continue;
      }

      const count = await fetchCityCategory(amap, city, catConfig, 30);
      totalVenues += count;
      stats.push({ city: city.name, category: catConfig.name, count });
      
      // 请求间隔，避免触发限流
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 输出统计
  console.log('\n' + '='.repeat(50));
  console.log('📊 抓取统计');
  console.log('='.repeat(50));
  
  const cityStats = {};
  for (const s of stats) {
    cityStats[s.city] = (cityStats[s.city] || 0) + s.count;
  }
  
  for (const [city, count] of Object.entries(cityStats)) {
    console.log(`  ${city}: ${count} 条`);
  }
  
  console.log(`\n✅ 总计: ${totalVenues} 条数据`);
  console.log(`📁 数据保存位置: data/venues/`);
}

// 错误处理
main().catch(error => {
  console.error('❌ 程序错误:', error);
  process.exit(1);
});
