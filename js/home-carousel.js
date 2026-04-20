document.addEventListener('DOMContentLoaded', function () {
    // 修复1：使用真实的容器 ID
    const sliderContainer = document.getElementById('home-showcase-container');
    
    if (!sliderContainer) return;

    // 获取所有带有封面的文章卡片
    const posts = Array.from(document.querySelectorAll('.post-list-item')).filter(post => {
        return post.querySelector('.post-cover-wrapper img'); 
    });

    if (posts.length === 0) {
        sliderContainer.innerHTML = '<div style="padding:20px; text-align:center; color:#999;">暂无轮播文章</div>';
        return;
    }

    try {
        sliderContainer.innerHTML = '';
        let swiperHTML = '<div class="swiper-container" style="width:100%; height:100%; position:absolute; top:0; left:0; overflow:hidden; border-radius:12px;"><div class="swiper-wrapper">';
        
        posts.forEach(post => {
            const coverImgUrl = post.querySelector('.post-cover-wrapper img').src;
            // 修复2：直接获取外层 a 标签的 href，以及内部标题的文字
            const title = post.querySelector('.post-item-title').innerText;
            const link = post.getAttribute('href');
            
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
        
        sliderContainer.innerHTML = swiperHTML;

        if (typeof Swiper !== 'undefined') {
            new Swiper(sliderContainer.querySelector('.swiper-container'), {
                loop: posts.length > 1,
                autoplay: { delay: 4000, disableOnInteraction: false },
                effect: 'fade',
                pagination: { el: '.swiper-pagination', clickable: true },
                navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }
            });
        }
    } catch (err) {
        console.warn('Carousel script error:', err);
    }
});