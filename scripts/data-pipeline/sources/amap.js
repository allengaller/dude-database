/**
 * 高德地图 API 封装
 * 文档: https://lbs.amap.com/api/webservice/summary
 */

const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');

class AmapAPI {
  constructor(key) {
    this.key = key;
    this.baseUrl = 'https://restapi.amap.com/v3';
    this.cacheDir = path.join(__dirname, '../../.cache');
    this.ensureCacheDir();
  }

  async ensureCacheDir() {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (e) {
      // ignore
    }
  }

  // 带缓存的请求
  async request(endpoint, params, useCache = true) {
    const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
    const cacheFile = path.join(this.cacheDir, `${Buffer.from(cacheKey).toString('base64')}.json`);

    // 检查缓存
    if (useCache) {
      try {
        const cached = await fs.readFile(cacheFile, 'utf8');
        const data = JSON.parse(cached);
        // 缓存7天
        if (Date.now() - data._cachedAt < 7 * 24 * 60 * 60 * 1000) {
          console.log(`  [Cache] ${endpoint}`);
          return data.response;
        }
      } catch (e) {
        // 缓存不存在或过期，继续请求
      }
    }

    // 添加API Key
    const requestParams = { ...params, key: this.key };

    // 延迟请求避免触发限流
    await this.delay(100);

    try {
      const response = await axios.get(`${this.baseUrl}${endpoint}`, {
        params: requestParams,
        timeout: 10000
      });

      if (response.data.status !== '1') {
        throw new Error(`API Error: ${response.data.info} (${response.data.infocode})`);
      }

      // 保存缓存
      if (useCache) {
        await fs.writeFile(cacheFile, JSON.stringify({
          _cachedAt: Date.now(),
          response: response.data
        }));
      }

      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(`HTTP ${error.response.status}: ${error.message}`);
      }
      throw error;
    }
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 关键字搜索POI
   * @param {string} city - 城市名或adcode
   * @param {string} keywords - 搜索关键词
   * @param {number} page - 页码
   * @param {string} types - POI类型编码
   */
  async searchPOI(city, keywords, page = 1, types = '') {
    const params = {
      city: city,
      keywords: keywords,
      offset: 25,
      page: page,
      extensions: 'all'
    };
    if (types) params.types = types;

    const data = await this.request('/place/text', params);
    return {
      pois: data.pois || [],
      count: parseInt(data.count) || 0
    };
  }

  /**
   * 周边搜索
   * @param {string} location - 经纬度 "lng,lat"
   * @param {string} keywords - 关键词
   * @param {number} radius - 半径（米）
   */
  async searchAround(location, keywords, radius = 5000) {
    const params = {
      location: location,
      keywords: keywords,
      radius: radius,
      offset: 25,
      page: 1,
      extensions: 'all'
    };

    const data = await this.request('/place/around', params);
    return {
      pois: data.pois || [],
      count: parseInt(data.count) || 0
    };
  }

  /**
   * POI详情查询
   * @param {string} id - POI ID
   */
  async getPOIDetail(id) {
    const params = { id };
    const data = await this.request('/place/detail', params);
    return data.pois?.[0] || null;
  }

  /**
   * 批量获取城市多个类别的POI
   * @param {Object} city - 城市配置
   * @param {Object} category - 类别配置
   * @param {number} maxResults - 最大结果数
   */
  async searchCategory(city, category, maxResults = 50) {
    const results = [];
    const seen = new Set();

    console.log(`\n🔍 搜索 ${city.name} - ${category.name}`);

    // 使用类型编码搜索
    if (category.amapTypes && category.amapTypes.length > 0) {
      for (const typeCode of category.amapTypes) {
        let page = 1;
        let hasMore = true;

        while (hasMore && results.length < maxResults && page <= 4) {
          try {
            const { pois, count } = await this.searchPOI(
              city.adcode,
              '',
              page,
              typeCode
            );

            if (pois.length === 0) break;

            for (const poi of pois) {
              if (!seen.has(poi.id) && results.length < maxResults) {
                seen.add(poi.id);
                results.push(this.normalizePOI(poi, city, category));
              }
            }

            console.log(`  类型${typeCode} 第${page}页: ${pois.length}条, 总计: ${results.length}`);

            hasMore = pois.length === 25;
            page++;
          } catch (error) {
            console.error(`  Error fetching page ${page}:`, error.message);
            break;
          }
        }
      }
    }

    // 使用关键词搜索补充
    if (category.keywords && results.length < maxResults) {
      for (const keyword of category.keywords) {
        if (results.length >= maxResults) break;

        try {
          const { pois } = await this.searchPOI(city.adcode, keyword, 1);
          for (const poi of pois.slice(0, 10)) {
            if (!seen.has(poi.id) && results.length < maxResults) {
              seen.add(poi.id);
              results.push(this.normalizePOI(poi, city, category));
            }
          }
        } catch (error) {
          console.error(`  Error searching keyword ${keyword}:`, error.message);
        }
      }
    }

    console.log(`✅ ${city.name} ${category.name}: 共 ${results.length} 条`);
    return results;
  }

  /**
   * 标准化POI数据
   */
  normalizePOI(poi, city, category) {
    return {
      id: `amap_${poi.id}`,
      source: 'amap',
      source_id: poi.id,
      city: city.id,
      category: category.name,
      name: poi.name,
      address: poi.address || '',
      phone: poi.tel?.split(';')[0] || '',
      location: poi.location,
      rating: poi.biz_ext?.rating ? parseFloat(poi.biz_ext.rating) : null,
      cost: poi.biz_ext?.cost ? parseFloat(poi.biz_ext.cost) : null,
      business_hours: poi.business?.split(';')[0] || '',
      photos: poi.photos?.map(p => p.url) || [],
      type: poi.type,
      typecode: poi.typecode,
      tag: poi.tag || '',
      website: poi.website || '',
      adcode: poi.adcode,
      cityname: poi.cityname,
      query_time: new Date().toISOString()
    };
  }

  /**
   * 地理编码（地址转坐标）
   * @param {string} address - 地址
   * @param {string} city - 城市
   */
  async geocode(address, city) {
    const params = {
      address: address,
      city: city
    };

    const data = await this.request('/geocode/geo', params);
    return data.geocodes?.[0] || null;
  }

  /**
   * 逆地理编码（坐标转地址）
   * @param {string} location - "lng,lat"
   */
  async regeocode(location) {
    const params = {
      location: location,
      extensions: 'all'
    };

    const data = await this.request('/geocode/regeo', params);
    return data.regeocode || null;
  }
}

module.exports = AmapAPI;
