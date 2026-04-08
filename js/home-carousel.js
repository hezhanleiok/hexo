(function () {
  function textOf(el) {
    return el ? (el.textContent || '').replace(/\s+/g, ' ').trim() : '';
  }

  function truncate(str, n) {
    if (!str) return '';
    return str.length > n ? str.slice(0, n) + '...' : str;
  }

  function pickCover(postEl) {
    var img = postEl.querySelector('.post_cover img.post-bg') || postEl.querySelector('.content img');
    return img ? img.getAttribute('src') : '';
  }

  function parsePosts(postWrap) {
    return Array.prototype.slice.call(postWrap.querySelectorAll('.recent-post-item')).map(function (post, index) {
      var titleEl = post.querySelector('.article-title');
      return {
        id: index,
        title: textOf(titleEl) || 'Latest Post',
        href: titleEl ? titleEl.getAttribute('href') : '/',
        desc: truncate(textOf(post.querySelector('.content')), 110),
        cover: pickCover(post)
      };
    });
  }

  function buildCarousel(slides) {
    var dots = slides
      .map(function (slide, i) {
        return '<button class="hero-dot' + (i === 0 ? ' is-active' : '') + '" type="button" data-slide="' + i + '" aria-label="slide ' + (i + 1) + '"></button>';
      })
      .join('');

    var slideHtml = slides
      .map(function (slide, i) {
        var activeClass = i === 0 ? ' is-active' : '';
        var noCoverClass = slide.cover ? '' : ' no-cover';
        var styleAttr = slide.cover ? ' style="background-image:url(\'' + slide.cover + '\')"' : '';
        var descHtml = slide.desc ? '<p class="hero-desc">' + slide.desc + '</p>' : '';

        return (
          '<a class="hero-slide' + activeClass + noCoverClass + '" href="' + slide.href + '"' + styleAttr + '>' +
            '<div class="hero-overlay">' +
              '<div class="hero-content">' +
                '<span class="hero-tag">轮播推荐</span>' +
                '<h2 class="hero-title">' + slide.title + '</h2>' +
                descHtml +
              '</div>' +
            '</div>' +
          '</a>'
        );
      })
      .join('');

    return '<section class="home-hero-carousel"><div class="hero-track">' + slideHtml + '</div><div class="hero-controls">' + dots + '</div></section>';
  }

  function buildNoticeHtml(posts) {
    // 从 localStorage 读取公告数据
    var announcements = [];
    try {
      announcements = JSON.parse(localStorage.getItem('announcements') || '[]');
    } catch (e) {
      announcements = [];
    }

    // 默认公告内容
    var defaultLines = [
      '博客全新布局已上线：轮播 + 公告 + 推荐区。',
      '右侧网站信息已修复为对齐展示，阅读更清晰。',
      '欢迎查看最新文章，持续更新前端与开发实战。'
    ];

    // 如果有公告，使用公告数据；否则使用默认公告
    var noticeItems = [];
    if (announcements.length > 0) {
      // 最多显示5个公告
      var maxNotices = Math.min(announcements.length, 5);
      for (var i = 0; i < maxNotices; i++) {
        var ann = announcements[i];
        var title = (ann.title || '').replace(/"/g, '"');
        var content = (ann.content || '').replace(/"/g, '"');
        var link = ann.link || '#';
        noticeItems.push('<li><a href="' + link + '" title="' + content + '">' + truncate(title, 42) + '</a></li>');
      }
    } else {
      // 使用默认公告
      noticeItems = defaultLines.map(function (line) {
        return '<li>' + line + '</li>';
      });
    }

    return '<section class="home-card"><h3 class="home-card-title">最新公告</h3><ul class="notice-list">' + noticeItems.join('') + '</ul></section>';
  }

  function buildFeaturedMini(feature) {
    var noCoverClass = feature.cover ? '' : ' no-cover';
    var styleAttr = feature.cover ? ' style="background-image:url(\'' + feature.cover + '\')"' : '';

    return (
      '<section class="home-card">' +
        '<h3 class="home-card-title">特别文章</h3>' +
        '<a class="featured-mini" href="' + feature.href + '">' +
          '<div class="featured-mini-thumb' + noCoverClass + '"' + styleAttr + '></div>' +
          '<p class="featured-mini-title">' + truncate(feature.title, 48) + '</p>' +
        '</a>' +
      '</section>'
    );
  }

  function initCarouselAutoPlay(root) {
    var slideEls = root.querySelectorAll('.hero-slide');
    var dotEls = root.querySelectorAll('.hero-dot');
    if (!slideEls.length || !dotEls.length) return;

    var activeIndex = 0;
    var timer = null;

    function setActive(index) {
      activeIndex = index;
      slideEls.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === index);
      });
      dotEls.forEach(function (item, idx) {
        item.classList.toggle('is-active', idx === index);
      });
    }

    function next() {
      setActive((activeIndex + 1) % slideEls.length);
    }

    function startAutoPlay() {
      stopAutoPlay();
      timer = setInterval(next, 5000);
    }

    function stopAutoPlay() {
      if (timer) {
        clearInterval(timer);
        timer = null;
      }
    }

    dotEls.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-slide'));
        if (!Number.isNaN(index)) {
          setActive(index);
          startAutoPlay();
        }
      });
    });

    root.addEventListener('mouseenter', stopAutoPlay);
    root.addEventListener('mouseleave', startAutoPlay);
    startAutoPlay();
  }

    function buildHomeModules() {
    // 🔥 修改：使用新的容器 #home-showcase-container
    var showcaseRoot = document.getElementById('home-showcase-container');
    var postWrap = document.querySelector('#recent-posts .recent-post-items');
    
    // 如果容器不存在或已初始化，跳过
    if (!showcaseRoot || !postWrap || showcaseRoot.querySelector('.home-showcase')) return;

    var allPosts = parsePosts(postWrap);
    if (!allPosts.length) return;

    var carouselPosts = allPosts.slice(0, 3);
    var featuredPost = allPosts[3] || allPosts[0];

    // 🔥 修改：构建 3 列布局结构
    var showcase = document.createElement('div');
    showcase.className = 'home-showcase';
    showcase.innerHTML =
      '<div class="home-showcase-left">' + buildCarousel(carouselPosts) + '</div>' +
      '<div class="home-showcase-right">' + buildNoticeHtml(allPosts) + buildFeaturedMini(featuredPost) + '</div>';

    showcaseRoot.appendChild(showcase);

    var carouselRoot = showcase.querySelector('.home-hero-carousel');
    if (carouselRoot) initCarouselAutoPlay(carouselRoot);
  }

  function initNavSplit() {
    var menuWrap = document.querySelector('#menus .menus_items');
    if (!menuWrap) return;

    var links = menuWrap.querySelectorAll('.menus_item > a.site-page');
    links.forEach(function (link) {
      var href = (link.getAttribute('href') || '').replace(/\/$/, '');
      if (href.endsWith('/login') || href.endsWith('/register')) {
        link.parentElement.classList.add('menu-right-item');
      }
    });

    var rightStart = menuWrap.querySelector('.menu-right-item');
    if (rightStart) rightStart.classList.add('menu-right-start');
  }

  function boot() {
    initNavSplit();
    buildHomeModules();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  document.addEventListener('pjax:complete', boot);
})();
