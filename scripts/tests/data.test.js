const fs = require('fs');
const path = require('path');

const CITIES = ['hangzhou', 'shanghai', 'shenzhen', 'hongkong', 'newyork', 'thailand', 'moscow', 'spb'];
const DATA_DIR = path.join(__dirname, '../..');

describe('Markdown Data Files', () => {
    CITIES.forEach(city => {
        describe(`${city} directory`, () => {
            const cityDir = path.join(DATA_DIR, city);

            beforeAll(() => {
                if (!fs.existsSync(cityDir)) {
                    throw new Error(`Directory ${cityDir} does not exist`);
                }
            });

            test('directory exists', () => {
                expect(fs.existsSync(cityDir)).toBe(true);
            });

            test('contains at least 10 md files', () => {
                const files = fs.readdirSync(cityDir).filter(f => f.endsWith('.md'));
                expect(files.length).toBeGreaterThanOrEqual(10);
            });

            const mdFiles = fs.existsSync(cityDir)
                ? fs.readdirSync(cityDir).filter(f => f.endsWith('.md'))
                : [];

            mdFiles.forEach(file => {
                test(`${file} has valid structure`, () => {
                    const content = fs.readFileSync(path.join(cityDir, file), 'utf8');

                    expect(content.startsWith('#')).toBe(true);
                    expect(content.length).toBeGreaterThan(100);
                });

                test(`${file} has data source disclaimer`, () => {
                    const content = fs.readFileSync(path.join(cityDir, file), 'utf8');
                    const hasSource = content.includes('数据来源') || content.includes('Data Source') || content.includes('Data Note') || content.includes('數據來源');
                    expect(hasSource).toBe(true);
                });

                test(`${file} has last updated date`, () => {
                    const content = fs.readFileSync(path.join(cityDir, file), 'utf8');
                    const hasDate = content.includes('最后更新') || content.includes('Last updated') || content.includes('最後更新');
                    expect(hasDate).toBe(true);
                });

                test(`${file} has no placeholder-only content`, () => {
                    const content = fs.readFileSync(path.join(cityDir, file), 'utf8');
                    const hasRealContent = content.includes('###') || content.includes('推荐') || content.includes('Recommended');
                    expect(hasRealContent).toBe(true);
                });
            });
        });
    });
});

describe('Pipeline Configuration', () => {
    test('cities.json is valid JSON with required fields', () => {
        const config = JSON.parse(
            fs.readFileSync(path.join(DATA_DIR, 'scripts/data-pipeline/config/cities.json'), 'utf8')
        );
        expect(config.cities).toBeDefined();
        expect(Array.isArray(config.cities)).toBe(true);
        expect(config.cities.length).toBeGreaterThan(0);

        config.cities.forEach(city => {
            expect(city.id).toBeDefined();
            expect(city.name).toBeDefined();
            expect(city.region).toBeDefined();
        });
    });

    test('categories.json is valid JSON with required fields', () => {
        const config = JSON.parse(
            fs.readFileSync(path.join(DATA_DIR, 'scripts/data-pipeline/config/categories.json'), 'utf8')
        );
        expect(config.categories).toBeDefined();

        Object.entries(config.categories).forEach(([key, cat]) => {
            expect(cat.name).toBeDefined();
            expect(cat.keywords).toBeDefined();
            expect(Array.isArray(cat.keywords)).toBe(true);
        });
    });
});

describe('Validation Script', () => {
    test('validate-data.js covers all 8 cities', () => {
        const script = fs.readFileSync(
            path.join(DATA_DIR, 'scripts/tests/validate-data.js'), 'utf8'
        );
        CITIES.forEach(city => {
            expect(script).toContain(city);
        });
    });
});

describe('Frontend Assets', () => {
    test('style.css exists and is non-empty', () => {
        const cssPath = path.join(DATA_DIR, 'assets/style.css');
        expect(fs.existsSync(cssPath)).toBe(true);
        const content = fs.readFileSync(cssPath, 'utf8');
        expect(content.length).toBeGreaterThan(1000);
    });

    test('app.js exists and is non-empty', () => {
        const jsPath = path.join(DATA_DIR, 'assets/app.js');
        expect(fs.existsSync(jsPath)).toBe(true);
        const content = fs.readFileSync(jsPath, 'utf8');
        expect(content.length).toBeGreaterThan(1000);
    });

    test('index.html references external assets', () => {
        const html = fs.readFileSync(path.join(DATA_DIR, 'index.html'), 'utf8');
        expect(html).toContain('assets/style.css');
        expect(html).toContain('assets/app.js');
    });

    test('index.html is valid HTML structure', () => {
        const html = fs.readFileSync(path.join(DATA_DIR, 'index.html'), 'utf8');
        expect(html).toContain('<!DOCTYPE html>');
        expect(html).toContain('</html>');
        expect(html).toContain('<head>');
        expect(html).toContain('</body>');
    });
});

describe('README Documentation', () => {
    test('README.md exists', () => {
        expect(fs.existsSync(path.join(DATA_DIR, 'README.md'))).toBe(true);
    });

    test('PROJECT_REVIEW.md exists', () => {
        expect(fs.existsSync(path.join(DATA_DIR, 'PROJECT_REVIEW.md'))).toBe(true);
    });
});
