const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '../..');

// 新结构: 6 大类 + gaming + adult-industry
const BIG_DIRS = ['游戏', '娱乐', '景点', '购物', '健康', '生活', '身后'];
const CITIES = ['上海', '杭州', '深圳', '香港', '纽约', '莫斯科', '圣彼得堡',
                '泰国', '东京', '新加坡', '首尔'];

describe('Markdown Data Files - 6 大主题分类结构', () => {
    describe('总文件统计', () => {
        test('总 md 文件数 >= 300', () => {
            let total = 0;
            for (const dir of BIG_DIRS) {
                const d = path.join(ROOT, dir);
                if (fs.existsSync(d)) {
                    const files = fs.readdirSync(d).filter(f => f.endsWith('.md'));
                    total += files.length;
                }
            }
            expect(total).toBeGreaterThanOrEqual(300);
        });
    });

    describe('每个大类', () => {
        BIG_DIRS.forEach(dir => {
            describe(`${dir}/ 目录`, () => {
                const bigPath = path.join(ROOT, dir);
                const exists = fs.existsSync(bigPath);

                test('目录存在', () => {
                    expect(exists).toBe(true);
                });

                if (exists) {
                    test('包含 README.md 索引', () => {
                        expect(fs.existsSync(path.join(bigPath, 'README.md'))).toBe(true);
                    });

                    const files = fs.readdirSync(bigPath).filter(f => f.endsWith('.md') && f !== 'README.md');

                    test('至少包含 20 个 md 文件', () => {
                        expect(files.length).toBeGreaterThanOrEqual(20);
                    });

                    files.forEach(file => {
                        describe(`${file}`, () => {
                            const content = fs.readFileSync(path.join(bigPath, file), 'utf8');

                            test('文件以 # 标题开头', () => {
                                expect(content.startsWith('#')).toBe(true);
                            });

                            test('文件大小 >= 500 字节', () => {
                                expect(content.length).toBeGreaterThanOrEqual(500);
                            });

                            test('包含数据说明', () => {
                                const hasSource = content.includes('数据说明') || content.includes('数据来源') ||
                                                  content.includes('Data Source') || content.includes('Data Note') ||
                                                  content.includes('數據來源');
                                expect(hasSource).toBe(true);
                            });

                            test('包含至少 3 个 ## 章节', () => {
                                const h2Count = (content.match(/^## /gm) || []).length;
                                expect(h2Count).toBeGreaterThanOrEqual(3);
                            });

                            test('包含实际内容 (非占位符)', () => {
                                const hasRealContent = content.includes('###') || content.includes('推荐') ||
                                                       content.includes('Recommended') || content.includes('地址');
                                expect(hasRealContent).toBe(true);
                            });
                        });
                    });
                }
            });
        });
    });

    describe('11 个城市覆盖', () => {
        CITIES.forEach(city => {
            describe(`${city} 城市覆盖`, () => {
                test('至少出现在 15 个 md 文件中', () => {
                    let count = 0;
                    for (const dir of BIG_DIRS) {
                        const d = path.join(ROOT, dir);
                        if (fs.existsSync(d)) {
                            const files = fs.readdirSync(d).filter(f => f.startsWith(city + '-') && f.endsWith('.md'));
                            count += files.length;
                        }
                    }
                    expect(count).toBeGreaterThanOrEqual(15);
                });
            });
        });
    });
});

describe('Pipeline Configuration', () => {
    test('cities.json 合法', () => {
        const config = JSON.parse(
            fs.readFileSync(path.join(ROOT, 'scripts/data-pipeline/config/cities.json'), 'utf8')
        );
        expect(config.cities).toBeDefined();
        expect(Array.isArray(config.cities)).toBe(true);
        expect(config.cities.length).toBeGreaterThan(0);

        config.cities.forEach(city => {
            expect(city.id).toBeDefined();
            expect(city.name).toBeDefined();
        });
    });

    test('categories.json 合法', () => {
        const config = JSON.parse(
            fs.readFileSync(path.join(ROOT, 'scripts/data-pipeline/config/categories.json'), 'utf8')
        );
        expect(config.categories).toBeDefined();
    });
});

describe('Frontend Assets', () => {
    test('style.css 存在且非空', () => {
        const cssPath = path.join(ROOT, 'assets/style.css');
        expect(fs.existsSync(cssPath)).toBe(true);
        const content = fs.readFileSync(cssPath, 'utf8');
        expect(content.length).toBeGreaterThan(1000);
    });

    test('app.js 存在且非空', () => {
        const jsPath = path.join(ROOT, 'assets/app.js');
        expect(fs.existsSync(jsPath)).toBe(true);
        const content = fs.readFileSync(jsPath, 'utf8');
        expect(content.length).toBeGreaterThan(1000);
    });

    test('index.html 引用外部资源', () => {
        const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
        expect(html).toContain('assets/style.css');
        expect(html).toContain('assets/app.js');
    });

    test('index.html 是有效 HTML 结构', () => {
        const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('</html>');
        expect(html).toContain('<head>');
        expect(html).toContain('</body>');
    });

    test('index.html 不引用已删除的 md (README.md 等)', () => {
        const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
        expect(html).not.toMatch(/href="README\.md"/);
        expect(html).not.toMatch(/href="RECTIFICATION_REPORT\.md"/);
    });
});

describe('顶层文档', () => {
    test('项目说明.md 存在', () => {
        expect(fs.existsSync(path.join(ROOT, '项目说明.md'))).toBe(true);
    });

    test('主页指南.md 存在', () => {
        expect(fs.existsSync(path.join(ROOT, '主页指南.md'))).toBe(true);
    });

    test('整改报告.md 存在', () => {
        expect(fs.existsSync(path.join(ROOT, '整改报告.md'))).toBe(true);
    });
});

describe('内部链接健康', () => {
    test('所有 md 文件无内部断裂链接', () => {
        const linkPattern = /\]\(([^)#]+\.md)\)/g;
        let brokenCount = 0;
        const allMd = [];
        for (const dir of BIG_DIRS) {
            const d = path.join(ROOT, dir);
            if (fs.existsSync(d)) {
                const files = fs.readdirSync(d).filter(f => f.endsWith('.md'));
                for (const f of files) {
                    allMd.push(path.join(d, f));
                }
            }
        }
        for (const f of allMd) {
            const content = fs.readFileSync(f, 'utf8');
            let m;
            while ((m = linkPattern.exec(content)) !== null) {
                const link = m[1];
                if (link.startsWith('http')) continue;
                const target = path.resolve(path.dirname(f), link);
                if (!fs.existsSync(target)) brokenCount++;
            }
        }
        expect(brokenCount).toBe(0);
    });
});