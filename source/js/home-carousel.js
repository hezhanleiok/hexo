document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.getElementById('index_slider');
    
    // 如果不在首页或找不到容器，直接退出，防止 F12 报错
    if (!sliderContainer) return;

    // 检查是否有带封面的文章
    const hasCovers = document.querySelectorAll('.recent-post-item .post_cover').length > 0;

    if (!hasCovers) {
        // 如果没有封面文章，隐藏加载状态，避免一直显示加载中
        sliderContainer.innerHTML = '<div style="padding:20px; text-align:center;">暂无封面文章</div>';
        return;
    }

    try {
        // 这里是你的轮播初始化代码（例如 Swiper）
        // 如果你使用的是 Butterfly 自带的 slider，它通常会自动寻找 data-source
        console.log('Carousel content detected, starting initialization...');
        
        // 强制移除“加载中”样式的容错处理（如果你有手动添加的 loading 标签）
        const loadingEl = sliderContainer.querySelector('.loading-text');
        if (loadingEl) loadingEl.style.display = 'none';

    } catch (err) {
        console.warn('Carousel script error:', err);
    }
});