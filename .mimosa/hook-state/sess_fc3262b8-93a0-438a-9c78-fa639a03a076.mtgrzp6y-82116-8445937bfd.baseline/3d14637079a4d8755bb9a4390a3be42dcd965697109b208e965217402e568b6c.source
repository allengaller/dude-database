#!/usr/bin/env node
/**
 * Markdown 生成器
 * 将抓取的JSON数据转换为Markdown文件
 */

const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const citiesConfig = require('./config/cities.json');
const categoriesConfig = require('./config/categories.json');

// 解析命令行参数
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

// 确保目录存在
async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

// 加载模板
async function loadTemplate() {
  const templatePath = path.join(__dirname, 'templates/city-category.md.ejs');
  return await fs.readFile(templatePath, 'utf8');
}

// 生成单个Markdown文件
async function generateMarkdown(city, category, venues, template) {
  const data = {
    city,
    category,
    venues,
    generatedAt: new Date().toISOString()
  };

  const content = ejs.render(template, data);
  return content;
}

// 保存Markdown文件
async function saveMarkdown(cityId, categoryId, content) {
  const outputPath = path.join(__dirname, `../../${cityId}/${cityId}-${categoryId}.md`);
  await fs.writeFile(outputPath, content, 'utf8');
  console.log(`  ✍️  ${outputPath}`);
}

// 加载抓取的数据
async function loadVenueData(cityId, categoryId) {
  const dataPath = path.join(__dirname, `../../data/venues/${cityId}_${categoryId}.json`);
  
  try {
    const content = await fs.readFile(dataPath, 'utf8');
    const data = JSON.parse(content);
    return data.venues || [];
  } catch (e) {
    return null;
  }
}

// 主函数
async function main() {
  const args = parseArgs();
  
  console.log('📝 开始生成 Markdown...\n');

  // 加载模板
  const template = await loadTemplate();
  
  // 获取城市和类别
  const cities = citiesConfig.cities.filter(c => c.region === 'china');
  const categories = categoriesConfig.categories;

  // 过滤
  let targetCities = cities;
  let targetCategories = Object.entries(categories);

  if (args.city) {
    targetCities = cities.filter(c => c.id === args.city);
  }

  if (args.category) {
    targetCategories = targetCategories.filter(([k, v]) => 
      k === args.category || v.name === args.category
    );
  }

  let generatedCount = 0;
  let skippedCount = 0;

  // 生成每个城市每个类别的Markdown
  for (const city of targetCities) {
    console.log(`🏙️  ${city.name}`);
    
    for (const [catId, catConfig] of targetCategories) {
      // 只处理有amapTypes的类别
      if (!catConfig.amapTypes || catConfig.amapTypes.length === 0) {
        continue;
      }

      const venues = await loadVenueData(city.id, catId);
      
      if (!venues) {
        console.log(`  ⏭️  ${catConfig.name}: 无数据文件`);
        skippedCount++;
        continue;
      }

      if (venues.length === 0) {
        console.log(`  ⏭️  ${catConfig.name}: 数据为空`);
        skippedCount++;
        continue;
      }

      try {
        const content = await generateMarkdown(city, catConfig, venues, template);
        await saveMarkdown(city.id, catId, content);
        generatedCount++;
      } catch (error) {
        console.error(`  ❌ ${catConfig.name} 生成失败:`, error.message);
        skippedCount++;
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 生成统计');
  console.log('='.repeat(50));
  console.log(`✅ 成功生成: ${generatedCount} 个文件`);
  console.log(`⏭️ 跳过: ${skippedCount} 个文件`);
  console.log(`\n💡 提示: 使用 --city=hangzhou --category=spa 生成特定文件`);
}

// 运行
main().catch(error => {
  console.error('❌ 程序错误:', error);
  process.exit(1);
});
