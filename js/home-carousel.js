document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取轮播容器
  var container = document.getElementById('home-showcase-container');
  if (!container) return;

  // 2. 获取最新文章列表数据 (抓取下半部分已经生成的文章)
  var posts = document.querySelectorAll('.post-list-item');
  if (posts.length === 0) return; // 如果一篇文章都没有，静默退出，不报错

  // 3. 构建纯净的轮播区域 HTML
  container.innerHTML = '<div class="home-hero-carousel"><div class="hero-track"></div><div class="hero-controls"></div></div>';

  // 4. 动态填充轮播图 (自动适应：最多取 3 篇，不够有几篇取几篇)
  var track = container.querySelector('.hero-track');
  var controls = container.querySelector('.hero-controls');
  var slideCount = Math.min(3, posts.length);
  var slides = []; 
  var dots = [];   

  for (var i = 0; i < slideCount; i++) {
    var post = posts[i];
    var imgEl = post.querySelector('.post-cover-wrapper img') || post.querySelector('img');
    var titleEl = post.querySelector('.post-item-title a') || post.querySelector('a');
    var excerptEl = post.querySelector('.post-item-excerpt');
    
    if (imgEl && titleEl) {
      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      slide.style.backgroundImage = 'url(' + imgEl.src + ')';
      slide.innerHTML = 
        '<div class="hero-overlay">' +
          '<div class="hero-content">' +
            '<span class="hero-tag">推荐</span>' +
            '<h2 class="hero-title">' + titleEl.textContent + '</h2>' +
            '<p class="hero-desc">' + (excerptEl ? excerptEl.textContent : '') + '</p>' +
          '</div>' +
        '</div>';
      
      slide.onclick = function(href) {
        return function() { window.location.href = href; };
      }(titleEl.href);
      
      track.appendChild(slide);
      slides.push(slide); 

      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.onclick = (function(index) {
        return function() {
          slides.forEach(function(s) { s.classList.remove('is-active'); });
          dots.forEach(function(d) { d.classList.remove('is-active'); });
          if(slides[index]) slides[index].classList.add('is-active');
          if(dots[index]) dots[index].classList.add('is-active');
        };
      })(i);
      controls.appendChild(dot);
      dots.push(dot); 
    }
  }

  // 5. 动态填充特别推荐海报 (按要求：读取最新的一篇文章，即第一篇 posts[0])
  if (posts[0]) {
    var featuredImgEl = document.getElementById('featured-poster-img');
    var featuredTitleEl = document.getElementById('featured-poster-title');
    var featuredCard = document.querySelector('.featured-poster-card');

    var sourceImg = posts[0].querySelector('.post-cover-wrapper img') || posts[0].querySelector('img');
    var sourceTitle = posts[0].querySelector('.post-item-title a') || posts[0].querySelector('a');

    if (sourceImg && sourceTitle && featuredImgEl && featuredTitleEl && featuredCard) {
      featuredImgEl.src = sourceImg.src;
      featuredTitleEl.textContent = sourceTitle.textContent;
      
      featuredCard.onclick = function(href) {
        return function() { window.location.href = href; };
      }(sourceTitle.href);
      featuredCard.style.cursor = 'pointer';
    }
  } else {
     // 极端情况防御：有可能会进入这里，但保证不报错
     var featuredTitleFallback = document.getElementById('featured-poster-title');
     if (featuredTitleFallback) featuredTitleFallback.textContent = "暂无推荐文章";
  }

  // 6. 启动自动轮播 (极其关键：只有文章数 > 1 篇时才开启轮播动画)
  if (slides.length > 1) {
     var currentSlide = 0;
     setInterval(function() {
       if(slides[currentSlide]) slides[currentSlide].classList.remove('is-active');
       if(dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
       
       currentSlide = (currentSlide + 1) % slides.length;
       
       if(slides[currentSlide]) slides[currentSlide].classList.add('is-active');
       if(dots[currentSlide]) dots[currentSlide].classList.add('is-active');
     }, 5000);
  }
});
