document.addEventListener('DOMContentLoaded', function() {
  try {
    var container = document.getElementById('home-showcase-container');
    if (!container) return;

    // 1. 动态抓取文章数据（兼容了各种旧类名和新类名）
    var posts = document.querySelectorAll('.post-list-item, .latest-post-item');
    
    // 如果没有文章，安全提示并优雅退出
    if (posts.length === 0) {
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:16px;">暂无文章数据</div>';
      var fallbackTitle = document.getElementById('featured-poster-title');
      if (fallbackTitle) fallbackTitle.textContent = "暂无推荐";
      return;
    }

    // 2. 构建纯净的轮播结构 HTML
    container.innerHTML = '<div class="home-hero-carousel"><div class="hero-track"></div><div class="hero-controls"></div></div>';
    var track = container.querySelector('.hero-track');
    var controls = container.querySelector('.hero-controls');
    
    var slides = []; 
    var dots = [];   

    // 3. 动态填充左侧轮播图（自适应数量：最多3篇，不够有几篇算几篇）
    var maxSlides = 3;
    for (var i = 0; i < posts.length && slides.length < maxSlides; i++) {
      var post = posts[i];
      var imgEl = post.querySelector('.post-cover-wrapper img') || post.querySelector('.post-cover img') || post.querySelector('img');
      var titleEl = post.querySelector('.post-item-title a') || post.querySelector('.post-title a') || post.querySelector('a');
      var excerptEl = post.querySelector('.post-item-excerpt') || post.querySelector('.post-excerpt');
      
      // 必须有标题才生成幻灯片，防止生成空对象
      if (titleEl) {
        var slideIndex = slides.length; // 当前生成的真实索引
        
        var imgSrc = imgEl ? imgEl.src : '';
        var titleText = titleEl.textContent || '无标题';
        var linkHref = titleEl.href || '#';
        var excerptText = excerptEl ? excerptEl.textContent : '';

        var slide = document.createElement('div');
        slide.className = 'hero-slide' + (slideIndex === 0 ? ' is-active' : '');
        
        if (imgSrc) {
          slide.style.backgroundImage = 'url(' + imgSrc + ')';
        } else {
          slide.style.backgroundColor = '#3b82f6'; // 无图片时的备用蓝色背景
        }
        
        slide.innerHTML = 
          '<div class="hero-overlay">' +
            '<div class="hero-content">' +
              '<span class="hero-tag">推荐</span>' +
              '<h2 class="hero-title">' + titleText + '</h2>' +
              '<p class="hero-desc">' + excerptText + '</p>' +
            '</div>' +
          '</div>';
        
        // 点击跳转
        slide.addEventListener('click', (function(href) {
          return function() { window.location.href = href; };
        })(linkHref));
        
        track.appendChild(slide);
        slides.push(slide); 

        // 生成底部控制点
        var dot = document.createElement('button');
        dot.className = 'hero-dot' + (slideIndex === 0 ? ' is-active' : '');
        
        dot.addEventListener('click', (function(index) {
          return function() {
            slides.forEach(function(s) { s.classList.remove('is-active'); });
            dots.forEach(function(d) { d.classList.remove('is-active'); });
            if(slides[index]) slides[index].classList.add('is-active');
            if(dots[index]) dots[index].classList.add('is-active');
          };
        })(slideIndex));
        
        controls.appendChild(dot);
        dots.push(dot); 
      }
    }

    // 4. 动态填充特别推荐海报 (永远抓取最新发布的第一篇文章)
    var featuredImgEl = document.getElementById('featured-poster-img');
    var featuredTitleEl = document.getElementById('featured-poster-title');
    var featuredCard = document.querySelector('.featured-poster-card');

    if (posts[0] && featuredCard) {
      var sourceImg = posts[0].querySelector('.post-cover-wrapper img') || posts[0].querySelector('.post-cover img') || posts[0].querySelector('img');
      var sourceTitle = posts[0].querySelector('.post-item-title a') || posts[0].querySelector('.post-title a') || posts[0].querySelector('a');

      if (sourceImg && featuredImgEl) featuredImgEl.src = sourceImg.src;
      if (sourceTitle && featuredTitleEl) {
        featuredTitleEl.textContent = sourceTitle.textContent || '无标题';
        featuredCard.addEventListener('click', function() { window.location.href = sourceTitle.href; });
        featuredCard.style.cursor = 'pointer';
      }
    }

    // 5. 智能启动自动轮播【🚨 彻底修复白屏崩溃问题的核心逻辑 🚨】
    var actualSlideCount = slides.length; // 获取真正渲染成功后的幻灯片总数
    
    // 如果只有 1 篇文章或没文章，直接隐藏底部圆点，绝不启动定时器！
    if (actualSlideCount <= 1) {
       controls.style.display = 'none';
    } else {
       var currentSlide = 0;
       setInterval(function() {
         // 二重安全防御：确幻灯片不为空
         if (actualSlideCount === 0) return;

         // 移除当前活动状态
         if(slides[currentSlide]) slides[currentSlide].classList.remove('is-active');
         if(dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
         
         // 核心修复：% (取模)运算。确保索引永远在 0 到 actualSlideCount-1 之间安全循环！
         // 即使你只有 2 篇文章，它也会完美地 0 -> 1 -> 0 -> 1 循环，绝不报错！
         currentSlide = (currentSlide + 1) % actualSlideCount;
         
         // 添加下一个活动状态
         if(slides[currentSlide]) slides[currentSlide].classList.add('is-active');
         if(dots[currentSlide]) dots[currentSlide].classList.add('is-active');
       }, 5000);
    }
  } catch (err) {
    // 万一发生意外，在控制台打印错误，但绝对不阻断后续代码的执行！
    console.error('Hlog Carousel Error:', err);
  }
});
