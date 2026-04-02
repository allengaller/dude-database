#!/usr/bin/env node
/**
 * 数据验证脚本
 * 检查生成的JSON和Markdown是否符合规范
 */

const fs = require('fs');
const path = require('path');

// 验证JSON数据
function validateJSON(filepath) {
  const issues = [];
  
  try {
    const content = JSON.parse(fs.readFileSync(filepath, 'utf8'));
    
    // 检查元数据
    if (!content.metadata) {
      issues.push('缺少metadata');
    } else {
      if (!content.metadata.city) issues.push('metadata缺少city');
      if (!content.metadata.category) issues.push('metadata缺少category');
      if (!content.metadata.fetched_at) issues.push('metadata缺少fetched_at');
    }
    
    // 检查场所数据
    if (!Array.isArray(content.venues)) {
      issues.push('venues不是数组');
    } else {
      content.venues.forEach((venue, i) => {
        if (!venue.id) issues.push(`venue[${i}]缺少id`);
        if (!venue.name) issues.push(`venue[${i}]缺少name`);
        if (!venue.source) issues.push(`venue[${i}]缺少source`);
      });
    }
    
  } catch (e) {
    issues.push(`JSON解析错误: ${e.message}`);
  }
  
  return issues;
}

// 验证Markdown
function validateMarkdown(filepath) {
  const issues = [];
  const content = fs.readFileSync(filepath, 'utf8');
  
  // 检查基本结构
  if (!content.startsWith('#')) {
    issues.push('文件不是以标题开始');
  }
  
  // 检查数据来源说明
  if (!content.includes('数据来源')) {
    issues.push('缺少数据来源说明');
  }
  
  // 检查最后更新时间
  if (!content.includes('最后更新')) {
    issues.push('缺少最后更新时间');
  }
  
  return issues;
}

// 主函数
function main() {
  console.log('🔍 数据验证\n');
  
  let totalIssues = 0;
  
  // 验证JSON文件
  const venuesDir = path.join(__dirname, '../../data/venues');
  if (fs.existsSync(venuesDir)) {
    const files = fs.readdirSync(venuesDir).filter(f => f.endsWith('.json'));
    
    console.log(`📁 验证 ${files.length} 个JSON文件:`);
    
    for (const file of files) {
      const filepath = path.join(venuesDir, file);
      const issues = validateJSON(filepath);
      
      if (issues.length > 0) {
        console.log(`  ❌ ${file}:`);
        issues.forEach(i => console.log(`     - ${i}`));
        totalIssues += issues.length;
      } else {
        console.log(`  ✅ ${file}`);
      }
    }
  } else {
    console.log('  ⏭️  data/venues/ 目录不存在');
  }
  
  console.log('');
  
  // 验证Markdown文件
  const cities = ['hangzhou', 'shanghai', 'shenzhen', 'hongkong'];
  let mdCount = 0;
  
  console.log('📄 验证Markdown文件:');
  
  for (const city of cities) {
    const cityDir = path.join(__dirname, `../../${city}`);
    if (!fs.existsSync(cityDir)) continue;
    
    const files = fs.readdirSync(cityDir).filter(f => f.endsWith('.md'));
    
    for (const file of files) {
      const filepath = path.join(cityDir, file);
      const issues = validateMarkdown(filepath);
      mdCount++;
      
      if (issues.length > 0) {
        console.log(`  ❌ ${city}/${file}:`);
        issues.forEach(i => console.log(`     - ${i}`));
        totalIssues += issues.length;
      }
    }
  }
  
  console.log(`  ✅ 已验证 ${mdCount} 个Markdown文件`);
  
  console.log('\n' + '='.repeat(50));
  if (totalIssues === 0) {
    console.log('✅ 所有数据验证通过');
    process.exit(0);
  } else {
    console.log(`❌ 发现 ${totalIssues} 个问题`);
    process.exit(1);
  }
}

main();
