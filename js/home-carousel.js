document.addEventListener('DOMContentLoaded', function() {
  // 1. 获取容器
  var container = document.getElementById('home-showcase-container');
  if (!container) return;

  // 2. 获取最新文章列表数据
  var posts = document.querySelectorAll('.latest-post-item');
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

      // 创建控制点
      var dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' is-active' : '');
      dot.onclick = function(index) {
        return function() {
          var slides = track.querySelectorAll('.hero-slide');
          var dots = controls.querySelectorAll('.hero-dot');
          slides.forEach(s => s.classList.remove('is-active'));
          dots.forEach(d => d.classList.remove('is-active'));
          slides[index].classList.add('is-active');
          dots[index].classList.add('is-active');
        };
      }(i);
      controls.appendChild(dot);
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
    // 如果没有第 4 篇，显示提示
    var noticeList = rightDiv.querySelector('.notice-list');
    noticeList.innerHTML = '<li style="color:#999;text-align:center;">暂无更多公告</li>';
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
    // 如果没有第 5 篇，隐藏特别推荐或显示提示
    var featuredBox = rightDiv.querySelector('#featured-post-box');
    featuredBox.querySelector('.featured-mini').innerHTML = '<span style="color:#999;font-size:14px;">暂无特别推荐</span>';
  }
  
  // 9. 启动自动轮播 (5 秒切换)
  if (slideCount > 1) {
     var currentSlide = 0;
     var slides = track.querySelectorAll('.hero-slide');
     var dots = controls.querySelectorAll('.hero-dot');
     
     setInterval(function() {
       slides[currentSlide].classList.remove('is-active');
       dots[currentSlide].classList.remove('is-active');
       
       currentSlide = (currentSlide + 1) % slideCount;
       
       slides[currentSlide].classList.add('is-active');
       dots[currentSlide].classList.add('is-active');
     }, 5000);
  }
});
