/**
 * 大众点评爬虫
 * ⚠️ 警告: 本爬虫仅供学习研究使用
 * ⚠️ 使用本爬虫可能违反大众点评的服务条款
 * ⚠️ 请遵守相关法律法规，合理使用
 * ⚠️ 建议使用前咨询法律意见
 * 
 * 反爬机制说明:
 * - 大众点评有严格的反爬措施
 * - 需要代理IP池、Cookie池
 * - 页面结构经常变化，需要持续维护
 * - 建议仅用于小规模数据补充
 */

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

// 使用 stealth 插件避免检测
puppeteer.use(StealthPlugin());

class DianpingCrawler {
  constructor(options = {}) {
    this.proxyPool = options.proxyPool || [];
    this.headless = options.headless !== false;
    this.timeout = options.timeout || 30000;
    this.delay = options.delay || 2000;
  }

  /**
   * 启动浏览器
   */
  async init() {
    const args = ['--no-sandbox', '--disable-setuid-sandbox'];
    
    // 使用代理
    if (this.proxyPool.length > 0) {
      const proxy = this.proxyPool[Math.floor(Math.random() * this.proxyPool.length)];
      args.push(`--proxy-server=${proxy}`);
    }

    this.browser = await puppeteer.launch({
      headless: this.headless,
      args,
      defaultViewport: { width: 1920, height: 1080 }
    });

    this.page = await this.browser.newPage();
    
    // 设置User-Agent
    await this.page.setUserAgent(
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
    );

    // 设置请求拦截
    await this.page.setRequestInterception(true);
    this.page.on('request', (req) => {
      // 拦截图片和CSS，加快加载
      if (['image', 'stylesheet', 'font'].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });
  }

  /**
   * 搜索店铺
   * @param {string} city - 城市名
   * @param {string} keyword - 搜索关键词
   * @param {number} maxPages - 最大页数
   */
  async searchShops(city, keyword, maxPages = 3) {
    if (!this.browser) {
      await this.init();
    }

    const results = [];
    
    try {
      const cityCode = this.getCityCode(city);
      const searchUrl = `https://www.dianping.com/search/keyword/${cityCode}/0_${encodeURIComponent(keyword)}`;
      
      console.log(`🔍 访问: ${searchUrl}`);
      
      await this.page.goto(searchUrl, { 
        waitUntil: 'networkidle2',
        timeout: this.timeout 
      });

      // 检查是否被拦截
      const pageTitle = await this.page.title();
      if (pageTitle.includes('验证') || pageTitle.includes('403')) {
        throw new Error('触发反爬验证，请稍后重试或使用代理');
      }

      // 等待列表加载
      await this.page.waitForSelector('.shop-list', { timeout: 10000 });

      // 翻页抓取
      for (let page = 1; page <= maxPages; page++) {
        console.log(`📄 第 ${page} 页`);

        const shops = await this.extractShops();
        results.push(...shops);

        if (page < maxPages) {
          const hasNext = await this.goToNextPage();
          if (!hasNext) break;
          await this.sleep(this.delay);
        }
      }

    } catch (error) {
      console.error('爬取失败:', error.message);
      throw error;
    }

    return results;
  }

  /**
   * 提取店铺信息
   */
  async extractShops() {
    return await this.page.evaluate(() => {
      const shops = [];
      const items = document.querySelectorAll('.shop-list .shop-list-item');
      
      items.forEach(item => {
        try {
          const nameEl = item.querySelector('.shop-name');
          const name = nameEl?.textContent?.trim();
          const link = nameEl?.getAttribute('href');
          
          const ratingEl = item.querySelector('.score');
          const rating = ratingEl?.textContent?.trim();
          
          const priceEl = item.querySelector('.price');
          const price = priceEl?.textContent?.trim();
          
          const tagEls = item.querySelectorAll('.tag');
          const tags = Array.from(tagEls).map(el => el.textContent.trim());
          
          const addressEl = item.querySelector('.addr');
          const address = addressEl?.textContent?.trim();
          
          if (name) {
            shops.push({
              name,
              link: link ? `https://www.dianping.com${link}` : '',
              rating,
              price,
              tags,
              address,
              source: 'dianping'
            });
          }
        } catch (e) {
          // ignore
        }
      });
      
      return shops;
    });
  }

  /**
   * 跳转到下一页
   */
  async goToNextPage() {
    try {
      const nextBtn = await this.page.$('.next');
      if (!nextBtn || await nextBtn.evaluate(el => el.classList.contains('disabled'))) {
        return false;
      }
      
      await nextBtn.click();
      await this.page.waitForNavigation({ waitUntil: 'networkidle2' });
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * 城市名称转城市代码
   */
  getCityCode(cityName) {
    const cityMap = {
      '杭州': '3',
      '上海': '1',
      '深圳': '7',
      '香港': '341'
    };
    return cityMap[cityName] || '3';
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.page = null;
    }
  }
}

module.exports = DianpingCrawler;
