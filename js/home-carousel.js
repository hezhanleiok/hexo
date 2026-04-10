document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取容器
  var container = document.getElementById('home-showcase-container');
  if (!container) return;

  // 2. 获取最新文章列表数据
  var posts = document.querySelectorAll('.latest-post-item');
  // 如果文章太少，不执行复杂布局，避免报错
  if (posts.length === 0) return;

  // 3. 构建左侧轮播区域 HTML
  var leftDiv = document.createElement('div');
  leftDiv.className = 'home-showcase-left';
  leftDiv.innerHTML = '<div class="home-hero-carousel"><div class="hero-track"></div><div class="hero-controls"></div></div>';
  
  // 4. 构建右侧公告 + 特别文章区域 HTML
  var rightDiv = document.createElement('div');
  rightDiv.className = 'home-showcase-right';
  rightDiv.innerHTML = 
    '<div id="announcement-box" class="home-card">' +
      '<h3 class="home-card-title">最新公告</h3>' +
      '<ul class="notice-list"></ul>' +
    '</div>' +
    '<div id="featured-post-box" class="home-card">' +
      '<h3 class="home-card-title">特别推荐</h3>' +
      '<div class="featured-mini"></div>' +
    '</div>';

  // 5. 清空容器并重新插入 (顺序：左 -> 右)
  container.innerHTML = ''; 
  container.appendChild(leftDiv);
  container.appendChild(rightDiv);

  // 6. 填充轮播图 (取前 3 篇)
  var track = leftDiv.querySelector('.hero-track');
  var controls = leftDiv.querySelector('.hero-controls');
  var slideCount = Math.min(3, posts.length);
  var slides = []; // 存储生成的幻灯片元素
  var dots = [];   // 存储生成的控制点元素

  for (var i = 0; i < slideCount; i++) {
    var post = posts[i];
    var imgEl = post.querySelector('.post-cover img');
    var titleEl = post.querySelector('.post-title a');
    var excerptEl = post.querySelector('.post-excerpt');
    
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
      
      // 点击跳转
      slide.onclick = function(href) {
        return function() { window.location.href = href; };
      }(titleEl.href);
      
      track.appendChild(slide);
      slides.push(slide); // 存入数组

      // 创建控制点
      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.onclick = function(index) {
        return function() {
          slides.forEach(s => s.classList.remove('is-active'));
          dots.forEach(d => d.classList.remove('is-active'));
          if(slides[index]) slides[index].classList.add('is-active');
          if(dots[index]) dots[index].classList.add('is-active');
        };
      }(i);
      controls.appendChild(dot);
      dots.push(dot); // 存入数组
    }
  }

  // 7. 填充公告 (取第 4 篇)
  if (posts[3]) {
    var noticeList = rightDiv.querySelector('.notice-list');
    var titleEl = posts[3].querySelector('.post-title a');
    if (titleEl) {
      var li = document.createElement('li');
      li.innerHTML = '<a href="' + titleEl.href + '">' + titleEl.textContent + '</a>';
      noticeList.appendChild(li);
    }
  } else {
    var noticeList = rightDiv.querySelector('.notice-list');
    noticeList.innerHTML = '<li style="color:#999;text-align:center;padding:10px;">暂无更多公告</li>';
  }

  // 8. 填充特别推荐 (取第 5 篇)
  if (posts[4]) {
    var featuredBox = rightDiv.querySelector('#featured-post-box');
    var featuredDiv = featuredBox.querySelector('.featured-mini');
    var imgEl = posts[4].querySelector('.post-cover img');
    var titleEl = posts[4].querySelector('.post-title a');
    
    if (imgEl && titleEl) {
      featuredDiv.innerHTML = 
        '<div class="featured-mini-thumb" style="background-image:url(' + imgEl.src + ')"></div>' +
        '<h4 class="featured-mini-title">' + titleEl.textContent + '</h4>';
      
      featuredBox.onclick = function(href) {
        return function() { window.location.href = href; };
      }(titleEl.href);
      featuredBox.style.cursor = 'pointer';
    }
  } else {
    var featuredBox = rightDiv.querySelector('#featured-post-box');
    featuredBox.querySelector('.featured-mini').innerHTML = '<span style="color:#999;font-size:14px;display:block;text-align:center;padding:20px;">暂无特别推荐</span>';
  }
  
  // 9. 启动自动轮播 (修复报错：只有当幻灯片数量 > 1 时才启动)
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
