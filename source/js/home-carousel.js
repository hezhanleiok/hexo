document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取轮播容器 (现在它只负责左侧区域)
  var container = document.getElementById('home-showcase-container');
  if (!container) return;

  // 2. 获取最新文章列表数据 (做了类名兼容，防止抓不到数据)
  var posts = document.querySelectorAll('.latest-post-item, .post-list-item');
  // 如果文章太少，不执行复杂布局，避免报错
  if (posts.length === 0) return;

  // 3. 构建纯净的轮播区域 HTML
  // 直接填充到 container 中，不再创建 leftDiv 和 rightDiv
  container.innerHTML = '<div class="home-hero-carousel"><div class="hero-track"></div><div class="hero-controls"></div></div>';

  // 4. 填充轮播图 (取前 3 篇)
  var track = container.querySelector('.hero-track');
  var controls = container.querySelector('.hero-controls');
  var slideCount = Math.min(3, posts.length);
  var slides = []; // 存储生成的幻灯片元素
  var dots = [];   // 存储生成的控制点元素

  for (var i = 0; i < slideCount; i++) {
    var post = posts[i];
    
    // 获取文章封面、标题和摘要 (兼容了你之前的类名和新的类名)
    var imgEl = post.querySelector('.post-cover img') || post.querySelector('.post-cover-wrapper img') || post.querySelector('img');
    var titleEl = post.querySelector('.post-title a') || post.querySelector('.post-item-title a') || post.querySelector('a');
    var excerptEl = post.querySelector('.post-excerpt') || post.querySelector('.post-item-excerpt');
    
    if (imgEl && titleEl) {
      // 创建幻灯片
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
      
      // 点击幻灯片跳转
      slide.onclick = function(href) {
        return function() { window.location.href = href; };
      }(titleEl.href);
      
      track.appendChild(slide);
      slides.push(slide); // 存入数组

      // 创建底部控制点
      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.onclick = function(index) {
        return function() {
          slides.forEach(function(s) { s.classList.remove('is-active'); });
          dots.forEach(function(d) { d.classList.remove('is-active'); });
          if(slides[index]) slides[index].classList.add('is-active');
          if(dots[index]) dots[index].classList.add('is-active');
        };
      }(i);
      controls.appendChild(dot);
      dots.push(dot); // 存入数组
    }
  }

  // (注：原本的第 7 步公告和第 8 步特别推荐已彻底删除，因为在 Pug 和 CSS 中已经排版好了)

  // 5. 启动自动轮播 (只有当幻灯片数量 > 1 时才启动)
  if (slides.length > 1) {
     var currentSlide = 0;
     
     setInterval(function() {
       // 安全移除类名
       if(slides[currentSlide]) slides[currentSlide].classList.remove('is-active');
       if(dots[currentSlide]) dots[currentSlide].classList.remove('is-active');
       
       currentSlide = (currentSlide + 1) % slides.length;
       
       // 安全添加类名
       if(slides[currentSlide]) slides[currentSlide].classList.add('is-active');
       if(dots[currentSlide]) dots[currentSlide].classList.add('is-active');
     }, 5000);
  }
});
