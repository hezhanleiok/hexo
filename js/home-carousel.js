document.addEventListener('DOMContentLoaded', function() {
  try {
    var container = document.getElementById('home-showcase-container');
    if (!container) return;

    var posts = document.querySelectorAll('.post-list-item');
    
    // 如果没有任何文章，优雅降级，不报错
    if (posts.length === 0) {
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:16px;">暂无发布文章</div>';
      var fallbackTitle = document.getElementById('featured-poster-title');
      if (fallbackTitle) fallbackTitle.textContent = "暂无推荐文章";
      return;
    }

    container.innerHTML = '<div class="home-hero-carousel"><div class="hero-track"></div><div class="hero-controls"></div></div>';
    var track = container.querySelector('.hero-track');
    var controls = container.querySelector('.hero-controls');
    var slideCount = Math.min(3, posts.length);
    var slides = []; 
    var dots = [];   

    // 填充左侧轮播图
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
        
        slide.onclick = (function(href) {
          return function() { window.location.href = href; };
        })(titleEl.href);
        
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

    // 动态填充特别推荐海报 (永远抓取最新发布的第一篇文章)
    if (posts[0]) {
      var featuredImgEl = document.getElementById('featured-poster-img');
      var featuredTitleEl = document.getElementById('featured-poster-title');
      var featuredCard = document.querySelector('.featured-poster-card');

      var sourceImg = posts[0].querySelector('.post-cover-wrapper img') || posts[0].querySelector('img');
      var sourceTitle = posts[0].querySelector('.post-item-title a') || posts[0].querySelector('a');

      if (sourceImg && sourceTitle && featuredImgEl && featuredTitleEl && featuredCard) {
        featuredImgEl.src = sourceImg.src;
        featuredTitleEl.textContent = sourceTitle.textContent;
        featuredCard.onclick = function() { window.location.href = sourceTitle.href; };
        featuredCard.style.cursor = 'pointer';
      }
    }

    // 智能启动自动轮播
    if (slides.length <= 1) {
       controls.style.display = 'none';
    } else {
       var currentSlide = 0;
       setInterval(function() {
         if(slides[currentSlide]) slides[currentSlide].classList.remove('is-active');
         if(dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
         currentSlide = (currentSlide + 1) % slides.length;
         if(slides[currentSlide]) slides[currentSlide].classList.add('is-active');
         if(dots[currentSlide]) dots[currentSlide].classList.add('is-active');
       }, 5000);
    }
  } catch (err) {
    console.error('Hlog Carousel Error:', err);
  }
});