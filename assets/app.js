        // Database Configuration
        const cities = [
            { id: 'hangzhou', name: '杭州', nameEn: 'Hangzhou', flag: '🇨🇳' },
            { id: 'shanghai', name: '上海', nameEn: 'Shanghai', flag: '🇨🇳' },
            { id: 'shenzhen', name: '深圳', nameEn: 'Shenzhen', flag: '🇨🇳' },
            { id: 'hongkong', name: '香港', nameEn: 'Hong Kong', flag: '🇨🇳' },
            { id: 'thailand', name: '泰国', nameEn: 'Thailand', flag: '🇹🇭' },
            { id: 'moscow', name: '莫斯科', nameEn: 'Moscow', flag: '🇷🇺' },
            { id: 'spb', name: '圣彼得堡', nameEn: 'Saint Petersburg', flag: '🇷🇺' },
            { id: 'newyork', name: '纽约', nameEn: 'New York', flag: '🇺🇸' }
        ];

        const categories = {
                        'spa': { name: 'SPA & 养生', icon: 'fa-spa', color: '#ec4899', dir: '健康', cn: 'SPA' },
                        'coffee': { name: '咖啡文化', icon: 'fa-coffee', color: '#6366f1', dir: '娱乐', cn: '咖啡' },
                        'bars': { name: '酒吧 & 夜生活', icon: 'fa-glass-cheers', color: '#06b6d4', dir: '娱乐', cn: '酒吧' },
                        'art': { name: '艺术 & 文化', icon: 'fa-palette', color: '#f59e0b', dir: '购物', cn: '艺术' },
                        'park': { name: '公园 & 户外', icon: 'fa-tree', color: '#10b981', dir: '景点', cn: '公园' },
                        'gym': { name: '健身 & 运动', icon: 'fa-dumbbell', color: '#8b5cf6', dir: '健康', cn: '健身' },
                        'library': { name: '图书馆', icon: 'fa-book', color: '#3b82f6', dir: '生活', cn: '图书馆' },
                        'hiking': { name: '徒步 & 登山', icon: 'fa-hiking', color: '#ef4444', dir: '景点', cn: '徒步' },
                        'dating': { name: '约会场所', icon: 'fa-heart', color: '#f43f5e', dir: '生活', cn: '约会' },
                        'tourism': { name: '旅游', icon: 'fa-plane', color: '#06b6d4', dir: '景点', cn: '观光' },
                        'dentist': { name: '牙科', icon: 'fa-tooth', color: '#14b8a6', dir: '健康', cn: '牙医' },
                        'hospital': { name: '医院', icon: 'fa-hospital', color: '#ef4444', dir: '健康', cn: '医院' },
                        'psychology': { name: '心理咨询', icon: 'fa-brain', color: '#8b5cf6', dir: '健康', cn: '心理' },
                        'cemetery': { name: '公墓', icon: 'fa-monument', color: '#64748b', dir: '身后', cn: '墓地' },
                        'funeral': { name: '殡葬服务', icon: 'fa-angel', color: '#64748b', dir: '身后', cn: '殡葬' },
                        'nursing-home': { name: '养老院', icon: 'fa-home', color: '#f59e0b', dir: '身后', cn: '养老院' },
                        'cycling': { name: '骑行', icon: 'fa-bicycle', color: '#10b981', dir: '健康', cn: '骑行' },
                        'running': { name: '跑步', icon: 'fa-running', color: '#3b82f6', dir: '健康', cn: '跑步' },
                        'internet-cafe': { name: '网吧', icon: 'fa-gamepad', color: '#6366f1', dir: '娱乐', cn: '网吧' },
                        'internet-famous': { name: '网红打卡', icon: 'fa-camera', color: '#ec4899', dir: '生活', cn: '网红' },
                        'amusement': { name: '娱乐', icon: 'fa-ticket-alt', color: '#f59e0b', dir: '游戏', cn: '游乐场' },
                        'young-women': { name: '年轻女性消费', icon: 'fa-female', color: '#f43f5e', dir: '生活', cn: '年轻女性' }
        };

        // View Switching
        function switchView(view) {
            document.querySelectorAll('.mode-tab').forEach(tab => {
                tab.classList.remove('active');
            });
            event.target.closest('.mode-tab').classList.add('active');

            document.querySelectorAll('.category-section, .map-view').forEach(section => {
                section.classList.remove('active');
            });
            
            if (view === 'cities') {
                document.getElementById('cities-view').classList.add('active');
            } else if (view === 'categories') {
                document.getElementById('categories-view').classList.add('active');
            } else if (view === 'map') {
                document.getElementById('map-view').classList.add('active');
            }
        }

        // Open City
        function openCity(city) {
            const cityInfo = cities.find(c => c.id === city);
            if (!cityInfo) return;

            addRecentVisit('city', cityInfo.id, cityInfo.name, { flag: cityInfo.flag });

            const modal = document.getElementById('categoryModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalSubtitle = document.getElementById('modalSubtitle');
            const cityList = document.getElementById('cityList');

            modalTitle.innerHTML = `<span style="font-size: 28px; margin-right: 8px;">${cityInfo.flag}</span> ${cityInfo.name}`;
            modalSubtitle.textContent = `${cityInfo.nameEn} — 选择类别查看详细信息`;

            const catEntries = Object.entries(categories);

            cityList.innerHTML = catEntries.map(([key, cat]) => `
                <div onclick="openMarkdownViewer('${categories[key].dir}/${city}-${categories[key].cn}.md', '${cityInfo.name} - ${cat.name}'); closeModal();"
                     class="city-link" style="cursor: pointer;">
                    <i class="fas ${cat.icon}" style="font-size: 20px; color: ${cat.color};"></i>
                    <div>
                        <div style="font-weight: 600;">${cat.name}</div>
                    </div>
                    <i class="fas fa-arrow-right" style="margin-left: auto; color: ${cat.color};"></i>
                </div>
            `).join('');

            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Open Category - Show Modal
        function openCategory(category) {
            const modal = document.getElementById('categoryModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalSubtitle = document.getElementById('modalSubtitle');
            const cityList = document.getElementById('cityList');
            
            const catInfo = categories[category] || { name: category, icon: 'fa-folder' };
            
            modalTitle.innerHTML = `<i class="fas ${catInfo.icon}" style="color: ${catInfo.color};"></i> ${catInfo.name}`;
            modalSubtitle.textContent = `选择城市查看${catInfo.name}详细信息`;
            
            cityList.innerHTML = cities.map(city => `
                <div onclick="openMarkdownViewer('${categories[category].dir}/${city.id}-${categories[category].cn}.md', '${city.name} - ${catInfo.name}'); closeModal();" 
                     class="city-link" style="cursor: pointer;">
                    <span style="font-size: 24px;">${city.flag}</span>
                    <div>
                        <div style="font-weight: 600;">${city.name}</div>
                        <div style="font-size: 12px; color: rgba(0,0,0,0.5);">${city.nameEn}</div>
                    </div>
                    <i class="fas fa-arrow-right" style="margin-left: auto; color: ${catInfo.color};"></i>
                </div>
            `).join('');
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Close Modal
        function closeModal() {
            const modal = document.getElementById('categoryModal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }

        // Close modal on outside click
        document.getElementById('categoryModal').addEventListener('click', function(e) {
            if (e.target === this) {
                closeModal();
            }
        });

        // Close modal on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                // Close markdown viewer first if open
                const markdownViewer = document.getElementById('markdownViewer');
                if (markdownViewer.classList.contains('active')) {
                    closeMarkdownViewer();
                    return;
                }
                // Then close other modals
                closeModal();
                closeFavorites();
            }
        });

        const searchIndex = [];
        let searchIndexBuilt = false;

        async function buildSearchIndex() {
            if (searchIndexBuilt) return;
            const catKeys = Object.keys(categories);
            const promises = [];

            for (const city of cities) {
                for (const catKey of catKeys) {
                    const url = `${categories[catKey].dir}/${city.id}-${categories[catKey].cn}.md`;
                    promises.push(
                        fetch(url)
                            .then(r => r.ok ? r.text() : null)
                            .then(text => {
                                if (text) {
                                    searchIndex.push({
                                        url,
                                        cityId: city.id,
                                        cityName: city.name,
                                        cityFlag: city.flag,
                                        catId: catKey,
                                        catName: categories[catKey].name,
                                        catIcon: categories[catKey].icon,
                                        catColor: categories[catKey].color,
                                        text: text.toLowerCase(),
                                        title: `${city.name} - ${categories[catKey].name}`
                                    });
                                }
                            })
                            .catch(() => {})
                    );
                }
            }

            await Promise.all(promises);
            searchIndexBuilt = true;
        }

        let searchAbort = null;

        async function search() {
            const query = document.getElementById('searchInput').value.trim();
            if (!query) return;

            const modal = document.getElementById('categoryModal');
            const modalTitle = document.getElementById('modalTitle');
            const modalSubtitle = document.getElementById('modalSubtitle');
            const cityList = document.getElementById('cityList');

            modalTitle.innerHTML = `<i class="fas fa-search" style="color: #6366f1;"></i> 搜索中...`;
            modalSubtitle.textContent = `正在检索所有文档`;
            cityList.innerHTML = `<div style="text-align:center;padding:40px;color:rgba(0,0,0,0.4);"><div class="spinner" style="width:40px;height:40px;border:3px solid #e5e7eb;border-top-color:#6366f1;border-radius:50%;animation:spin 1s linear infinite;margin:0 auto 16px;"></div>正在搜索 176 个文档...</div>`;
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';

            await buildSearchIndex();

            const q = query.toLowerCase();
            const results = [];
            const seen = new Set();

            for (const doc of searchIndex) {
                if (seen.has(doc.url)) continue;
                const matchCity = doc.cityName.includes(query) || city_names_en(doc.cityId).includes(q);
                const matchCat = doc.catName.includes(query) || doc.catId.includes(q);
                const matchContent = doc.text.includes(q);

                if (matchCity || matchCat || matchContent) {
                    seen.add(doc.url);
                    let snippet = '';
                    if (matchContent) {
                        const idx = doc.text.indexOf(q);
                        const start = Math.max(0, idx - 30);
                        const end = Math.min(doc.text.length, idx + query.length + 30);
                        snippet = '...' + doc.text.substring(start, end).replace(new RegExp(query, 'gi'), m => `**${m}**`) + '...';
                    }
                    results.push({ ...doc, snippet, matchType: matchContent ? 'content' : 'meta' });
                }
            }

            function city_names_en(id) {
                const map = { hangzhou:'hangzhou', shanghai:'shanghai', shenzhen:'shenzhen', hongkong:'hong kong', thailand:'thailand', moscow:'moscow', spb:'saint petersburg', newyork:'new york' };
                return map[id] || id;
            }

            modalTitle.innerHTML = `<i class="fas fa-search" style="color: #6366f1;"></i> 搜索结果: "${query}"`;
            modalSubtitle.textContent = `在 ${searchIndex.length} 个文档中找到 ${results.length} 个相关结果`;

            if (results.length === 0) {
                cityList.innerHTML = `<div style="text-align:center;padding:40px;color:rgba(0,0,0,0.5);"><i class="fas fa-search" style="font-size:36px;opacity:0.3;margin-bottom:12px;display:block;"></i><p>未找到与 "${query}" 相关的内容</p><p style="font-size:13px;margin-top:8px;">尝试搜索：城市名称、类别、商家名称</p></div>`;
                return;
            }

            cityList.innerHTML = results.slice(0, 30).map(r => `
                <div onclick="openMarkdownViewer('${r.url}', '${r.title}'); closeModal();"
                     class="city-link" style="cursor: pointer; flex-wrap: wrap;">
                    <span style="font-size: 20px;">${r.cityFlag}</span>
                    <div style="flex:1;min-width:0;">
                        <div style="font-weight: 600;">${r.title}</div>
                        ${r.snippet ? `<div style="font-size:12px;color:rgba(0,0,0,0.5);margin-top:4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${r.snippet.replace(/\*\*/g, '<strong style="color:#6366f1;">').replace(/\*\*/g, '</strong>')}</div>` : ''}
                    </div>
                    <i class="fas fa-arrow-right" style="margin-left: 8px; color: ${r.catColor};"></i>
                </div>
            `).join('');
        }

        // Enter key for search
        document.getElementById('searchInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                search();
            }
        });

        // Smooth scroll
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Animation on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.city-card, .category-card').forEach(card => {
            observer.observe(card);
        });

        // Map Marker Hover Effect
        document.querySelectorAll('.city-marker').forEach(marker => {
            marker.addEventListener('mouseenter', function() {
                const cityName = this.querySelector('text').textContent;
                this.querySelector('circle:first-child').style.animation = 'none';
                this.querySelector('circle:first-child').setAttribute('r', '16');
            });
            
            marker.addEventListener('mouseleave', function() {
                this.querySelector('circle:first-child').style.animation = 'pulse 2s infinite';
            });
        });

        // Console Easter Egg
        console.log('%c 🌍 DUDE Database ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 24px; padding: 10px 20px; border-radius: 10px;');
        console.log('%c 全球生活方式数据库 - 2026 Edition ', 'color: #6366f1; font-size: 14px;');
        console.log('%c 可用命令: ', 'color: #ec4899; font-weight: bold;');
        console.log('  - search("关键词") : 搜索数据库');
        console.log('  - cities : 查看所有城市');
        console.log('  - categories : 查看所有类别');

        // ==================== Theme Management ====================
        function initTheme() {
            const savedTheme = localStorage.getItem('dude-theme') || 'dark';
            if (savedTheme === 'light') {
                document.body.classList.add('light-theme');
                document.getElementById('themeIcon').className = 'fas fa-sun';
            }
        }

        function toggleTheme() {
            const body = document.body;
            const icon = document.getElementById('themeIcon');
            
            if (body.classList.contains('light-theme')) {
                body.classList.remove('light-theme');
                icon.className = 'fas fa-moon';
                localStorage.setItem('dude-theme', 'dark');
                showToast('已切换到暗黑模式');
            } else {
                body.classList.add('light-theme');
                icon.className = 'fas fa-sun';
                localStorage.setItem('dude-theme', 'light');
                showToast('已切换到亮色模式');
            }
        }

        // ==================== Toast Notification ====================
        function showToast(message) {
            const toast = document.getElementById('toast');
            toast.textContent = message;
            toast.classList.add('show');
            
            setTimeout(() => {
                toast.classList.remove('show');
            }, 3000);
        }

        // ==================== Recent Visits Management ====================
        function addRecentVisit(type, id, name, extra = {}) {
            let recent = JSON.parse(localStorage.getItem('dude-recent') || '[]');
            
            // Remove duplicate
            recent = recent.filter(item => !(item.type === type && item.id === id));
            
            // Add to beginning
            recent.unshift({
                type,
                id,
                name,
                timestamp: Date.now(),
                ...extra
            });
            
            // Keep only last 10
            recent = recent.slice(0, 10);
            
            localStorage.setItem('dude-recent', JSON.stringify(recent));
            renderRecentVisits();
        }

        function renderRecentVisits() {
            const recent = JSON.parse(localStorage.getItem('dude-recent') || '[]');
            const container = document.getElementById('recentVisits');
            const grid = document.getElementById('recentGrid');
            
            if (recent.length === 0) {
                container.classList.remove('has-items');
                return;
            }
            
            container.classList.add('has-items');
            
            grid.innerHTML = recent.map(item => {
                let icon, color, onclick;
                
                if (item.type === 'city') {
                    icon = 'fa-city';
                    color = '#6366f1';
                    onclick = `openMarkdownViewer('健康/${cityMap[item.id] || item.id}-SPA', '${item.name} SPA 指南')`;
                } else if (item.type === 'category') {
                    icon = categories[item.id]?.icon || 'fa-folder';
                    color = categories[item.id]?.color || '#6366f1';
                    onclick = `openCategory('${item.id}')`;
                } else if (item.type === 'document') {
                    icon = 'fa-file-alt';
                    color = '#10b981';
                    onclick = `openMarkdownViewer('${item.url}', '${item.name}')`;
                }
                
                return `
                    <div class="recent-item" onclick="${onclick}">
                        <i class="fas ${icon}" style="color: ${color};"></i>
                        <span>${item.name}</span>
                    </div>
                `;
            }).join('');
        }

        function clearHistory() {
            if (confirm('确定要清空访问历史吗？')) {
                localStorage.removeItem('dude-recent');
                renderRecentVisits();
                showToast('访问历史已清空');
            }
        }

        // ==================== Favorites Management ====================
        function toggleFavorite(element, type, id, name, extra = {}) {
            element.classList.toggle('active');
            
            let favorites = JSON.parse(localStorage.getItem('dude-favorites') || '[]');
            const exists = favorites.some(f => f.type === type && f.id === id);
            
            if (exists) {
                favorites = favorites.filter(f => !(f.type === type && f.id === id));
                showToast('已取消收藏');
            } else {
                favorites.push({
                    type,
                    id,
                    name,
                    timestamp: Date.now(),
                    ...extra
                });
                showToast('已添加到收藏');
            }
            
            localStorage.setItem('dude-favorites', JSON.stringify(favorites));
        }

        function showFavorites() {
            const modal = document.getElementById('favoritesModal');
            const list = document.getElementById('favoritesList');
            const favorites = JSON.parse(localStorage.getItem('dude-favorites') || '[]');
            
            if (favorites.length === 0) {
                list.innerHTML = `
                    <div class="favorites-empty">
                        <i class="fas fa-heart-broken"></i>
                        <h3>暂无收藏</h3>
                        <p>点击城市卡片上的 <i class="fas fa-heart" style="color: #ec4899;"></i> 按钮添加收藏</p>
                    </div>
                `;
            } else {
                list.innerHTML = favorites.map(item => {
                    let icon, color, onclick;
                    
                    if (item.type === 'city') {
                        icon = 'fa-city';
                        color = '#6366f1';
                        onclick = `closeFavorites(); openMarkdownViewer('健康/${cityMap[item.id] || item.id}-SPA', '${item.name} SPA 指南');`;
                    } else if (item.type === 'category') {
                        icon = categories[item.id]?.icon || 'fa-folder';
                        color = categories[item.id]?.color || '#6366f1';
                        onclick = `closeFavorites(); openCategory('${item.id}');`;
                    } else {
                        icon = 'fa-file-alt';
                        color = '#10b981';
                        onclick = `closeFavorites(); openMarkdownViewer('${item.url}', '${item.name}');`;
                    }
                    
                    return `
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
                            <div class="city-link" style="flex: 1; cursor: pointer;" onclick="${onclick}">
                                <i class="fas ${icon}" style="color: ${color};"></i>
                                <span>${item.name}</span>
                            </div>
                            <button onclick="event.stopPropagation(); removeFavorite('${item.type}', '${item.id}')" 
                                    style="padding: 10px; border: none; background: rgba(239,68,68,0.1); color: #ef4444; border-radius: 8px; cursor: pointer;">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `;
                }).join('');
            }
            
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function removeFavorite(type, id) {
            let favorites = JSON.parse(localStorage.getItem('dude-favorites') || '[]');
            favorites = favorites.filter(f => !(f.type === type && f.id === id));
            localStorage.setItem('dude-favorites', JSON.stringify(favorites));
            showFavorites(); // Refresh
            showToast('已取消收藏');
        }

        function closeFavorites() {
            document.getElementById('favoritesModal').classList.remove('active');
            document.body.style.overflow = '';
        }

        // ==================== Data Visualization ====================
        function initCharts() {
            // City distribution chart
            const cityChart = document.getElementById('cityChart');
            const cityData = [
                { label: '中国', value: 4, color: '#ec4899' },
                { label: '泰国', value: 1, color: '#10b981' },
                { label: '俄罗斯', value: 2, color: '#ef4444' },
                { label: '美国', value: 1, color: '#3b82f6' }
            ];
            
            cityChart.innerHTML = cityData.map(d => `
                <div class="chart-bar" 
                     style="height: ${d.value * 25}%; background: linear-gradient(135deg, ${d.color} 0%, ${d.color}88 100%);" 
                     data-label="${d.label}" 
                     data-value="${d.value}城">
                </div>
            `).join('');
            
            // Category distribution chart
            const categoryChart = document.getElementById('categoryChart');
            const categoryData = [
                { label: '生活', value: 8, color: '#6366f1' },
                { label: '健康', value: 6, color: '#10b981' },
                { label: '文化', value: 5, color: '#f59e0b' },
                { label: '其他', value: 3, color: '#06b6d4' }
            ];
            
            categoryChart.innerHTML = categoryData.map(d => `
                <div class="chart-bar" 
                     style="height: ${d.value * 10}%; background: linear-gradient(135deg, ${d.color} 0%, ${d.color}88 100%);" 
                     data-label="${d.label}" 
                     data-value="${d.value}类">
                </div>
            `).join('');
            
            // Trend chart (mock data)
            const trendChart = document.getElementById('trendChart');
            const trendData = [
                { label: '2020', value: 2 },
                { label: '2021', value: 3 },
                { label: '2022', value: 4 },
                { label: '2023', value: 5 },
                { label: '2024', value: 6 },
                { label: '2025', value: 7 },
                { label: '2026', value: 8 }
            ];
            
            trendChart.innerHTML = trendData.map((d, i) => `
                <div class="chart-bar" 
                     style="height: ${d.value * 10}%; background: linear-gradient(135deg, #06b6d4 0%, #22d3ee 100%);" 
                     data-label="${d.label}" 
                     data-value="${d.value}城">
                </div>
            `).join('');
        }

        // ==================== Markdown Viewer ====================
        function openMarkdownViewer(url, title) {
            const viewer = document.getElementById('markdownViewer');
            const content = document.getElementById('markdownContent');
            const titleText = document.getElementById('markdownTitleText');
            
            // Show viewer
            viewer.classList.add('active');
            document.body.style.overflow = 'hidden';
            titleText.textContent = title || '文档预览';
            
            // Show loading
            content.innerHTML = `
                <div class="markdown-loading">
                    <div class="spinner"></div>
                    <p>正在加载文档...</p>
                </div>
            `;
            
            // Fetch and render markdown
            fetch(url)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('文档加载失败');
                    }
                    return response.text();
                })
                .then(markdown => {
                    // Parse markdown
                    const html = marked.parse(markdown);
                    content.innerHTML = html;
                    
                    // Track visit
                    const cityMatch = url.match(/^([^/]+)/);
                    if (cityMatch) {
                        const cityId = cityMatch[1];
                        const cityInfo = cities.find(c => c.id === cityId);
                        if (cityInfo) {
                            addRecentVisit('document', url, title || cityInfo.name, { 
                                flag: cityInfo.flag,
                                url: url
                            });
                        }
                    }
                })
                .catch(error => {
                    content.innerHTML = `
                        <div class="markdown-error">
                            <i class="fas fa-exclamation-circle"></i>
                            <h3>加载失败</h3>
                            <p>${error.message}</p>
                            <p style="margin-top: 20px; font-size: 14px; color: #6b7280;">
                                文件路径: ${url}
                            </p>
                        </div>
                    `;
                });
        }

        function closeMarkdownViewer() {
            const viewer = document.getElementById('markdownViewer');
            viewer.classList.remove('active');
            document.body.style.overflow = '';
        }

        // ==================== Initialize ====================
        initTheme();
        renderRecentVisits();
        initCharts();

        // Expose to global for console access
        window.search = search;
        window.cities = cities;
        window.categories = categories;
        window.toggleFavorite = toggleFavorite;
        window.showFavorites = showFavorites;
        window.clearHistory = clearHistory;

        // Page Load Animation
        window.addEventListener('load', function() {
            setTimeout(() => {
                document.getElementById('loader').classList.add('hidden');
                animateNumbers();
            }, 500);
        });

        // Animate Numbers
        function animateNumbers() {
            const numbers = document.querySelectorAll('.stat-number');
            numbers.forEach((num, index) => {
                const target = parseInt(num.textContent);
                let current = 0;
                const increment = target / 50;
                const delay = index * 200;
                
                setTimeout(() => {
                    const timer = setInterval(() => {
                        current += increment;
                        if (current >= target) {
                            num.textContent = target;
                            clearInterval(timer);
                        } else {
                            num.textContent = Math.floor(current);
                        }
                    }, 30);
                }, delay);
            });
        }

        // Parallax Effect on Mouse Move
        document.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            document.querySelector('.bg-animation').style.transform = 
                `translate(${x * 20}px, ${y * 20}px)`;
        });

        // Console Easter Egg
        console.log('%c 🌍 DUDE Database ', 'background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; font-size: 24px; padding: 10px 20px; border-radius: 10px;');
        console.log('%c 全球生活方式数据库 - 2026 Edition ', 'color: #6366f1; font-size: 14px;');
        console.log('%c 可用命令: ', 'color: #ec4899; font-weight: bold;');
        console.log('  - search("关键词") : 搜索数据库');
        console.log('  - cities : 查看所有城市');
        console.log('  - categories : 查看所有类别');
        console.log('  - toggleFavorite(element, type, id, name) : 收藏功能');
        console.log('  - showFavorites() : 显示收藏');
        console.log('  - clearHistory() : 清空历史');
