document.addEventListener('DOMContentLoaded', function () {
    const sliderContainer = document.getElementById('index_slider');
    
    // 如果不在首页或找不到容器，直接退出
    if (!sliderContainer) return;

    // 适配你自己写的 CSS，获取所有首页文章列表项目
    const posts = Array.from(document.querySelectorAll('.post-list-item')).filter(post => {
        return post.querySelector('.post-cover-wrapper img'); // 只筛选带有封面的文章
    });

    if (posts.length === 0) {
        sliderContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#999;">暂无轮播文章</div>';
        return;
    }

    try {
        // 清除原来的 loading
        sliderContainer.innerHTML = '';
        
        // 动态构建 Swiper 的 DOM 结构
        let swiperHTML = '<div class="swiper-container" style="width:100%; height:100%; position:relative; overflow:hidden; border-radius:12px;"><div class="swiper-wrapper">';
        
        posts.forEach(post => {
            const coverImgUrl = post.querySelector('.post-cover-wrapper img').src;
            const titleEl = post.querySelector('.post-item-title a');
            const title = titleEl.innerText;
            const link = titleEl.href;
            
            swiperHTML += `
                <div class="swiper-slide">
                    <a href="${link}" style="display:block; width:100%; height:100%; position:relative;">
                        <img src="${coverImgUrl}" style="width:100%; height:100%; object-fit:cover; transition: transform 0.3s;">
                        <div style="position:absolute; bottom:0; left:0; width:100%; padding: 40px 20px 20px; background:linear-gradient(to top, rgba(0,0,0,0.85), transparent); box-sizing:border-box;">
                            <h3 style="color:#fff; margin:0; font-size:18px; font-weight:700; text-shadow: 0 2px 4px rgba(0,0,0,0.5);">${title}</h3>
                        </div>
                    </a>
                </div>`;
        });
        
        swiperHTML += `
            </div>
            <div class="swiper-pagination"></div>
            <div class="swiper-button-next" style="color:#fff; transform:scale(0.7);"></div>
            <div class="swiper-button-prev" style="color:#fff; transform:scale(0.7);"></div>
        </div>`;
        
        // 将构建好的 HTML 插入容器
        sliderContainer.innerHTML = swiperHTML;

        // 初始化 Swiper 组件
        if (typeof Swiper !== 'undefined') {
            new Swiper(sliderContainer.querySelector('.swiper-container'), {
                loop: posts.length > 1, // 大于1篇才开启循环
                autoplay: { delay: 4000, disableOnInteraction: false },
                effect: 'fade', // 如果喜欢渐变加上这个，不需要可以删掉
                pagination: { 
                    el: '.swiper-pagination', 
                    clickable: true 
                },
                navigation: { 
                    nextEl: '.swiper-button-next', 
                    prevEl: '.swiper-button-prev' 
                }
            });
        }
    } catch (err) {
        console.warn('Carousel script error:', err);
    }
});