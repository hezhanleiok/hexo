// 获取最新5篇文章（数据来自 Hexo 生成的全局变量）
document.addEventListener('DOMContentLoaded', function() {
  // 注意：Hexo 在页面中会注入 window.siteData 或通过其他方式暴露文章列表
  // 最简单的方法是：在首页的某个隐藏 script 中输出文章 JSON，或者通过 AJAX 获取
  // 这里提供一种可靠的方法：利用主题已有的 #recent-posts 里的文章数据

  const container = document.getElementById('latest-posts-container');
  if (!container) return;

  // 方法1：从已有的隐藏 .recent-post-item 提取文章数据（如果存在）
  const existingPosts = document.querySelectorAll('#recent-posts .recent-post-item');
  if (existingPosts.length > 0) {
    const latestFive = Array.from(existingPosts).slice(0, 5);
    latestFive.forEach(post => {
      const clone = post.cloneNode(true);
      container.appendChild(clone);
    });
  } else {
    // 方法2：通过 fetch 获取站点首页的 HTML 并解析（较复杂，不推荐）
    // 备用方案：手动构造文章列表（如果你知道文章数据）
    console.warn('未找到现有文章，请确保文章数据可用');
  }
});