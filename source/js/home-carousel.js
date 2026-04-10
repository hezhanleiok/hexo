document.addEventListener('DOMContentLoaded', function() {
  try {
    var container = document.getElementById('home-showcase-container');
    if (!container) return;

    // 抓取页面上渲染出来的文章
    var posts = document.querySelectorAll('.post-list-item');
    if (posts.length === 0) {
      container.innerHTML = '<div style=\"display:flex;align-items:center;justify-content:center;height:100%;color:#999;\">暂无文章发布</div>';
      return;
    }

    // 1. 生成轮播 HTML
    container.innerHTML = '<div class=\"home-hero-carousel\"><div class=\"hero-track\"></div><div class=\"hero-controls\"></div></div>';
    var track = container.querySelector('.hero-track');
    var controls = container.querySelector('.hero-controls');
    var slides = [];
    var dots = [];
    var slideCount = Math.min(3, posts.length);

    for (var i = 0; i < slideCount; i++) {
      var post = posts[i];
      var img = post.querySelector('img') ? post.querySelector('img').src : '';
      var title = post.querySelector('.post-item-title') ? post.item_title.textContent : '文章';
      var link = post.href || '#';

      var slide = document.createElement('div');
      slide.className = 'hero-slide' + (i === 0 ? ' is-active' : '');
      slide.style.cssText = 'position:absolute;inset:0;opacity:0;transition:opacity 0.6s;background-size:cover;background-position:center;cursor:pointer;display:flex;align-items:flex-end;';
      if(i === 0) slide.style.opacity = '1';
      if(img) slide.style.backgroundImage = 'url(' + img + ')';

      slide.innerHTML = '<div style=\"padding:30px;background:linear-gradient(transparent, rgba(0,0,0,0.8));width:100%;color:#fff;\"><h2 style=\"margin:0;font-size:24px;\">' + title + '</h2></div>';
      slide.onclick = (function(l){ return function(){ window.location.href = l; }})(link);
      
      track.appendChild(slide);
      slides.push(slide);

      var dot = document.createElement('button');
      dot.style.cssText = 'width:10px;height:10px;border-radius:50%;border:none;margin:0 5px;background:rgba(255,255,255,0.5);cursor:pointer;';
      if(i === 0) dot.style.background = '#3b82f6';
      controls.appendChild(dot);
      dots.push(dot);
    }

    // 2. 填充特别推荐海报
    var posterImg = document.getElementById('featured-poster-img');
    var posterTitle = document.getElementById('featured-poster-title');
    if (posts[0] && posterImg && posterTitle) {
        var firstImg = posts[0].querySelector('img');
        var firstTitle = posts[0].querySelector('.post-item-title');
        if(firstImg) posterImg.src = firstImg.src;
        if(firstTitle) posterTitle.textContent = firstTitle.textContent;
    }

    // 3. 只有超过1张才轮播
    if (slides.length > 1) {
      var curr = 0;
      setInterval(function() {
        slides[curr].style.opacity = '0';
        dots[curr].style.background = 'rgba(255,255,255,0.5)';
        curr = (curr + 1) % slides.length;
        slides[curr].style.opacity = '1';
        dots[curr].style.background = '#3b82f6';
      }, 5000);
    }
  } catch (e) {
    console.warn('轮播组件加载略有延迟或遇到非致命错误', e);
  }
});
