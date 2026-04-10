document.addEventListener('DOMContentLoaded', function() {
  try {
    var container = document.getElementById('home-showcase-container');
    if (!container) return;

    var posts = document.querySelectorAll('.post-list-item');
    
    // 如果没有文章，安全提示并退出
    if (posts.length === 0) {
      container.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100%;color:#999;font-size:16px;">暂无文章数据</div>';
      var fallbackTitle = document.getElementById('featured-poster-title');
      if (fallbackTitle) fallbackTitle.textContent = "暂无推荐";
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
      
      var imgSrc = imgEl ? imgEl.src : '';
      var titleText = titleEl ? titleEl.textContent : '无标题';
      var linkHref = titleEl ? titleEl.href : '#';
      var excerptText = excerptEl ? excerptEl.textContent : '';

      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      if (imgSrc) {
        slide.style.backgroundImage = 'url(' + imgSrc + ')';
      } else {
        slide.style.backgroundColor = '#3b82f6'; // 无图片时的备用背景色
      }
      
      slide.innerHTML = 
        '<div class="hero-overlay">' +
          '<div class="hero-content">' +
            '<span class="hero-tag">推荐</span>' +
            '<h2 class="hero-title">' + titleText + '</h2>' +
            '<p class="hero-desc">' + excerptText + '</p>' +
          '</div>' +
        '</div>';
      
      slide.onclick = (function(href) {
        return function() { window.location.href = href; };
      })(linkHref);
      
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

    // 动态填充特别推荐海报 (永远抓取最新发布的第一篇文章)
    var featuredImgEl = document.getElementById('featured-poster-img');
    var featuredTitleEl = document.getElementById('featured-poster-title');
    var featuredCard = document.querySelector('.featured-poster-card');

    if (posts[0] && featuredImgEl && featuredTitleEl && featuredCard) {
      var sourceImg = posts[0].querySelector('.post-cover-wrapper img') || posts[0].querySelector('img');
      var sourceTitle = posts[0].querySelector('.post-item-title a') || posts[0].querySelector('a');

      if (sourceImg) featuredImgEl.src = sourceImg.src;
      if (sourceTitle) {
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