document.addEventListener('DOMContentLoaded', function() {
    // 增加容错检查：尝试获取默认轮播图 ID 或你自定义的容器 ID
    const sliderEl = document.getElementById('index_slider') || document.getElementById('home-showcase-container');
    
    // 核心修复：如果当前页面没渲染轮播图 DOM（比如在文章内容页），则直接退出，不执行后续初始化，防止报错
    if (!sliderEl) {
        return; 
    }

    try {
        // --- 轮播图具体初始化逻辑 ---
        
        // 抓取页面上渲染出来的文章 (兼容你原有的逻辑)
        const posts = document.querySelectorAll('.post-list-item');
        
        if (posts.length > 0) {
            // 这里可以继续写你具体的轮播图控制代码
            // 例如初始化 Swiper： 
            // new Swiper('#index_slider', { ... });
        }
        
        console.log('轮播图初始化成功');
    } catch (e) {
        console.error('轮播图初始化失败:', e);
    }
});