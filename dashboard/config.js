// ==========================================
// 🚀 API 配置 - Cloudflare Workers 地址
// ==========================================
window.API_BASE = 'https://hexiaoyiok.dpdns.org';

// ==========================================
// API 请求封装（带错误处理）
// ==========================================
window.BlogAPI = {
  async request(endpoint, options = {}) {
    const url = window.API_BASE + endpoint;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('🔥 API Error:', error);
      throw error;
    }
  },
  
  // 公告 API
  announcements: {
    get: () => window.BlogAPI.request('/api/announcements'),
    create: (content) => window.BlogAPI.request('/api/announcements', {
      method: 'POST',
      body: JSON.stringify({ content })
    })
  },
  
  // 评论 API
  comments: {
    get: () => window.BlogAPI.request('/api/comments'),
    create: (data) => window.BlogAPI.request('/api/comments', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },
  
  // 文章 API
  posts: {
    create: (data) => window.BlogAPI.request('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
};

console.log('✅ Blog API initialized:', window.API_BASE);
