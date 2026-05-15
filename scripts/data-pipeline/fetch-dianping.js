#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const DianpingCrawler = require('./crawlers/dianping');

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

async function ensureDir(dir) {
    try { await fs.mkdir(dir, { recursive: true }); } catch (e) {}
}

async function saveData(cityId, categoryId, data) {
    const outputDir = path.join(__dirname, '../../data/venues');
    await ensureDir(outputDir);
    const filename = path.join(outputDir, `${cityId}_${categoryId}_dianping.json`);
    await fs.writeFile(filename, JSON.stringify({
        metadata: {
            city: cityId,
            category: categoryId,
            fetched_at: new Date().toISOString(),
            count: data.length,
            source: 'dianping'
        },
        venues: data
    }, null, 2));
    console.log(`Saved: ${filename} (${data.length} venues)`);
}

async function main() {
    const args = parseArgs();
    const city = args.city;
    const category = args.category;
    const maxPages = parseInt(args.pages) || 2;

    if (!city || !category) {
        console.error('Usage: node fetch-dianping.js --city=杭州 --category=SPA [--pages=2]');
        console.error('Available cities: 杭州, 上海, 深圳, 香港');
        process.exit(1);
    }

    console.log(`Fetching Dianping data: ${city} - ${category}`);

    const crawler = new DianpingCrawler({ headless: true });

    try {
        await crawler.init();
        const results = await crawler.searchShops(city, category, maxPages);

        if (results.length > 0) {
            const cityMap = { '杭州': 'hangzhou', '上海': 'shanghai', '深圳': 'shenzhen', '香港': 'hongkong' };
            const cityId = cityMap[city] || city;
            await saveData(cityId, category.toLowerCase(), results);
            console.log(`Total: ${results.length} venues fetched`);
        } else {
            console.log('No results found');
        }
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    } finally {
        await crawler.close();
    }
}

main();
